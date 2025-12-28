const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));

const devices26_50 = data.devices.slice(25, 50);
const results = [];

devices26_50.forEach((device, idx) => {
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
  
  results.push({
    index: idx + 26,
    id: device.id,
    name: device.name,
    issues: issues.length > 0 ? issues : ['✓ FULLY LOCALIZED']
  });
});

console.log('\n DEVICES 26-50 - LOCALIZATION AUDIT\n');
console.log('='.repeat(110));

results.forEach(r => {
  const status = r.issues[0].includes('✓') ? '✓' : '⚠';
  console.log(`\n[${String(r.index).padStart(2)}] ${r.id.padEnd(30)} ${status}`);
  if (!r.issues[0].includes('✓')) {
    r.issues.forEach(issue => console.log(`     └─ ${issue}`));
  }
});

// Summary
const untranslated = results.filter(r => !r.issues[0].includes('✓'));
console.log('\n' + '='.repeat(110));
console.log(`\nSUMMARY: ${untranslated.length} / ${results.length} devices have untranslated content`);

if (untranslated.length > 0) {
  console.log('\nUntranslated devices:');
  untranslated.forEach(r => console.log(`  - [${r.index}] ${r.id}`));
}
