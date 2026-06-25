/**
 * SD Card Checker - Compare Component
 *
 * One reusable comparison grid (up to 3 cards), rendered in two places:
 *   - standalone /compare/ page, defaulted to recommended-tier cards
 *   - embedded widget on device pages, defaulted to that device's recommendedBrands
 *
 * See SD_CARD_COMPARISON_SERVICE_DESIGN.md for the approved design.
 */
const path = require("path");
const fs = require("fs");
const {
  readTemplate,
  writeFile,
  getCardImageFallback,
  generateBreadcrumbSchema,
} = require("./helpers");

const MAX_SLOTS = 3;

function loadAllCards() {
  const sdcardsPath = path.join(__dirname, "../../data/sdcards.json");
  const { sdcards } = JSON.parse(fs.readFileSync(sdcardsPath, "utf8"));
  return sdcards;
}

function buildCardMap(allCards) {
  return Object.fromEntries(allCards.map((c) => [c.id, c]));
}

function defaultRecommendedCardIds(allCards, count = MAX_SLOTS) {
  return allCards
    .filter((c) => c.tier === "recommended")
    .slice(0, count)
    .map((c) => c.id);
}

function resolveImage(card) {
  // getCardImageFallback's UHS-based fallback reads card.uhs; the raw
  // sdcards.json schema nests that under card.specs.uhs, so shim it through.
  return getCardImageFallback({ ...card, uhs: card.specs?.uhs });
}

function priceBadgeHTML(card) {
  if (!card.priceSymbol) return "";
  return `<span class="compare-price-badge">${card.priceSymbol} &middot; ${card.priceTier || ""}</span>`;
}

function specsListHTML(card) {
  const specs = card.specs || {};
  const rows = [
    ["UHS Rating", specs.uhs],
    ["Speed Class", specs.speedClass],
    ["App Performance", specs.appPerformance],
    ["Read Speed", specs.readSpeed],
    ["Write Speed", specs.writeSpeed],
    ["Endurance", specs.endurance],
  ].filter(([, value]) => value);

  return `<ul class="compare-specs-list">${rows
    .map(
      ([label, value]) =>
        `<li><span class="compare-spec-label">${label}</span><span class="compare-spec-value">${value}</span></li>`
    )
    .join("")}</ul>`;
}

function prosConsHTML(card) {
  const pros = (card.pros || "").split(",").map((s) => s.trim()).filter(Boolean);
  const cons = (card.cons || "").split(",").map((s) => s.trim()).filter(Boolean);
  return `
    ${pros.length ? `<div class="compare-pros"><h4>Pros</h4><ul>${pros.map((p) => `<li>${p}</li>`).join("")}</ul></div>` : ""}
    ${cons.length ? `<div class="compare-cons"><h4>Cons</h4><ul>${cons.map((c) => `<li>${c}</li>`).join("")}</ul></div>` : ""}
  `;
}

function capacitiesHTML(card) {
  if (!card.availableCapacities || !card.availableCapacities.length) return "";
  return `<div class="compare-capacities"><span class="compare-spec-label">Available Capacities</span><span class="compare-spec-value">${card.availableCapacities
    .map((c) => `${c}GB`)
    .join(", ")}</span></div>`;
}

function amazonButtonHTML(card, utmCampaign) {
  const baseUrl = card.amazonSearchUrl;
  const utmParams = `utm_source=sdcardchecker&utm_medium=compare&utm_campaign=${utmCampaign}`;
  const url = baseUrl.includes("?") ? `${baseUrl}&${utmParams}` : `${baseUrl}?${utmParams}`;
  return `<a href="${url}" target="_blank" rel="nofollow noopener" class="compare-amazon-btn"><i class="fas fa-shopping-cart"></i> View on Amazon</a>`;
}

/**
 * Render one card's content. Mirrored (deliberately, field-for-field) by the
 * client-side renderer in src/js/compare.js so a swapped-in card looks
 * identical to a server-rendered one.
 */
function renderCardPanel(card, utmCampaign) {
  const image = resolveImage(card);
  const tierBadge = card.tier
    ? `<span class="compare-tier-badge compare-tier-${card.tier}">${card.tier}</span>`
    : "";

  return `
    ${tierBadge}
    <div class="compare-card-image"><img src="${image}" alt="${card.name}" width="120" height="120" loading="lazy" onerror="this.src='/img/cards/placeholder.webp'"></div>
    <h3 class="compare-card-name">${card.name}</h3>
    ${priceBadgeHTML(card)}
    ${specsListHTML(card)}
    ${capacitiesHTML(card)}
    ${prosConsHTML(card)}
    ${amazonButtonHTML(card, utmCampaign)}
  `;
}

function renderSelectOptions(allCards, selectedId) {
  return allCards
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.name}</option>`)
    .join("");
}

function renderSlot(card, allCards, slotIndex, utmCampaign) {
  return `
  <div class="compare-slot" data-slot="${slotIndex}">
    <label class="compare-select-label" for="compare-select-${slotIndex}">Card ${slotIndex + 1}</label>
    <select class="compare-select" id="compare-select-${slotIndex}" data-slot="${slotIndex}" aria-label="Select card for slot ${slotIndex + 1}">
      ${renderSelectOptions(allCards, card.id)}
    </select>
    <div class="compare-card-panel" data-card-id="${card.id}">
      ${renderCardPanel(card, utmCampaign)}
    </div>
  </div>`;
}

/**
 * @param {string[]} cardIds - up to 3 card ids to pre-fill (missing/removed
 *   ids are silently skipped, never rendered as an empty slot)
 * @param {Record<string, object>} cardMap
 * @param {object[]} allCards - full catalog, used to populate every dropdown
 * @param {{mode: "standalone"|"widget", utmCampaign: string}} opts
 */
function renderCompareGrid(cardIds, cardMap, allCards, { mode, utmCampaign }) {
  const slots = cardIds.map((id) => cardMap[id]).filter(Boolean).slice(0, MAX_SLOTS);

  const slotsHTML = slots.map((card, i) => renderSlot(card, allCards, i, utmCampaign)).join("");

  return `<div class="compare-grid compare-grid-${slots.length}" data-mode="${mode}" data-utm-campaign="${utmCampaign}">${slotsHTML}</div>`;
}

function generateComparePage(distPath) {
  console.log("Generating Compare page...");
  const { generateHeader, generateFooter, generateSidebar } = require("../../src/templates/components");

  const allCards = loadAllCards();
  const cardMap = buildCardMap(allCards);
  const defaultIds = defaultRecommendedCardIds(allCards);

  const gridHTML = renderCompareGrid(defaultIds, cardMap, allCards, {
    mode: "standalone",
    utmCampaign: "compare-page",
  });

  const template = readTemplate(path.join(__dirname, "../../src/templates/compare.html"));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Compare SD Cards", url: "/compare/" },
  ]);

  const html = template
    .replace(/{{HEADER}}/g, generateHeader())
    .replace(/{{FOOTER}}/g, generateFooter())
    .replace(/{{SIDEBAR}}/g, generateSidebar())
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{COMPARE_GRID_HTML}}/g, gridHTML);

  writeFile(path.join(distPath, "compare", "index.html"), html);
  console.log(`  ✓ Generated /compare/index.html (defaults: ${defaultIds.join(", ")})`);
}

/**
 * Compare widget embedded on a device page, defaulted to that device's
 * recommendedBrands. Returns "" if the device has no recommended cards that
 * still resolve in sdcards.json (handles the "card renamed/removed" edge case).
 */
function generateDeviceCompareWidgetHTML(device, allCards) {
  if (!device.recommendedBrands || !device.recommendedBrands.length) return "";

  const cardMap = buildCardMap(allCards);
  const deviceCardIds = device.recommendedBrands
    .map((ref) => ref.id)
    .filter((id) => cardMap[id])
    .slice(0, MAX_SLOTS);

  if (!deviceCardIds.length) return "";

  const gridHTML = renderCompareGrid(deviceCardIds, cardMap, allCards, {
    mode: "widget",
    utmCampaign: `compare-widget-${device.slug}`,
  });

  const fullToolUrl = `/compare/?cards=${deviceCardIds.join(",")}`;

  return `
  <section id="compare" class="compare-widget-section mb-16 scroll-mt-20">
    <div class="flex items-start justify-between gap-4 mb-2 flex-wrap">
      <h2 class="text-2xl font-bold text-slate-900"><i class="fas fa-table-columns text-blue-600 mr-2"></i>Compare These Cards</h2>
      <a href="${fullToolUrl}" class="text-blue-600 hover:underline font-semibold text-sm whitespace-nowrap">Open in full compare tool <i class="fas fa-arrow-right text-xs"></i></a>
    </div>
    <p class="text-slate-600 mb-6">See how the recommended cards for ${device.name} stack up side by side, or swap in any other card.</p>
    ${gridHTML}
  </section>`;
}

module.exports = {
  loadAllCards,
  buildCardMap,
  defaultRecommendedCardIds,
  renderCompareGrid,
  generateComparePage,
  generateDeviceCompareWidgetHTML,
};
