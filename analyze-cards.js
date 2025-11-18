const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('./data/devices.json', 'utf-8'));
const cards = {};

data.devices.forEach(device => {
  if (device.recommendedBrands && Array.isArray(device.recommendedBrands)) {
    device.recommendedBrands.forEach(brand => {
      cards[brand.id] = (cards[brand.id] || 0) + 1;
    });
  }
});

const sorted = Object.entries(cards)
  .sort((a, b) => b[1] - a[1]);

console.log('SD Card Recommendations by Frequency:\n');
sorted.forEach(([cardId, count]) => {
  console.log(`${count}x - ${cardId}`);
});
