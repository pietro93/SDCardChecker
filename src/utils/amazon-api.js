// src/utils/amazon-api.js
require('dotenv').config();

/**
 * Amazon Creators API configuration and rate-limited search
 * (replaces PA-API 5.0, which Amazon retired in 2026)
 * Called during build process ONLY (not at runtime)
 * Docs: https://affiliate-program.amazon.com/creatorsapi/docs/en-us/
 */

const CREDENTIAL_ID = process.env.AMAZON_CREATORS_CREDENTIAL_ID;
const CREDENTIAL_SECRET = process.env.AMAZON_CREATORS_CREDENTIAL_SECRET;
const PARTNER_TAG = process.env.AMAZON_TAG;
const MARKETPLACE = 'www.amazon.com';

// Credential version 3.1 = North America (US, CA, MX, BR)
const TOKEN_ENDPOINT = 'https://api.amazon.com/auth/o2/token';
const API_BASE = 'https://creatorsapi.amazon/catalog/v1';

// Rate limiting: Amazon allows ~1 request/second for new associates
let lastRequestTime = 0;
const REQUEST_DELAY_MS = 2500; // 2.5 seconds between requests

let cachedToken = null;
let tokenExpiresAt = 0;

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

function hasCredentials() {
  if (!CREDENTIAL_ID || !CREDENTIAL_SECRET || !PARTNER_TAG) {
    console.warn('Amazon Creators API credentials missing (check .env or Cloudflare env vars)');
    return false;
  }
  return true;
}

/**
 * Get an OAuth access token (valid 1 hour, cached)
 */
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CREDENTIAL_ID,
      client_secret: CREDENTIAL_SECRET,
      scope: 'creatorsapi::default'
    })
  });

  if (!res.ok) {
    throw Object.assign(new Error(`Token request failed: ${await res.text()}`), { statusCode: res.status });
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

/**
 * POST to a Creators API catalog operation (searchItems, getItems)
 */
async function callApi(operation, body) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/${operation}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-marketplace': MARKETPLACE
    },
    body: JSON.stringify({ partnerTag: PARTNER_TAG, marketplace: MARKETPLACE, ...body })
  });

  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`), { statusCode: res.status });
  }
  return res.json();
}

function logApiError(error) {
  if (error.statusCode === 429) {
    console.warn(`  Rate limited (429). Increase REQUEST_DELAY_MS to 3500+`);
  } else if (error.statusCode === 400) {
    console.warn(`  Bad Request (400). Check keywords and searchIndex. ${error.message}`);
  } else if (error.statusCode === 401 || error.statusCode === 403) {
    console.warn(`  Auth failed (${error.statusCode}). Check Creators API credentials in env vars. ${error.message}`);
  } else {
    console.warn(`  API Error: ${error.message}`);
  }
}

/**
 * Search for SD card products on Amazon
 * @param {string} keywords - What to search for
 * @returns {Promise<Array>} Array of product objects or empty array on error
 */
async function searchSDCards(keywords) {
  if (!hasCredentials()) return [];

  if (!keywords) {
    console.error('Keywords required for search');
    return [];
  }

  try {
    // Enforce rate limiting before API call
    await delayIfNeeded();

    console.log(`  Searching Amazon for: "${keywords}"`);

    const response = await callApi('searchItems', {
      keywords,
      searchIndex: 'Electronics',  // SD cards fall under Electronics
      itemCount: 5,
      resources: [
        'images.primary.medium',
        'itemInfo.title'
      ]
    });

    // Extract and transform results
    // Note: the Creators API doesn't return customer reviews, so rating/reviewCount are 0
    // Prices are deliberately not fetched: this cache is committed and served for weeks,
    // and the Associates agreement forbids showing stale prices. Badges link to "Check Price".
    const products = (response?.searchResult?.items || []).map(item => {
      try {
        return {
          asin: item.asin,
          title: item.itemInfo?.title?.displayValue,
          image: item.images?.primary?.medium?.url,
          price: 'Check Price',
          rating: 0,
          reviewCount: 0,
          url: item.detailPageURL
        };
      } catch (e) {
        return null;
      }
    }).filter(p => p !== null);

    console.log(`  ✓ Found ${products.length} products`);
    return products;

  } catch (error) {
    // Handle errors gracefully (don't break build)
    logApiError(error);
    return [];
  }
}

/**
 * Look up product images/titles for specific ASINs (e.g. the exact listing
 * linked from an affiliate URL), rather than a fuzzy keyword search.
 * @param {string[]} asins - Up to 10 ASINs
 * @returns {Promise<Object>} Map of ASIN -> { title, image, url }
 */
async function getItemsByAsin(asins) {
  if (!hasCredentials()) return {};
  if (!asins || asins.length === 0) return {};

  try {
    await delayIfNeeded();

    console.log(`  Looking up Amazon ASINs: ${asins.join(', ')}`);

    const response = await callApi('getItems', {
      itemIds: asins,
      itemIdType: 'ASIN',
      condition: 'New',
      resources: [
        'images.primary.large',
        'itemInfo.title'
      ]
    });

    // Per-item failures (e.g. delisted ASINs) come back as 200 with an errors array
    (response?.errors || []).forEach(err => console.warn(`  ${err.code}: ${err.message}`));

    const result = {};
    (response?.itemsResult?.items || []).forEach(item => {
      result[item.asin] = {
        title: item.itemInfo?.title?.displayValue,
        image: item.images?.primary?.large?.url,
        url: item.detailPageURL
      };
    });
    return result;
  } catch (error) {
    logApiError(error);
    return {};
  }
}

module.exports = {
  searchSDCards,
  getItemsByAsin,
  delayIfNeeded
};
