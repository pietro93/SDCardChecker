/**
 * Calculator-Specific Card Recommendations
 * Generates inline card recommendations for calculator results
 * Similar to device pages but formatted for results display
 * Version 1.0
 */

class CalculatorCardRecommendations {
    /**
     * Get smart fallback image for card based on type and speed class
     * Uses UHS level and type to determine appropriate placeholder
     * @param {Object} card - Card object
     * @returns {String} Fallback image URL
     */
    static getCardImageFallback(card) {
        const isMicroSD = card.type && card.type.toLowerCase().includes('microsd');
        const uhs = card.uhs ? card.uhs.toUpperCase() : '';
        
        // Type-specific placeholders for specialty formats
        if (card.type === 'CFast') {
            return '/img/cards/cfast-generic.webp';
        }
        if (card.type === 'XQD') {
            return '/img/cards/xqd-generic.webp';
        }
        
        // UHS-II cards
        if (uhs.includes('UHS-II')) {
            return isMicroSD ? '/img/cards/micro-uhs2-generic.webp' : '/img/cards/uhs2-generic.webp';
        }
        
        // UHS-I cards
        if (uhs.includes('UHS-I')) {
            return isMicroSD ? '/img/cards/micro-uhs1-generic.webp' : '/img/cards/uhs1-generic.webp';
        }

        // Default fallback
        return '/img/cards/placeholder.webp';
    }

    /**
     * Load cards from JSON
     * @returns {Promise<Array>} Cards array
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

    /**
     * Filter cards by speed class
     * @param {Array} allCards - All cards from JSON
     * @param {String} requiredSpeedClass - Speed class (V30, V60, V90)
     * @param {Number} limit - Max cards to return
     * @returns {Array} Filtered and sorted cards
     */
    static filterBySpeedClass(allCards, requiredSpeedClass, limit = 5) {
        const speedClassOrder = {
            'V6': 1,
            'V30': 2,
            'V60': 3,
            'V90': 4,
            'U3': 2.5,
            'Class 10': 1.5
        };

        const requiredRank = speedClassOrder[requiredSpeedClass] || 2;

        // Filter for sufficient speed class
        let filtered = allCards.filter(card => {
            const cardRank = speedClassOrder[card.speed] || 0;
            return cardRank >= requiredRank;
        });

        // Sort by: speed class (ascending), then price
        filtered.sort((a, b) => {
            const rankA = speedClassOrder[a.speed] || 0;
            const rankB = speedClassOrder[b.speed] || 0;

            if (rankA !== rankB) {
                return rankA - rankB;
            }

            return (a.priceEstimate || 0) - (b.priceEstimate || 0);
        });

        return filtered.slice(0, limit);
    }

    /**
     * Format single card for calculator results display
     * @param {Object} card - Card from sdcards.json
     * @returns {Object} Formatted card
     */
    static formatCard(card) {
        const priceTierClass = card.priceTier
            ? `price-${card.priceTier.toLowerCase().replace(/\s+/g, '-')}`
            : 'price-mid-range';

        const priceTierSymbol = card.priceTier
            ? card.priceTier.toLowerCase().includes('budget')
                ? '$'
                : card.priceTier.toLowerCase().includes('premium')
                    ? '$$$'
                    : '$$'
            : '$$';

        return {
            id: card.id,
            name: card.name,
            speed: card.speed,
            writeSpeed: card.writeSpeed,
            capacity: card.capacity,
            imageUrl: card.imageUrl || this.getCardImageFallback(card),
            amazonUrl: card.amazonSearchUrl,
            priceTier: card.priceTier || 'Standard',
            priceTierClass: priceTierClass,
            priceTierSymbol: priceTierSymbol,
            priceEstimate: card.priceEstimate || 'N/A',
            pros: card.pros,
            tier: card.tier || 'standard'
        };
    }

    /**
     * Build HTML grid of recommendation cards
     * @param {Array} cards - Filtered cards
     * @param {String} speedClass - Speed class for reference
     * @returns {String} HTML markup
     */
    static buildRecommendationHTML(cards, speedClass) {
        if (!cards || cards.length === 0) {
            return `
        <div class="p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
          No matching cards found. Adjust your speed class filter and try again.
        </div>
      `;
        }

        const cardHTML = cards
            .map(card => {
                const formatted = this.formatCard(card);
                // Get fallback image URL for this card
                const fallbackUrl = this.getCardImageFallback(card);
                return `
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <!-- Card Image - Clickable -->
            <a 
              href="${formatted.amazonUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="aspect-square bg-gray-100 flex items-center justify-center p-3 block hover:bg-gray-200 transition-colors"
              title="View on Amazon">
              <img 
                src="${formatted.imageUrl}" 
                alt="${formatted.name} ${formatted.speed} SD Card" 
                class="w-full h-full object-contain cursor-pointer"
                loading="lazy"
                width="180"
                height="180"
                onerror="this.src='${fallbackUrl}'"
              />
            </a>

            <!-- Card Details -->
            <div class="p-4">
              <!-- Brand & Model - Clickable -->
              <h4 class="font-bold text-base text-gray-900 mb-1">
                <a 
                  href="${formatted.amazonUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="hover:text-orange-600 transition-colors">
                  ${formatted.name}
                </a>
              </h4>

              <!-- Specs Grid -->
              <div class="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div class="bg-blue-50 rounded p-2">
                  <span class="text-gray-600">Speed</span>
                  <div class="font-bold text-blue-600">${formatted.speed}</div>
                </div>
                <div class="bg-green-50 rounded p-2">
                  <span class="text-gray-600">Write</span>
                  <div class="font-bold text-green-600">${formatted.writeSpeed}</div>
                </div>
              </div>

              <!-- Price Tier Badge -->
              <div class="text-center mb-4">
                <span class="text-xs font-bold ${formatted.priceTierClass === 'price-budget' ? 'text-green-600' :
                        formatted.priceTierClass === 'price-premium' ? 'text-red-600' :
                            'text-amber-600'
                    }">
                  ${formatted.priceTierSymbol} ${formatted.priceTier}
                </span>
              </div>

              <!-- Check Price Button -->
              <a 
                href="${formatted.amazonUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg transition-colors text-center block"
              >
                <i class="fas fa-shopping-cart"></i> Check Price
              </a>
            </div>
          </div>
        `;
            })
            .join('');

        return `
      <div class="space-y-4">
        <!-- Header -->
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            Recommended SD Cards (${speedClass} or faster)
          </h3>
          <p class="text-sm text-gray-600">
            Click "Check Price" to compare offers on Amazon. We earn a small commission at no extra cost to you.
          </p>
        </div>

        <!-- Cards Grid -->
         <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
           ${cardHTML}
         </div>
        </div>
    `;
    }

    /**
     * Get and display recommendations for calculator result
     * @param {String} speedClass - Required speed class
     * @param {String} containerId - HTML element ID to inject into
     * @returns {Promise<void>}
     */
    static async displayRecommendations(speedClass, containerId = 'calculator-recommendations') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`[CalculatorCardRecommendations] Container #${containerId} not found`);
            return;
        }

        try {
            console.log(`[CalculatorCardRecommendations] Loading recommendations for ${speedClass}...`);

            // Load all cards
            const allCards = await this.loadCards();

            if (!allCards || allCards.length === 0) {
                console.warn('[CalculatorCardRecommendations] No cards loaded');
                container.innerHTML = `
          <div class="p-4 bg-red-50 rounded-lg text-red-600 text-sm">
            Unable to load card recommendations at this time. Please try <a href="/sd-card-guide/" class="font-bold underline">browsing the SD card guide</a>.
          </div>
        `;
                return;
            }

            // Filter for speed class
            const recommended = this.filterBySpeedClass(allCards, speedClass, 5);

            if (!recommended || recommended.length === 0) {
                console.warn(`[CalculatorCardRecommendations] No cards match ${speedClass}`);
                container.innerHTML = `
          <div class="p-4 bg-yellow-50 rounded-lg text-yellow-600 text-sm">
            No cards matching ${speedClass} found. <a href="/sd-card-guide/" class="font-bold underline">Learn more about speed classes</a>.
          </div>
        `;
                return;
            }

            // Build and inject HTML
            const html = this.buildRecommendationHTML(recommended, speedClass);
            container.innerHTML = html;
            console.log(`[CalculatorCardRecommendations] ✓ Displayed ${recommended.length} recommendations`);

            // Make container visible if hidden
            container.style.display = 'block';
        } catch (error) {
            console.error('[CalculatorCardRecommendations] Error displaying recommendations:', error);
            container.innerHTML = `
        <div class="p-4 bg-red-50 rounded-lg text-red-600 text-sm">
          Failed to load recommendations. <a href="/sd-card-guide/" class="font-bold underline">Learn more about cards</a>.
        </div>
      `;
        }
    }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorCardRecommendations;
}
