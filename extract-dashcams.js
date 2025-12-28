const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'devices-ja.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const dashcams = data.devices.filter(d => d.category === 'ドライブレコーダー');

console.log(`\n📹 Found ${dashcams.length} remaining dashcams:\n`);
dashcams.forEach(d => {
  console.log(`   ${d.id}`);
  console.log(`   └─ Name: ${d.name}`);
  console.log(`   └─ SDCard Type: ${d.sdCard.type}`);
  console.log(`   └─ Min Speed: ${d.sdCard.minSpeed}`);
  console.log();
});

// Write the extracted data to a file
const outputPath = path.join(__dirname, 'EXTRACTED_DASHCAMS.json');
fs.writeFileSync(outputPath, JSON.stringify(dashcams, null, 2), 'utf8');
console.log(`\n✓ Extracted to: EXTRACTED_DASHCAMS.json`);
