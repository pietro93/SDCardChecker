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
 * Delay between API requests (in milliseconds)
 * Amazon allows ~1 req/sec for new associates, we use 2500ms to be safe
 */
const REQUEST_DELAY_MS = 2500;

/**
 * Sleep utility for request throttling
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main build function
 */
async function buildAmazonData() {
  console.log('\n📦 Building Amazon product data...\n');
  
  ensureCacheDir();

  // Define search groups - each with multiple keywords to aggregate results
  const searchGroups = [
    // Default: General featured products (used on device pages)
    {
      filename: 'featured-general.json',
      keywords: [
        'Kingston Canvas Go Plus 128GB microSD',
        'SanDisk Extreme 128GB microSD',
        'Samsung EVO Plus 128GB microSD'
      ]
    },
    
    // GUIDES: Speed Classes
    {
      filename: 'guide-speed-classes.json',
      keywords: [
        'Kingston Canvas Go V10 microSD',
        'SanDisk Extreme V30 microSD',
        'Lexar Professional V60 SD card',
        'Sony TOUGH V90 SD card'
      ]
    },
    
    // GUIDES: Professional Cameras
    {
      filename: 'guide-professional-cameras.json',
      keywords: [
        'SanDisk Extreme PRO SD UHS-II',
        'Sony TOUGH G V90 SD card',
        'Lexar Professional Gold UHS-II'
      ]
    },
    
    // GUIDES: RAW vs JPEG (Professional)
    {
      filename: 'guide-raw-jpeg.json',
      keywords: [
        'professional SDXC card fast write',
        'SanDisk Extreme PRO SD card',
        'Lexar Professional Silver microSD'
      ]
    },
    
    // GUIDES: Fake SD Card Detection
    {
      filename: 'guide-fake-detection.json',
      keywords: [
        'genuine SanDisk Extreme microSD',
        'authentic Kingston Canvas microSD',
        'SanDisk Ultra microSD card'
      ]
    },
    
    // GUIDES: Video Bitrate (for 4K/8K recording)
    {
      filename: 'guide-video-bitrate.json',
      keywords: [
        'SanDisk Extreme V30 SD card',
        'Lexar Professional Silver V60 microSD',
        'Sony TOUGH G V90 SD card'
      ]
    },
    
    // CALCULATORS: Recommended cards (for pricing lookup)
    {
      filename: 'calculator-recommended.json',
      keywords: [
        'Kingston Canvas Go Plus microSD',
        'SanDisk Extreme microSD V30',
        'Samsung EVO Select microSD',
        'Lexar Professional Silver microSD',
        'Kingston Canvas Select Plus',
        'SanDisk MAX ENDURANCE',
        'Samsung PRO Endurance',
        'Lexar Professional Gold UHS-II',
        'SanDisk Extreme PRO SD UHS-II'
      ]
    },
    
    // READERS: Photographers
    {
      filename: 'readers-photographers.json',
      keywords: [
        'ProGrade Thunderbolt card reader',
        'SanDisk Extreme PRO USB-C SD card reader',
        'Satechi USB-C aluminum SD card reader',
        'Lexar professional thunderbolt reader',
        'Anker PowerExpand SD card reader'
      ]
    },
    
    // READERS: Android
    {
      filename: 'readers-android.json',
      keywords: [
        'USB-C SD card reader portable',
        'Android phone SD card reader',
        'Kingston MobileLite microSD reader',
        'Anker PowerExpand USB-C reader',
        'SanDisk microSD USB-C reader'
      ]
    },
    
    // READERS: iPhone
    {
      filename: 'readers-iphone.json',
      keywords: [
        'iPhone Lightning SD card reader',
        'iPad Lightning microSD reader',
        'Anker Lightning SD card reader',
        'Satechi Lightning card reader',
        'Apple certified SD card reader'
      ]
    },
    
    // READERS: MacBook
    {
      filename: 'readers-macbook.json',
      keywords: [
        'USB-C SD card reader Mac',
        'Thunderbolt SD card reader MacBook',
        'ProGrade Thunderbolt Mac reader',
        'Satechi USB-C Mac reader',
        'high speed Mac card reader'
      ]
    }
  ];

  const totalKeywords = searchGroups.reduce((sum, group) => sum + group.keywords.length, 0);
  console.log(`Processing ${searchGroups.length} search groups with ${totalKeywords} total keywords...\n`);

  let requestCount = 0;

  // Process each search group
  for (const { filename, keywords } of searchGroups) {
    console.log(`🔍 ${filename}:`);
    let allResults = [];
    
    // Search for each keyword in the group
    for (const keyword of keywords) {
      try {
        requestCount++;
        
        // Add delay between requests to respect rate limits
        if (requestCount > 1) {
          process.stdout.write(`   Waiting ${REQUEST_DELAY_MS}ms before next request...\r`);
          await sleep(REQUEST_DELAY_MS);
        }
        
        process.stdout.write(`   Searching: "${keyword}"...\r`);
        const products = await searchSDCards(keyword);
        
        if (products.length > 0) {
          allResults = allResults.concat(products);
          process.stdout.write(`   ✓ Found ${products.length} products for "${keyword}"\n`);
        } else {
          process.stdout.write(`   ⚠️  No results for "${keyword}"\n`);
        }
      } catch (error) {
        process.stdout.write(`   ❌ Error searching "${keyword}": ${error.message}\n`);
      }
    }
    
    // De-duplicate by ASIN and take top 5
    const uniqueProducts = [];
    const seenAsins = new Set();
    
    for (const product of allResults) {
      if (product.asin && !seenAsins.has(product.asin)) {
        seenAsins.add(product.asin);
        uniqueProducts.push(product);
        if (uniqueProducts.length >= 5) break;
      }
    }
    
    if (uniqueProducts.length > 0) {
      saveToCache(filename, uniqueProducts);
      console.log(`  ✅ Saved ${uniqueProducts.length} unique products\n`);
    } else {
      // Keep existing cache if API returns nothing
      const existingCache = loadCache(filename);
      if (existingCache.length > 0) {
        console.log(`  ⚠️  No API results, keeping existing cache: ${filename}\n`);
      } else {
        console.log(`  ❌ No results found, no existing cache for: ${filename}\n`);
        saveToCache(filename, []);
      }
    }
  }

  console.log('✅ Amazon data build complete!\n');
}

// Run if executed directly
if (require.main === module) {
  buildAmazonData().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
}

module.exports = { buildAmazonData };
