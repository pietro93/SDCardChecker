/**
 * Card Recommender Utility
 * Filters sdcards.json by calculated speed class requirements
 * Lightweight integration - loads only when needed, caches results
 */

class CardRecommender {
  // Cache for loaded cards data
  static #cardsCache = null;

  /**
   * Load cards from sdcards.json (cached)
   * @returns {Promise<Array>} Array of card objects
   */
  static async loadCards() {
    if (this.#cardsCache) {
      return this.#cardsCache;
    }

    try {
      const response = await fetch('/data/sdcards.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      this.#cardsCache = data.sdcards || [];
      return this.#cardsCache;
    } catch (error) {
      console.error('Failed to load cards:', error);
      return [];
    }
  }

  /**
   * Get recommended cards matching the speed class requirement
   * @param {Array} allCards - Array of card objects
   * @param {string} requiredSpeedClass - e.g., 'V30', 'V60', 'V90'
   * @param {number} limit - Max cards to return (default 5)
   * @param {number} minCapacityGB - Filter cards >= this capacity
   * @returns {Array} Filtered and ranked card recommendations
   */
  static getTopRecommendations(allCards, requiredSpeedClass, limit = 5, minCapacityGB = 64) {
    const speedClassRank = { 'V6': 6, 'V30': 30, 'V60': 60, 'V90': 90 };
    const requiredRank = speedClassRank[requiredSpeedClass] || 30;

    // Filter: card speed >= required speed
    const filtered = allCards.filter(card => {
      const cardRank = speedClassRank[card.speed] || 0;
      return cardRank >= requiredRank;
    });

    // Sort: tier (recommended first), then price (budget first), then write speed (faster first)
    const sorted = filtered.sort((a, b) => {
      const tierOrder = { 'recommended': 0, 'budget': 1, 'premium': 2 };
      const aTier = tierOrder[a.tier] ?? 99;
      const bTier = tierOrder[b.tier] ?? 99;

      if (aTier !== bTier) return aTier - bTier;

      // Sort by price tier (Budget < Mid-Range < Premium)
      const priceOrder = { 'Budget': 0, 'Mid-Range': 1, 'Premium': 2 };
      const aPrice = priceOrder[a.priceTier] ?? 99;
      const bPrice = priceOrder[b.priceTier] ?? 99;

      if (aPrice !== bPrice) return aPrice - bPrice;

      // Sort by write speed (faster first)
      const aSpeed = parseInt(a.writeSpeed) || 0;
      const bSpeed = parseInt(b.writeSpeed) || 0;
      return bSpeed - aSpeed;
    });

    return sorted.slice(0, limit);
  }

  /**
   * Generate HTML for recommended cards (for injection into template)
   * @param {Array} recommendations - Array of recommended card objects
   * @returns {string} HTML string of card recommendation blocks
   */
  static generateRecommendationHTML(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return '<p class="text-sm text-gray-600">No matching cards found.</p>';
    }

    return recommendations
      .map(card => `
        <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-sm">${this._escapeHtml(card.name)}</h5>
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">${card.speed}</span>
          </div>
          <p class="text-xs text-gray-600 mb-2">Write Speed: ${card.writeSpeed}</p>
          <p class="text-xs text-gray-700 mb-3">✓ ${this._escapeHtml(card.pros)}</p>
          ${card.amazonSearchUrl ? `<a href="${this._escapeHtml(card.amazonSearchUrl)}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 hover:underline">View on Amazon ↗</a>` : ''}
        </div>
      `)
      .join('');
  }

  /**
   * Build a card filter URL for the card comparison page
   * @param {string} speedClass - Required speed class
   * @param {string} type - Card type (optional, e.g., 'SD', 'microSD')
   * @returns {string} URL with filter parameters
   */
  static getCardFilterURL(speedClass, type = null) {
    const params = new URLSearchParams();
    params.append('speedClass', speedClass);
    if (type) params.append('type', type);
    return `/cards/?${params.toString()}`;
  }

  /**
   * Escape HTML special characters (security)
   * @private
   */
  static _escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CardRecommender;
}
