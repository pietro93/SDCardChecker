const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'devices-ja.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const handhelds = data.devices.filter(d => d.category === '携帯ゲーム機');

console.log(`\n🎮 Gaming Handhelds (携帯ゲーム機): ${handhelds.length} devices\n`);
handhelds.forEach(d => {
  console.log(`   ${d.id}`);
  console.log(`   └─ Name: ${d.name}`);
  console.log(`   └─ SDCard: ${d.sdCard.type}`);
  console.log(`   └─ Min Speed: ${d.sdCard.minSpeed}`);
  console.log();
});

// Write the extracted data to a file
const outputPath = path.join(__dirname, 'EXTRACTED_GAMING_HANDHELDS.json');
fs.writeFileSync(outputPath, JSON.stringify(handhelds, null, 2), 'utf8');
console.log(`✓ Extracted to: EXTRACTED_GAMING_HANDHELDS.json`);
