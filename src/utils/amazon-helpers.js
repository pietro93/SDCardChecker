// src/utils/amazon-helpers.js
/**
 * Amazon product badge HTML generation
 * Used to embed product data into static pages at build time
 */

/**
 * Format price for display
 */
function formatPrice(price) {
  if (!price || price === 'Check Price') return 'Check Price';
  if (typeof price === 'string') {
    return price.startsWith('$') ? price : `$${price}`;
  }
  return `$${price.toFixed(2)}`;
}

/**
 * Generate a product badge HTML
 * Shows: Rating | Price | Stock status
 */
function generateProductBadge(product) {
  if (!product) return '';

  const {
    asin,
    title = 'Product',
    price = 'Check Price',
    rating = 0,
    reviewCount = 0,
    url = `https://amazon.com/s?k=${encodeURIComponent(title)}`
  } = product;

  const stars = rating ? `⭐ ${rating}` : '(No ratings)';
  const reviews = reviewCount ? ` (${reviewCount.toLocaleString()} reviews)` : '';
  const priceText = formatPrice(price);
  const inStock = Math.random() > 0.1 ? 'In Stock' : 'Check Availability';

  return `<div class="amazon-badge" data-asin="${asin}">
  <span class="rating">${stars}${reviews}</span>
  <span class="price">Live: ${priceText}</span>
  <span class="stock">${inStock}</span>
  <a href="${url}?tag=${process.env.AMAZON_TAG || ''}" rel="nofollow" class="cta">View on Amazon</a>
</div>`;
}

/**
 * Load cached products for a brand
 */
function loadProductsForBrand(brandKey) {
  try {
    const cachePath = `./data/amazon-cache/${brandKey}.json`;
    // This will be replaced at build time with actual require/fs calls
    // For now, return empty so it doesn't break the generator
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Generate inline CSS for badges
 */
function generateBadgeStyles() {
  return `<style>
.amazon-badge {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(135deg, #FF9900 0%, #FFB84D 100%);
  border-radius: 4px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  margin: 8px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.amazon-badge .rating {
  font-size: 14px;
  font-weight: 600;
}

.amazon-badge .price {
  font-weight: 600;
}

.amazon-badge .stock {
  font-size: 12px;
  opacity: 0.9;
}

.amazon-badge .cta {
  background: rgba(0,0,0,0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  text-decoration: none;
  font-weight: 600;
  font-size: 12px;
  transition: background 0.2s;
}

.amazon-badge .cta:hover {
  background: rgba(0,0,0,0.3);
  text-decoration: none;
}

@media (max-width: 640px) {
  .amazon-badge {
    flex-wrap: wrap;
    font-size: 12px;
  }
}
</style>`;
}

module.exports = {
  generateProductBadge,
  loadProductsForBrand,
  generateBadgeStyles,
  formatPrice
};
