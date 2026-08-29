const fs = require('fs');
const path = require('path');

// Validates JSON-LD schema blocks across every built English device page.
// English pages live at dist/categories/{category}/{slug}/index.html
// (dist/{locale}/categories/... holds the localized copies - not checked here).
const categoriesDir = path.join(__dirname, 'dist', 'categories');

if (!fs.existsSync(categoriesDir)) {
  console.error(`No such directory: ${categoriesDir}. Run "npm run build:site" first.`);
  process.exit(1);
}

const pages = [];
for (const category of fs.readdirSync(categoriesDir)) {
  const categoryPath = path.join(categoriesDir, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;
  for (const slug of fs.readdirSync(categoryPath)) {
    const indexPath = path.join(categoryPath, slug, 'index.html');
    if (fs.existsSync(indexPath)) pages.push({ category, slug, indexPath });
  }
}

let invalidCount = 0;
let pagesWithNoSchema = 0;

for (const { category, slug, indexPath } of pages) {
  const html = fs.readFileSync(indexPath, 'utf8');
  const schemaMatches = html.match(/<script type="application\/ld\+json">\s*([^<]+?)\s*<\/script>/g);

  if (!schemaMatches) {
    pagesWithNoSchema++;
    console.log(`${category}/${slug}: No schemas found`);
    continue;
  }

  schemaMatches.forEach((match, idx) => {
    const json = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
    try {
      const parsed = JSON.parse(json);
      if (parsed['@type'] === 'FAQPage' && !Array.isArray(parsed.mainEntity)) {
        throw new Error('FAQPage schema missing mainEntity array');
      }
      if (parsed['@type'] === 'ItemList' && !Array.isArray(parsed.itemListElement)) {
        throw new Error('ItemList schema missing itemListElement array');
      }
      if (parsed['@type'] === 'AggregateRating' && (typeof parsed.ratingValue === 'undefined' || typeof parsed.reviewCount === 'undefined')) {
        throw new Error('AggregateRating schema missing ratingValue/reviewCount');
      }
    } catch (e) {
      invalidCount++;
      console.log(`${category}/${slug}: Schema ${idx + 1} INVALID - ${e.message}`);
    }
  });
}

console.log(`\nChecked ${pages.length} English device pages.`);
console.log(`${pagesWithNoSchema} page(s) with no JSON-LD schema.`);
console.log(`${invalidCount} invalid schema block(s).`);

if (invalidCount > 0 || pagesWithNoSchema > 0) {
  process.exit(1);
}
