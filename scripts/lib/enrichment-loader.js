/**
 * Enrichment Data Loader
 * Loads and provides access to AI-generated device enrichment data
 */

const fs = require('fs');
const path = require('path');

const ENRICHMENT_FILE = path.join(__dirname, '../../data/device-enrichment.json');

let enrichmentCache = null;

function loadEnrichment() {
  if (enrichmentCache) return enrichmentCache;

  if (!fs.existsSync(ENRICHMENT_FILE)) {
    console.warn('⚠️  device-enrichment.json not found. Run: npm run enrich');
    return {};
  }

  try {
    enrichmentCache = JSON.parse(fs.readFileSync(ENRICHMENT_FILE, 'utf8'));
    return enrichmentCache;
  } catch (error) {
    console.error('Error loading enrichment data:', error.message);
    return {};
  }
}

/**
 * Get enrichment data for a device
 * @param {string} category - Device category
 * @param {string} slug - Device slug
 * @returns {object|null} Enrichment data or null if not found
 */
function getEnrichment(category, slug) {
  const enrichment = loadEnrichment();
  const key = `${category}:${slug}`;
  return enrichment[key] || null;
}

/**
 * Get explanation for a device
 * @param {string} category - Device category
 * @param {string} slug - Device slug
 * @returns {string|null} Explanation text or null if not found
 */
function getExplanation(category, slug) {
  const enrichment = getEnrichment(category, slug);
  return enrichment ? enrichment.explanation : null;
}

module.exports = {
  loadEnrichment,
  getEnrichment,
  getExplanation,
};
