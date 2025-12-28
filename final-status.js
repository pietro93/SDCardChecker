const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));

console.log(`\nTOTAL DEVICES: ${data.devices.length}\n`);
console.log('='.repeat(80));

let untranslatedCount = 0;
let translatedCount = 0;

data.devices.forEach((device, idx) => {
  const issues = [];
  
  // Check whySpecs
  if (device.whySpecs && typeof device.whySpecs === 'string') {
    if (/[A-Za-z]{3,}/.test(device.whySpecs)) {
      const engWords = (device.whySpecs.match(/\b[A-Za-z]{3,}\b/g) || []).length;
      if (engWords > 5) {
        issues.push(`whySpecs: ${engWords} words`);
      }
    }
  }
  
  // Check faq
  if (device.faq && Array.isArray(device.faq)) {
    device.faq.forEach((item, faqIdx) => {
      if (item.q && /[A-Za-z]{3,}/.test(item.q)) {
        const engWords = (item.q.match(/\b[A-Za-z]{3,}\b/g) || []).length;
        if (engWords > 3) {
          issues.push(`FAQ[${faqIdx}].q: ${engWords} words`);
        }
      }
      if (item.a && /[A-Za-z]{3,}/.test(item.a)) {
        const engWords = (item.a.match(/\b[A-Za-z]{3,}\b/g) || []).length;
        if (engWords > 5) {
          issues.push(`FAQ[${faqIdx}].a: ${engWords} words`);
        }
      }
    });
  }
  
  // Check notes
  if (device.notes && typeof device.notes === 'string') {
    if (/[A-Za-z]{3,}/.test(device.notes)) {
      const engWords = (device.notes.match(/\b[A-Za-z]{3,}\b/g) || []).length;
      if (engWords > 5) {
        issues.push(`notes: ${engWords} words`);
      }
    }
  }
  
  if (issues.length > 0) {
    untranslatedCount++;
    if (untranslatedCount <= 20) { // Show first 20
      console.log(`[${String(idx + 1).padStart(3)}] ${device.id.padEnd(30)} ⚠️ ${issues.join(' | ')}`);
    }
  } else {
    translatedCount++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ LOCALIZED: ${translatedCount} devices`);
console.log(`⚠️  UNTRANSLATED: ${untranslatedCount} devices`);
console.log(`\nLocalization rate: ${Math.round((translatedCount / data.devices.length) * 100)}%`);
