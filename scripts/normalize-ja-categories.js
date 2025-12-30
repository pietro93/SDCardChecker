#!/usr/bin/env node

/**
 * Normalize Japanese category field names to English slugs in categories-ja/*.json
 */

const fs = require('fs');
const path = require('path');

const categoriesJaPath = path.join(__dirname, '../data/categories-ja');

const categoryMapping = {
  'アクションカメラ': 'action-cameras',
  'アクセサリー': 'accessories',
  'アーケードミニ': 'retro-arcade',
  'カメラ': 'cameras',
  'コンピュータ・タブレット': 'computing-and-tablets',
  'スマートミラー': 'dash-cams',
  'スマートフォン': 'smartphones',
  'セキュリティカメラ': 'security-cameras',
  'ドライブレコーダー': 'dash-cams',
  'ドローン': 'drones',
  'バイク用ドライブレコーダー': 'dash-cams',
  'レトロゲーム機': 'retro-handhelds',
  'UMPC / 携帯ゲーム機': 'computing-and-tablets',
  '中華ゲーム機': 'gaming-handhelds',
  '携帯ゲーム機': 'gaming-handhelds',
  '高性能ドライブレコーダー': 'dash-cams'
};

console.log('🔄 Normalizing Japanese category fields...\n');

const files = fs.readdirSync(categoriesJaPath)
  .filter(f => f.endsWith('.json'))
  .sort();

files.forEach(file => {
  const filepath = path.join(categoriesJaPath, file);
  const content = fs.readFileSync(filepath, 'utf8');
  const devices = JSON.parse(content);
  
  let updated = 0;
  devices.forEach(device => {
    const originalCategory = device.category;
    const newCategory = categoryMapping[originalCategory];
    
    if (newCategory && newCategory !== originalCategory) {
      device.category = newCategory;
      updated++;
    }
  });
  
  fs.writeFileSync(filepath, JSON.stringify(devices, null, 2));
  console.log(`✓ ${file}: ${updated} device(s) updated`);
});

console.log(`\n✅ Normalized all category fields\n`);
