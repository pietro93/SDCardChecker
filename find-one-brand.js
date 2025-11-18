const data = require('./data/devices.json');
const results = data.devices.filter(d => d.recommendedBrands && d.recommendedBrands.length === 1);
console.log('Devices with exactly ONE recommended SD card:\n');
results.forEach(r => {
  console.log(`• ${r.name}`);
  console.log(`  ID: ${r.id}`);
  console.log(`  Brand: ${r.recommendedBrands[0].id}`);
  console.log(`  Category: ${r.category}\n`);
});
