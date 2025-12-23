const fs = require('fs');
const en = require('./data/devices.json');
const ja = require('./data/devices-ja.json');

const jaIds = new Set(ja.devices.map(d => d.id));

// Simple translation helper (using romanization for device names when translations aren't available)
const deviceNameTranslations = {
  'fujifilm-x-s20': 'Fujifilm X-S20',
  'gopro-hero-max': 'GoPro Hero Max',
  'dji-mini-3-pro': 'DJI Mini 3 Pro',
  'nintendo-switch-lite': 'Nintendo Switch Lite',
  'samsung-galaxy-tab-s9': 'Samsung Galaxy Tab S9',
  'canon-eos-r6-mark-ii': 'Canon EOS R6 Mark II',
};

const categoryTranslations = {
  'Action Cameras': 'アクションカメラ',
  'Drones': 'ドローン',
  'Cameras': 'カメラ',
  'Handheld Gaming': '携帯ゲーム機',
  'Gaming Devices': 'ゲーム機',
  'Dash Cams': 'ドライブレコーダー',
  'Computers/Tablets': 'コンピュータ・タブレット',
  'Mobile Devices': 'モバイルデバイス',
  'Tablets': 'タブレット',
  'PCs': 'パソコン',
  'Security Cameras': 'セキュリティカメラ',
  'Card Readers': 'SDカードリーダー',
};

// Add missing devices to Japanese array
en.devices.forEach(enDevice => {
  if (!jaIds.has(enDevice.id)) {
    // Create a minimal Japanese version
    const jaDevice = {
      id: enDevice.id,
      name: deviceNameTranslations[enDevice.id] || enDevice.name,
      category: categoryTranslations[enDevice.category] || enDevice.category,
      slug: enDevice.slug,
      searchTerms: enDevice.searchTerms || [],
      sdCard: enDevice.sdCard,
      whySpecs: enDevice.whySpecs, // Keep English for now
      recommendedBrands: enDevice.recommendedBrands,
      faq: enDevice.faq || [],
      relatedDevices: enDevice.relatedDevices || [],
      notes: enDevice.notes || '',
    };
    ja.devices.push(jaDevice);
  }
});

// Write updated Japanese file
fs.writeFileSync('./data/devices-ja.json', JSON.stringify(ja, null, 2));
console.log(`Added ${ja.devices.length - (ja.devices.length - Object.keys(jaIds).length)} missing devices to devices-ja.json`);
console.log(`Total devices now: ${ja.devices.length}`);
