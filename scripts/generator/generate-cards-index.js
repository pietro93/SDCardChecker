/**
 * SD Card Checker - /cards/ Index Page Generator
 *
 * Lists every card that has its own /cards/<id>/ spec/review page (i.e. the
 * same enrichment-gated set generate-card-pages.js builds), so the breadcrumb
 * link on each card page resolves and the cards have an internal hub linking
 * into them beyond the sitemap.
 */
const path = require("path");
const fs = require("fs");
const {
  readTemplate,
  writeFile,
  getCardImageFallback,
  generateBreadcrumbSchema,
  loadSDCardEnrichment,
} = require("./helpers");

function heroImagePath(cardId) {
  const heroPath = path.join(__dirname, "../../img/cards/_hero", `${cardId}.webp`);
  return fs.existsSync(heroPath) ? `/img/cards/_hero/${cardId}.webp` : null;
}

function generateCardsIndex(distPath) {
  console.log("Generating SD Cards Index Page...");

  const { generateHeader, generateFooter, generateSidebar } = require("../../src/templates/components");

  const sdcardsPath = path.join(__dirname, "../../data/sdcards.json");
  const { sdcards } = JSON.parse(fs.readFileSync(sdcardsPath, "utf8"));
  const cardMap = Object.fromEntries(sdcards.map((c) => [c.id, c]));

  const enrichmentData = loadSDCardEnrichment();
  const gatedCards = Object.keys(enrichmentData)
    .map((id) => cardMap[id])
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  const tilesHtml = gatedCards
    .map((card) => {
      const image = heroImagePath(card.id) || card.imageUrl || getCardImageFallback(card);
      const priceLabel = card.priceSymbol ? `${card.priceSymbol} &middot; ${card.priceTier}` : card.priceTier || "";
      return `
<div class="card-tile">
  <div class="card-tile-image"><img src="${image}" alt="${card.name}" width="110" height="110" loading="lazy" /></div>
  <div class="card-tile-name">${card.name}</div>
  <div class="card-tile-meta">${card.specs?.speedClass || ""} ${priceLabel}</div>
  <a href="/cards/${card.id}/" class="card-tile-link">Read Full Review &rarr;</a>
</div>`;
    })
    .join("");

  const template = readTemplate(path.join(__dirname, "../../src/templates/cards-index.html"));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "SD Cards", url: "/cards/" },
  ]);

  const html = template
    .replace(/{{HEADER}}/g, generateHeader())
    .replace(/{{FOOTER}}/g, generateFooter())
    .replace(/{{SIDEBAR}}/g, generateSidebar())
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{CARD_TILES_HTML}}/g, tilesHtml);

  writeFile(path.join(distPath, "cards", "index.html"), html);
  console.log(`  ✓ Generated /cards/index.html (${gatedCards.length} cards)`);
}

module.exports = { generateCardsIndex };
