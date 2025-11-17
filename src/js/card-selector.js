/**
 * Card Selector for Calculator
 * Allows users to select from existing cards to auto-fill calculator inputs
 * Version 1.0
 */

class CardSelector {
  /**
   * Load all cards from sdcards.json
   * @returns {Promise<Array>} All available SD cards
   */
  static async loadCards() {
    try {
      console.log('[CardSelector] Fetching cards from /data/sdcards.json');
      const response = await fetch('/data/sdcards.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const cards = data.sdcards || [];
      
      if (!cards || cards.length === 0) {
        console.warn('[CardSelector] ⚠️ No cards found in sdcards.json');
        return [];
      }
      
      console.log(`[CardSelector] ✓ Loaded ${cards.length} cards from JSON`);
      return cards;
    } catch (error) {
      console.error('[CardSelector] ✗ Failed to load cards:', error);
      console.error('[CardSelector] URL attempted:', '/data/sdcards.json');
      return [];
    }
  }

  /**
   * Filter cards by search term
   * @param {Array} cards - All cards
   * @param {String} searchTerm - User's search input
   * @returns {Array} Filtered cards
   */
  static searchCards(cards, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return cards;
    }

    const term = searchTerm.toLowerCase();
    return cards.filter(card => 
      card.name.toLowerCase().includes(term) || 
      card.id.toLowerCase().includes(term) ||
      (card.speed && card.speed.toLowerCase().includes(term)) ||
      (card.type && card.type.toLowerCase().includes(term))
    );
  }

  /**
   * Parse write speed from string to number (MB/s)
   * @param {String} speedStr - e.g., "90 MB/s" or "90MB/s"
   * @returns {Number} Speed in MB/s
   */
  static parseWriteSpeed(speedStr) {
    if (typeof speedStr === 'number') return speedStr;
    if (!speedStr) return 0;
    
    const match = speedStr.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Get selected card's relevant specs for calculator
   * @param {Object} card - Selected card object
   * @returns {Object} { writeSpeedMBps, speedClass, type, capacity, bitrateMbps }
   */
  static getCardSpecs(card) {
    return {
      name: card.name,
      id: card.id,
      type: card.type,
      speedClass: card.speed,
      writeSpeedMBps: this.parseWriteSpeed(card.writeSpeed),
      capacity: card.capacity || null,
      // Estimate bitrate from speed class (conservative estimate)
      estimatedBitrateMbps: this._estimateBitrate(card.speed)
    };
  }

  /**
   * Estimate bitrate from speed class (for reverse calculator)
   * @private
   * @param {String} speedClass - e.g., "V30", "V60", "V90"
   * @returns {Number} Estimated bitrate in Mbps
   */
  static _estimateBitrate(speedClass) {
    const estimates = {
      'V6': 6,
      'V30': 100,    // Conservative for V30
      'V60': 150,    // Conservative for V60
      'V90': 300     // Conservative for V90
    };
    return estimates[speedClass] || 100;
  }

  /**
   * Format card for display in dropdown
   * @param {Object} card - Card object
   * @returns {String} Display string
   */
  static formatCardDisplay(card) {
    return `${card.name} (${card.speed}, ${card.writeSpeed})`;
  }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CardSelector;
}
