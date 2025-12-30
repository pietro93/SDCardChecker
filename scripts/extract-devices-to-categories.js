#!/usr/bin/env node

/**
 * ONE-TIME EXTRACTION SCRIPT
 * Extracts devices from data/devices.json into individual category files
 * Run this ONCE to initialize the category structure
 * After this, NEVER edit devices.json directly - only edit category files
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, '../data/devices.json');
const categoriesDir = path.join(__dirname, '../data/categories');

// Ensure categories directory exists
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

// Read devices.json
const devicesData = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));
const devices = devicesData.devices;

// Group by category
const byCategory = {};
devices.forEach(device => {
  const category = device.category;
  if (!byCategory[category]) {
    byCategory[category] = [];
  }
  byCategory[category].push(device);
});

// Create individual category files
const createdFiles = [];
Object.keys(byCategory).sort().forEach(category => {
  const categorySlug = category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-');
  
  const fileName = `${categorySlug}.json`;
  const filePath = path.join(categoriesDir, fileName);
  
  // Write category file
  const categoryData = byCategory[category];
  fs.writeFileSync(filePath, JSON.stringify(categoryData, null, 2));
  
  createdFiles.push({ 
    file: fileName, 
    count: categoryData.length,
    category: category
  });
  
  console.log(`✓ ${fileName}: ${categoryData.length} device(s)`);
});

console.log(`\n✅ Extraction complete! Created ${createdFiles.length} category files:\n`);
createdFiles.forEach(f => {
  console.log(`  • ${f.file} (${f.count} devices) - ${f.category}`);
});

console.log(`\n📝 NEXT STEPS:`);
console.log(`  1. Commit the new category files: git add data/categories/*.json && git commit`);
console.log(`  2. Add devices.json to .gitignore (it will be generated during build)`);
console.log(`  3. Edit device data ONLY in the individual category files`);
console.log(`  4. Run 'npm run build' to regenerate devices.json from categories\n`);
