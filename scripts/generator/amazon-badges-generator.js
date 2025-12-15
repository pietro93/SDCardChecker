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
    <div class="amazon-product-badge">
      <div class="badge-image">
        <img src="${image}" alt="${title}" loading="lazy" width="120" height="120" />
      </div>
      <div class="badge-content">
        <h4 class="badge-title">${title}</h4>
        ${ratingHtml}
        <div class="badge-price">${priceDisplay}</div>
        <a href="${url}" target="_blank" rel="nofollow noopener" class="badge-link">
          <i class="fas fa-shopping-cart"></i>
          View on Amazon
        </a>
      </div>
    </div>
  `;
}

/**
 * Generate the Amazon Badges Section HTML (default for device pages)
 */
function generateAmazonBadgesSection() {
  return generateAmazonBadgeSectionByType('featured-general', 3);
}

/**
 * Get fallback reader recommendations when cache is empty
 */
function getFallbackReaderRecommendations() {
  return [
    {
      title: 'SanDisk Extreme PRO USB-C SD Card Reader',
      price: '$34.99',
      rating: 4.6,
      reviewCount: 512,
      url: 'https://www.amazon.com/dp/B08F7TM5FG?tag=sd-cc-20&linkCode=osi&th=1&psc=1',
      image: '/img/readers/sd-card-reader-placeholder.webp'
    },
    {
      title: 'Satechi USB-C Aluminum SD Card Reader',
      price: '$24.99',
      rating: 4.5,
      reviewCount: 387,
      url: 'https://www.amazon.com/dp/B08GMCPTH1?tag=sd-cc-20&linkCode=osi&th=1&psc=1',
      image: '/img/readers/sd-card-reader-placeholder.webp'
    },
    {
      title: 'Kingston Workflow Dual Slot SD Card Reader',
      price: '$99.99',
      rating: 4.7,
      reviewCount: 156,
      url: 'https://www.amazon.com/dp/B0BVDS17RY?tag=sd-cc-20&linkCode=osi&th=1&psc=1',
      image: '/img/readers/sd-card-reader-placeholder.webp'
    }
  ];
}

/**
 * Generate Amazon Badges Section by type
 * Allows different product sets for guides, calculators, etc.
 * 
 * @param {string} type - Cache file type (e.g., 'featured-general', 'guide-speed-classes')
 * @param {number} count - How many products to show (default: 3)
 * @param {string} title - Section title (default: 'Featured Products on Amazon')
 * @returns {string} HTML section or empty string if no products
 */
function generateAmazonBadgeSectionByType(type = 'featured-general', count = 3, title = 'Featured Products on Amazon') {
  try {
    let products = loadCachedProducts(`${type}.json`);
    
    // Fallback to reader recommendations if cache is empty and type is reader-related
    if ((!products || products.length === 0) && type.includes('readers')) {
      products = getFallbackReaderRecommendations();
    }
    
    if (!products || products.length === 0) {
      return '';
    }

    const topProducts = products.slice(0, count);
    const badgesHTML = topProducts
      .map((product, index) => generateProductBadgeHTML(product, index))
      .join('');

    return `
      <section id="amazon-products-${type}" class="mb-16 scroll-mt-20">
        <h3 class="text-2xl font-bold text-slate-900 mb-6">${title}</h3>
        <p class="text-xs text-slate-500 mb-6">This website contains affiliate links. We may earn a small commission when you purchase through our links at no extra cost to you.</p>
        <div class="amazon-badges-grid">
          ${badgesHTML}
        </div>
      </section>
    `;
  } catch (error) {
    console.warn(`  ⚠️  Error generating Amazon badges section (${type}):`, error.message);
    return '';
  }
}

module.exports = {
  generateAmazonBadgesSection,
  generateAmazonBadgeSectionByType,
  loadCachedProducts,
  generateProductBadgeHTML
};
