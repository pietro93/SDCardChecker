// scripts/build-amazon-data.js
/**
 * Build-time script: Fetch Amazon product data and cache it
 * Run ONCE during build, data is then embedded in static HTML
 * 
 * Usage:
 *   node scripts/build-amazon-data.js
 * 
 * Or automatically called by:
 *   npm run build (if wired into build pipeline)
 */

const fs = require('fs');
const path = require('path');
const { searchSDCards } = require('../src/utils/amazon-api');
require('dotenv').config();

const CACHE_DIR = path.join(__dirname, '../data/amazon-cache');

/**
 * Ensure cache directory exists
 */
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log(`✓ Created cache directory: ${CACHE_DIR}`);
  }
}

/**
 * Save products to cache JSON file
 */
function saveToCache(filename, products) {
  const filepath = path.join(CACHE_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(products, null, 2));
  console.log(`  ✓ Cached to: ${filename}`);
}

/**
 * Load existing cache (for fallback if API fails)
 */
function loadCache(filename) {
  const filepath = path.join(CACHE_DIR, filename);
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
  return [];
}

/**
 * Main build function
 */
async function buildAmazonData() {
  console.log('\n📦 Building Amazon product data...\n');
  
  ensureCacheDir();

  // Define products to search for
  const searches = [
    { filename: 'kingston-canvas-go.json', keyword: 'Kingston Canvas Go Plus 128GB microSD' },
    { filename: 'sandisk-extreme.json', keyword: 'SanDisk Extreme 128GB microSD' },
    { filename: 'samsung-evo-plus.json', keyword: 'Samsung EVO Plus 128GB microSD' },
    { filename: 'prograde-digital.json', keyword: 'ProGrade Digital UHS-II 128GB SD card' },
    { filename: 'sabrent-rocket.json', keyword: 'Sabrent Rocket 128GB SDXC UHS-II' }
  ];

  console.log(`Searching for ${searches.length} products...\n`);

  // Search for each product
  for (const { filename, keyword } of searches) {
    try {
      const products = await searchSDCards(keyword);
      
      if (products.length > 0) {
        saveToCache(filename, products);
      } else {
        // Keep existing cache if API returns nothing
        const existingCache = loadCache(filename);
        if (existingCache.length > 0) {
          console.log(`  ⚠️  No API results, keeping existing cache: ${filename}`);
        } else {
          console.log(`  ❌ No results found, no existing cache for: ${filename}`);
          saveToCache(filename, []);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error searching for ${filename}:`, error.message);
      // Keep existing cache
      const existingCache = loadCache(filename);
      if (existingCache.length === 0) {
        saveToCache(filename, []);
      }
    }
  }

  console.log('\n✅ Amazon data build complete!\n');
}

// Run if executed directly
if (require.main === module) {
  buildAmazonData().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
}

module.exports = { buildAmazonData };
