/**
 * Promoted Card Section Generator
 * Generates promotional sections for SD cards on device pages
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate promoted card section for device pages
 * @param {Object} deviceData - The device being displayed
 * @param {Array} sdcards - All SD card data
 * @param {boolean} isJapanese - Whether this is a Japanese page
 * @param {Function} getCardImageFallback - Helper function for card images
 * @returns {string} HTML for promoted card section or empty string
 */
function generatePromotedCardSection(deviceData, sdcards, isJapanese = false, getCardImageFallback = null) {
  try {
    const promotedCardsPath = path.join(__dirname, '../../data/promoted-cards.json');
    if (!fs.existsSync(promotedCardsPath)) {
      return '';
    }

    const promotionConfig = JSON.parse(fs.readFileSync(promotedCardsPath, 'utf8'));
    
    // Check if promotions are enabled
    if (!promotionConfig.enabled || !promotionConfig.promotedCards || promotionConfig.promotedCards.length === 0) {
      return '';
    }

    // Find applicable promoted cards for this device
    const applicableCards = promotionConfig.promotedCards.filter(promo => {
      if (!promo.enabled) return false;
      
      // Check display rules
      if (promo.displayOn === 'all') {
        return !promo.excludeFrom?.includes(deviceData.id);
      } else if (promo.displayOn === 'list') {
        return promo.appliesTo?.includes(deviceData.id);
      }
      return false;
    });

    if (applicableCards.length === 0) {
      return '';
    }

    // Generate HTML for promoted cards
    let html = '<div id="promoted-cards" class="promoted-cards-section mb-8 border-2 border-amber-300 bg-amber-50 rounded-lg p-6">\n';
    
    // Add section title
    html += isJapanese 
      ? '  <h3 class="text-lg font-semibold text-slate-900 mb-4">💡 特別推奨</h3>\n'
      : '  <h3 class="text-lg font-semibold text-slate-900 mb-4">💡 Special Recommendation</h3>\n';

    applicableCards.forEach(promo => {
      // Find the actual card data
      const card = sdcards.find(c => c.id === promo.id);
      if (!card) return;

      const baseUrl = card.amazonDirectUrl || card.amazonSearchUrl;
      const amazonUrl = baseUrl.includes('?')
        ? `${baseUrl}&utm_source=sdcardchecker&utm_medium=promotion&utm_campaign=featured`
        : `${baseUrl}?utm_source=sdcardchecker&utm_medium=promotion&utm_campaign=featured`;

      const cardImage = card.imageUrl || (getCardImageFallback ? getCardImageFallback(card) : '/img/cards/placeholder.webp');

      html += `
  <div class="promoted-card-item flex gap-6 items-center">
    <div class="promoted-card-image flex-shrink-0">
      <a href="${amazonUrl}" target="_blank" rel="noopener noreferrer">
        <img src="${cardImage}" alt="${card.name}" class="w-32 h-32 object-cover rounded" loading="lazy" />
      </a>
    </div>
    <div class="promoted-card-content flex-grow">
      <div class="flex items-center gap-2 mb-2">
        <h4 class="text-lg font-bold text-slate-900">${card.name}</h4>
        ${promo.badgeText ? `<span class="badge ${promo.badgeColor || 'bg-blue-600'} text-white text-xs font-semibold px-2 py-1 rounded">${promo.badgeText}</span>` : ''}
      </div>
      <div class="specs-mini text-sm text-slate-600 mb-3">
        <span class="font-semibold">${card.specs.speedClass}</span> • 
        <span>${card.specs.readSpeed}</span> read • 
        <span>${card.specs.writeSpeed}</span> write
      </div>
      <p class="text-sm text-slate-700 mb-3">${card.pros}</p>
      <a href="${amazonUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 btn btn-primary text-sm">
        <i class="fas fa-shopping-cart"></i>
        ${isJapanese ? '価格を確認する' : 'Check Price on Amazon'}
      </a>
    </div>
  </div>`;
    });

    html += '\n</div>\n';
    return html;
  } catch (error) {
    console.warn('Error generating promoted card section:', error.message);
    return '';
  }
}

module.exports = {
  generatePromotedCardSection,
};
