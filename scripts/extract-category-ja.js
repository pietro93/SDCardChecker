#!/usr/bin/env node
/**
 * Extract devices from a specific category in devices-ja.json and output as separate JSON file
 * 
 * Usage: node scripts/extract-category-ja.js "Japanese Category Name"
 * 
 * Example: node scripts/extract-category-ja.js "アクションカメラ"
 *          -> Creates data/categories-ja/アクションカメラ.json
 */

const fs = require('fs');
const path = require('path');

const DEVICES_FILE = path.join(__dirname, '../data/devices-ja.json');
const CATEGORIES_DIR = path.join(__dirname, '../data/categories-ja');

// Create categories dir if it doesn't exist
if (!fs.existsSync(CATEGORIES_DIR)) {
  fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
}

const categoryName = process.argv[2];

if (!categoryName) {
  console.log('Usage: node scripts/extract-category-ja.js "Japanese Category Name"');
  console.log('\nExample: node scripts/extract-category-ja.js "アクションカメラ"');
  console.log('\nJapanese Categories:');
  console.log('  - アクションカメラ (Action Cameras)');
  console.log('  - カメラ (Cameras)');
  console.log('  - ドローン (Drones)');
  console.log('  - 携帯ゲーム機 (Gaming Handhelds)');
  console.log('  - ドライブレコーダー (Dash Cams)');
  console.log('  - コンピュータ・タブレット (Computing & Tablets)');
  console.log('  - セキュリティカメラ (Security Cameras)');
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
  
  // Use category name directly as filename (it's already Japanese)
  const filename = categoryName + '.json';
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
