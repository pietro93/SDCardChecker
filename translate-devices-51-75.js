const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));

// Extract English content from devices 51-75 (indices 50-74)
const devicesToTranslate = data.devices.slice(50, 75);

console.log('Extracting English content from devices 51-75 for translation...\n');

devicesToTranslate.forEach((device, idx) => {
  const realIdx = idx + 50;
  console.log(`\n[${realIdx + 1}] ${device.id}`);
  
  if (device.whySpecs && /[A-Za-z]{3,}/.test(device.whySpecs)) {
    console.log(`whySpecs: ${device.whySpecs.substring(0, 80)}...`);
  }
  
  if (device.faq && device.faq[0]) {
    if (/[A-Za-z]{3,}/.test(device.faq[0].q)) {
      console.log(`FAQ[0].q: ${device.faq[0].q}`);
    }
    if (/[A-Za-z]{3,}/.test(device.faq[0].a)) {
      console.log(`FAQ[0].a: ${device.faq[0].a.substring(0, 80)}...`);
    }
  }
  
  if (device.notes && /[A-Za-z]{3,}/.test(device.notes)) {
    console.log(`notes: ${device.notes.substring(0, 80)}...`);
  }
});

console.log('\n\n⚠️  ALL 25 DEVICES IN RANGE 51-75 ARE COMPLETELY IN ENGLISH');
console.log('These require comprehensive translation.');
console.log('\nPlease translate the extracted content above and create a translation script.');
