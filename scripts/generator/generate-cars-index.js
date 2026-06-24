const path = require('path');
const fs = require('fs');
const { readJSON, writeFile, readTemplate, getCarImageFallback, generateBreadcrumbSchema } = require('./helpers');

const BASE_URL = 'https://sdcardchecker.com';

function generateCarsIndex(distPath) {
  console.log('Generating Car Navigation Index Page...');

  const carsPath = path.join(process.cwd(), 'data/cars-navigation.json');
  const templatePath = path.join(process.cwd(), 'src/templates/cars-index.html');

  const { generateHeader, generateFooter, generateSidebar } = require("../../src/templates/components");

  if (!fs.existsSync(carsPath)) {
    console.warn("data/cars-navigation.json not found. Skipping.");
    return;
  }

  const vehicles = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
  const template = readTemplate(templatePath);

  const sortedVehicles = [...vehicles].sort((a, b) => a.carModel.localeCompare(b.carModel));

  const carCardsHtml = sortedVehicles.map(vehicle => {
    const image = getCarImageFallback(vehicle);
    const bgStyle = image
      ? `background-image: url('${image}'); background-size: cover; background-position: center;`
      : `background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);`;

    return `
<div class="device-card" data-make="${vehicle.make}" style="${bgStyle} position: relative; min-height: 220px;" role="article" aria-label="SD card recommendations for ${vehicle.carModel}" tabindex="0">
<div class="device-card-overlay" style="position: absolute; inset: 0; background: rgba(240, 240, 240, 0.85); transition: opacity 0.3s ease;"></div>
<a href="/cars/${vehicle.slug}/" style="position: relative; z-index: 1; text-decoration: none; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; width: 100%; height: 100%;">
<div class="device-card-name" style="color: #1e293b; text-shadow: 0 1px 3px rgba(255,255,255,0.5);">${vehicle.carModel}</div>
<div class="device-card-info" style="color: #475569; text-shadow: 0 1px 2px rgba(255,255,255,0.5);">Model Years: ${vehicle.years}</div>
<span class="device-card-link">View Products →</span>
</a>
</div>`;
  }).join('');

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Car Navigation', url: '/cars/' }
  ]);

  const header = generateHeader();
  const footer = generateFooter();
  const sidebar = generateSidebar();

  let html = template
    .replace(/{{HEADER}}/g, header)
    .replace(/{{FOOTER}}/g, footer)
    .replace(/{{SIDEBAR}}/g, sidebar)
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{CAR_CARDS_HTML}}/g, carCardsHtml);

  const outDir = path.join(distPath, 'cars');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  writeFile(path.join(outDir, 'index.html'), html);

  console.log(`✓ Generated /cars/index.html (${vehicles.length} vehicles)`);
}

module.exports = { generateCarsIndex };
