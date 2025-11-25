// src/utils/amazon-api.js
const common = require('amazon-paapi');
require('dotenv').config();

/**
 * Amazon PAAPI configuration and rate-limited search
 * Called during build process ONLY (not at runtime)
 */

const commonParameters = {
  AccessKey: process.env.AMAZON_ACCESS_KEY,
  SecretKey: process.env.AMAZON_SECRET_KEY,
  PartnerTag: process.env.AMAZON_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com'
};

// Rate limiting: Amazon allows ~1 request/second for new associates
let lastRequestTime = 0;
const REQUEST_DELAY_MS = 2500; // 2.5 seconds between requests

/**
 * Enforce rate limiting between API calls
 */
async function delayIfNeeded() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < REQUEST_DELAY_MS) {
    await new Promise(resolve => 
      setTimeout(resolve, REQUEST_DELAY_MS - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
}

/**
 * Search for SD card products on Amazon
 * @param {string} keywords - What to search for
 * @returns {Promise<Array>} Array of product objects or empty array on error
 */
async function searchSDCards(keywords) {
  // Validate credentials exist
  if (!commonParameters.AccessKey || !commonParameters.SecretKey || !commonParameters.PartnerTag) {
    console.warn('⚠️  Amazon API credentials missing (check .env or Cloudflare env vars)');
    return [];
  }

  if (!keywords) {
    console.error('❌ Keywords required for search');
    return [];
  }

  try {
    // Enforce rate limiting before API call
    await delayIfNeeded();

    console.log(`  Searching Amazon for: "${keywords}"`);

    // Call Amazon PAAPI
    const response = await common.SearchItems(commonParameters, {
      Keywords: keywords,
      SearchIndex: 'Electronics',  // SD cards fall under Electronics
      ItemCount: 5,
      Resources: [
        'Images.Primary.Medium',
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating'
      ]
    });

    // Extract and transform results
    const products = (response?.SearchResult?.Items || []).map(item => {
      try {
        return {
          asin: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue,
          image: item.Images?.Primary?.Medium?.URL,
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Check Price',
          rating: item.CustomerReviews?.StarRating?.Value || 0,
          reviewCount: item.CustomerReviews?.Count?.Value || 0,
          url: item.DetailPageURL
        };
      } catch (e) {
        return null;
      }
    }).filter(p => p !== null);

    console.log(`  ✓ Found ${products.length} products`);
    return products;

  } catch (error) {
    // Handle errors gracefully (don't break build)
    if (error.code === 'TooManyRequests' || error.statusCode === 429) {
      console.warn(`  ⚠️  Rate limited (429). Increase REQUEST_DELAY_MS to 3500+`);
    } else if (error.statusCode === 400) {
      console.warn(`  ⚠️  Bad Request (400). Check keywords and SearchIndex.`);
    } else if (error.statusCode === 401 || error.statusCode === 403) {
      console.warn(`  ⚠️  Auth failed (401/403). Check AWS credentials in env vars.`);
    } else {
      console.warn(`  ⚠️  API Error: ${error.message}`);
    }
    
    // Return empty array so build doesn't fail
    return [];
  }
}

module.exports = {
  searchSDCards,
  delayIfNeeded
};
