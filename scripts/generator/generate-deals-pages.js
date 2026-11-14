/**
 * SD Card Checker - Deals Pages Generator (/deals/ and /ja/deals/)
 *
 * Evergreen sale-season pages: a hub plus one page per device group. Copy lives in
 * data/deals.json (English) and data/deals-{locale}.json; a locale gets deals pages only
 * when its file exists.
 *
 * What is derived, not written by hand:
 *  - Card picks: the cards most often listed in recommendedBrands across the category's
 *    devices, grouped by card tier, so the picks always agree with the device pages.
 *  - Capacity data: the most common recommendedCapacity values across the same devices.
 *
 * Price-per-GB ranges in the copy files are editorial guidance. The pages never show live
 * prices, discounts or Product schema (no offers to attach, and Google flags Product
 * without offers/reviews). Schema is BreadcrumbList + FAQPage only.
 */

const path = require("path");
const fs = require("fs");
const {
  readTemplate,
  writeFile,
  readJSON,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHreflangTags,
  getCategorySlug,
  getCategoryLabel,
  getCardImageFallback,
  loadSDCardData,
} = require("./helpers");
const { DATE_TOKENS } = require("./freshness");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript, generateAffiliateDisclosure } = require("../../src/templates/components");

const BASE_URL = "https://sdcardchecker.com";
const dataDir = path.join(__dirname, "../../data");
const srcPath = path.join(__dirname, "../../src");
const locales = JSON.parse(fs.readFileSync(path.join(dataDir, "locales.json"), "utf8"));

// Amazon store + tag per locale. There is no central affiliate link builder yet (Sprint 1
// plans scripts/lib/affiliate.js + data/affiliate-config.json); move this there when it exists.
const STORES = {
  en: { domain: "amazon.com", host: "www.amazon.com", tag: "sd-cc-20" },
  ja: { domain: "amazon.co.jp", host: "www.amazon.co.jp", tag: "sdcc-22" },
};
// Tags on card URLs that must never be rewritten (owner's Creator Connections campaign tag).
const PRESERVED_TAGS = new Set(["uproot01-20"]);

const TIER_ORDER = ["budget", "recommended", "professional"];
const PICKS_PER_TIER = 2;
// Below this many devices, "recommended on N of M pages" says little, so it is hidden.
const MIN_DEVICES_FOR_COUNT = 5;
const OG_LOCALE = { en: "en_US", ja: "ja_JP" };

const dealsCache = {};
function getDeals(locale) {
  if (!(locale in dealsCache)) {
    const file = path.join(dataDir, locale === "en" ? "deals.json" : `deals-${locale}.json`);
    dealsCache[locale] = STORES[locale] && fs.existsSync(file) ? readJSON(file) : null;
  }
  return dealsCache[locale];
}

function localePrefix(locale) {
  const dir = locales[locale] && locales[locale].dir;
  return dir ? `/${dir}` : "";
}

function dealsUrl(locale, slug) {
  return `${localePrefix(locale)}/deals/${slug ? `${slug}/` : ""}`;
}

function fill(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (m, key) => (key in vars ? vars[key] : m));
}

function esc(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Affiliate URL for a card in a locale's store. Uses the card's own URL when it points at
 * that store (setting the locale tag, keeping preserved tags, dropping utm_* params);
 * otherwise builds a store search from the English card's search keywords.
 */
function amazonUrl(locale, card, enCard) {
  const store = STORES[locale];
  const raw = card && (card.amazonDirectUrl || card.affiliateUrl || card.amazonSearchUrl);
  if (raw) {
    try {
      const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      if (url.hostname === store.domain || url.hostname.endsWith(`.${store.domain}`)) {
        [...url.searchParams.keys()].filter((k) => k.startsWith("utm_")).forEach((k) => url.searchParams.delete(k));
        if (!PRESERVED_TAGS.has(url.searchParams.get("tag"))) url.searchParams.set("tag", store.tag);
        return url.toString();
      }
    } catch (e) {
      // fall through to a search URL
    }
  }
  let keywords = (enCard || card).name;
  try {
    const k = enCard && enCard.amazonSearchUrl && new URL(enCard.amazonSearchUrl).searchParams.get("k");
    if (k) keywords = k;
  } catch (e) {
    // keep the card name
  }
  const search = new URLSearchParams({ k: keywords, tag: store.tag });
  return `https://${store.host}/s?${search.toString()}`;
}

function devicePool(page, devices) {
  const typeMatch = page.deviceTypeMatch && new RegExp(page.deviceTypeMatch, "i");
  const typeExclude = page.deviceTypeExclude && new RegExp(page.deviceTypeExclude, "i");
  return devices.filter((d) => {
    if (getCategorySlug(d.category) !== page.category) return false;
    const type = (d.sdCard && d.sdCard.type) || "";
    if (typeMatch && !typeMatch.test(type)) return false;
    if (typeExclude && typeExclude.test(type)) return false;
    return true;
  });
}

/**
 * Top cards per tier from the pool's recommendedBrands. Cards that resolve to the same
 * Amazon listing (duplicate catalog entries for one product) are counted once.
 */
function derivePicks(page, pool, locale, cards) {
  const counts = {};
  pool.forEach((d) => {
    new Set((d.recommendedBrands || []).map((b) => b.id)).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });
  });
  const cardMatch = page.cardMatch && new RegExp(page.cardMatch, "i");
  const cardExclude = page.cardExclude && new RegExp(page.cardExclude, "i");
  const ranked = Object.entries(counts)
    .filter(([id]) => (!cardMatch || cardMatch.test(id)) && (!cardExclude || !cardExclude.test(id)))
    .map(([id, n]) => {
      const card = cards.local[id] || cards.en[id];
      const enCard = cards.en[id];
      if (!card) return null;
      // Card copy must be in the page's language: a locale-specific note, else the locale
      // catalog's pros, else nothing (never English pros on a translated page).
      const note = (cards.notes && cards.notes[id]) || (cards.local[id] || locale === "en" ? card.pros : "");
      return { id, n, card, enCard, note, tier: (enCard || card).tier, url: amazonUrl(locale, cards.local[id], enCard) };
    })
    .filter(Boolean)
    .sort((a, b) => b.n - a.n || a.id.localeCompare(b.id));

  const seenUrls = new Set();
  const picks = [];
  TIER_ORDER.forEach((tier) => {
    ranked
      .filter((p) => p.tier === tier && !seenUrls.has(p.url))
      .slice(0, PICKS_PER_TIER)
      .forEach((p) => {
        seenUrls.add(p.url);
        picks.push(p);
      });
  });
  return picks;
}

function topCapacities(pool, limit = 3) {
  const counts = {};
  pool.forEach((d) => {
    ((d.sdCard && d.sdCard.recommendedCapacity) || [])
      .filter((c) => /^\d+(GB|TB)$/.test(c))
      .forEach((c) => {
        counts[c] = (counts[c] || 0) + 1;
      });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function updatedLine(ui) {
  return `<p class="page-updated text-sm text-slate-500 mb-4"><i class="far fa-calendar-check mr-1" aria-hidden="true"></i><time datetime="${DATE_TOKENS.modified}">${fill(ui.updated, { date: DATE_TOKENS.modifiedText })}</time></p>`;
}

function breadcrumbHTML(crumbs) {
  return crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<span class="text-slate-900 font-medium" aria-current="page">${esc(c.name)}</span>`
        : `<a href="${c.url}" class="text-blue-600 hover:underline">${esc(c.name)}</a>\n        <i class="fas fa-chevron-right text-xs" aria-hidden="true"></i>`
    )
    .join("\n        ");
}

function heroSection(deals, h1, intro) {
  return `
      <section class="mb-8">
        <p class="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">${esc(deals.season)}</p>
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">${esc(h1)}</h1>
        ${updatedLine(deals.ui)}
        ${intro.map((p) => `<p class="text-lg text-slate-700 leading-relaxed mb-4">${p}</p>`).join("\n        ")}
      </section>`;
}

function priceTableSection(deals, tierIds, cards) {
  const { ui } = deals;
  const rows = tierIds
    .map((id) => deals.tiers[id])
    .filter(Boolean)
    .map((tier) => {
      const examples = (tier.exampleCards || [])
        .map((cid) => (cards.local[cid] || cards.en[cid] || {}).name)
        .filter(Boolean)
        .map(esc)
        .join(esc(ui.listSeparator));
      return `
            <tr class="border-t border-slate-200 align-top">
              <td class="px-3 py-3 font-semibold text-slate-900">${esc(tier.label)}</td>
              <td class="px-3 py-3 text-slate-700">${examples}</td>
              <td class="px-3 py-3 font-bold text-green-700 whitespace-nowrap">${esc(tier.range)}</td>
              <td class="px-3 py-3 text-slate-600">${esc(tier.note)}</td>
            </tr>`;
    })
    .join("");
  return `
      <section class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-2">${esc(ui.priceTableHeading)}</h2>
        <p class="text-sm text-slate-600 mb-4">${esc(fill(ui.priceTableNote, { date: deals.priceGuideUpdated }))}</p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-700">
              <tr>
                <th scope="col" class="px-3 py-2">${esc(ui.colCardType)}</th>
                <th scope="col" class="px-3 py-2">${esc(ui.colExamples)}</th>
                <th scope="col" class="px-3 py-2">${esc(ui.colRange)}</th>
                <th scope="col" class="px-3 py-2">${esc(ui.colNotes)}</th>
              </tr>
            </thead>
            <tbody>${rows}
            </tbody>
          </table>
        </div>
      </section>`;
}

function specLine(card) {
  const specs = card.specs || {};
  return [specs.uhs, specs.speedClass, specs.appPerformance]
    .filter((v) => v && !/^(N\/A|None|Not listed|Not published)$/i.test(v))
    .map(esc)
    .join(" · ");
}

function picksSection(deals, picks, pool, categoryLabel, locale, distPath) {
  if (picks.length === 0) return "";
  const { ui } = deals;
  const items = picks
    .map((p) => {
      const card = p.card;
      const image = card.imageUrl || getCardImageFallback(card);
      const countLine = pool.length >= MIN_DEVICES_FOR_COUNT
        ? `<p class="text-xs text-slate-500 mb-3">${esc(fill(ui.recommendedOn, { n: p.n, total: pool.length, category: categoryLabel }))}</p>`
        : "";
      const detailsLink = locale === "en" && fs.existsSync(path.join(distPath, "cards", p.id, "index.html"))
        ? `<a href="/cards/${p.id}/" class="text-sm text-blue-600 hover:underline self-center">${esc(ui.cardDetails)}</a>`
        : "";
      return `
        <article class="bg-white border border-slate-200 rounded-lg p-4 flex gap-4">
          <img src="${esc(image)}" alt="${esc(card.name)}" width="80" height="80" loading="lazy" decoding="async" class="w-20 h-20 object-contain flex-shrink-0">
          <div class="flex-1 min-w-0">
            <span class="inline-block text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800 mb-2">${esc(ui.tierLabels[p.tier] || p.tier)}</span>
            <h3 class="text-lg font-bold text-slate-900">${esc(card.name)}</h3>
            <p class="text-xs text-slate-500 mb-2">${specLine(card)}</p>
            <p class="text-sm text-slate-700 mb-2">${esc(p.note || "")}</p>
            ${countLine}
            <div class="flex flex-wrap gap-3">
              <a href="${esc(p.url)}" rel="nofollow sponsored noopener" target="_blank" class="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg"><i class="fab fa-amazon" aria-hidden="true"></i> ${esc(ui.checkPrice)}</a>
              ${detailsLink}
            </div>
          </div>
        </article>`;
    })
    .join("");
  return `
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-2">${esc(ui.picksHeading)}</h2>
        <p class="text-slate-600 mb-4">${esc(fill(ui.picksIntro, { category: categoryLabel }))}</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">${items}
        </div>
      </section>`;
}

function listSection(heading, items, extra = "", boxClass = "bg-white border-slate-200") {
  return `
      <section class="${boxClass} border rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">${esc(heading)}</h2>
        ${extra}
        <ul class="list-disc pl-5 space-y-2 text-slate-700">
          ${items.map((i) => `<li>${i}</li>`).join("\n          ")}
        </ul>
      </section>`;
}

function capacitySection(deals, page, pool, categoryLabel) {
  const { ui } = deals;
  const caps = topCapacities(pool);
  const dataLine = caps.length && pool.length >= MIN_DEVICES_FOR_COUNT
    ? `<p class="text-sm text-slate-600 mb-4">${esc(fill(ui.capacityData, {
        category: categoryLabel,
        list: caps.map(([size, n]) => fill(ui.capacityItem, { size, n })).join(ui.listSeparator),
      }))}</p>`
    : "";
  return listSection(ui.capacityHeading, page.capacity, dataLine);
}

function avoidSection(deals, heading, items, locale) {
  const link = `<p class="mt-4"><a href="${localePrefix(locale)}/guides/is-my-sd-card-fake/" class="text-blue-600 font-semibold hover:underline"><i class="fas fa-shield-halved mr-1" aria-hidden="true"></i>${esc(deals.ui.fakeGuideLink)}</a></p>`;
  return listSection(heading, items, "", "bg-red-50 border-red-200").replace(/<\/ul>\s*<\/section>$/, `</ul>\n        ${link}\n      </section>`);
}

function devicesSection(deals, page, devices, categoryLabel, locale) {
  const bySlug = Object.fromEntries(devices.map((d) => [d.slug, d]));
  const shown = (page.featuredDevices || []).map((s) => bySlug[s]).filter(Boolean);
  if (shown.length === 0) return "";
  const prefix = localePrefix(locale);
  const links = shown
    .map((d) => `
          <a href="${prefix}/categories/${getCategorySlug(d.category)}/${d.slug}/" class="block bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition">
            <span class="font-semibold text-slate-900">${esc(d.name)}</span>
            <span class="block text-xs text-slate-500 mt-1">${esc((d.sdCard && d.sdCard.type) || "")}</span>
          </a>`)
    .join("");
  return `
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">${esc(deals.ui.devicesHeading)}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${links}
        </div>
        <p class="mt-4"><a href="${prefix}/categories/${page.category}/" class="text-blue-600 font-semibold hover:underline">${esc(fill(deals.ui.seeAll, { category: categoryLabel }))} &rarr;</a></p>
      </section>`;
}

function faqSection(deals, faq) {
  if (!faq || faq.length === 0) return "";
  return `
      <section class="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">${esc(deals.ui.faqHeading)}</h2>
        <div class="space-y-5">
          ${faq.map((f) => `<div>
            <h3 class="font-semibold text-slate-900 mb-1">${esc(f.q)}</h3>
            <p class="text-slate-700">${f.a}</p>
          </div>`).join("\n          ")}
        </div>
      </section>`;
}

function otherDealsSection(deals, locale, currentSlug) {
  const links = [
    `<a href="${dealsUrl(locale)}" class="text-blue-600 hover:underline">${esc(deals.ui.dealsHubName)}</a>`,
    ...deals.pages.filter((p) => p.slug !== currentSlug).map((p) => `<a href="${dealsUrl(locale, p.slug)}" class="text-blue-600 hover:underline">${esc(p.h1)}</a>`),
  ];
  return `
      <section class="mb-8">
        <h2 class="text-xl font-bold text-slate-900 mb-3">${esc(deals.ui.otherDealsHeading)}</h2>
        <ul class="space-y-2">
          ${links.map((l) => `<li><i class="fas fa-tag text-amber-500 mr-2" aria-hidden="true"></i>${l}</li>`).join("\n          ")}
        </ul>
      </section>`;
}

function hubCategoriesSection(deals, locale) {
  const cards = deals.pages
    .map((p) => `
          <a href="${dealsUrl(locale, p.slug)}" class="block bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition">
            <span class="block text-lg font-bold text-slate-900 mb-1">${esc(p.hubTitle)}</span>
            <span class="block text-sm text-slate-600">${esc(p.hubBlurb)}</span>
          </a>`)
    .join("");
  return `
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">${esc(deals.ui.hubCategoriesHeading)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}
        </div>
      </section>`;
}

function renderPage(template, locale, { urlPath, hreflangPath, title, metaDescription, crumbs, faq, content, hreflangLocales }) {
  const faqSchema = faq && faq.length ? `<script type="application/ld+json">\n  ${generateFAQSchema(faq)}\n  </script>` : "";
  return template
    .replace(/{{LANG}}/g, locale)
    .replace(/{{TITLE}}/g, esc(title))
    .replace(/{{META_DESCRIPTION}}/g, esc(metaDescription))
    .replace(/{{CANONICAL_URL}}/g, `${BASE_URL}${urlPath}`)
    .replace(/{{HREFLANG_TAGS}}/g, generateHreflangTags(hreflangPath, hreflangLocales))
    .replace(/{{OG_LOCALE}}/g, OG_LOCALE[locale] || locale)
    .replace(/{{BREADCRUMB_SCHEMA}}/g, generateBreadcrumbSchema(crumbs))
    .replace(/{{FAQ_SCHEMA}}/g, faqSchema)
    .replace(/{{BREADCRUMB_HTML}}/g, breadcrumbHTML(crumbs))
    .replace(/{{CONTENT}}/g, () => content)
    .replace(/{{SIDEBAR}}/g, () => generateSidebar(locale))
    .replace(/{{HEADER}}/g, () => generateHeader(locale))
    .replace(/{{FOOTER}}/g, () => generateFooter(locale))
    .replace(/{{GROW_SCRIPT}}/g, () => generateGrowScript());
}

/**
 * Build the hub and category deal pages for every locale that has a deals copy file.
 * Runs after the card pages so "Card details" links only point at built /cards/ pages.
 */
function generateDealsPages(distPath, devicesByLocale) {
  console.log("Generating deals pages...");
  const template = readTemplate(path.join(srcPath, "templates/deals.html"));
  const dealsLocales = Object.keys(STORES).filter((l) => getDeals(l) && (devicesByLocale[l] || []).length > 0);
  const cardsEn = loadSDCardData("en");
  let count = 0;

  dealsLocales.forEach((locale) => {
    const deals = getDeals(locale);
    const { ui } = deals;
    const devices = devicesByLocale[locale];
    const cards = { en: cardsEn, local: locale === "en" ? cardsEn : loadSDCardData(locale), notes: deals.cardNotes || {} };
    const home = { name: ui.home, url: `${localePrefix(locale)}/` };
    const hub = { name: ui.deals, url: dealsUrl(locale) };
    const localesWith = (slug) => dealsLocales.filter((l) => !slug || getDeals(l).pages.some((p) => p.slug === slug));

    // Hub
    const hubContent = [
      heroSection(deals, deals.hub.h1, deals.hub.intro),
      generateAffiliateDisclosure(locale),
      priceTableSection(deals, deals.hub.tiers, cards),
      hubCategoriesSection(deals, locale),
      listSection(deals.hub.rulesHeading, deals.hub.rules),
      avoidSection(deals, deals.hub.avoidHeading, deals.hub.avoid, locale),
      faqSection(deals, deals.hub.faq),
    ].join("\n");
    writeFile(path.join(distPath, dealsUrl(locale), "index.html"), renderPage(template, locale, {
      urlPath: dealsUrl(locale),
      hreflangPath: "/deals/",
      title: deals.hub.title,
      metaDescription: deals.hub.metaDescription,
      crumbs: [home, hub],
      faq: deals.hub.faq,
      content: hubContent,
      hreflangLocales: localesWith(null),
    }));
    count++;

    // Category pages
    deals.pages.forEach((page) => {
      const categoryLabel = getCategoryLabel(page.category, locale);
      // Mid-sentence form ("on our gaming handhelds device pages"); headings keep the label as-is
      const categoryInline = locale === "en" ? categoryLabel.toLowerCase() : categoryLabel;
      let pool = devicePool(page, devices);
      let picks = derivePicks(page, pool, locale, cards);
      if (picks.length === 0 && locale !== "en") {
        // The locale's device data has no matching recommendations (e.g. no microSD Express
        // cards in its catalog yet): fall back to the English device data.
        pool = devicePool(page, devicesByLocale.en || []);
        picks = derivePicks(page, pool, locale, cards);
      }
      const content = [
        heroSection(deals, page.h1, page.intro),
        generateAffiliateDisclosure(locale),
        priceTableSection(deals, page.tiers, cards),
        picksSection(deals, picks, pool, categoryInline, locale, distPath),
        capacitySection(deals, page, pool, categoryInline),
        avoidSection(deals, ui.avoidHeading, page.avoid, locale),
        devicesSection(deals, page, devices, categoryLabel, locale),
        faqSection(deals, page.faq),
        otherDealsSection(deals, locale, page.slug),
      ].join("\n");
      const urlPath = dealsUrl(locale, page.slug);
      writeFile(path.join(distPath, urlPath, "index.html"), renderPage(template, locale, {
        urlPath,
        hreflangPath: `/deals/${page.slug}/`,
        title: page.title,
        metaDescription: page.metaDescription,
        crumbs: [home, hub, { name: page.h1, url: urlPath }],
        faq: page.faq,
        content,
        hreflangLocales: localesWith(page.slug),
      }));
      count++;
    });
    console.log(`  ✓ ${locale}: deals hub + ${deals.pages.length} category deal pages`);
  });
  console.log(`  ✓ Generated ${count} deals pages`);
}

/**
 * Callout linking a category page to its deal pages ("" when the locale or category has none).
 */
function dealsLinksHTML(categorySlug, locale) {
  const deals = getDeals(locale);
  if (!deals) return "";
  const pages = deals.pages.filter((p) => p.category === categorySlug);
  if (pages.length === 0) return "";
  const links = pages
    .map((p) => `<a href="${dealsUrl(locale, p.slug)}" class="text-blue-700 font-semibold hover:underline">${esc(p.h1)}</a>`)
    .join(" · ");
  return `<aside class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-sm text-slate-800"><i class="fas fa-tag text-amber-600 mr-2" aria-hidden="true"></i>${esc(deals.ui.categoryCallout)} ${links}</aside>`;
}

module.exports = { generateDealsPages, dealsLinksHTML, amazonUrl };
