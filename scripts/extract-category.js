#!/usr/bin/env node
/**
 * Extract devices from a specific category and output as separate JSON file
 * 
 * Usage: node scripts/extract-category.js "Category Name"
 * 
 * Example: node scripts/extract-category.js "Audio & Hi-Fi"
 *          -> Creates data/categories/audio-hi-fi.json
 */

const fs = require('fs');
const path = require('path');

const DEVICES_FILE = path.join(__dirname, '../data/devices.json');
const CATEGORIES_DIR = path.join(__dirname, '../data/categories');

// Create categories dir if it doesn't exist
if (!fs.existsSync(CATEGORIES_DIR)) {
  fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
}

const categoryName = process.argv[2];

if (!categoryName) {
  console.log('Usage: node scripts/extract-category.js "Category Name"');
  console.log('\nExample: node scripts/extract-category.js "Audio & Hi-Fi"');
  process.exit(1);
}

try {
  const devicesData = JSON.parse(fs.readFileSync(DEVICES_FILE, 'utf8'));
  const devices = devicesData.devices || [];
  
  const categoryDevices = devices.filter(d => d.category === categoryName);
  
  if (categoryDevices.length === 0) {
    console.log(`❌ No devices found for category: "${categoryName}"`);
    console.log('\nAvailable categories:');
    const categories = [...new Set(devices.map(d => d.category))].sort();
    categories.forEach(cat => console.log(`  - ${cat}`));
    process.exit(1);
  }
  
  // Generate filename from category name
  const filename = categoryName
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    + '.json';
  
  const outputPath = path.join(CATEGORIES_DIR, filename);
  
  // Write category file
  fs.writeFileSync(outputPath, JSON.stringify(categoryDevices, null, 2));
  
  console.log(`✅ Extracted ${categoryDevices.length} device(s) from "${categoryName}"`);
  console.log(`   Saved to: ${outputPath}`);
  console.log('\nDevices:');
  categoryDevices.forEach(d => console.log(`  - ${d.name}`));
  
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
