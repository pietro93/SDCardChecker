const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data/sdcards.json', 'utf8'));
const cards = data.sdcards;

console.log('Cards with missing image files:\n');
let count = 0;

cards.forEach(card => {
  if (card.imageUrl) {
    const filePath = '.' + card.imageUrl;
    if (!fs.existsSync(filePath)) {
      console.log(`  • ${card.name}`);
      console.log(`    Missing: ${card.imageUrl}`);
      count++;
    }
  }
});

console.log(`\nTotal: ${count} cards with missing images`);
