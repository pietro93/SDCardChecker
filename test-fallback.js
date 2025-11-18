const fs = require('fs');
const path = require('path');

const sdcardsData = JSON.parse(fs.readFileSync('./data/sdcards.json', 'utf-8'));

// Simulate the getCardImageFallback function
function imageExists(imagePath) {
  const fullPath = path.join(__dirname, 'img/cards', imagePath.replace('/img/cards/', ''));
  return fs.existsSync(fullPath);
}

const card = sdcardsData.sdcards.find(c => c.id === 'sandisk-ultra-sd-uhs1');

console.log('Card:', card.name);
console.log('Type:', card.type);
console.log('UHS:', card.uhs);
console.log('Has explicit imageUrl:', card.imageUrl ? 'YES' : 'NO');
console.log('');

// Check which fallback images exist
const sandiskImages = [
  "/img/cards/sandisk-extreme-microsd.webp",
  "/img/cards/sandisk-extreme-pro-sd-uhs-ii.webp",
  "/img/cards/sandisk-ultra-microsd.webp",
  "/img/cards/sandisk-max-endurance-microsd.webp"
];

console.log('Checking SanDisk fallback images:');
sandiskImages.forEach(img => {
  const exists = imageExists(img);
  console.log(`  ${img}: ${exists ? '✅' : '❌'}`);
});

console.log('');
console.log('Generic fallbacks:');
const genericImages = [
  "/img/cards/uhs1-generic.webp",
  "/img/cards/micro-uhs1-generic.webp",
  "/img/cards/placeholder.webp"
];

genericImages.forEach(img => {
  const exists = imageExists(img);
  console.log(`  ${img}: ${exists ? '✅' : '❌'}`);
});
