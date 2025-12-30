#!/usr/bin/env node
/**
 * Merge category device files into single devices.json
 * 
 * Usage: node scripts/merge-devices.js
 * 
 * Reads from: data/categories/*.json
 * Writes to: data/devices.json
 */

const fs = require('fs');
const path = require('path');

const CATEGORIES_DIR = path.join(__dirname, '../data/categories');
const OUTPUT_FILE = path.join(__dirname, '../data/devices.json');

function getCategoryFiles() {
  try {
    const files = fs.readdirSync(CATEGORIES_DIR)
      .filter(f => f.endsWith('.json') && f !== 'README.md')
      .sort();
    return files;
  } catch (err) {
    console.error('❌ Error reading categories directory:', err.message);
    process.exit(1);
  }
}

function loadCategoryFile(filename) {
  const filepath = path.join(CATEGORIES_DIR, filename);
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    // Handle both array format and wrapped format
    const devices = Array.isArray(data) ? data : (data.devices || []);
    
    console.log(`  ✓ ${filename}: ${devices.length} device(s)`);
    return devices;
  } catch (err) {
    console.error(`  ❌ Error loading ${filename}:`, err.message);
    return [];
  }
}

function validateDevice(device) {
  const required = ['id', 'name', 'category', 'slug'];
  const missing = required.filter(field => !device[field]);
  
  if (missing.length > 0) {
    console.warn(`    ⚠️  Device "${device.name || 'UNNAMED'}" missing: ${missing.join(', ')}`);
  }
  
  return device;
}

async function mergeDevices() {
  console.log('🔄 Merging category files...\n');
  
  const categoryFiles = getCategoryFiles();
  if (categoryFiles.length === 0) {
    console.error('❌ No category files found in', CATEGORIES_DIR);
    process.exit(1);
  }
  
  console.log(`Found ${categoryFiles.length} category file(s):\n`);
  
  let allDevices = [];
  
  // Load each category file
  for (const file of categoryFiles) {
    const devices = loadCategoryFile(file);
    allDevices = allDevices.concat(devices);
  }
  
  // Validate all devices
  console.log(`\nValidating ${allDevices.length} total device(s)...`);
  allDevices = allDevices.map(validateDevice);
  
  // Check for duplicates
  const ids = new Set();
  const duplicates = [];
  
  allDevices.forEach(device => {
    if (ids.has(device.id)) {
      duplicates.push(device.id);
    }
    ids.add(device.id);
  });
  
  if (duplicates.length > 0) {
    console.warn(`\n⚠️  Found ${duplicates.length} duplicate ID(s):`, duplicates);
  }
  
  // Write merged file
  const output = {
    devices: allDevices,
    metadata: {
      generated: new Date().toISOString(),
      totalDevices: allDevices.length,
      categories: [...new Set(allDevices.map(d => d.category))].sort(),
      categoryCount: new Set(allDevices.map(d => d.category)).size
    }
  };
  
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n✅ Merged to ${OUTPUT_FILE}`);
    console.log(`   Total devices: ${output.metadata.totalDevices}`);
    console.log(`   Categories: ${output.metadata.categoryCount}`);
    console.log(`   Last updated: ${output.metadata.generated}`);
  } catch (err) {
    console.error('❌ Error writing output file:', err.message);
    process.exit(1);
  }
}

mergeDevices().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
