const fs = require('fs');
const path = require('path');
const { generateHeader, generateFooter, generateSidebar } = require('../../src/templates/components.js');
const { writeFile, getCardImageFallback, getCarImageFallback, generateFAQHTML, generateFAQSchema, generateBreadcrumbSchema } = require('./helpers');

const BASE_URL = 'https://sdcardchecker.com';

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
     const carUrl = `${BASE_URL}/cars/${vehicle.slug}/`;

     // Fetch the actual SD card objects using the IDs in cars-navigation.json
     const cards = vehicle.cardIds
       .map(id => allCards.find(c => c.id === id))
       .filter(Boolean);

     // 1. Build the Table (with product images, matching device-page styling)
     const productRows = cards.map((card, i) => {
       const cardImage = card.imageUrl || getCardImageFallback(card);
       const priceTierClass = card.priceTier ? `price-${card.priceTier.toLowerCase().replace(/\s+/g, '-')}` : 'price-mid-range';
       const priceSymbol = card.priceSymbol || '$$';

       const prosList = card.pros
         ? card.pros.split('.').map(p => p.trim()).filter(Boolean).map(p => `<li>${p}</li>`).join('')
         : '';
       const prosHtml = `<ul style="margin:0; padding-left:1.25rem; font-size:0.95rem;">${prosList}</ul>`;

       const utmParams = `utm_source=sdcardchecker&utm_medium=car-page&utm_campaign=${vehicle.slug}&utm_content=${card.tier || 'featured'}`;
       const amazonUrlWithUTM = card.affiliateUrl.includes('?') ? `${card.affiliateUrl}&${utmParams}` : `${card.affiliateUrl}?${utmParams}`;
       const altLink = card.affiliateUrlAlt ? `<br><a href="${card.affiliateUrlAlt}" target="_blank" rel="nofollow sponsored" class="text-xs text-blue-500">Alt Listing</a>` : '';

       const cardAlt = `${card.name} - ${vehicle.carModel} navigation SD card, part ${card.partNumber}`;

       return `
       <tr${i === 0 ? ' class="bg-blue-50"' : ''}>
       <td class="table-card-cell">
       <a href="${amazonUrlWithUTM}" target="_blank" rel="nofollow sponsored" class="table-card-link-wrapper" title="${card.name} on Amazon">
       <div class="table-card-image">
       <img src="${cardImage}" alt="${cardAlt}" title="${card.name}" width="115" height="115" loading="lazy" />
       </div>
       <div class="table-card-name">${card.name}</div>
       </a>
       </td>
       <td data-label="Map Year">${card.specs?.mapYear || '2025'}</td>
       <td data-label="Coverage">${card.specs?.mapRegion || 'North America'}</td>
       <td data-label="Pros">${prosHtml}</td>
       <td data-label="Price" class="price-column">
       <span class="price-badge ${priceTierClass}">${priceSymbol}</span>
       <a href="${amazonUrlWithUTM}" target="_blank" rel="nofollow sponsored" class="btn-check-price">
         <i class="fas fa-shopping-cart"></i> Check Price
       </a>
       ${altLink}
       </td>
       </tr>`;
     }).join('\n');

     // 2. Build SEO HTML Blocks (styled consistently with device pages)
     const featuresHtml = (vehicle.specificFeatures || []).length > 0 ?
        `<section class="mb-16"><h2 class="text-2xl font-bold text-slate-900 mb-6">${vehicle.carModel} Features</h2><div class="bg-white border border-slate-200 rounded-lg shadow-sm p-6"><div class="grid md:grid-cols-2 gap-4">${vehicle.specificFeatures.map(f => `<div class="flex items-start gap-3"><i class="fas fa-check-circle text-emerald-500 mt-1"></i><span class="text-slate-700">${f}</span></div>`).join('')}</div></div></section>` : '';

     const issuesHtml = (vehicle.commonIssues || []).length > 0 ?
        `<section class="mb-16"><h2 class="text-2xl font-bold text-slate-900 mb-6">Common Issues</h2><div class="bg-white border border-slate-200 rounded-lg shadow-sm p-6"><ul class="space-y-3">${vehicle.commonIssues.map(i => `<li class="flex items-start gap-3"><i class="fas fa-circle-exclamation text-amber-500 mt-1"></i><span class="text-slate-700">${i}</span></li>`).join('')}</ul></div></section>` : '';

     const carFaqs = (vehicle.faqs || []).map(f => ({ q: f.question, a: f.answer }));
     const faqsHtml = carFaqs.length > 0 ? generateFAQHTML(carFaqs) : '';

     const tc = vehicle.trimCompatibility;
     const compatHtml = tc ?
        `<section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">${vehicle.carModel} Trim Compatibility</h2>
          <div class="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div class="grid md:grid-cols-2 gap-6">
            ${tc.compatible && tc.compatible.length ? `<div><h4 class="font-semibold text-emerald-700 mb-2 flex items-center gap-2"><i class="fas fa-check-circle"></i> Compatible Trims</h4><ul class="space-y-1">${tc.compatible.map(t => `<li class="text-slate-700">${t}</li>`).join('')}</ul></div>` : ''}
            ${tc.notCompatible && tc.notCompatible.length ? `<div><h4 class="font-semibold text-red-700 mb-2 flex items-center gap-2"><i class="fas fa-circle-xmark"></i> Not Compatible</h4><ul class="space-y-1">${tc.notCompatible.map(t => `<li class="text-slate-700">${t}</li>`).join('')}</ul></div>` : ''}
          </div>
          </div>
        </section>` : '';

     const relatedVehicles = vehicles.filter(v => v.make === vehicle.make && v.slug !== vehicle.slug);
     const relatedVehiclesHtml = relatedVehicles.length > 0 ? `
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Other ${vehicle.make} Vehicles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${relatedVehicles.map(rel => `<a href="/cars/${rel.slug}/" class="device-card"><div class="device-card-name">${rel.carModel}</div><div class="device-card-info">${rel.years}</div></a>`).join('\n')}
          </div>
        </section>` : '';

     // 3. SEO metadata, schema
     const title = `${vehicle.carModel} Navigation SD Card Update | ${vehicle.years} - Latest Maps`;
     const ogTitle = `Best Navigation SD Card for ${vehicle.carModel} | ${vehicle.years}`;

     const topCard = cards[0];
     const answerText = topCard ? topCard.name : `${vehicle.carModel} Navigation SD Card`;
     const answerExplanation = topCard
        ? `${topCard.pros} ${vehicle.carModel} owners get ${topCard.specs?.mapYear || '2025'} maps covering ${topCard.specs?.mapRegion || 'North America'}.`
        : vehicle.seoDescription;

     // Hero: real vehicle photo when sourced, gradient + car icon placeholder otherwise
     const heroImage = getCarImageFallback(vehicle);
     const heroAlt = `${vehicle.carModel} (${vehicle.years}) navigation SD card upgrade`;
     const heroTitle = `Best navigation SD card for ${vehicle.carModel}`;
     const heroHtml = heroImage
        ? `<div class="hero-image-container mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                <img src="${heroImage}" alt="${heroAlt}" title="${heroTitle}" class="w-full object-cover hero-image" width="1200" height="350" loading="lazy" />
                <div class="hero-overlay">
                    <h1 class="hero-title" style="color: #ffffff;">
                        Best Navigation SD Card for ${vehicle.carModel}
                    </h1>
                </div>
            </div>`
        : `<div class="hero-image-container mb-12 rounded-2xl overflow-hidden shadow-lg relative" style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%); min-height: 220px;">
                <div class="hero-overlay" style="background: linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 100%);">
                    <div class="text-center px-4">
                        <i class="fas fa-car-side text-white text-4xl mb-3 opacity-80"></i>
                        <h1 class="hero-title" style="color: #ffffff;">
                            Best Navigation SD Card for ${vehicle.carModel}
                        </h1>
                    </div>
                </div>
            </div>`;

     const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Car Navigation', url: '/cars/' },
        { name: vehicle.carModel, url: `/cars/${vehicle.slug}/` }
     ]);
     const faqSchema = generateFAQSchema(carFaqs.length > 0 ? carFaqs : [{ q: `What SD card do I need for my ${vehicle.carModel}?`, a: vehicle.seoDescription || '' }]);
     const productSchema = topCard ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": topCard.name,
        "image": BASE_URL + (topCard.imageUrl || getCardImageFallback(topCard)),
        "description": topCard.pros,
        "offers": {
          "@type": "Offer",
          "url": topCard.affiliateUrl,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
     }) : '{}';

     // 4. Final Template Replacement (Note the NO semicolons between .replace calls)
     let html = template
       .replace(/{{HEADER}}/g, headerHtml)
       .replace(/{{FOOTER}}/g, footerHtml)
       .replace(/{{SIDEBAR}}/g, sidebarHtml)
       .replace(/{{CAR_TITLE}}/g, title)
       .replace(/{{OG_TITLE}}/g, ogTitle)
       .replace(/{{CAR_URL}}/g, carUrl)
       .replace(/{{HERO_HTML}}/g, heroHtml)
       .replace(/{{CAR_MODEL}}/g, vehicle.carModel)
       .replace(/{{YEARS}}/g, vehicle.years)
       .replace(/{{MAKE}}/g, vehicle.make)
       .replace(/{{PART_NOTE}}/g, vehicle.partNumberNote)
       .replace(/{{SEO_DESCRIPTION}}/g, vehicle.seoDescription || '')
       .replace(/{{ANSWER_TEXT}}/g, answerText)
       .replace(/{{ANSWER_EXPLANATION}}/g, answerExplanation)
       .replace(/{{PRODUCTS_TABLE}}/g, productRows)
       .replace(/{{INSTALL_GUIDE}}/g, vehicle.installGuide)
       .replace(/{{WARNING}}/g, vehicle.warning)
       .replace(/{{SPECIFIC_FEATURES_HTML}}/g, featuresHtml)
       .replace(/{{COMMON_ISSUES_HTML}}/g, issuesHtml)
       .replace(/{{FAQS_HTML}}/g, faqsHtml)
       .replace(/{{COMPATIBILITY_HTML}}/g, compatHtml)
       .replace(/{{RELATED_LINKS}}/g, relatedVehiclesHtml)
       .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
       .replace(/{{FAQ_SCHEMA}}/g, faqSchema)
       .replace(/{{PRODUCT_SCHEMA}}/g, productSchema);

    const outDir = path.join(distPath, 'cars', vehicle.slug);
    writeFile(path.join(outDir, 'index.html'), html);
  });
}
module.exports = { generateCarPages };
