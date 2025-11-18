const fs = require('fs');

const sdcardsData = JSON.parse(fs.readFileSync('./data/sdcards.json', 'utf-8'));

// Cards with exact name matches
const exactMatches = {
  "kingston canvas select": true,
  "sony tough g-series": true,
  "sandisk max endurance": true,
  "samsung pro endurance": true,
  "samsung evo select": true
};

// Brand patterns with fallbacks
const brandPatterns = ['lexar', 'kingston', 'sandisk', 'samsung', 'sony'];
const specialTypes = ['CFast', 'XQD'];

console.log('Cards with NO explicit imageUrl:\n');

const cardsWithoutImage = sdcardsData.sdcards.filter(card => !card.imageUrl);

console.log(`Total: ${cardsWithoutImage.length} cards without explicit imageUrl\n`);

const cardsWithoutFallback = cardsWithoutImage.filter(card => {
  const name = card.name.toLowerCase();
  
  // Check exact match
  for (const pattern of Object.keys(exactMatches)) {
    if (name.includes(pattern)) return false;
  }
  
  // Check brand patterns
  for (const brand of brandPatterns) {
    if (name.includes(brand)) return false;
  }
  
  // Check special types
  if (specialTypes.includes(card.type)) return false;
  
  return true;
});

if (cardsWithoutFallback.length === 0) {
  console.log('✅ ALL CARDS HAVE A FALLBACK IMAGE!');
} else {
  console.log('❌ These cards have NO fallback image:\n');
  cardsWithoutFallback.forEach(card => {
    console.log(`- ${card.id}`);
    console.log(`  Name: ${card.name}`);
    console.log(`  Type: ${card.type}`);
    console.log('');
  });
}

console.log('\n---\n');
console.log('Summary of cards with explicit imageUrl:');
const withImage = sdcardsData.sdcards.filter(c => c.imageUrl);
console.log(`${withImage.length} cards have explicit imageUrl`);
