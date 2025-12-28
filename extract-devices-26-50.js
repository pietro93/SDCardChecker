const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));

const toCheck = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];

toCheck.forEach(idx => {
  const device = data.devices[idx - 1]; // 0-indexed
  if (!device) return;
  
  console.log(`\n\n========== [${idx}] ${device.id} ==========\n`);
  
  // Show whySpecs
  if (device.whySpecs && /[A-Za-z]{3,}/.test(device.whySpecs)) {
    console.log('### whySpecs:');
    console.log(device.whySpecs);
    console.log();
  }
  
  // Show faq
  if (device.faq) {
    let hasFaqIssue = false;
    device.faq.forEach((item, idx) => {
      const qHasEng = /[A-Za-z]{3,}/.test(item.q);
      const aHasEng = /[A-Za-z]{3,}/.test(item.a);
      
      if (qHasEng || aHasEng) {
        if (!hasFaqIssue) {
          console.log('### FAQ:');
          hasFaqIssue = true;
        }
        console.log(`\n[${idx}] Q: ${item.q}`);
        if (aHasEng) console.log(`    A: ${item.a}\n`);
      }
    });
    if (hasFaqIssue) console.log();
  }
  
  // Show notes
  if (device.notes && /[A-Za-z]{3,}/.test(device.notes)) {
    console.log('### notes:');
    console.log(device.notes);
    console.log();
  }
});
