/**
 * Card Recommendations Filter
 * Filters and displays SD cards based on calculator results
 * Version 1.0
 */

class CardRecommendations {
  /**
   * Speed class mapping for filtering
   */
  static SPEED_CLASS_ORDER = {
    'V6': 1,
    'V30': 2,
    'V60': 3,
    'V90': 4,
    'U3': 2.5,
    'Class 10': 1.5
  };

  /**
   * Filter cards based on speed class requirement
   * @param {Array} allCards - All available SD cards from sdcards.json
   * @param {String} requiredSpeedClass - Min speed class (V6, V30, V60, V90)
   * @param {Number} minCapacityGB - Minimum capacity needed (optional)
   * @param {String} priceTier - Filter by price tier (optional: "Budget", "Mid-Range", "Premium")
   * @returns {Array} Filtered cards sorted by speed class then price
   */
  static filterBySpeedClass(allCards, requiredSpeedClass, minCapacityGB = null, priceTier = null) {
    if (!allCards || allCards.length === 0) {
      console.warn('No cards provided for filtering');
      return [];
    }

    const requiredRank = this.SPEED_CLASS_ORDER[requiredSpeedClass] || 2;

    let filtered = allCards.filter(card => {
      // Check speed class is sufficient
      const cardRank = this.SPEED_CLASS_ORDER[card.speed] || 0;
      if (cardRank < requiredRank) {
        return false;
      }

      // Check capacity if specified
      if (minCapacityGB && card.capacity) {
        if (card.capacity < minCapacityGB) {
          return false;
        }
      }

      // Check price tier if specified
      if (priceTier && card.priceTier !== priceTier) {
        return false;
      }

      return true;
    });

    // Sort by: speed class (ascending, min sufficient first), then by price (ascending)
    filtered.sort((a, b) => {
      const rankA = this.SPEED_CLASS_ORDER[a.speed] || 0;
      const rankB = this.SPEED_CLASS_ORDER[b.speed] || 0;

      if (rankA !== rankB) {
        return rankA - rankB; // Lower rank = faster
      }

      // If same speed class, sort by price
      return (a.priceEstimate || 0) - (b.priceEstimate || 0);
    });

    return filtered;
  }

  /**
   * Get top N cards matching requirements
   * @param {Array} allCards - All available SD cards
   * @param {String} requiredSpeedClass - Speed class requirement
   * @param {Number} limit - Max cards to return (default 5)
   * @param {Number} minCapacityGB - Min capacity (optional)
   * @returns {Array} Top matching cards
   */
  static getTopRecommendations(allCards, requiredSpeedClass, limit = 5, minCapacityGB = null) {
    const filtered = this.filterBySpeedClass(allCards, requiredSpeedClass, minCapacityGB);
    return filtered.slice(0, limit);
  }

  /**
   * Get cards by endurance rating (for continuous recording, surveillance)
   * @param {Array} allCards - All available SD cards
   * @param {String} enduranceRating - "HIGH_ENDURANCE" or similar
   * @param {Number} limit - Max cards to return
   * @returns {Array} Endurance-rated cards
   */
  static filterByEndurance(allCards, enduranceRating = 'HIGH_ENDURANCE', limit = 5) {
    const filtered = allCards.filter(card => {
      return card.enduranceRating === enduranceRating || card.tags?.includes(enduranceRating);
    });

    // Sort by price (cheaper endurance cards first)
    filtered.sort((a, b) => (a.priceEstimate || 0) - (b.priceEstimate || 0));

    return filtered.slice(0, limit);
  }

  /**
   * Format card for display in HTML
   * @param {Object} card - Card object from sdcards.json
   * @returns {Object} Formatted card with display properties
   */
  static formatCardForDisplay(card) {
    return {
      id: card.id,
      name: card.name,
      speedClass: card.speed,
      writeSpeed: card.writeSpeed,
      capacity: card.capacity ? `${card.capacity}GB` : 'Variable',
      priceTier: card.priceTier || 'Standard',
      amazonUrl: card.amazonSearchUrl,
      imageUrl: card.imageUrl,
      pros: card.pros,
      cons: card.cons,
      tier: card.tier || 'standard'
    };
  }

  /**
   * Build recommendation HTML markup
   * @param {Array} cards - Filtered cards to display
   * @returns {String} HTML markup for card list
   */
  static buildCardHTML(cards) {
    if (!cards || cards.length === 0) {
      return '<p class="text-gray-600">No matching cards found. Try adjusting your requirements.</p>';
    }

    let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';

    cards.forEach(card => {
      const formatted = this.formatCardForDisplay(card);
      
      html += `
        <div class="border border-gray-300 rounded-lg p-4 hover:shadow-md transition">
          ${formatted.imageUrl ? `<img src="${formatted.imageUrl}" alt="${formatted.name}" class="w-full h-32 object-contain mb-3" />` : ''}
          
          <h4 class="font-bold text-lg mb-2">${formatted.name}</h4>
          
          <div class="space-y-2 text-sm mb-4">
            <div><span class="font-semibold">Speed Class:</span> ${formatted.speedClass}</div>
            <div><span class="font-semibold">Write Speed:</span> ${formatted.writeSpeed}</div>
            <div><span class="font-semibold">Price Tier:</span> ${formatted.priceTier}</div>
          </div>
          
          <a href="${formatted.amazonUrl}" 
             target="_blank" 
             rel="noopener noreferrer"
             class="block w-full px-4 py-2 bg-orange-500 text-white font-bold text-center rounded-lg hover:bg-orange-600 transition">
            Check Price on Amazon
          </a>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  /**
   * Inject recommendations into page after calculation
   * @param {Array} cards - Filtered cards
   * @param {String} containerId - HTML element ID to inject into
   */
  static injectRecommendations(cards, containerId = 'card-recommendations') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return;
    }

    const html = this.buildCardHTML(cards);
    const listContainer = container.querySelector('#card-list');
    
    if (listContainer) {
      listContainer.innerHTML = html;
    }

    // Show recommendations section
    container.style.display = 'block';
  }

  /**
   * Load cards from JSON (typically called at page load)
   * @returns {Promise} Cards array
   */
  static async loadCards() {
    try {
      const response = await fetch('/data/sdcards.json');
      const data = await response.json();
      return data.sdcards || [];
    } catch (error) {
      console.error('Failed to load cards:', error);
      return [];
    }
  }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CardRecommendations;
}
