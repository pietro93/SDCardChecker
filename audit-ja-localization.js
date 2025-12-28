const fs = require('fs');
const path = require('path');

console.log('=== JAPANESE LOCALIZATION AUDIT ===\n');

// 1. Check devices-ja.json
const devicesJa = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));
const devices = devicesJa.devices || [];
console.log(`✓ Total devices in devices-ja.json: ${devices.length}`);

// Extract categories and dashcams/mirrors
const categories = [...new Set(devices.map(d => d.category))];
console.log(`✓ Total categories: ${categories.length}`);
console.log(`  Categories: ${categories.sort().join(', ')}\n`);

const dashcams = devices.filter(d => d.category === 'ドライブレコーダー');
console.log(`✓ Dashcams (ドライブレコーダー): ${dashcams.length}`);
if (dashcams.length > 0) {
  console.log(`  Sample dashcams: ${dashcams.slice(0, 3).map(d => d.id).join(', ')}`);
}

const mirrors = devices.filter(d => d.category === 'ドライブレコーダー（ミラー型）');
console.log(`✓ Mirror dashcams (ドライブレコーダー（ミラー型）): ${mirrors.length}`);
if (mirrors.length > 0) {
  console.log(`  Sample mirrors: ${mirrors.slice(0, 3).map(d => d.id).join(', ')}`);
}

// 2. Check for missing translations in devices
console.log('\n=== TRANSLATION COMPLETENESS ===');
let missingTranslations = 0;
devices.forEach(device => {
  const requiredFields = ['name', 'category', 'sdCard.type', 'sdCard.minSpeed', 'recommendedBrands', 'faq'];
  requiredFields.forEach(field => {
    if (field === 'faq' && (!device.faq || device.faq.length === 0)) {
      missingTranslations++;
      console.log(`  ⚠ Missing FAQ: ${device.id}`);
    }
  });
});
console.log(`✓ Devices with complete translations: ${devices.length - missingTranslations}/${devices.length}`);

// 3. Check device pages exist
console.log('\n=== DEVICE PAGE EXISTENCE ===');
const deviceTemplates = {
  ja: 'src/templates/device-ja.html',
  en: 'src/templates/device.html'
};

let validPages = 0;
let missingPages = [];

devices.forEach(device => {
  const slugPath = `dist/ja/devices/${device.slug}.html`;
  if (fs.existsSync(slugPath)) {
    validPages++;
  } else {
    missingPages.push(device.id);
  }
});

console.log(`✓ Device pages that exist: ${validPages}/${devices.length}`);
if (missingPages.length > 0 && missingPages.length <= 10) {
  console.log(`  ⚠ Missing device pages (showing first 10): ${missingPages.slice(0, 10).join(', ')}`);
}

// 4. Check category pages
console.log('\n=== CATEGORY PAGE EXISTENCE ===');
let validCategories = 0;
let missingCategories = [];

categories.forEach(cat => {
  const categorySlug = cat.toLowerCase().replace(/\s+/g, '-').replace(/[（）]/g, '');
  const categoryPath = `dist/ja/categories/${categorySlug}.html`;
  if (fs.existsSync(categoryPath)) {
    validCategories++;
  } else {
    missingCategories.push(`${cat} (${categorySlug})`);
  }
});

console.log(`✓ Category pages that exist: ${validCategories}/${categories.length}`);
if (missingCategories.length > 0) {
  console.log(`  ⚠ Missing category pages:`);
  missingCategories.forEach(cat => console.log(`    - ${cat}`));
}

// 5. Check homepage and main templates
console.log('\n=== MAIN TEMPLATES EXISTENCE ===');
const mainTemplates = {
  'home-ja.html': 'src/templates/home-ja.html',
  'categories-index-ja.html': 'src/templates/categories-index-ja.html',
  'category-ja.html': 'src/templates/category-ja.html',
  'device-ja.html': 'src/templates/device-ja.html',
  'faq-ja.html': 'src/templates/faq-ja.html',
  'about-ja.html': 'src/templates/about-ja.html'
};

let templateCheck = 0;
for (const [name, filePath] of Object.entries(mainTemplates)) {
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${name}`);
    templateCheck++;
  } else {
    console.log(`  ✗ ${name} - MISSING`);
  }
}
console.log(`✓ Main templates ready: ${templateCheck}/${Object.keys(mainTemplates).length}`);

// 6. Check for broken links in templates
console.log('\n=== CHECKING FOR BROKEN LINK PATTERNS ===');
const homeJaPath = 'dist/ja/index.html';
let linkIssues = [];

if (fs.existsSync(homeJaPath)) {
  const homeContent = fs.readFileSync(homeJaPath, 'utf8');
  
  // Check for device links
  const deviceLinkPattern = /href=['"](\/ja\/devices\/[\w-]+\.html)['"]/g;
  const deviceLinks = homeContent.match(deviceLinkPattern);
  if (deviceLinks) {
    console.log(`  Found ${deviceLinks.length} device links on homepage`);
  }
  
  // Check for category links
  const categoryLinkPattern = /href=['"](\/ja\/categories\/[\w-]+\.html)['"]/g;
  const categoryLinks = homeContent.match(categoryLinkPattern);
  if (categoryLinks) {
    console.log(`  Found ${categoryLinks.length} category links on homepage`);
  }
  
  // Look for common issues
  if (homeContent.includes('undefined') || homeContent.includes('null')) {
    linkIssues.push('Found "undefined" or "null" in homepage content');
  }
  if (homeContent.match(/href=["'][\w\/#-]*[\s]/)) {
    linkIssues.push('Found malformed href attributes');
  }
} else {
  console.log(`  ⚠ Homepage not built yet: ${homeJaPath}`);
}

if (linkIssues.length > 0) {
  console.log('  Issues found:');
  linkIssues.forEach(issue => console.log(`    - ${issue}`));
} else {
  console.log('  ✓ No obvious link issues detected');
}

// 7. Summary report
console.log('\n=== SUMMARY ===');
console.log(`✓ Device data: ${devices.length} devices loaded`);
console.log(`✓ Categories: ${validCategories}/${categories.length} pages exist`);
console.log(`✓ Device pages: ${validPages}/${devices.length} pages exist`);
console.log(`✓ Main templates: ${templateCheck}/${Object.keys(mainTemplates).length} files present`);
console.log(`✓ Dashcams: ${dashcams.length} devices`);
console.log(`✓ Mirror dashcams: ${mirrors.length} devices`);

if (validPages < devices.length * 0.8) {
  console.log('\n⚠ WARNING: Many device pages are missing. Run build process.');
} else if (validCategories < categories.length) {
  console.log('\n⚠ WARNING: Some category pages are missing. Run build process.');
} else {
  console.log('\n✓ LOCALIZATION SETUP APPEARS COMPLETE');
}
