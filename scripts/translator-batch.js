#!/usr/bin/env node

/**
 * Batch Translator for devices-ja.json FAQs
 * Uses a translation service to translate English FAQ Q&A to Japanese
 * 
 * Setup: npm install @google-cloud/translate
 * Run: node scripts/translator-batch.js
 */

const fs = require('fs');
const path = require('path');

// High-quality manual translations for common FAQ patterns
const FAQ_TRANSLATIONS = {
  // Questions
  "What SD Card Do I Need for {device}?": "{device}にはどのSDカードが必要ですか？",
  "What SD Card Do I Need": "どのSDカードが必要ですか？",
  "Is the {device} good for video?": "{device}はビデオに適していますか？",
  "Is the {device} good for 4K?": "{device}は4Kに適していますか？",
  "Can I use {speed} cards?": "{speed}カードを使用できますか？",
  "Do I need V90?": "V90が必要ですか？",
  "Is V60 enough?": "V60で十分ですか？",
  "How many SD cards do I need?": "何枚のSDカードが必要ですか？",
  "Can I use older cards?": "古いカードを使用できますか？",
  "How long do SD cards last?": "SDカードはどのくらい持ちますか？",
  "What happens with the wrong card?": "間違ったカードを使用するとどうなりますか？",
  "How much storage do I need?": "どのくらいのストレージが必要ですか？",
  
  // Answers - Yes/No openers
  "Yes, the {device}": "はい、{device}は",
  "Yes, {device} is": "はい、{device}は",
  "No, you cannot": "いいえ、...はできません",
  "No, this is": "いいえ、これは",
  
  // Common answer patterns
  "The {device} requires": "{device}には...が必要です",
  "The {device} supports": "{device}は...に対応しています",
  "The {device} has": "{device}は...を備えています",
  "For {device}, we recommend": "{device}の場合、...をお勧めします",
  "We recommend {capacity}": "{capacity}をお勧めします",
  "V{speed} or faster": "V{speed}以上",
  "write speeds of": "の書き込み速度",
  "MB/s minimum": "MB/s最小",
  "SD UHS-II": "SD UHS-II",
  "microSD card": "microSDカード",
};

/**
 * Load and analyze current translation status
 */
function loadDevices() {
  const devicesPath = path.join(__dirname, '../data/devices-ja.json');
  return JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
}

/**
 * Detect if text is English (simple heuristic)
 */
function isEnglish(text) {
  if (!text) return false;
  // Check if starts with English letter or HTML tag
  return /^[A-Za-z<]/.test(text.trim());
}

/**
 * Apply manual translations to text
 */
function applyManualTranslations(text, isQuestion = false) {
  let translated = text;
  
  for (const [pattern, replacement] of Object.entries(FAQ_TRANSLATIONS)) {
    // Create regex that's case-insensitive but preserves replacement case
    const regex = new RegExp(
      pattern
        .replace(/\{device\}/g, '.+?')
        .replace(/\{speed\}/g, '\\d+')
        .replace(/\{capacity\}/g, '.+?'),
      'gi'
    );
    
    if (regex.test(translated)) {
      translated = translated.replace(regex, replacement);
    }
  }
  
  return translated;
}

/**
 * Generate translation CSV for manual review/upload to service
 */
function generateCSV() {
  const data = loadDevices();
  const lines = ['Device,Question EN,Answer EN (truncated)'];
  
  data.devices.forEach(device => {
    if (!device.faq || device.faq.length === 0) return;
    
    device.faq.forEach(faq => {
      if (isEnglish(faq.q)) {
        const q = faq.q.replace(/"/g, '""');
        const a = faq.a.substring(0, 100).replace(/"/g, '""');
        lines.push(`"${device.name}","${q}","${a}..."`);
      }
    });
  });
  
  const csv = lines.join('\n');
  const outputPath = path.join(__dirname, '../faq-to-translate.csv');
  fs.writeFileSync(outputPath, csv, 'utf8');
  
  console.log(`Generated CSV: ${outputPath}`);
  console.log(`   Contains ${lines.length - 1} FAQ items for translation`);
  return lines.length - 1;
}

/**
 * Apply pre-translated mappings (from spreadsheet or API)
 */
function applyPreTranslatedFAQs(translationMap) {
  const data = loadDevices();
  let updated = 0;
  
  data.devices.forEach(device => {
    if (!device.faq) return;
    
    device.faq.forEach(faq => {
      const key = `${device.id}:::${faq.q}`;
      if (translationMap[key]) {
        faq.q = translationMap[key].q;
        faq.a = translationMap[key].a;
        updated++;
      }
    });
  });
  
  return updated;
}

/**
 * Show translation status summary
 */
function showStatus() {
  const data = loadDevices();
  let total = 0, english = 0, japanese = 0;
  
  data.devices.forEach(device => {
    if (!device.faq) return;
    device.faq.forEach(faq => {
      total++;
      if (isEnglish(faq.q) || isEnglish(faq.a)) {
        english++;
      } else {
        japanese++;
      }
    });
  });
  
  console.log('\nFAQ Translation Status');
  console.log('════════════════════════════════');
  console.log(`Total FAQs: ${total}`);
  console.log(`Translated to Japanese: ${japanese} (${Math.round(japanese/total*100)}%)`);
  console.log(`Still in English: ${english} (${Math.round(english/total*100)}%)`);
  console.log('');
}

/**
 * Show top 5 devices needing translation
 */
function showTopDevices() {
  const data = loadDevices();
  const deviceCounts = {};
  
  data.devices.forEach(device => {
    if (!device.faq) return;
    let count = 0;
    device.faq.forEach(faq => {
      if (isEnglish(faq.q) || isEnglish(faq.a)) count++;
    });
    if (count > 0) {
      deviceCounts[device.name] = count;
    }
  });
  
  console.log('Top 10 Devices Needing Translation:');
  console.log('════════════════════════════════');
  Object.entries(deviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([name, count]) => {
      console.log(`  • ${name}: ${count} FAQ items`);
    });
  console.log('');
}

// CLI
const command = process.argv[2];

switch (command) {
  case '--status':
    showStatus();
    showTopDevices();
    break;
  
  case '--csv':
    generateCSV();
    break;
  
  case '--example':
    const data = loadDevices();
    const gopro = data.devices.find(d => d.name === 'GoPro Hero 13 Black');
    console.log('\nExample FAQ from GoPro Hero 13 Black:');
    if (gopro && gopro.faq && gopro.faq[0]) {
      console.log(`Q: ${gopro.faq[0].q}`);
      console.log(`A: ${gopro.faq[0].a.substring(0, 150)}...`);
    }
    break;
  
  default:
    console.log(`
🇯🇵 FAQ Translation Manager

Usage:
  node scripts/translator-batch.js --status    Show translation progress
  node scripts/translator-batch.js --csv       Export untranslated FAQs to CSV
  node scripts/translator-batch.js --example   Show example FAQ

Setup Instructions:
1. Export untranslated FAQs: node scripts/translator-batch.js --csv
2. Translate faq-to-translate.csv using:
   - Google Translate
   - DeepL
   - Human translator
   - ChatGPT/Claude
3. Import translated FAQs back
4. Run: npm run build:ja

Current Status:
    `);
    showStatus();
    showTopDevices();
}
