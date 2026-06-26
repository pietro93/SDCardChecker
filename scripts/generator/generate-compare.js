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
  // Car navigation SD cards have an entirely different spec shape (mapYear,
  // vehicleBrand, etc.) and aren't comparable to flash storage - keep them
  // out of the generic compare tool entirely (they still have their own
  // /cars/ pages).
  return sdcards.filter((c) => !c.navCardProduct);
}

function buildCardMap(allCards) {
  return Object.fromEntries(allCards.map((c) => [c.id, c]));
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

function affiliateUrl(card, utmCampaign) {
  const baseUrl = card.amazonSearchUrl || card.affiliateUrl;
  if (!baseUrl) return null;
  const utmParams = `utm_source=sdcardchecker&utm_medium=compare&utm_campaign=${utmCampaign}`;
  return baseUrl.includes("?") ? `${baseUrl}&${utmParams}` : `${baseUrl}?${utmParams}`;
}

function amazonButtonHTML(card, utmCampaign) {
  const url = affiliateUrl(card, utmCampaign);
  if (!url) return "";
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
  const url = affiliateUrl(card, utmCampaign);
  const imageTag = `<img src="${image}" alt="${card.name}" width="120" height="120" loading="lazy" onerror="this.src='/img/cards/placeholder.webp'">`;
  const nameTag = card.name;

  return `
    <button type="button" class="compare-remove-btn" aria-label="Remove ${card.name} from comparison" title="Remove"><i class="fas fa-xmark"></i></button>
    ${tierBadge}
    ${url ? `<a href="${url}" target="_blank" rel="nofollow noopener">` : ""}
    <div class="compare-card-image">${imageTag}</div>
    <h3 class="compare-card-name">${nameTag}</h3>
    ${url ? "</a>" : ""}
    ${priceBadgeHTML(card)}
    ${specsListHTML(card)}
    ${capacitiesHTML(card)}
    ${prosConsHTML(card)}
    ${amazonButtonHTML(card, utmCampaign)}
  `;
}

function renderEmptyPanelHTML() {
  return `
    <div class="compare-empty-state">
      <i class="fas fa-circle-plus"></i>
      <p>Add a card to compare</p>
    </div>
  `;
}

function renderSelectOptions(allCards, selectedId) {
  const blankOption = `<option value="" ${selectedId ? "" : "selected"}>Choose a card&hellip;</option>`;
  const cardOptions = allCards
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.name}</option>`)
    .join("");
  return blankOption + cardOptions;
}

function renderSlot(card, allCards, slotIndex, utmCampaign) {
  const isEmpty = !card;
  return `
  <div class="compare-slot" data-slot="${slotIndex}">
    <label class="compare-select-label" for="compare-select-${slotIndex}">Card ${slotIndex + 1}</label>
    <select class="compare-select" id="compare-select-${slotIndex}" data-slot="${slotIndex}" aria-label="Select card for slot ${slotIndex + 1}">
      ${renderSelectOptions(allCards, isEmpty ? null : card.id)}
    </select>
    <div class="compare-card-panel${isEmpty ? " compare-card-panel-empty" : ""}" data-card-id="${isEmpty ? "" : card.id}">
      ${isEmpty ? renderEmptyPanelHTML() : renderCardPanel(card, utmCampaign)}
    </div>
  </div>`;
}

/**
 * @param {string[]} cardIds - up to 3 card ids to pre-fill, by slot position.
 *   Missing/removed ids render as an empty "add a card" slot rather than
 *   being skipped, since every slot is optional (up to 3, not exactly 3).
 * @param {Record<string, object>} cardMap
 * @param {object[]} allCards - full catalog, used to populate every dropdown
 * @param {{mode: "standalone"|"widget", utmCampaign: string}} opts
 */
function renderCompareGrid(cardIds, cardMap, allCards, { mode, utmCampaign }) {
  const slotCards = Array.from({ length: MAX_SLOTS }, (_, i) => cardMap[cardIds[i]] || null);

  const slotsHTML = slotCards.map((card, i) => renderSlot(card, allCards, i, utmCampaign)).join("");

  return `<div class="compare-grid" data-mode="${mode}" data-utm-campaign="${utmCampaign}">${slotsHTML}</div>`;
}

const COMPARE_FAQS = [
  {
    q: "What's the difference between UHS-I and UHS-II cards?",
    a: "UHS-I cards have one row of pins and max out around 104 MB/s. UHS-II cards add a second row of pins that roughly doubles the speed. The catch: your device needs to support UHS-II to use the faster speeds. If you plug a UHS-II card into a UHS-I device, it'll just run at UHS-I speeds."
  },
  {
    q: "What do Speed Class ratings like C10, U3, and V30 actually do?",
    a: "Speed Class ratings guarantee minimum write speeds so your video doesn't stutter or drop frames. C10 means at least 10 MB/s write speed (good for HD video). U3 guarantees 30 MB/s (better for 4K). V30 and higher are what you need for serious video work, professional cameras, or high bitrate footage. V60 and V90 are overkill for most people but necessary for cinema cameras."
  },
  {
    q: "Should I care about the A2 rating?",
    a: "The A2 rating (App Performance Class) tells you how fast a card handles the quick random read/write tasks that apps and games need. A2 cards are noticeably snappier on phones, tablets, and gaming devices like the Steam Deck. If you're using your card mainly for photos or video, A2 doesn't matter much."
  },
  {
    q: "Why do cards have different read and write speeds?",
    a: "Read speed is how fast files come off the card. Write speed is how fast data goes onto the card. For video recording, write speed is what matters because if your camera's bitrate exceeds the card's write speed, your recording will glitch or stop. For photo work, read speed matters more because you're usually just offloading files."
  },
  {
    q: "What's the endurance rating for?",
    a: "Endurance tells you how much writing a card can handle before it wears out. Standard endurance cards are fine for normal photography and occasional video. High or Max Endurance cards are built to survive constant writing, which is why they're essential for dashcams and security cameras that record 24/7. Using a standard card in those situations will kill it fast."
  }
];


function generateComparePage(distPath) {
  console.log("Generating Compare page...");
  const { generateHeader, generateFooter, generateSidebar } = require("../../src/templates/components");
  const { generateFAQHTML, generateFAQSchema } = require("./helpers");

  const allCards = loadAllCards();
  const cardMap = buildCardMap(allCards);

  // Empty by default: comparing up to 3 cards is opt-in per slot, not forced.
  const defaultIds = [];

  const gridHTML = renderCompareGrid(defaultIds, cardMap, allCards, {
    mode: "standalone",
    utmCampaign: "compare-page",
  });

  const template = readTemplate(path.join(__dirname, "../../src/templates/compare.html"));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Compare SD Cards", url: "/compare/" },
  ]);
  const faqHTML = generateFAQHTML(COMPARE_FAQS);
  const faqSchema = generateFAQSchema(COMPARE_FAQS);

  const html = template
    .replace(/{{HEADER}}/g, generateHeader())
    .replace(/{{FOOTER}}/g, generateFooter())
    .replace(/{{SIDEBAR}}/g, generateSidebar())
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{FAQ_SCHEMA}}/g, faqSchema)
    .replace(/{{FAQ_HTML}}/g, faqHTML)
    .replace(/{{COMPARE_GRID_HTML}}/g, gridHTML);

  writeFile(path.join(distPath, "compare", "index.html"), html);
  console.log(`  ✓ Generated /compare/index.html (empty by default, up to ${MAX_SLOTS} cards)`);
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
  renderCompareGrid,
  generateComparePage,
  generateDeviceCompareWidgetHTML,
};
