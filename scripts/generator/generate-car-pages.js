const fs = require('fs');
const path = require('path');
const { generateHeader, generateFooter, generateSidebar } = require('../../src/templates/components.js');

const slugify = text => text.toString().toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

function generateCarPages(distPath) {
  console.log('🚗 Generating Car Navigation Pages...');

  const vehiclesPath = path.join(process.cwd(), 'data/cars-navigation.json');
  const sdcardsPath  = path.join(process.cwd(), 'data/sdcards.json');
  const templatePath = path.join(process.cwd(), 'src/templates/car-nav.html');

  if (!fs.existsSync(vehiclesPath)) return;

  const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));
  const sdcardsData = JSON.parse(fs.readFileSync(sdcardsPath, 'utf8'));
  const allCards = Array.isArray(sdcardsData) ? sdcardsData : sdcardsData.sdcards;
  const template = fs.readFileSync(templatePath, 'utf8');
  
  const headerHtml = generateHeader();
  const footerHtml = generateFooter();
  const sidebarHtml = generateSidebar();

  vehicles.forEach((vehicle) => {
     // Fetch the actual SD card objects using the IDs in cars-navigation.json
     const cards = vehicle.cardIds
       .map(id => allCards.find(c => c.id === id))
       .filter(Boolean);

     // 1. Build the Table (keeps affiliate links)
     const productRows = cards.map((card, i) => {
       const badge = card.tier === 'recommended' ? `<span class="badge-rec">⭐ Recommended</span>` :
                     card.tier === 'premium'     ? `<span class="badge-pre">👑 Premium</span>` :
                                                   `<span class="badge-bud">💰 Budget</span>`;
       const altLink = card.affiliateUrlAlt ? `<br><a href="${card.affiliateUrlAlt}" target="_blank" rel="nofollow sponsored" class="text-xs text-blue-500">Alt Listing</a>` : '';

       return `<tr${i === 0 ? ' class="bg-blue-50"' : ''}>
         <td class="p-3 border-b"><strong>${card.name}</strong><br>${badge}</td>
         <td class="p-3 border-b">${card.specs?.mapYear || '2025'}</td>
         <td class="p-3 border-b">${card.specs?.mapRegion || 'North America'}</td>
         <td class="p-3 border-b font-bold">${card.priceSymbol || '$$'}</td>
         <td class="p-3 border-b">
           <a href="${card.affiliateUrl}" target="_blank" rel="nofollow sponsored" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Check Price</a>
           ${altLink}
         </td>
       </tr>`;
     }).join('\n');

     // 2. Build SEO HTML Blocks
     const featuresHtml = (vehicle.specificFeatures || []).length > 0 ? 
        `<div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100"><h3 class="text-xl font-bold mb-4 text-gray-900">${vehicle.carModel} Features</h3><div class="grid md:grid-cols-2 gap-4">${vehicle.specificFeatures.map(f => `<div class="flex items-start"><span class="text-green-500 mr-2">✓</span><span>${f}</span></div>`).join('')}</div></div>` : '';

     const issuesHtml = (vehicle.commonIssues || []).length > 0 ? 
        `<div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100"><h3 class="text-xl font-bold mb-4 text-gray-900">Common Issues</h3><ul class="space-y-2 list-disc list-inside text-gray-700">${vehicle.commonIssues.map(i => `<li>${i}</li>`).join('')}</ul></div>` : '';

     const faqsHtml = (vehicle.faqs || []).length > 0 ? 
        `<div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100"><h3 class="text-xl font-bold mb-4 text-gray-900">FAQ</h3><div class="space-y-4">${vehicle.faqs.map(f => `<div><p class="font-bold">${f.question}</p><p class="text-gray-600">${f.answer}</p></div>`).join('')}</div></div>` : '';

     const relatedVehiclesHtml = vehicles.filter(v => v.make === vehicle.make && v.slug !== vehicle.slug).map(rel => 
       `<a href="/cars/${rel.slug}/" class="block p-3 border border-gray-200 rounded hover:bg-blue-50"><strong>${rel.carModel}</strong><p class="text-sm text-gray-500">${rel.years}</p></a>`
     ).join('\n');

     // 3. Final Template Replacement (Note the NO semicolons between .replace calls)
     let html = template
       .replace(/{{HEADER}}/g, headerHtml)
       .replace(/{{FOOTER}}/g, footerHtml)
       .replace(/{{SIDEBAR}}/g, sidebarHtml)
       .replace(/{{CAR_MODEL}}/g, vehicle.carModel)
       .replace(/{{YEARS}}/g, vehicle.years)
       .replace(/{{MAKE}}/g, vehicle.make)
       .replace(/{{PART_NOTE}}/g, vehicle.partNumberNote)
       .replace(/{{SEO_DESCRIPTION}}/g, vehicle.seoDescription || '')
       .replace(/{{PRODUCTS_TABLE}}/g, productRows)
       .replace(/{{INSTALL_GUIDE}}/g, vehicle.installGuide)
       .replace(/{{WARNING}}/g, vehicle.warning)
       .replace(/{{SPEC_FEATURES_HTML}}/g, featuresHtml)
       .replace(/{{COMMON_ISSUES_HTML}}/g, issuesHtml)
       .replace(/{{FAQS_HTML}}/g, faqsHtml)
       .replace(/{{RELATED_LINKS}}/g, relatedVehiclesHtml);

    const outDir = path.join(distPath, 'cars', vehicle.slug);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
  });
}
module.exports = { generateCarPages };