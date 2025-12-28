const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));

console.log('TOTAL DEVICES:', data.devices.length);

const first25 = data.devices.slice(0, 25);

// Find which ones have English
const untranslated = [];

first25.forEach((device, idx) => {
  const content = [
    device.whySpecs || '',
    device.notes || '',
    ...(device.faq || []).map(f => (f.q || '') + ' ' + (f.a || ''))
  ].join(' ');
  
  // Check for substantial English
  const englishWords = content.match(/\b[A-Z][a-z]+|[A-Z]{2,}|[a-z]{3,}\b(?=[A-Z])/g) || [];
  const actualEnglish = englishWords.filter(w => !['PC', 'OS', 'FAQ', 'AAA', 'ROM', 'PS', 'CFW', 'RPG'].includes(w.toUpperCase()));
  
  if (actualEnglish.length > 0) {
    untranslated.push({
      index: idx + 1,
      id: device.id,
      name: device.name,
      englishFound: actualEnglish
    });
  }
});

console.log('\n\nUNTRANSLATED CONTENT IN FIRST 25 DEVICES:\n');
untranslated.forEach(item => {
  console.log(`[${item.index}] ${item.id}`);
  console.log(`    English words found: ${[...new Set(item.englishFound)].join(', ')}`);
  
  const device = first25.find(d => d.id === item.id);
  if (device.notes && /[A-Za-z]{3,}/.test(device.notes)) {
    console.log(`    - notes: "${device.notes}"`);
  }
  if (device.whySpecs && /[A-Za-z]{3,}/.test(device.whySpecs)) {
    console.log(`    - whySpecs: "${device.whySpecs}"`);
  }
  if (device.faq) {
    device.faq.forEach((f, i) => {
      if (/[A-Za-z]{3,}/.test(f.a)) {
        console.log(`    - faq[${i}].a: "${f.a.substring(0, 100)}..."`);
      }
      if (/[A-Za-z]{3,}/.test(f.q)) {
        console.log(`    - faq[${i}].q: "${f.q}"`);
      }
    });
  }
  console.log();
});
