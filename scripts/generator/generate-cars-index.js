const path = require('path');
const fs = require('fs');
const { readJSON, writeFile, readTemplate } = require('./helpers');

function generateCarsIndex(distPath) {
  console.log('🚗 Generating Car Navigation Index Page...');

  const carsPath = path.join(process.cwd(), 'data/cars-navigation.json');
  const templatePath = path.join(process.cwd(), 'src/templates/cars-index.html');
  
  const srcPath = path.join(__dirname, "../../src");
  const { generateHeader, generateFooter } = require("../../src/templates/components");

  if (!fs.existsSync(carsPath)) {
    console.warn("  ⚠️  data/cars-navigation.json not found. Skipping.");
    return;
  }

  const vehicles = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
  const template = readTemplate(templatePath);

  // Build vehicle cards by brand
  const cardByBrand = {
    Toyota: [],
    Chevrolet: [],
    GMC: [],
    Cadillac: [],
    Buick: []
  };

  vehicles.forEach(vehicle => {
    const brand = vehicle.make;
    if (cardByBrand[brand]) {
      const card = `<a href="/cars/${vehicle.slug}/" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition text-decoration: none;" style="text-decoration: none; display: flex; flex-direction: column;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${vehicle.carModel}</h3>
        <p style="color: #64748b; margin-bottom: 1rem;">Model Years: ${vehicle.years}</p>
        <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1rem;">${vehicle.partNumberNote}</p>
        <span style="color: #2563eb; font-weight: 600; margin-top: auto;">View Products →</span>
      </a>`;
      cardByBrand[brand].push(card);
    }
  });

  const toyotaHtml = cardByBrand.Toyota.join('\n');
  const chevyHtml = cardByBrand.Chevrolet.join('\n');
  const gmcHtml = cardByBrand.GMC.join('\n');
  const cadillacHtml = cardByBrand.Cadillac.join('\n');
  const buickHtml = cardByBrand.Buick.join('\n');

  const header = generateHeader();
  const footer = generateFooter();

  let html = template
    .replace('{{HEADER}}', header)
    .replace('{{FOOTER}}', footer)
    .replace('{{TOYOTA_VEHICLES}}', toyotaHtml)
    .replace('{{CHEVY_VEHICLES}}', chevyHtml)
    .replace('{{GMC_VEHICLES}}', gmcHtml)
    .replace('{{CADILLAC_VEHICLES}}', cadillacHtml)
    .replace('{{BUICK_VEHICLES}}', buickHtml);

  const outDir = path.join(distPath, 'cars');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  writeFile(path.join(outDir, 'index.html'), html);

  console.log(`  ✓ Generated /cars/index.html (${Object.values(cardByBrand).reduce((sum, arr) => sum + arr.length, 0)} vehicles)`);
}

module.exports = { generateCarsIndex };
