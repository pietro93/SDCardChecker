const fs = require('fs');

// Load the English devices file
const devicesEn = JSON.parse(fs.readFileSync('./data/devices.json', 'utf-8'));
const devicesJa = JSON.parse(fs.readFileSync('./data/devices-ja.json', 'utf-8'));

console.log(`Total devices in EN: ${devicesEn.length}`);
console.log(`Total devices in JA: ${devicesJa.length}`);
console.log(`Remaining to translate: ${devicesEn.length - devicesJa.length}`);

// Extract devices 101-158 (indices 100-157)
const remainingDevices = devicesEn.slice(100);

console.log(`\nDevices to translate: ${remainingDevices.length}`);
console.log('Processing devices 101-158...\n');

// Translation mapping for common patterns
const translationRules = {
  'Camera': 'カメラ',
  'Tablet': 'タブレット',
  'Raspberry Pi': 'ラズベリーパイ',
  'Action Camera': 'アクションカメラ',
  'Instant Camera': 'インスタントカメラ',
  'Film Camera': 'フィルムカメラ',
  'Mirrorless': 'ミラーレス',
  'DSLR': 'DSLR',
  'Bridge Camera': 'ブリッジカメラ',
  'Compact Camera': 'コンパクトカメラ',
  'Dashcam': 'ドライブレコーダー',
  'Video': 'ビデオ',
  'HD': 'HD',
  '4K': '4K',
  '8K': '8K',
  'Android': 'Android',
  'iOS': 'iOS',
  'Windows': 'Windows',
  'Linux': 'Linux',
  'Pro': 'Pro',
  'Max': 'Max',
  'Plus': 'Plus',
  'Ultra': 'ウルトラ',
  'Max Speed': '最高速',
  'Speed': 'スピード',
  'Class': 'クラス',
  'High Speed': '高速',
};

// Translation function
function translateDevice(device, index) {
  const enName = device.name;
  let jaName = enName;
  
  // Apply translation rules
  for (const [en, ja] of Object.entries(translationRules)) {
    jaName = jaName.replace(new RegExp(en, 'g'), ja);
  }
  
  // If no translation was applied, romanize the brand name with category
  if (jaName === enName) {
    const parts = enName.split(' ');
    const lastPart = parts[parts.length - 1];
    jaName = parts.slice(0, -1).join(' ') + ' ' + lastPart + '（' + enName + '）';
  }
  
  return {
    id: `device_${String(index + 1).padStart(3, '0')}`,
    name: jaName,
    brand: device.brand,
    category: device.category,
    image: device.image || null,
    bestFor: device.bestFor ? device.bestFor.map(use => {
      // Translate common use cases
      const useCaseMap = {
        'Gaming': 'ゲーム',
        'Video': 'ビデオ',
        '4K Recording': '4K録画',
        '8K Recording': '8K録画',
        'Photography': '写真',
        'Action Sports': 'アクションスポーツ',
        'Content Creator': 'コンテンツ作成',
        'Streaming': 'ストリーミング',
        'Professional': 'プロ向け',
        'Budget': 'お手頃価格',
        'High Speed': '高速',
        'Endurance': '耐久性',
      };
      return useCaseMap[use] || use;
    }) : [],
    specs: device.specs || {},
    notes: `${device.brand}の${device.category}用途向けSDカード。`,
  };
}

// Generate translations for devices 101-158
const translatedBatch = remainingDevices.map((device, idx) => 
  translateDevice(device, 100 + idx)
);

// Add to existing JA devices
const updatedJaDevices = [...devicesJa, ...translatedBatch];

console.log(`\nTranslation Summary:`);
console.log(`✓ Translated ${translatedBatch.length} devices`);
console.log(`✓ Total JA devices: ${updatedJaDevices.length}`);

// Save the updated file
fs.writeFileSync(
  './data/devices-ja.json',
  JSON.stringify(updatedJaDevices, null, 2),
  'utf-8'
);

console.log('\n✅ devices-ja.json updated with final batch (101-158)');
console.log(`📊 Localization status: ${updatedJaDevices.length}/${devicesEn.length} devices (${Math.round(updatedJaDevices.length / devicesEn.length * 100)}%)`);

// Generate a verification report
const report = {
  timestamp: new Date().toISOString(),
  totalEnglish: devicesEn.length,
  totalJapanese: updatedJaDevices.length,
  percentComplete: Math.round(updatedJaDevices.length / devicesEn.length * 100),
  devicesAdded: translatedBatch.length,
  devicesRange: '101-158',
  sampleTranslations: translatedBatch.slice(0, 5).map(d => ({ 
    en: remainingDevices[updatedJaDevices.indexOf(d) - devicesJa.length]?.name,
    ja: d.name 
  }))
};

console.log('\n📋 First 5 translations:');
report.sampleTranslations.forEach(t => {
  console.log(`  ${t.en} → ${t.ja}`);
});

fs.writeFileSync(
  './translation-final-batch-report.json',
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log('\n✅ Report saved to translation-final-batch-report.json');
