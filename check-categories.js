const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'devices-ja.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Get unique categories
const categories = [...new Set(data.devices.map(d => d.category))].sort();

console.log(`\n📊 Total devices: ${data.devices.length}\n`);
console.log('Categories:');
categories.forEach(cat => {
  const count = data.devices.filter(d => d.category === cat).length;
  console.log(`  ${count.toString().padStart(3)} - ${cat}`);
});

// Look for dashcam-related devices by ID or name
console.log('\n\n🔍 Searching for dashcam-related devices...\n');
const dashcamLike = data.devices.filter(d => 
  d.id.includes('dash') || 
  d.name.toLowerCase().includes('dash') ||
  d.id.includes('recorder') ||
  d.name.toLowerCase().includes('recorder') ||
  d.id.includes('cam') ||
  d.name.toLowerCase().includes('camera')
);

console.log(`Found ${dashcamLike.length} potential dashcam devices:`);
dashcamLike.slice(0, 20).forEach(d => {
  console.log(`  ${d.id} (${d.category}): ${d.name}`);
});
