/**
 * SD Card Checker - Per-Card Spec/Review Pages Generator (/cards/<id>/)
 *
 * Gated to cards with real enrichment content (richDescription/useCase/bestFor)
 * in data/sdcard-enrichment.json — generating from spec-table-only data would
 * produce thin/duplicate-content pages across near-identical card variants.
 */
const fs = require("fs");
const path = require("path");
const {
  readTemplate,
  writeFile,
  getCardImageFallback,
  generateBreadcrumbSchema,
  loadSDCardEnrichment,
} = require("./helpers");

const { generateHeader, generateFooter, generateSidebar } = require("../../src/templates/components.js");

const BASE_URL = "https://sdcardchecker.com";
const srcPath = path.join(__dirname, "../../src");

/**
 * Reverse index: card id -> list of devices that recommend it.
 * Built from devices.json's recommendedBrands references so card pages can
 * link back to the device pages that drove the recommendation (unique
 * per-card content, also useful internal linking).
 */
function buildDeviceIndexForCards(allDevices) {
  const index = {};
  allDevices.forEach((device) => {
    (device.recommendedBrands || []).forEach((ref) => {
      if (!index[ref.id]) index[ref.id] = [];
      index[ref.id].push(device);
    });
  });
  return index;
}

function heroImagePath(cardId) {
  const heroPath = path.join(__dirname, "../../img/cards/_hero", `${cardId}.webp`);
  return fs.existsSync(heroPath) ? `/img/cards/_hero/${cardId}.webp` : null;
}

function generateSpecRows(card) {
  const rows = [
    { icon: "fas fa-microchip", color: "text-blue-600", label: "Type", value: card.type },
    { icon: "fas fa-bolt", color: "text-amber-600", label: "UHS Bus", value: card.specs?.uhs || "N/A" },
    { icon: "fas fa-tachometer-alt", color: "text-emerald-600", label: "Speed Class", value: card.specs?.speedClass || "N/A" },
  ];
  if (card.specs?.appPerformance && card.specs.appPerformance !== "N/A") {
    rows.push({ icon: "fas fa-cogs", color: "text-violet-600", label: "App Performance", value: card.specs.appPerformance });
  }
  rows.push(
    { icon: "fas fa-arrow-down", color: "text-blue-600", label: "Read Speed", value: card.specs?.readSpeed || "N/A" },
    { icon: "fas fa-arrow-up", color: "text-blue-600", label: "Write Speed", value: card.specs?.writeSpeed || "N/A" },
    { icon: "fas fa-database", color: "text-slate-600", label: "Available Capacities", value: (card.availableCapacities || []).map((c) => `${c}GB`).join(", ") },
    { icon: "fas fa-shield-halved", color: "text-rose-600", label: "Endurance", value: card.specs?.endurance || "Standard" }
  );

  return rows
    .map(
      (row) => `
        <li class="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
            <i class="${row.icon} ${row.color} mt-1 flex-shrink-0"></i>
            <div class="flex-1">
                <span class="font-semibold text-slate-900">${row.label}:</span>
                <span class="text-slate-700"> ${row.value}</span>
            </div>
        </li>`
    )
    .join("");
}

function generateBestForBadges(bestFor) {
  return (bestFor || []).map((item) => `<span class="best-for-badge">${item}</span>`).join("");
}

function generateRecommendedDevicesBlock(devices) {
  if (!devices || devices.length === 0) return "";
  const cards = devices
    .slice(0, 9)
    .map(
      (d) => {
        const categorySlug = d.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
        return `<a href="/categories/${categorySlug}/${d.slug}/" class="device-card"><div class="device-card-name">${d.name}</div></a>`;
      }
    )
    .join("\n");

  return `
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Recommended For</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        ${cards}
      </div>
    </section>`;
}

function generateProductSchema(card, cardUrl, heroImageAbs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    description: card.richDescription || card.pros,
    image: heroImageAbs,
    url: cardUrl,
    brand: {
      "@type": "Brand",
      name: card.name.split(" ")[0],
    },
  });
}

function generateCardPage(card, template, devicesForCard) {
  const cardUrl = `${BASE_URL}/cards/${card.id}/`;
  const heroImage = heroImagePath(card.id) || card.imageUrl || getCardImageFallback(card);
  const heroImageAbs = `${BASE_URL}${heroImage}`;

  const title = `${card.name} Review: Specs, Speed & Best Uses (2026)`;
  const ogTitle = `${card.name} Review & Specs`;
  const description = card.richDescription
    ? card.richDescription.length > 160
      ? `${card.richDescription.substring(0, 157)}...`
      : card.richDescription
    : `${card.name} specs, speed class, and best use cases.`;

  const utmParams = `utm_source=sdcardchecker&utm_medium=card-page&utm_campaign=${card.id}`;
  const baseAmazonUrl = card.affiliateUrl || card.amazonSearchUrl;
  const amazonUrl = baseAmazonUrl.includes("?") ? `${baseAmazonUrl}&${utmParams}` : `${baseAmazonUrl}?${utmParams}`;

  const priceDisplay = card.priceSymbol ? `${card.priceSymbol} (${card.priceTier})` : card.priceTier || "";

  const consBlock = card.cons
    ? `
                    <div class="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                        <h4 class="font-semibold text-amber-700 mb-2 flex items-center gap-2"><i class="fas fa-circle-exclamation"></i> Cons</h4>
                        <p class="text-slate-700">${card.cons}</p>
                    </div>`
    : "";

  const alternativesBlock = card.alternatives
    ? `
            <section class="mb-16">
                <h2 class="text-2xl font-bold text-slate-900 mb-6">Alternatives to Consider</h2>
                <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
                    <p class="text-slate-700 leading-relaxed">${card.alternatives}</p>
                </div>
            </section>`
    : "";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "SD Cards", url: "/cards/" },
    { name: card.name, url: `/cards/${card.id}/` },
  ]);
  const productSchema = generateProductSchema(card, cardUrl, heroImageAbs);

  return template
    .replace(/{{CARD_TITLE}}/g, title)
    .replace(/{{OG_TITLE}}/g, ogTitle)
    .replace(/{{SEO_DESCRIPTION}}/g, description)
    .replace(/{{CARD_URL}}/g, cardUrl)
    .replace(/{{CARD_NAME}}/g, card.name)
    .replace(/{{HERO_IMAGE_ABS}}/g, heroImageAbs)
    .replace(/{{HERO_IMAGE}}/g, heroImage)
    .replace(/{{RICH_DESCRIPTION}}/g, card.richDescription || card.pros)
    .replace(/{{SPEC_ROWS}}/g, generateSpecRows(card))
    .replace(/{{USE_CASE}}/g, card.useCase || "")
    .replace(/{{BEST_FOR_BADGES}}/g, generateBestForBadges(card.bestFor))
    .replace(/{{PROS}}/g, card.pros)
    .replace(/{{CONS_BLOCK}}/g, consBlock)
    .replace(/{{ALTERNATIVES_BLOCK}}/g, alternativesBlock)
    .replace(/{{PRICE_DISPLAY}}/g, priceDisplay)
    .replace(/{{AMAZON_URL}}/g, amazonUrl)
    .replace(/{{RECOMMENDED_DEVICES_BLOCK}}/g, generateRecommendedDevicesBlock(devicesForCard))
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{PRODUCT_SCHEMA}}/g, productSchema)
    .replace(/{{SIDEBAR}}/g, generateSidebar())
    .replace(/{{HEADER}}/g, generateHeader())
    .replace(/{{FOOTER}}/g, generateFooter());
}

async function generateCardPages(allDevices, distPath) {
  console.log("Generating SD Card spec/review pages...");

  const sdcardsPath = path.join(__dirname, "../../data/sdcards.json");
  const { sdcards } = JSON.parse(fs.readFileSync(sdcardsPath, "utf8"));
  const cardMap = Object.fromEntries(sdcards.map((c) => [c.id, c]));

  const enrichmentData = loadSDCardEnrichment();
  const gatedIds = Object.keys(enrichmentData);

  const template = readTemplate(path.join(srcPath, "templates", "card-page.html"));
  const deviceIndex = buildDeviceIndexForCards(allDevices);

  let successCount = 0;
  const generatedIds = [];

  gatedIds.forEach((id) => {
    const baseCard = cardMap[id];
    if (!baseCard) {
      console.warn(`  Skipping ${id}: enrichment entry has no matching sdcards.json record`);
      return;
    }

    const card = { ...baseCard, ...enrichmentData[id] };
    try {
      const html = generateCardPage(card, template, deviceIndex[id]);
      writeFile(path.join(distPath, "cards", id, "index.html"), html);
      successCount++;
      generatedIds.push(id);
    } catch (error) {
      console.warn(`  Failed to generate card page for ${id}: ${error.message}`);
    }
  });

  console.log(`  ✓ Generated ${successCount}/${gatedIds.length} SD card pages`);
  return generatedIds;
}

module.exports = { generateCardPages };
