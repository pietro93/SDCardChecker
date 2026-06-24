#!/usr/bin/env node

/**
 * Extract Japanese devices from devices-ja.json and create category files
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data');
const devicesJaPath = path.join(dataPath, 'devices-ja.json');
const categoriesJaPath = path.join(dataPath, 'categories-ja');

// Ensure categories-ja directory exists
if (!fs.existsSync(categoriesJaPath)) {
  fs.mkdirSync(categoriesJaPath, { recursive: true });
}

// Read devices-ja.json
const content = fs.readFileSync(devicesJaPath, 'utf8');
const data = JSON.parse(content);
const devices = data.devices || [];

// Group devices by category
const groups = {};
devices.forEach(device => {
  if (!groups[device.category]) {
    groups[device.category] = [];
  }
  groups[device.category].push(device);
});

// Create category files
console.log('Creating Japanese category files...\n');

// Mapping of Japanese categories to English slugs
const categoryMapping = {
  'アクションカメラ': 'action-cameras',
  'カメラ': 'cameras',
  'ドローン': 'drones',
  '携帯ゲーム機': 'gaming-handhelds',
  'コンピュータ・タブレット': 'computing-and-tablets',
  'スマートフォン': 'smartphones',
  'ドライブレコーダー': 'dash-cams',
  'セキュリティカメラ': 'security-cameras',
  'アクセサリー': 'accessories',
  'アーケードミニ': 'retro-arcade',
  'レトロゲーム機': 'retro-handhelds',
  'UMPC / 携帯ゲーム機': 'gaming-handhelds',
  'スマートミラー': 'dash-cams',
  'バイク用ドライブレコーダー': 'dash-cams',
  '高性能ドライブレコーダー': 'dash-cams',
  '中華ゲーム機': 'gaming-handhelds'
};

// Group devices by slug to handle multiple Japanese categories mapping to same slug
const slugGroups = {};
Object.keys(groups).forEach(category => {
  // Use mapping if available, otherwise generate slug
  let categorySlug = categoryMapping[category];
  if (!categorySlug) {
    categorySlug = category
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  
  if (!slugGroups[categorySlug]) {
    slugGroups[categorySlug] = [];
  }
  slugGroups[categorySlug] = slugGroups[categorySlug].concat(groups[category]);
});

// Write merged category files
Object.keys(slugGroups).sort().forEach(slug => {
  const filename = `${slug}.json`;
  const filepath = path.join(categoriesJaPath, filename);
  const devices = slugGroups[slug];
  
  fs.writeFileSync(filepath, JSON.stringify(devices, null, 2));
  console.log(`✓ ${filename}: ${devices.length} device(s)`);
});

console.log(`\nCreated ${Object.keys(groups).length} category files`);
console.log(`Location: ${categoriesJaPath}\n`);
