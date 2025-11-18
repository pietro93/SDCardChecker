const fs = require('fs');
const path = require('path');

const sdcardsData = JSON.parse(fs.readFileSync('./data/sdcards.json', 'utf-8'));
const devicesData = JSON.parse(fs.readFileSync('./data/devices.json', 'utf-8'));

// Count recommendations
const cardCounts = {};
devicesData.devices.forEach(device => {
  if (device.recommendedBrands && Array.isArray(device.recommendedBrands)) {
    device.recommendedBrands.forEach(brand => {
      cardCounts[brand.id] = (cardCounts[brand.id] || 0) + 1;
    });
  }
});

// Get top 15
const topCards = Object.entries(cardCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .map(([id]) => id);

console.log('Top 15 Most Recommended Cards:\n');
console.log('Rank | Count | Card ID | Type | Image Source\n');

topCards.forEach((cardId, index) => {
  const card = sdcardsData.sdcards.find(c => c.id === cardId);
  
  if (card) {
    const type = card.type === 'microSD' ? 'microSD' : 'Regular SD';
    const imageSource = card.imageUrl ? `Has image: ${card.imageUrl}` : 'Uses fallback';
    const count = cardCounts[cardId];
    
    console.log(`${String(index + 1).padEnd(4)} | ${String(count).padEnd(5)} | ${cardId.padEnd(35)} | ${type.padEnd(11)} | ${imageSource}`);
  }
});
