const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));

const devices76_100 = data.devices.slice(75, 100);
const results = [];

devices76_100.forEach((device, idx) => {
  const issues = [];
  
  if (device.whySpecs && typeof device.whySpecs === 'string') {
    if (/[A-Za-z]{3,}/.test(device.whySpecs)) {
      const engWords = (device.whySpecs.match(/\b[A-Za-z]{3,}\b/g) || []).length;
      if (engWords > 5) {
        issues.push(`whySpecs: ${engWords} words`);
      }
    }
  }
  
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
  
  if (device.notes && typeof device.notes === 'string') {
    if (/[A-Za-z]{3,}/.test(device.notes)) {
      const engWords = (device.notes.match(/\b[A-Za-z]{3,}\b/g) || []).length;
      if (engWords > 5) {
        issues.push(`notes: ${engWords} words`);
      }
    }
  }
  
  results.push({
    index: idx + 76,
    id: device.id,
    issues: issues.length > 0 ? issues : ['✓']
  });
});

console.log(`\n DEVICES 76-100 - LOCALIZATION AUDIT\n`);
console.log('='.repeat(110));

results.forEach(r => {
  const status = r.issues[0].includes('✓') ? '✓' : '⚠';
  console.log(`\n[${String(r.index).padStart(3)}] ${r.id.padEnd(30)} ${status}`);
  if (!r.issues[0].includes('✓')) {
    r.issues.forEach(issue => console.log(`     └─ ${issue}`));
  }
});

const untranslated = results.filter(r => !r.issues[0].includes('✓'));
console.log('\n' + '='.repeat(110));
console.log(`\nSUMMARY: ${untranslated.length} / ${results.length} devices need translation`);
