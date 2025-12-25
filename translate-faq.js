#!/usr/bin/env node

/**
 * Japanese FAQ Translation Script
 * Translates English FAQ questions and answers to Japanese using Google Translate API
 * Falls back to manual translation map for common terms
 */

const fs = require('fs');
const path = require('path');

// Manual translation map for common phrases (high-quality translations)
const MANUAL_TRANSLATIONS = {
  // Common questions
  "What SD Card Do I Need for": "に必要なSDカードは何ですか？",
  "What SD Card Do I Need": "に必要なSDカードは何ですか？",
  "Is the": "は",
  "a good camera": "は良いカメラですか？",
  "good camera for": "は...に適したカメラですか？",
  "good for video": "ビデオに適していますか？",
  "good for 4K": "4Kに適していますか？",
  "good for recording": "録画に適していますか？",
  "good for photos": "写真撮影に適していますか？",
  "good for streaming": "ストリーミングに適していますか？",
  "Does the": "は...ですか？",
  "Can I use": "...を使用できますか？",
  "Do I need": "...が必要ですか？",
  "Are": "は...ですか？",
  "Why is": "なぜ...ですか？",
  
  // Common answers
  "Yes": "はい",
  "No": "いいえ",
  "The": "は",
  "It features": "...を備えています",
  "It has": "...があります",
  "It supports": "...に対応しています",
  "You can use": "...を使用できます",
  "You should use": "...を使用すべきです",
  "For best results": "最良の結果を得るには",
  "Recommended": "推奨",
  "Not recommended": "推奨されません",
  "Professional": "プロフェッショナル",
  "Budget": "予算",
  "Entry-level": "エントリーレベル",
  "4K video": "4Kビデオ",
  "write speed": "書き込み速度",
  "read speed": "読み取り速度",
  "SD card": "SDカード",
  "reliability": "信頼性",
  "performance": "パフォーマンス",
  "capacity": "容量"
};

/**
 * Simple batch translator using Google Translate (requires API key)
 * For now, returns placeholder - user can integrate actual API later
 */
async function translateText(text) {
  // Check manual map first
  for (const [en, ja] of Object.entries(MANUAL_TRANSLATIONS)) {
    if (text.toLowerCase().includes(en.toLowerCase())) {
      return text.replace(new RegExp(en, 'gi'), ja);
    }
  }
  
  // For production, integrate with:
  // - Google Translate API: https://cloud.google.com/translate/docs
  // - DeepL API: https://www.deepl.com/docs-api
  
  console.warn(`⚠️  No translation found for: "${text.substring(0, 50)}..."`);
  return null;
}

/**
 * Check which devices need FAQ translation
 */
function analyzeDevicesForTranslation() {
  const devicesPath = path.join(__dirname, 'data/devices-ja.json');
  const data = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
  
  let totalFAQs = 0;
  let englishFAQs = 0;
  let translatedFAQs = 0;
  let needsTranslation = [];
  
  data.devices.forEach((device, idx) => {
    if (!device.faq || device.faq.length === 0) return;
    
    device.faq.forEach(faq => {
      totalFAQs++;
      
      const qIsEnglish = /^[A-Za-z]/.test(faq.q);
      const aIsEnglish = /^[A-Za-z<]/.test(faq.a);
      
      if (qIsEnglish || aIsEnglish) {
        englishFAQs++;
        needsTranslation.push({
          device: device.name,
          deviceId: device.id,
          question: faq.q,
          qIsEnglish,
          aIsEnglish
        });
      } else {
        translatedFAQs++;
      }
    });
  });
  
  console.log('\n📊 FAQ Translation Analysis');
  console.log('═══════════════════════════════════');
  console.log(`Total FAQ items: ${totalFAQs}`);
  console.log(`✅ Already translated: ${translatedFAQs}`);
  console.log(`❌ Need translation: ${englishFAQs}`);
  console.log(`Progress: ${Math.round(translatedFAQs / totalFAQs * 100)}% complete`);
  console.log('\n📋 Devices needing FAQ translation:');
  
  const byDevice = {};
  needsTranslation.forEach(item => {
    if (!byDevice[item.device]) {
      byDevice[item.device] = { count: 0, id: item.deviceId };
    }
    byDevice[item.device].count++;
  });
  
  Object.entries(byDevice)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .forEach(([device, meta]) => {
      console.log(`  • ${device}: ${meta.count} FAQ items`);
    });
  
  return { totalFAQs, englishFAQs, translatedFAQs, needsTranslation: needsTranslation.slice(0, 20) };
}

/**
 * Show example FAQs that need translation
 */
function showExamples() {
  const devicesPath = path.join(__dirname, 'data/devices-ja.json');
  const data = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
  
  console.log('\n📝 Example FAQs Needing Translation:');
  console.log('═══════════════════════════════════\n');
  
  let examples = 0;
  for (const device of data.devices) {
    if (examples >= 5) break;
    if (!device.faq || device.faq.length === 0) continue;
    
    for (const faq of device.faq) {
      if (examples >= 5) break;
      const qIsEnglish = /^[A-Za-z]/.test(faq.q);
      const aIsEnglish = /^[A-Za-z<]/.test(faq.a);
      
      if (qIsEnglish || aIsEnglish) {
        examples++;
        console.log(`Device: ${device.name}`);
        console.log(`Q: ${faq.q.substring(0, 80)}${faq.q.length > 80 ? '...' : ''}`);
        console.log(`A: ${faq.a.substring(0, 80)}${faq.a.length > 80 ? '...' : ''}`);
        console.log('');
      }
    }
  }
}

// Run analysis
console.log('\n🇯🇵 Japanese FAQ Translation Analysis');
const analysis = analyzeDevicesForTranslation();
showExamples();

console.log('\n📌 Next Steps:');
console.log('1. Set up Google Translate API or DeepL API');
console.log('2. Run: node translate-faq.js --translate');
console.log('3. Verify translations manually');
console.log('4. Deploy with: npm run build:ja');
