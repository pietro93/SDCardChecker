/**
 * Amazon Badges Generator
 * Loads cached product data and generates HTML badges for device pages
 */

const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '../../data/amazon-cache');

/**
 * Load cached products from JSON file
 */
function loadCachedProducts(filename) {
  try {
    const filepath = path.join(CACHE_DIR, filename);
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`  ⚠️  Failed to load cache ${filename}:`, error.message);
  }
  return [];
}

/**
 * Generate HTML for a single product badge
 */
function generateProductBadgeHTML(product, index) {
  if (!product || !product.url) return '';

  const {
    title = 'Product',
    price = 'Check Price',
    rating = 0,
    reviewCount = 0,
    url,
    image = '/img/fallback-product.jpg'
  } = product;

  const priceDisplay = price.startsWith('$') ? price : `$${price}`;
  
  // Only show rating if it exists
  const ratingHtml = rating > 0 
    ? `<div class="badge-rating">⭐ ${rating.toFixed(1)}${reviewCount > 0 ? ` (${reviewCount.toLocaleString()})` : ''}</div>`
    : '';

  return `
    <div class="amazon-product-badge" data-index="${index}">
      <div class="badge-image">
        <img src="${image}" alt="${title}" loading="lazy" width="100" height="100" />
      </div>
      <div class="badge-content">
        <h4 class="badge-title">${title}</h4>
        ${ratingHtml}
        <div class="badge-price">${priceDisplay}</div>
        <a href="${url}" target="_blank" rel="nofollow noopener" class="badge-link">
          View on Amazon →
        </a>
      </div>
    </div>
  `;
}

/**
 * Generate the Amazon Badges Section HTML
 */
function generateAmazonBadgesSection() {
  try {
    // Load all cached product files
    const cacheFiles = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
    
    if (cacheFiles.length === 0) {
      return ''; // No cache files, skip section
    }

    let allProducts = [];
    for (const file of cacheFiles) {
      const products = loadCachedProducts(file);
      if (products.length > 0) {
        allProducts = allProducts.concat(products);
      }
    }

    if (allProducts.length === 0) {
      return '';
    }

    // Take top 3 products
    const topProducts = allProducts.slice(0, 3);

    const badgesHTML = topProducts
      .map((product, index) => generateProductBadgeHTML(product, index))
      .join('');

    return `
      <section id="amazon-products" class="mb-16 scroll-mt-20">
        <h3 class="text-2xl font-bold text-slate-900 mb-6">Featured Products on Amazon</h3>
        <p class="text-xs text-slate-500 mb-6">This website contains affiliate links. We may earn a small commission when you purchase through our links at no extra cost to you.</p>
        <div class="amazon-badges-grid">
          ${badgesHTML}
        </div>
      </section>
    `;
  } catch (error) {
    console.warn('  ⚠️  Error generating Amazon badges section:', error.message);
    return '';
  }
}

module.exports = {
  generateAmazonBadgesSection,
  loadCachedProducts,
  generateProductBadgeHTML
};
