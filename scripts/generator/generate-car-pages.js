const fs = require('fs');
const path = require('path');

const slugify = text => text.toString().toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

function generateCarPages(distPath) {
  console.log('🚗 Generating Car Navigation Pages (Vehicle-Centric)...');

  const vehiclesPath = path.join(process.cwd(), 'data/cars-navigation.json');
  const sdcardsPath  = path.join(process.cwd(), 'data/sdcards.json');
  const templatePath = path.join(process.cwd(), 'src/templates/car-nav.html');

  if (!fs.existsSync(vehiclesPath)) {
    console.warn("  ⚠️  data/cars-navigation.json not found. Skipping.");
    return;
  }

  const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));
  // Ensure we get the sdcards array whether it's wrapped or not
  const sdcardsData = JSON.parse(fs.readFileSync(sdcardsPath, 'utf8'));
  const allCards = Array.isArray(sdcardsData) ? sdcardsData : sdcardsData.sdcards;
  
  const template = fs.readFileSync(templatePath, 'utf8');

  let pageCount = 0;

  vehicles.forEach(vehicle => {
    // Map the cardIds in the vehicle entry to the full card objects from sdcards.json
    const cards = vehicle.cardIds
      .map(id => allCards.find(c => c.id === id))
      .filter(Boolean);

    if (cards.length === 0) {
      console.warn(`  ⚠️  No matching cards found for ${vehicle.slug} (IDs: ${vehicle.cardIds.join(', ')}).`);
      return;
    }

    // Build the comparison table rows
    const productRows = cards.map((card, i) => {
      const badge =
        card.tier === 'recommended' ? `<span class="badge-rec">⭐ Recommended</span>` :
        card.tier === 'premium'     ? `<span class="badge-pre">👑 Premium</span>` :
                                      `<span class="badge-bud">💰 Budget</span>`;

      // If the card has an alternate URL (duplicate ASIN), show it
      const altLink = card.affiliateUrlAlt
        ? ` <br><a href="${card.affiliateUrlAlt}" target="_blank" rel="nofollow sponsored" class="text-xs text-blue-500">Alt Listing</a>`
        : '';

      return `<tr${i === 0 ? ' class="bg-blue-50"' : ''}>
  <td class="p-3 border-b">
    <strong>${card.name}</strong><br>${badge}
  </td>
  <td class="p-3 border-b">${card.specs?.mapYear || card.specs?.speedClass || '—'}</td>
  <td class="p-3 border-b">${card.specs?.mapRegion || '—'}</td>
  <td class="p-3 border-b font-bold">${card.priceSymbol}</td>
  <td class="p-3 border-b">
    <a href="${card.affiliateUrl}" target="_blank" rel="nofollow sponsored" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Check Price</a>
    ${altLink}
  </td>
</tr>`;
    }).join('\n');

    // The first card in the list is the "Primary" recommendation
    const primary = cards[0];

    let html = template
      .replace(/{{CAR_MODEL}}/g,         vehicle.carModel)
      .replace(/{{YEARS}}/g,             vehicle.years)
      .replace(/{{MAKE}}/g,              vehicle.make)
      .replace(/{{PART_NOTE}}/g,         vehicle.partNumberNote)
      .replace(/{{PRIMARY_CARD_NAME}}/g, primary.name)
      .replace(/{{PRIMARY_LINK}}/g,      primary.affiliateUrl)
      .replace(/{{PRODUCTS_TABLE}}/g,    productRows)
      .replace(/{{INSTALL_GUIDE}}/g,     vehicle.installGuide)
      .replace(/{{WARNING}}/g,           vehicle.warning);

    const outDir = path.join(distPath, 'cars', vehicle.slug);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    pageCount++;
  });

  console.log(`  ✓ Generated ${pageCount} car navigation page(s)`);
}

module.exports = { generateCarPages };
