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
  console.log('🚗 Generating Car Navigation Pages (Vehicle-Centric)...');

  const vehiclesPath = path.join(process.cwd(), 'data/cars-navigation.json');
  const sdcardsPath  = path.join(process.cwd(), 'data/sdcards.json');
  const templatePath = path.join(process.cwd(), 'src/templates/car-nav.html');

  if (!fs.existsSync(vehiclesPath)) {
    console.warn("  ⚠️  data/cars-navigation.json not found. Skipping.");
    return;
  }

  const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));
  const sdcardsData = JSON.parse(fs.readFileSync(sdcardsPath, 'utf8'));
  const allCards = Array.isArray(sdcardsData) ? sdcardsData : sdcardsData.sdcards;
  
  const template = fs.readFileSync(templatePath, 'utf8');
  
  const headerHtml = generateHeader();
  const footerHtml = generateFooter();
  const sidebarHtml = generateSidebar();

  let pageCount = 0;

  vehicles.forEach((vehicle, vehicleIndex) => {
     const cards = vehicle.cardIds
       .map(id => allCards.find(c => c.id === id))
       .filter(Boolean);

     if (cards.length === 0) {
       console.warn(`  ⚠️  No matching cards found for ${vehicle.slug} (IDs: ${vehicle.cardIds.join(', ')}).`);
       return;
     }

     const productRows = cards.map((card, i) => {
       const badge =
         card.tier === 'recommended' ? `<span class="badge-rec">⭐ Recommended</span>` :
         card.tier === 'premium'     ? `<span class="badge-pre">👑 Premium</span>` :
                                       `<span class="badge-bud">💰 Budget</span>`;

       const altLink = card.affiliateUrlAlt
         ? ` <br><a href="${card.affiliateUrlAlt}" target="_blank" rel="nofollow sponsored" class="text-xs text-blue-500">Alt Listing</a>`
         : '';

       return `<tr${i === 0 ? ' class="bg-blue-50"' : ''}>
         <td class="p-3 border-b"><strong>${card.name}</strong><br>${badge}</td>
         <td class="p-3 border-b">${card.specs?.mapYear || card.specs?.speedClass || '—'}</td>
         <td class="p-3 border-b">${card.specs?.mapRegion || '—'}</td>
         <td class="p-3 border-b font-bold">${card.priceSymbol}</td>
         <td class="p-3 border-b">
           <a href="${card.affiliateUrl}" target="_blank" rel="nofollow sponsored" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Check Price</a>
           ${altLink}
         </td>
       </tr>`;
     }).join('\n');

     const relatedVehicles = vehicles.filter(v => v.make === vehicle.make && v.slug !== vehicle.slug);
     const relatedLinks = relatedVehicles.map(rel => 
       `<a href="/cars/${rel.slug}/" class="block p-3 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition flex items-center">
         <span class="mr-2 text-xl">🚗</span>
         <div>
            <strong class="text-gray-900">${rel.carModel}</strong>
            <p class="text-sm text-gray-500">${rel.years}</p>
         </div>
       </a>`
     ).join('\n');

     // --- NEW: BUILD RICH SEO HTML BLOCKS HERE ---
     
     let specificFeaturesHtml = '';
     if (vehicle.specificFeatures && vehicle.specificFeatures.length > 0) {
         let listItems = vehicle.specificFeatures.map(f => `<div class="flex items-start"><span class="text-green-500 mr-2">✓</span><span class="text-gray-700">${f}</span></div>`).join('');
         specificFeaturesHtml = `
         <div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
             <h3 class="text-xl font-bold mb-4 text-gray-900">${vehicle.carModel} Navigation Features</h3>
             <div class="grid md:grid-cols-2 gap-4">${listItems}</div>
         </div>`;
     }

     let commonIssuesHtml = '';
     if (vehicle.commonIssues && vehicle.commonIssues.length > 0) {
         let listItems = vehicle.commonIssues.map(i => `<li>${i}</li>`).join('');
         commonIssuesHtml = `
         <div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
             <h3 class="text-xl font-bold mb-4 text-gray-900">Common Issues & Solutions for ${vehicle.carModel}</h3>
             <ul class="space-y-3 list-disc list-inside text-gray-700 pl-4">${listItems}</ul>
         </div>`;
     }

     let faqsHtml = '';
     if (vehicle.faqs && vehicle.faqs.length > 0) {
         let listItems = vehicle.faqs.map(f => `
         <div class="faq-item">
             <div class="faq-question">${f.question} <span>▼</span></div>
             <div class="faq-answer">${f.answer}</div>
         </div>`).join('');
         faqsHtml = `
         <div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
             <h3 class="text-xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h3>
             <div class="space-y-2">${listItems}</div>
         </div>`;
     }

     let compatibilityHtml = '';
     if (vehicle.trimCompatibility) {
         let compHTML = vehicle.trimCompatibility.compatible.map(t => `<li class="text-gray-700">• ${t}</li>`).join('');
         let incompHTML = vehicle.trimCompatibility.notCompatible.map(t => `<li class="text-gray-700">• ${t}</li>`).join('');
         compatibilityHtml = `
         <div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
             <h3 class="text-xl font-bold mb-4 text-gray-900">${vehicle.carModel} Trim Compatibility</h3>
             <div class="grid md:grid-cols-2 gap-6">
                 <div><h4 class="font-semibold text-green-800 mb-2">✅ Compatible Trims:</h4><ul class="space-y-1">${compHTML}</ul></div>
                 <div><h4 class="font-semibold text-red-800 mb-2">❌ Not Compatible:</h4><ul class="space-y-1">${incompHTML}</ul></div>
             </div>
         </div>`;
     } else if (vehicle.applicableModels) {
         let modelsHTML = vehicle.applicableModels.map(m => `<div class="flex items-start"><span class="text-blue-500 mr-2">▪</span><span class="text-gray-700">${m}</span></div>`).join('');
         compatibilityHtml = `
         <div class="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100">
             <h3 class="text-xl font-bold mb-4 text-gray-900">Applicable ${vehicle.make} Models</h3>
             <p class="text-gray-600 mb-4">This navigation card is compatible with the following ${vehicle.make} models, provided they have factory-installed navigation:</p>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${modelsHTML}</div>
         </div>`;
     }

     const primary = cards[0];

     let html = template
       .replace(/{{CAR_MODEL}}/g,         vehicle.carModel || '')
       .replace(/{{YEARS}}/g,             vehicle.years || '')
       .replace(/{{MAKE}}/g,              vehicle.make || '')
       .replace(/{{PART_NOTE}}/g,         vehicle.partNumberNote || '')
       .replace(/{{SEO_DESCRIPTION}}/g,   vehicle.seoDescription || '')
       .replace(/{{PRIMARY_CARD_NAME}}/g, primary.name || '')
       .replace(/{{PRIMARY_LINK}}/g,      primary.affiliateUrl || '')
       .replace(/{{PRODUCTS_TABLE}}/g,    productRows)
       .replace(/{{INSTALL_GUIDE}}/g,     vehicle.installGuide || '')
       .replace(/{{WARNING}}/g,           vehicle.warning || '')
       .replace(/{{SPECIFIC_FEATURES_HTML}}/g, specificFeaturesHtml)
       .replace(/{{COMMON_ISSUES_HTML}}/g,     commonIssuesHtml)
       .replace(/{{FAQS_HTML}}/g,              faqsHtml)
       .replace(/{{COMPATIBILITY_HTML}}/g,     compatibilityHtml)
       .replace(/{{RELATED_LINKS}}/g,     relatedLinks)
       .replace(/{{HEADER}}/g,            headerHtml)
       .replace(/{{FOOTER}}/g,            footerHtml)
       .replace(/{{SIDEBAR}}/g,           sidebarHtml);

    const outDir = path.join(distPath, 'cars', vehicle.slug);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    pageCount++;
  });

  console.log(`  ✓ Generated ${pageCount} car navigation page(s)`);
}

module.exports = { generateCarPages };