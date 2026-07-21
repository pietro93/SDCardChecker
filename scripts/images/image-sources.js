/**
 * Resolves a device hero image from manufacturer storefronts (preferred) or, as
 * a fallback, the Grover rental marketplace.
 *
 * IMPORTANT — licensing: these are NOT freely-licensed (CC) images. Manufacturer
 * product photography and Grover's catalogue shots are copyrighted product
 * imagery. We use manufacturer sources first because the manufacturer is the
 * rights-holder and the only source that actually stocks niche devices; Grover
 * is a same-risk-tier fallback for mainstream gear. Metadata records the source
 * site explicitly (sourceSite / licenseNote) rather than CC-shaped fields so the
 * risk stays visible. See the pipeline handoff for the accepted-risk context.
 */
const sharp = require("sharp");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

class NoCandidatesError extends Error {}
class NoSuitableCandidateError extends Error {}

// Words too generic to discriminate one model from another. Deliberately does
// NOT include product-line words like "mini"/"pro"/"max"/"se"/"plus" — those
// discriminate real SKUs (DJI Mini vs Air vs Mavic; iPhone Pro vs Pro Max)
// and dropping them caused cross-product false matches (e.g. "DJI Mini 3
// Pro" collapsing to just brand token "dji" and matching "DJI Action 3").
const GENERIC_TOKENS = new Set([
  "black", "white", "gen", "edition", "series",
  "the", "and", "with", "for", "ai", "ex", "console", "handheld",
]);

// Roman-numeral revision markers (e.g. "Mark II" vs "Mark III", "Z6 II" vs
// "Z6 III") — these discriminate models just like a model number does, so
// they must NOT be treated as generic filler.
const ROMAN_TOKENS = new Set(["ii", "iii", "iv", "vi", "vii", "viii", "ix"]);

function rawTokens(name) {
  return name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function salientTokens(name) {
  // Single-character alpha tokens are usually noise, but single-digit model
  // numbers (DJI "Mini 3", "Mini 5") are real discriminators — keep them.
  return rawTokens(name).filter((t) => (t.length >= 2 || /\d/.test(t)) && !GENERIC_TOKENS.has(t));
}

// Accessory/part words that, if present in a candidate but absent from the
// device name itself, mark the candidate as the wrong product (a lens/case/kit
// instead of the device body) rather than a true match.
const ACCESSORY_TOKENS = new Set([
  "lens", "kit", "case", "strap", "tripod", "cap", "battery", "charger",
  "mount", "bundle", "cable", "adapter", "grip", "filter", "sticker",
]);

function isModelToken(t) {
  return /\d/.test(t) || ROMAN_TOKENS.has(t);
}

/** Boundary-aware exact match: digits can't be glued to other digits;
 * mixed alnum model tokens (e.g. "x100v") can't be a substring of a longer
 * alnum run (e.g. "x100vi"); roman numerals ("ii") can't match inside a
 * longer one ("iii"). Plain letter-only tokens still use `includes`. */
function tokenMatches(hay, token) {
  if (isModelToken(token)) {
    const boundary = /^\d+$/.test(token) ? "\\d" : "a-z0-9";
    const re = new RegExp(`(?<![${boundary}])${token}(?![${boundary}])`);
    return re.test(hay);
  }
  return hay.includes(token);
}

/** Strict relevance: a candidate must share the device's discriminating tokens,
 * and any model-number/version token (e.g. "11", "x100v", "ii") must match
 * exactly — not as a substring of a different model ("x100vi", "hero13",
 * "iii") — and the candidate must not carry a *different* version token the
 * device name doesn't have (e.g. device "EOS R6" vs. candidate "EOS R6 II"). */
function relevanceScore(deviceName, candidateText) {
  const want = salientTokens(deviceName);
  if (want.length === 0) return { score: 0, want: 0, ok: false };
  const hay = candidateText.toLowerCase();

  const modelTokens = want.filter(isModelToken);
  if (modelTokens.length > 0 && !modelTokens.every((t) => tokenMatches(hay, t))) {
    return { score: 0, want: want.length, ok: false };
  }

  const wantRoman = new Set(want.filter((t) => ROMAN_TOKENS.has(t)));
  const hayRoman = rawTokens(candidateText).filter((t) => ROMAN_TOKENS.has(t));
  if (hayRoman.some((t) => !wantRoman.has(t))) {
    return { score: 0, want: want.length, ok: false };
  }

  // "+"/"Plus" denotes a distinct, larger SKU (e.g. "Tab S10 FE" vs "Tab S10
  // FE+") that plain tokenization can't see (the "+" glyph splits to nothing).
  // Both sides must agree on whether this is the "plus" variant.
  // Only a "+" glued directly to a word (e.g. "FE+") counts — a " + " with
  // spaces on both sides is usually a separator (e.g. "Camera + Lens kit").
  const isPlusVariant = (text) => /[a-z0-9]\+/i.test(text) || /\bplus\b/i.test(text);
  if (isPlusVariant(deviceName) !== isPlusVariant(candidateText)) {
    return { score: 0, want: want.length, ok: false };
  }

  const wantAccessory = want.some((t) => ACCESSORY_TOKENS.has(t));
  const hayHasAccessory = [...ACCESSORY_TOKENS].some((t) => tokenMatches(hay, t));
  if (hayHasAccessory && !wantAccessory) {
    return { score: 0, want: want.length, ok: false };
  }

  const hit = want.filter((t) => tokenMatches(hay, t));
  // Every salient token (brand, product line, category word like "chromebook")
  // must be present — a partial match risks pairing the device with a
  // different but textually-similar product (e.g. "Chromebook 14" matching a
  // "Pavilion Plus 14" laptop because both share brand + the number "14").
  return { score: hit.length, want: want.length, ok: hit.length === want.length };
}

async function download(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Fraction of border pixels that are near-white — a proxy for "clean studio shot". */
async function whiteBorderScore(buffer) {
  const { data, info } = await sharp(buffer)
    .flatten({ background: "#ffffff" })
    .resize(120, 120, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let white = 0, total = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!(x < 6 || y < 6 || x >= width - 6 || y >= height - 6)) continue;
      const i = (y * width + x) * channels;
      total++;
      if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) white++;
    }
  }
  return total ? white / total : 0;
}

/** Downloads up to `limit` candidate image URLs and returns the cleanest-white one. */
async function pickCleanestImage(urls, { limit = 6 } = {}) {
  let best = null;
  for (const url of urls.slice(0, limit)) {
    let buffer;
    try { buffer = await download(url); } catch { continue; }
    const score = await whiteBorderScore(buffer);
    if (!best || score > best.score) best = { url, buffer, score };
  }
  if (!best) throw new NoSuitableCandidateError("no candidate image could be downloaded");
  return best;
}

// ---------------------------------------------------------------------------
// Shopify storefront adapter (manufacturer stores expose /products.json)
// ---------------------------------------------------------------------------

const shopifyCatalogCache = new Map();

async function shopifyCatalog(domain) {
  if (shopifyCatalogCache.has(domain)) return shopifyCatalogCache.get(domain);
  const res = await fetch(`${domain}/products.json?limit=250`, { headers: { "User-Agent": UA } });
  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!ct.includes("json") && !text.trim().startsWith("{")) {
    throw new Error(`${domain} did not serve a Shopify products.json (got ${ct})`);
  }
  const products = JSON.parse(text).products || [];
  shopifyCatalogCache.set(domain, products);
  return products;
}

// Some storefronts list warranty plans, bundles, year variants, and
// accessories that share all the device's salient tokens (e.g. because the
// vendor field alone supplies the brand token) but have shorter titles, so
// they'd win a plain length tie-break over the real/best product photo.
// `preferTokens` lets a brand config mark words (e.g. "drone", "camera", a
// model year) that the preferred listing's title uses but the others don't,
// without changing relevanceScore matching for every other brand.
function rankCandidates(scored, titleOf, preferTokens) {
  const matchesPreferred = (title) =>
    preferTokens && preferTokens.length && preferTokens.some((t) => title.toLowerCase().includes(t));

  return [...scored].sort((a, b) => {
    const aPref = matchesPreferred(titleOf(a)) ? 1 : 0;
    const bPref = matchesPreferred(titleOf(b)) ? 1 : 0;
    if (aPref !== bPref) return bPref - aPref;
    return b.r.score - a.r.score || titleOf(a).length - titleOf(b).length;
  });
}

async function shopifySource(device, { domain, productTypes, preferTokens } = {}) {
  const products = await shopifyCatalog(domain);

  let candidates = products;
  if (productTypes && productTypes.length) {
    candidates = candidates.filter((p) => productTypes.includes(p.product_type));
  }

  // Some storefronts rebrand a device's retail title away from its model
  // number (e.g. Vantrue's "N4 Pro" listed as "Nexus 4 Pro") but keep the
  // model code in the product's URL handle — include it in the matched text
  // so relevanceScore can still find the model token.
  const scored = rankCandidates(
    candidates
      .map((p) => ({ p, r: relevanceScore(device.name, `${p.vendor || ""} ${p.title} ${p.handle || ""}`) }))
      .filter((s) => s.r.ok),
    (s) => s.p.title,
    preferTokens
  );

  if (scored.length === 0) {
    throw new NoCandidatesError(`no matching product for "${device.name}" on ${domain}`);
  }

  const product = scored[0].p;
  const imageUrls = (product.images || []).map((im) => im.src).filter(Boolean);
  if (imageUrls.length === 0) {
    throw new NoSuitableCandidateError(`matched "${product.title}" but it has no images`);
  }
  const picked = await pickCleanestImage(imageUrls);

  return {
    buffer: picked.buffer,
    meta: {
      sourceSite: new URL(domain).hostname,
      sourceType: "manufacturer",
      productTitle: product.title,
      productUrl: `${domain}/products/${product.handle}`,
      sourceImageUrl: picked.url,
      whiteBorderScore: Number(picked.score.toFixed(2)),
      licenseNote: "Copyrighted manufacturer product photography — NOT freely licensed.",
    },
  };
}

// ---------------------------------------------------------------------------
// WooCommerce storefront adapter (manufacturer stores exposing the public
// Store API at /wp-json/wc/store/v1/products — no auth needed). Distinct from
// shopifySource() because the search is server-side (?search=) rather than a
// full-catalog dump, and the response shape differs (name/permalink/images
// instead of title/handle/images).
// ---------------------------------------------------------------------------

async function wooCommerceSearch(domain, query) {
  const url = `${domain}/wp-json/wc/store/v1/products?search=${encodeURIComponent(query)}&per_page=20`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("json")) {
    throw new Error(`${domain} did not serve a WooCommerce Store API response (status ${res.status}, ${ct})`);
  }
  return res.json();
}

async function wooCommerceSource(device, { domain, preferTokens, query } = {}) {
  const products = await wooCommerceSearch(domain, query || device.name);

  const scored = rankCandidates(
    products
      .map((p) => ({ p, r: relevanceScore(device.name, p.name) }))
      .filter((s) => s.r.ok),
    (s) => s.p.name,
    preferTokens
  );

  if (scored.length === 0) {
    throw new NoCandidatesError(`no matching product for "${device.name}" on ${domain}`);
  }

  const product = scored[0].p;
  const imageUrls = (product.images || []).map((im) => im.src).filter(Boolean);
  if (imageUrls.length === 0) {
    throw new NoSuitableCandidateError(`matched "${product.name}" but it has no images`);
  }
  const picked = await pickCleanestImage(imageUrls);

  return {
    buffer: picked.buffer,
    meta: {
      sourceSite: new URL(domain).hostname,
      sourceType: "manufacturer",
      productTitle: product.name,
      productUrl: product.permalink,
      sourceImageUrl: picked.url,
      whiteBorderScore: Number(picked.score.toFixed(2)),
      licenseNote: "Copyrighted manufacturer product photography — NOT freely licensed.",
    },
  };
}

// ---------------------------------------------------------------------------
// Grover marketplace adapter (fallback for mainstream devices)
// ---------------------------------------------------------------------------

async function groverSearch(query) {
  const url = `https://www.grover.com/de-en/search?filter=search%3D${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Grover search failed ${res.status}`);
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) return [];
  const data = JSON.parse(m[1]);
  const q = (data.props.pageProps.dehydratedState.queries || []).find((x) => x.queryKey[0] === "searchProductsFull");
  return (q && q.state.data.pages[0].products) || [];
}

async function groverSource(device, { query } = {}) {
  const products = await groverSearch(query || device.name);
  const scored = products
    .map((p) => ({ p, r: relevanceScore(device.name, `${p.brandName} ${p.name}`) }))
    .filter((s) => s.r.ok)
    .sort((a, b) => b.r.score - a.r.score || a.p.name.length - b.p.name.length);

  if (scored.length === 0) {
    throw new NoCandidatesError(`no relevant Grover product for "${device.name}"`);
  }
  const product = scored[0].p;
  const imageUrl = product.originalImageUrl || (product.variants && product.variants[0] && product.variants[0].originalImageUrl);
  if (!imageUrl) throw new NoSuitableCandidateError(`matched "${product.name}" but it has no image URL`);

  return {
    buffer: await download(imageUrl),
    meta: {
      sourceSite: "grover.com",
      sourceType: "marketplace",
      productTitle: product.name,
      productUrl: `https://www.grover.com/de-en/products/${product.slug}`,
      sourceImageUrl: imageUrl,
      licenseNote: "Copyrighted marketplace product photography (Grover) — NOT freely licensed.",
    },
  };
}

// ---------------------------------------------------------------------------
// Brand registry: device name -> manufacturer storefront adapter
// ---------------------------------------------------------------------------

// Brands checked but deliberately NOT registered (2026-06-19):
//   - ayn (ayntec.com): Shopify, but our only AYN device is the combo-named
//     "AYN Odin 3 / Odin 2 Portal" — no single product can satisfy both
//     halves under the all-salient-tokens rule, so it's a guaranteed
//     NoCandidatesError. Add only if a single-model AYN device is added.
//   - skydio (shop.skydio.com): Shopify, but the store sells accessories
//     only (Beacon, Battery, Controller, microSD) — no drone body listing
//     to source a hero photo from.
const BRAND_REGISTRY = [
  // brand: matched case-insensitively against the start of the device name.
  { brand: "anbernic", source: shopifySource, config: { domain: "https://anbernic.com", productTypes: ["游戏机"] } },
  { brand: "trimui", source: shopifySource, config: { domain: "https://trimui.net" } },
  { brand: "analogue", source: shopifySource, config: { domain: "https://store.analogue.co", productTypes: ["Console"] } },
  { brand: "autel", source: shopifySource, config: { domain: "https://shop.autelrobotics.com", productTypes: ["drone"] } },
  { brand: "potensic", source: shopifySource, config: { domain: "https://store.potensic.com", productTypes: ["Drones"] } },
  { brand: "holy stone", source: shopifySource, config: { domain: "https://store.holystone.com", productTypes: ["Drones"] } },
  // HoverAir's storefront lists warranty plans ("HOVERCare"), bundles ("for
  // Skiing"/"for Cycling"), and accessories that share the device's salient
  // tokens but have shorter titles than the real listing — preferTokens
  // breaks the tie toward the listing that actually reads like a product.
  { brand: "hoverair", source: shopifySource, config: { domain: "https://us.hoverair.com", preferTokens: ["drone", "camera"] } },
  // gpdstore.net is WooCommerce, not Shopify — uses the public Store API
  // (wooCommerceSource) instead. The catalog lists separate "GPD WIN Mini"
  // listings per model year; preferTokens nudges toward the newest revision
  // instead of the shortest title (the original 2023 listing).
  { brand: "gpd", source: wooCommerceSource, config: { domain: "https://gpdstore.net", preferTokens: ["2025"] } },
  { brand: "bushnell", source: shopifySource, config: { domain: "https://www.bushnell.com", productTypes: ["Non-Cellular Trail Camera", "Cellular Trail Camera"] } },
  { brand: "blackvue", source: shopifySource, config: { domain: "https://blackvue.com", productTypes: ["Dash cam"] } },
  // Vantrue's storefront rebrands the "N4 Pro" dashcam as "Nexus 4 Pro" in the
  // title, but the product's URL handle is "n4-pro" — shopifySource matches
  // against vendor+title+handle, so the model token still resolves.
  { brand: "vantrue", source: shopifySource, config: { domain: "https://vantrue.com", productTypes: ["dash cam"] } },
];

function lookupBrand(device) {
  const name = device.name.toLowerCase();
  return BRAND_REGISTRY.find((b) => name.startsWith(b.brand) || name.includes(` ${b.brand} `));
}

/**
 * Resolves a hero image for a device: tries its manufacturer storefront first
 * (if registered), then falls back to Grover. Throws NoCandidatesError /
 * NoSuitableCandidateError on recoverable "no photo found" outcomes.
 */
async function resolveDeviceImage(device, { query } = {}) {
  const brand = lookupBrand(device);
  const errors = [];

  if (brand) {
    try {
      return await brand.source(device, brand.config);
    } catch (err) {
      if (err instanceof NoCandidatesError || err instanceof NoSuitableCandidateError) {
        errors.push(`manufacturer(${brand.brand}): ${err.message}`);
      } else {
        throw err; // network/parse errors are real failures
      }
    }
  }

  try {
    return await groverSource(device, { query });
  } catch (err) {
    if (err instanceof NoCandidatesError || err instanceof NoSuitableCandidateError) {
      errors.push(`grover: ${err.message}`);
      throw new NoCandidatesError(errors.join(" | "));
    }
    throw err;
  }
}

module.exports = {
  resolveDeviceImage,
  shopifySource,
  wooCommerceSource,
  groverSource,
  relevanceScore,
  salientTokens,
  NoCandidatesError,
  NoSuitableCandidateError,
  BRAND_REGISTRY,
};
