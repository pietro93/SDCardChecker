/**
 * Calculator-Specific Card Recommendations
 * Generates inline card recommendations for calculator results
 * Similar to device pages but formatted for results display
 * Version 1.0
 */

class CalculatorCardRecommendations {
    /**
      * Load enrichment data for cards
      * @returns {Promise<Object>} Enrichment data keyed by card ID
      */
    static async loadEnrichment() {
        try {
            const response = await fetch('/data/sdcard-enrichment.json');
            return await response.json();
        } catch (error) {
            console.warn('Failed to load enrichment data:', error);
            return {};
        }
    }

    /**
      * Get smart fallback image for card based on type and speed class
      * Uses UHS level and type to determine appropriate placeholder
      * First checks if card has a specific image, then falls back to type/speed-based placeholders
      * @param {Object} card - Card object
      * @returns {String} Fallback image URL
      */
    static getCardImageFallback(card) {
        // Check if card has a valid image URL that should exist
        if (card.imageUrl && card.imageUrl.includes('/img/cards/')) {
            return card.imageUrl;
        }
        
        const cardNameLower = (card.name || '').toLowerCase();
        const isMicroSD = card.type && card.type.toLowerCase().includes('microsd');
        const uhs = card.uhs ? card.uhs.toUpperCase() : '';
        
        // Type-specific placeholders for specialty formats
        if (card.type === 'CFast') {
            return '/img/cards/cfast-generic.webp';
        }
        if (card.type === 'XQD') {
            return '/img/cards/xqd-generic.webp';
        }
        
        // Brand-specific fallbacks (matching helpers.js logic)
        // SanDisk brand fallbacks
        if (cardNameLower.includes('sandisk')) {
            if (cardNameLower.includes('extreme') && cardNameLower.includes('pro')) {
                return '/img/cards/sandisk-extreme-pro-sd-uhs-ii.webp';
            }
            if (cardNameLower.includes('extreme')) {
                return '/img/cards/sandisk-extreme-microsd.webp';
            }
            if (cardNameLower.includes('max endurance')) {
                return '/img/cards/sandisk-max-endurance-microsd.webp';
            }
            if (cardNameLower.includes('ultra')) {
                return '/img/cards/sandisk-ultra-microsd.webp';
            }
            // Generic SanDisk fallback
            return '/img/cards/sandisk-extreme-pro-sd-uhs-ii.webp';
        }
        
        // Lexar brand fallbacks
        if (cardNameLower.includes('lexar')) {
            if (cardNameLower.includes('silver')) {
                return '/img/cards/lexar-professional-silver-sd-uhs-ii.webp';
            }
            if (cardNameLower.includes('633x')) {
                return '/img/cards/lexar-professional-633x.webp';
            }
            if (cardNameLower.includes('1000x') || cardNameLower.includes('1800x') || cardNameLower.includes('gold')) {
                return '/img/cards/lexar-professional-1000x.webp';
            }
            if (cardNameLower.includes('play')) {
                return '/img/cards/lexar-professional-1000x.webp';
            }
            // Generic Lexar fallback
            return '/img/cards/lexar-professional-1000x.webp';
        }
        
        // Kingston brand fallbacks
        if (cardNameLower.includes('kingston')) {
            if (cardNameLower.includes('canvas')) {
                if (cardNameLower.includes('go')) {
                    return '/img/cards/kingston-canvas-go-plus.webp';
                }
                if (cardNameLower.includes('select')) {
                    return '/img/cards/kingston-canvas-select-microsd.webp';
                }
                if (cardNameLower.includes('react')) {
                    return '/img/cards/kingston-canvas-react-sd.webp';
                }
            }
            return '/img/cards/kingston-canvas-go-plus.webp';
        }
        
        // Samsung brand fallbacks
        if (cardNameLower.includes('samsung')) {
            if (cardNameLower.includes('pro')) {
                return '/img/cards/samsung-pro-endurance-microsd.webp';
            }
            if (cardNameLower.includes('evo')) {
                return '/img/cards/samsung-evo-select-microsd.webp';
            }
            return '/img/cards/samsung-evo-select-microsd.webp';
        }
        
        // Sony brand fallbacks
        if (cardNameLower.includes('sony')) {
            return '/img/cards/sony-tough-g-v90.webp';
        }
        
        // ADATA brand fallbacks
        if (cardNameLower.includes('adata')) {
            return '/img/cards/adata-premier-microsd.webp';
        }
        
        // Transcend brand fallbacks
        if (cardNameLower.includes('transcend')) {
            return '/img/cards/transcend-microsd.webp';
        }
        
        // Type/UHS-based fallbacks (lowest priority)
        // UHS-II cards
        if (uhs.includes('UHS-II')) {
            return isMicroSD ? '/img/cards/micro-uhs2-generic.webp' : '/img/cards/uhs2-generic.webp';
        }
        
        // UHS-I cards
        if (uhs.includes('UHS-I')) {
            return isMicroSD ? '/img/cards/micro-uhs1-generic.webp' : '/img/cards/uhs1-generic.webp';
        }

        // Default fallback for any other card type
        return '/img/cards/placeholder.webp';
    }

    /**
     * Load cards from JSON
     * Automatically detects page language and loads appropriate data file
     * @returns {Promise<Array>} Cards array
     */
    static async loadCards() {
        try {
            // Detect page language from html lang attribute
            const htmlLang = document.documentElement.lang || 'en';
            const dataFile = htmlLang === 'ja' ? '/data/sdcards-ja.json' : '/data/sdcards.json';
            
            const response = await fetch(dataFile);
            const data = await response.json();
            return data.sdcards || [];
        } catch (error) {
            console.error('Failed to load cards:', error);
            return [];
        }
    }

    /**
     * Filter cards by speed class
     * UPDATED: Handles both nested specs and flat format
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
            // Support both old flat format and new nested spec format
            const speed = card.specs ? card.specs.speedClass : card.speed;
            const cardRank = speedClassOrder[speed] || 0;
            return cardRank >= requiredRank;
        });

        // Sort by: speed class (ascending), then price
        filtered.sort((a, b) => {
            // Support both formats
            const speedA = a.specs ? a.specs.speedClass : a.speed;
            const speedB = b.specs ? b.specs.speedClass : b.speed;
            const rankA = speedClassOrder[speedA] || 0;
            const rankB = speedClassOrder[speedB] || 0;

            if (rankA !== rankB) {
                return rankA - rankB;
            }

            return (a.priceEstimate || 0) - (b.priceEstimate || 0);
        });

        return filtered.slice(0, limit);
    }

    /**
     * Format single card for calculator results display
     * UPDATED: Handles both new nested specs format and old flat format
     * @param {Object} card - Card from sdcards.json
     * @param {String} calculatorType - Type of calculator (video-storage, photo-storage, etc.)
     * @returns {Object} Formatted card
     */
    static formatCard(card, calculatorType = 'calculator') {
        // Handle nested specs if they exist (New Series Format)
        const specs = card.specs || {};
        const speed = specs.speedClass || card.speed;
        const writeSpeed = specs.writeSpeed || card.writeSpeed;
        const capacity = card.availableCapacities 
            ? `${Math.min(...card.availableCapacities)}GB - ${Math.max(...card.availableCapacities)}GB`
            : (card.capacity || 'Var.');
        
        const priceTierClass = card.priceTier
            ? `price-${card.priceTier.toLowerCase().replace(/\s+/g, '-')}`
            : 'price-mid-range';

        // Use priceSymbol from JSON if available, otherwise generate from priceTier
        const priceTierSymbol = card.priceSymbol || (
            card.priceTier && card.priceTier.toLowerCase().includes('budget') ? '$' 
            : card.priceTier && card.priceTier.toLowerCase().includes('premium') ? '$$$' 
            : '$$'
        );

        // Add UTM parameters to Amazon URL
        const utmParams = `utm_source=sdcardchecker&utm_medium=tool-page&utm_campaign=${calculatorType}&utm_content=${card.tier || 'featured'}`;
        const amazonUrlWithUTM = card.amazonSearchUrl.includes('?') 
            ? `${card.amazonSearchUrl}&${utmParams}`
            : `${card.amazonSearchUrl}?${utmParams}`;

        return {
            id: card.id,
            name: card.name,
            speed: speed,
            writeSpeed: writeSpeed,
            capacity: capacity,
            imageUrl: card.imageUrl || this.getCardImageFallback(card),
            amazonUrl: amazonUrlWithUTM,
            priceTier: card.priceTier || 'Standard',
            priceTierClass: priceTierClass,
            priceTierSymbol: priceTierSymbol,
            priceEstimate: 'Check Amazon',
            pros: card.pros,
            tier: card.tier || 'standard'
        };
    }

    /**
     * Build HTML grid of recommendation cards
     * @param {Array} cards - Filtered cards
     * @param {String} speedClass - Speed class for reference
     * @param {String} calculatorType - Type of calculator (video-storage, photo-storage, etc.)
     * @param {Object} enrichmentMap - Enrichment data keyed by card ID
     * @returns {String} HTML markup
     */
    static buildRecommendationHTML(cards, speedClass, calculatorType = 'calculator', enrichmentMap = {}) {
        if (!cards || cards.length === 0) {
            return `
        <div class="p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
          No matching cards found. Adjust your speed class filter and try again.
        </div>
      `;
        }

        const cardHTML = cards
            .map(card => {
                const formatted = this.formatCard(card, calculatorType);
                // Get fallback image URL for this card
                const fallbackUrl = this.getCardImageFallback(card);
                
                // Get enrichment data if available
                const enrichment = enrichmentMap[card.id] || {};
                const useCase = enrichment.useCase || 'Professional recording';
                const bestForList = (enrichment.bestFor || []).slice(0, 2).join(', ');
                
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

              <!-- Enrichment: Use Case & Best For -->
              ${enrichment.useCase ? `
              <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs">
                <div class="font-semibold text-gray-900 mb-1">Best for:</div>
                <div class="text-gray-700">${bestForList || useCase}</div>
              </div>
              ` : ''}

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
     * @param {String} calculatorType - Type of calculator (video-storage, photo-storage, etc.)
     * @returns {Promise<void>}
     */
    static async displayRecommendations(speedClass, containerId = 'calculator-recommendations', calculatorType = 'calculator') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`[CalculatorCardRecommendations] Container #${containerId} not found`);
            return;
        }

        try {
            console.log(`[CalculatorCardRecommendations] Loading recommendations for ${speedClass}...`);

            // Load all cards and enrichment data in parallel
            const [allCards, enrichmentMap] = await Promise.all([
                this.loadCards(),
                this.loadEnrichment()
            ]);

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

            // Build and inject HTML with enrichment data
            const html = this.buildRecommendationHTML(recommended, speedClass, calculatorType, enrichmentMap);
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
