const fs = require('fs');
const html = fs.readFileSync('dist/devices/gopro-hero-max/index.html', 'utf8');

// Extract all JSON-LD scripts
const schemaMatches = html.match(/<script type="application\/ld\+json">\s*([^<]+?)\s*<\/script>/g);

if (schemaMatches) {
  schemaMatches.forEach((match, idx) => {
    const json = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
    try {
      const parsed = JSON.parse(json);
      if (parsed['@type'] === 'FAQPage') {
        console.log('✅ FAQ Schema: Valid JSON (' + parsed.mainEntity.length + ' questions)');
      } else if (parsed['@type'] === 'ItemList') {
        console.log('✅ Product Schema: Valid JSON (' + parsed.itemListElement.length + ' products)');
      } else if (parsed['@type'] === 'Article') {
        console.log('✅ Article Schema: Valid JSON');
      }
    } catch(e) {
      console.log('❌ Schema ' + (idx+1) + ': Invalid - ' + e.message);
    }
  });
} else {
  console.log('No schemas found');
}
