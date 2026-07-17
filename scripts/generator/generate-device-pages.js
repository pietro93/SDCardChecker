/**
 * SD Card Checker - Device Pages Generator
 * Locale-parameterized: pass a locale code ("en", "ja", "de", ...) instead of forking this file per language.
 * See data/locales.json for the locale registry and data/category-slugs.json for category slug/label resolution.
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateFAQSchema, generateBreadcrumbSchema, generateProductSchema, getDeviceImageFallback, getCardImageFallback, generateSpecsHTML, generateFAQHTML, generateRelatedDevices, loadSDCardData, loadSDCardEnrichment, mergeSDCardEnrichment, getCategorySlug, getCategoryLabel, getCategoryIconName, t } = require("./helpers");
const { generateFAQs, mergeFAQs } = require("./generateFAQs");
const { generateAmazonBadgesSection } = require("./amazon-badges-generator");
const { generatePromotedCardSection } = require("./promotion-generator");
const { loadAllCards, generateDeviceCompareWidgetHTML } = require("./generate-compare");
const { getExplanation } = require("../lib/enrichment-loader");
const { extractBrand, getQualifyingBrands, slugify } = require("./generate-category-pages");
const components = require("../../src/templates/components");
const locales = require("../../data/locales.json");

const srcPath = path.join(__dirname, "../../src");

/**
 * Locale-keyed label dictionaries for the small UI strings baked into device-page sections.
 * Locales without an entry fall back to "en". Add a locale key here once its device-page
 * strings are translated - no other code changes needed.
 */
const BRANDS_TABLE_LABELS = {
    en: { confirmed: "Verified", speedClass: "Speed Class", writeSpeed: "Write Speed", pros: "Pros", price: "Price", checkPrice: "Check Price" },
    ja: { confirmed: "動作確認", speedClass: "速度クラス", writeSpeed: "書き込み速度", pros: "長所", price: "価格", checkPrice: "価格確認" },
    de: { confirmed: "Bestätigt", speedClass: "Geschwindigkeitsklasse", writeSpeed: "Schreibgeschwindigkeit", pros: "Vorteile", price: "Preis", checkPrice: "Preis prüfen" },
    fr: { confirmed: "Vérifié", speedClass: "Classe de vitesse", writeSpeed: "Vitesse d'écriture", pros: "Avantages", price: "Prix", checkPrice: "Voir le prix" },
    it: { confirmed: "Verificato", speedClass: "Classe di velocità", writeSpeed: "Velocità di scrittura", pros: "Pro", price: "Prezzo", checkPrice: "Verifica prezzo" },
};

const ENRICHED_CARD_LABELS = {
    en: { whyCard: "Why This Card?", targetUser: "Target User", bestFor: "Best For", compareWith: "Comparison" },
    ja: { whyCard: "なぜこのカード？", targetUser: "ユーザー向け", bestFor: "おすすめ用途", compareWith: "比較情報" },
    de: { whyCard: "Warum diese Karte?", targetUser: "Zielgruppe", bestFor: "Am besten für", compareWith: "Vergleich" },
    fr: { whyCard: "Pourquoi cette carte ?", targetUser: "Public cible", bestFor: "Idéal pour", compareWith: "Comparaison" },
    it: { whyCard: "Perché questa scheda?", targetUser: "Utente target", bestFor: "Ideale per", compareWith: "Confronto" },
};

const REQUIREMENTS_BOX_LABELS = {
    en: { format: "Format", minSpeed: "Minimum Speed", appPerformance: "App Performance", maxCapacity: "Maximum Capacity", write: "write", requiredFor: "Required for OS/Apps", upTo: "Up to", official: "Official", requirements: "SD Card Requirements", why: "Why these requirements?" },
    ja: { format: "タイプ", minSpeed: "最低速度", appPerformance: "アプリパフォーマンス", maxCapacity: "最大容量", write: "書き込み", requiredFor: "OS/アプリに必須", upTo: "まで", official: "公式", requirements: "SD カード要件", why: "なぜこの要件?" },
    de: { format: "Format", minSpeed: "Mindestgeschwindigkeit", appPerformance: "App-Leistung", maxCapacity: "Maximale Kapazität", write: "Schreiben", requiredFor: "Erforderlich für OS/Apps", upTo: "Bis zu", official: "Offizielle", requirements: "SD-Karten-Anforderungen", why: "Warum diese Anforderungen?" },
    fr: { format: "Format", minSpeed: "Vitesse minimale", appPerformance: "Performance des applications", maxCapacity: "Capacité maximale", write: "écriture", requiredFor: "Requis pour OS/Applications", upTo: "Jusqu'à", official: "Officielles", requirements: "Exigences de carte SD", why: "Pourquoi ces exigences ?" },
    it: { format: "Formato", minSpeed: "Velocità minima", appPerformance: "Prestazioni app", maxCapacity: "Capacità massima", write: "scrittura", requiredFor: "Richiesto per OS/App", upTo: "Fino a", official: "Ufficiali", requirements: "Requisiti scheda SD", why: "Perché questi requisiti?" },
};

/**
 * Locale-aware device-page title/meta strings. Locales without an entry fall back to "en".
 * Add a locale key here once its title strings are translated - see Tier 1A finding in
 * LOCALIZATION_TODO.md (hardcoded English titles broke SEO for non-EN locales, including ja).
 */
const DEVICE_TITLE_STRINGS = {
    en: {
        title: (name, sdType) => `Best SD Cards for ${name} | ${sdType} Requirements & Recommendations`,
        ogTitle: (name, sdType) => `${name} ${sdType} Guide | Requirements & Best Cards`,
        twitterTitle: (name) => `${name} SD Card Guide | Best Recommendations`,
        schemaHeadline: (name, sdType) => `${name} ${sdType} Compatibility & Recommendations`,
    },
    ja: {
        title: (name, sdType) => `${name}に最適なSDカード | ${sdType}の要件とおすすめカード`,
        ogTitle: (name, sdType) => `${name} ${sdType}ガイド | 要件とおすすめカード`,
        twitterTitle: (name) => `${name} SDカードガイド | おすすめカード`,
        schemaHeadline: (name, sdType) => `${name} ${sdType}互換性とおすすめカード`,
    },
    de: {
        title: (name, sdType) => `Beste SD-Karten für ${name} | ${sdType}-Anforderungen & Empfehlungen`,
        ogTitle: (name, sdType) => `${name} ${sdType}-Leitfaden | Anforderungen & beste Karten`,
        twitterTitle: (name) => `${name} SD-Karten-Leitfaden | Beste Empfehlungen`,
        schemaHeadline: (name, sdType) => `${name} ${sdType}-Kompatibilität & Empfehlungen`,
    },
    fr: {
        title: (name, sdType) => `Meilleures cartes SD pour ${name} | Exigences ${sdType} & recommandations`,
        ogTitle: (name, sdType) => `Guide ${sdType} pour ${name} | Exigences & meilleures cartes`,
        twitterTitle: (name) => `Guide carte SD pour ${name} | Meilleures recommandations`,
        schemaHeadline: (name, sdType) => `Compatibilité ${sdType} et recommandations pour ${name}`,
    },
    it: {
        title: (name, sdType) => `Migliori schede SD per ${name} | Requisiti ${sdType} e consigli`,
        ogTitle: (name, sdType) => `Guida ${sdType} per ${name} | Requisiti e migliori schede`,
        twitterTitle: (name) => `Guida scheda SD per ${name} | Migliori consigli`,
        schemaHeadline: (name, sdType) => `Compatibilità ${sdType} e consigli per ${name}`,
    },
};

function labelsFor(dictionary, locale) {
    return dictionary[locale] || dictionary.en;
}

/**
 * Get Font Awesome icon for device category
 */
function getCategoryIcon(category) {
    const iconMap = {
        "Action Cameras": "fas fa-video",
        Cameras: "fas fa-camera",
        "Drones": "fas fa-drone",
        "Gaming Handhelds": "fas fa-gamepad",
        "Security Cameras": "fas fa-video",
        "Computing & Tablets": "fas fa-tablet",
    };
    return iconMap[category] || "fas fa-sd-card";
}

/**
 * Map category names to image icon file names (matches data/category-slugs.json's `icon` field)
 */
function getCategoryImageIcon(category) {
    return getCategoryIconName(category);
}

/**
 * Generate varied meta descriptions for better SEO
 */
function generateUniqueMetaDescription(device, brandNames, index) {
    if (device.metaDescription) return device.metaDescription;
    const templates = [
        `Find the perfect SD card for ${device.name}. Recommended: ${device.sdCard.type} ${device.sdCard.minSpeed} or faster. Top brands: ${brandNames}. Shop on Amazon.`,
        `${device.name} best SD card guide. Speed: ${device.sdCard.minSpeed}. Type: ${device.sdCard.type}. Expert reviewed brands.`,
        `${device.category} SD card recommendations. ${device.name} compatible. ${brandNames} or higher. Compare now.`,
        `Best SD card for ${device.name}. Video recording: ${device.whySpecs.substring(0, 30)}... Check Amazon prices.`,
        `${device.name} microSD vs SD card guide. ${device.sdCard.minSpeed} recommended. See top brands.`,
        `Buy the right SD card for ${device.name}. ${device.sdCard.type} ${device.sdCard.minSpeed} required. Shop now.`,
        `${device.name} SD card compatibility guide. ${brandNames} recommended. Compare prices and specs.`,
    ];

    const template = templates[index % templates.length];
    // Ensure description is 140-160 characters
    return template.length > 160 ? template.substring(0, 157) + "..." : template;
}

/**
* Generate brand comparison table rows
*/
function generateBrandsTable(brandReferences, sdcardsMap, deviceSlug, locale = "en") {
    const labels = labelsFor(BRANDS_TABLE_LABELS, locale);
    const isEnglish = locale === "en";

    return brandReferences
        .map((ref) => {
            const brand = sdcardsMap[ref.id];
            if (!brand) {
                console.warn(`Warning: SD card not found: ${ref.id}`);
                return "";
            }

            // Add UTM parameters to Amazon URL (prefer direct product link if available)
            const baseUrl = brand.amazonDirectUrl || brand.amazonSearchUrl || brand.affiliateUrl;
            const utmParams = `utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=${deviceSlug}&utm_content=${brand.tier || 'featured'}`;
            const amazonUrlWithUTM = baseUrl.includes('?')
                ? `${baseUrl}&${utmParams}`
                : `${baseUrl}?${utmParams}`;

            const cardImage = brand.imageUrl || getCardImageFallback(brand);
            const priceTierClass = brand.priceTier ? `price-${brand.priceTier.toLowerCase().replace(/\s+/g, '-')}` : 'price-mid-range';
            const priceTierSymbol = brand.priceTier
                ? (brand.priceTier.toLowerCase().includes('budget') ? '$' : brand.priceTier.toLowerCase().includes('premium') ? '$$$' : '$$')
                : '$$';

            // Convert pros string to bullet list
            const prosList = brand.pros
                .split(',')
                .map(pro => `<li>${pro.trim()}</li>`)
                .join('');
            const prosHtml = `<ul style="margin:0; padding-left:1.25rem; font-size:0.95rem;">${prosList}</ul>`;

            // Verified badge (check if brand is verified - default to true for now)
            const confirmedBadge = `<span class="confirmed-badge" title="${labels.confirmed}"></span>`;

            const reviewLinkHtml = (isEnglish && brand.richDescription)
                ? `<a href="/cards/${brand.id}/" class="table-card-review-link" style="font-size:0.8rem; color:#2563eb; text-decoration:underline;">Full Review</a>`
                : "";

            return `
            <tr>
            <td class="table-card-cell">
            <a href="${amazonUrlWithUTM}" target="_blank" class="table-card-link-wrapper">
            <div class="table-card-image">
            <img src="${cardImage}" alt="${brand.name} ${brand.speed} SD card - ${brand.priceEstimate}USD" width="115" height="115" loading="lazy" />
            </div>
            <div class="table-card-name">${brand.name}</div>
            </a>
            ${reviewLinkHtml}
            </td>
            <td data-label="${labels.confirmed}" class="text-center">${confirmedBadge}</td>
            <td data-label="${labels.speedClass}">${brand.speed}</td>
            <td data-label="${labels.writeSpeed}">${brand.writeSpeed}</td>
            <td data-label="${labels.pros}">${prosHtml}</td>
            <td data-label="${labels.price}" class="price-column">
            <span class="price-badge ${priceTierClass}">
            ${priceTierSymbol}
            </span>
            <a href="${amazonUrlWithUTM}" target="_blank" class="btn-check-price">
              <i class="fas fa-shopping-cart"></i> ${labels.checkPrice}
            </a>
            </td>
            </tr>
`;
        })
        .join("");
}

/**
 * Generate enriched card details section
 * Shows richDescription, useCase, and bestFor for each recommended card
 */
function generateEnrichedCardDetails(brandReferences, sdcardsMap, locale = "en") {
    const labels = labelsFor(ENRICHED_CARD_LABELS, locale);
    const isEnglish = locale === "en";

    return brandReferences
        .slice(0, 3) // Show details for top 3 cards only
        .map((ref) => {
            const card = sdcardsMap[ref.id];
            if (!card || !card.richDescription) {
                return "";
            }

            const bestForList = card.bestFor && card.bestFor.length > 0
                ? card.bestFor.join(", ")
                : "";

            const cardNameHtml = isEnglish
                ? `<a href="/cards/${card.id}/" class="text-slate-900 hover:text-blue-600 hover:underline">${card.name}</a>`
                : card.name;

            return `
            <div class="card-enrichment-detail bg-slate-50 border border-slate-200 rounded-lg p-5 mb-4">
                <h4 class="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <i class="fas fa-star text-amber-500"></i> ${cardNameHtml}
                </h4>

                <div class="space-y-3 text-sm">
                    ${card.richDescription ? `
                    <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                        <p class="text-slate-700 leading-relaxed">${card.richDescription}</p>
                    </div>
                    ` : ""}

                    ${card.useCase ? `
                    <div class="flex gap-3">
                        <span class="font-semibold text-slate-900 flex-shrink-0">${labels.targetUser}:</span>
                        <span class="text-slate-700">${card.useCase}</span>
                    </div>
                    ` : ""}

                    ${bestForList ? `
                    <div class="flex gap-3">
                        <span class="font-semibold text-slate-900 flex-shrink-0">${labels.bestFor}:</span>
                        <span class="text-slate-700">${bestForList}</span>
                    </div>
                    ` : ""}

                    ${card.alternatives ? `
                    <div class="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
                        <p class="text-slate-700 text-xs leading-relaxed">${card.alternatives}</p>
                    </div>
                    ` : ""}
                </div>
            </div>
            `;
        })
        .join("");
}

/**
 * Generate requirements checklist box
 */
function generateRequirementsBox(device, deviceNameShort, locale = "en") {
    // Ensure deviceNameShort is always a string
    const safeDeviceName = deviceNameShort || device.name;
    const { sdCard, whySpecs } = device;
    const labels = labelsFor(REQUIREMENTS_BOX_LABELS, locale);

    const rows = [
        {
            icon: 'fas fa-microchip',
            label: labels.format,
            value: sdCard.type,
            color: 'text-blue-600'
        },
        {
            icon: 'fas fa-tachometer-alt',
            label: labels.minSpeed,
            value: `${sdCard.minSpeed} (${sdCard.minWriteSpeed} ${labels.write})`,
            color: 'text-emerald-600'
        }
    ];

    // Add App Performance row if it exists
    if (sdCard.minAppPerformance) {
        rows.push({
            icon: 'fas fa-cogs',
            label: labels.appPerformance,
            value: `${sdCard.minAppPerformance} (${labels.requiredFor})`,
            color: 'text-amber-600'
        });
    }

    rows.push({
        icon: 'fas fa-database',
        label: labels.maxCapacity,
        value: `${labels.upTo} ${sdCard.maxCapacity}`,
        color: 'text-violet-600'
    });

    const rowsHtml = rows
        .map(row => `
        <li class="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
            <i class="${row.icon} ${row.color} mt-1 flex-shrink-0"></i>
            <div class="flex-1">
                <span class="font-semibold text-slate-900">${row.label}:</span>
                <span class="text-slate-700"> ${row.value}</span>
            </div>
        </li>
        `)
        .join('');

    return `
    <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-bold text-slate-900 mb-4">${labels.official} ${safeDeviceName} ${labels.requirements}</h2>
        <ul class="space-y-0">
            ${rowsHtml}
        </ul>
        <div class="mt-4 text-sm text-slate-600 bg-white p-3 rounded border border-slate-100">
            <strong>${labels.why}</strong> ${whySpecs}
        </div>
    </div>
    `;
}

/**
 * Generate alternatives cards
 */
function generateAlternatives(device, sdcardsMap) {
    // Find first card of each tier
    let recommended, budget, professional;

    for (const ref of device.recommendedBrands) {
        const card = sdcardsMap[ref.id];
        if (!card) continue;

        if (card.tier === "recommended" && !recommended) {
            recommended = card;
        } else if (card.tier === "budget" && !budget) {
            budget = card;
        } else if (card.tier === "professional" && !professional) {
            professional = card;
        }
    }

    let html = "";

    const createCard = (brand, label) => {
        // Add UTM parameters to Amazon URL
        const utmParams = `utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=${device.slug}&utm_content=${brand.tier || 'featured'}`;
        const baseUrl = brand.amazonDirectUrl || brand.amazonSearchUrl || brand.affiliateUrl;
        const amazonUrlWithUTM = baseUrl.includes('?')
            ? `${baseUrl}&${utmParams}`
            : `${baseUrl}?${utmParams}`;

        const cardImage = brand.imageUrl || getCardImageFallback(brand);
        // Use priceSymbol if available (new format), otherwise use numeric estimate
        const priceDisplay = brand.priceSymbol ? `${brand.priceSymbol} (${brand.priceTier})` : `$${brand.priceEstimate}`;

        return `
    <div class="alternative-card card">
    <div class="alternative-label">${label}</div>
    <div class="alternative-image">
    <img src="${cardImage}" alt="${brand.name} ${brand.speed} microSD card - ${label}" width="150" height="150" loading="lazy" />
    </div>
      <div class="alternative-content">
        <div class="alternative-title">${brand.name}</div>
        <div class="alternative-price">${priceDisplay}</div>
        <div class="pros">${brand.pros}</div>
        ${brand.cons ? `<div class="cons">${brand.cons}</div>` : ""}
        <a href="${amazonUrlWithUTM}" target="_blank" class="btn btn-amazon">
          Check on Amazon
        </a>
      </div>
    </div>
  `;
    };

    if (recommended) {
        html += createCard(recommended, "✓ Best Choice");
    }
    if (budget) {
        html += createCard(budget, "Budget Option");
    }
    if (professional) {
        html += createCard(professional, "Professional Option");
    }

    return html;
}

/**
 * Locale-specific "What SD Card Do I Need" first FAQ. English generator text is used as the
 * fallback for locales without a translated entry here.
 */
function generateFirstFAQ(device, locale) {
    const speedRating = device.sdCard.minSpeed;
    if (locale === "ja") {
        return {
            q: `${device.name}にはどのSDカードが必要ですか？`,
            a: `${device.name}には、信頼性の高いパフォーマンスのために<b>${device.sdCard.type}カード（${speedRating}速度評価）</b>が必要です。<b>バランスの取れた選択として${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]}容量をお勧めします</b>。デバイスは最大${device.sdCard.maxCapacity}をサポートしていますが、ほとんどのユーザーは日常使用に${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]}で十分です。<b>SanDisk、Lexar、Kingston、KIOXIA、Samsungなどの信頼できるブランドを選択してください</b>安定したパフォーマンスとデータ損失の防止を確保するために。`
        };
    }
    if (locale === "de") {
        return {
            q: `Welche SD-Karte brauche ich für ${device.name}?`,
            a: `Das ${device.name} benötigt eine <b>${device.sdCard.type}-Karte mit Geschwindigkeitsklasse ${speedRating}</b> für zuverlässige Leistung. <b>Wir empfehlen ${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]} als optimale Kapazität</b>, die Speicherplatz und Preis ausgewogen kombiniert. Das Gerät unterstützt bis zu ${device.sdCard.maxCapacity}, aber für die meisten Nutzer reichen ${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]} im Alltag aus. <b>Wählen Sie immer vertrauenswürdige Marken wie SanDisk, Lexar oder Kingston</b>, um eine gleichbleibende Leistung sicherzustellen und Datenverlust zu vermeiden.`
        };
    }
    return {
        q: `What SD Card Do I Need for ${device.name}?`,
        a: `The ${device.name} requires a <b>${device.sdCard.type} card with ${speedRating} speed rating</b> for reliable performance. <b>We recommend ${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]} capacity as the sweet spot</b> balancing storage capacity with affordability. The device supports up to ${device.sdCard.maxCapacity}, though most users find ${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]} sufficient for daily use. <b>Always choose from trusted brands like SanDisk, Lexar, or Kingston</b> to ensure consistent performance and avoid data loss.`
    };
}

/**
 * Generate single device page
 */
function generateDevicePage(device, template, allDevices, sdcardsMap, deviceIndex = 0, locale = "en", allCards = []) {
    const baseUrl = "https://sdcardchecker.com";
    const dirPrefix = locales[locale] && locales[locale].dir ? `/${locales[locale].dir}` : "";
    const categorySlug = getCategorySlug(device.category);
    const deviceUrlPath = `${dirPrefix}/categories/${categorySlug}/${device.slug}/`;
    const deviceUrl = `${baseUrl}${deviceUrlPath}`;

    // Get brand names from sdcards data for description
    const brandNames = device.recommendedBrands
        .slice(0, 3)
        .map((ref) => {
            const card = sdcardsMap[ref.id];
            return card ? card.name.split(" ")[0] : "Brand";
        })
        .join(", ");

    // Create short device name (remove "Black", "OLED", etc. for cleaner title)
    const deviceNameShort = device.name
        .replace(/\s(Black|White|OLED|Pro|Plus|SE|Max)$/i, "")
        .replace("Hero 13 Black", "Hero 13")
        .replace("Hero 12 Black", "Hero 12");

    const titleStrings = labelsFor(DEVICE_TITLE_STRINGS, locale);
    const title = titleStrings.title(device.name, device.sdCard.type);
    const ogTitle = titleStrings.ogTitle(device.name, device.sdCard.type);
    const twitterTitle = titleStrings.twitterTitle(device.name);
    const schemaHeadline = titleStrings.schemaHeadline(device.name, device.sdCard.type);
    const description = generateUniqueMetaDescription(device, brandNames, deviceIndex);

    let answerText = device.sdCard.type;
    if (device.sdCard.minSpeed !== "No minimum required") {
        answerText += ` (${device.sdCard.minSpeed} or faster)`;
    }

    const requirementsBoxHTML = generateRequirementsBox(device, deviceNameShort, locale);
    const specsHTML = generateSpecsHTML(device, locale === "ja");
    const brandsTableRows = generateBrandsTable(device.recommendedBrands, sdcardsMap, device.slug, locale);
    const enrichedCardDetailsHTML = generateEnrichedCardDetails(device.recommendedBrands, sdcardsMap, locale);
    const alternativesHTML = generateAlternatives(device, sdcardsMap);
    // Compare widget is English-only for v1 (compare.js fetches the English sdcards.json)
    const compareWidgetHTML = locale === "en" ? generateDeviceCompareWidgetHTML(device, allCards) : "";

    // Generate FAQs. Every locale (en/ja/de/fr/it) has a programmatic generator
    // (generateFAQs.js delegates to generateFAQs-{locale}.js) producing the generic
    // 8-question block in that language; per-device custom FAQs from device.faq are
    // merged on top and take priority by matching question text.
    const generatedFAQs = generateFAQs(device, sdcardsMap, locale);
    const finalFAQs = device.faq ? mergeFAQs(device.faq, generatedFAQs, locale) : generatedFAQs;

    const firstFAQ = generateFirstFAQ(device, locale);
    const faqsWithFirstQuestion = [firstFAQ, ...finalFAQs];
    const faqHTML = generateFAQHTML(faqsWithFirstQuestion);

    const relatedDevicesSection = generateRelatedDevices(device, allDevices, locale === "ja");
    const faqSchema = generateFAQSchema(faqsWithFirstQuestion);
    const productSchema = generateProductSchema(device.recommendedBrands, sdcardsMap);
    // Amazon PA-API badges are English/US-marketplace only for now (see JAPANESE_LOCALIZATION_MASTER.md)
    const amazonBadgesSection = locale === "en" ? generateAmazonBadgesSection() : "";

    // Generate promoted card section - convert sdcardsMap object to array
    const sdcardsArray = Object.values(sdcardsMap);
    const promotedCardSection = generatePromotedCardSection(device, sdcardsArray, locale === "ja", getCardImageFallback);

    // Generate Nintendo Branded Cards Grid (for Switch models only, not Switch 2)
    const nintendoDevicesWithGrid = ['nintendo-switch', 'nintendo-switch-oled', 'nintendo-switch-lite'];
    let nintendoBrandedCardsGrid = '';

    if (nintendoDevicesWithGrid.includes(device.id)) {
        const nintendoTemplateFile = locale === "ja" ? "nintendo-branded-cards-grid-ja.html" : "nintendo-branded-cards-grid.html";
        const gridTemplatePath = path.join(srcPath, "templates", "components", nintendoTemplateFile);

        const nintendoGridTemplate = readTemplate(gridTemplatePath);

        // Amazon affiliate URLs for Nintendo-branded cards
        const nintendoAffiliateUrls = {
            'ZELDA': 'https://amazon.com/s?k=SanDisk+Nintendo+Zelda+microSD+Switch&tag=sd-cc-20',
            'GENGAR': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Gengar+microSD+Switch&tag=sd-cc-20',
            'SNORLAX': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Snorlax+microSD+Switch&tag=sd-cc-20',
            'PIKACHU': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Pikachu+microSD+Switch&tag=sd-cc-20',
            'YOSHI': 'https://amazon.com/s?k=SanDisk+Nintendo+Yoshi+microSD+Switch&tag=sd-cc-20',
            'ANIMAL_CROSSING': 'https://amazon.com/s?k=SanDisk+Nintendo+Animal+Crossing+Leaf+microSD+Switch&tag=sd-cc-20',
            'MARIO_MUSHROOM': 'https://amazon.com/s?k=SanDisk+Nintendo+Super+Mario+Mushroom+microSD+Switch&tag=sd-cc-20',
            'MARIO_STAR': 'https://amazon.com/s?k=SanDisk+Nintendo+Super+Mario+Super+Star+microSD+Switch&tag=sd-cc-20',
            'FORTNITE_CUDDLE': 'https://amazon.com/s?k=SanDisk+Nintendo+Fortnite+Cuddle+Team+Leader+microSD+Switch&tag=sd-cc-20',
            'FORTNITE_SKULL': 'https://amazon.com/s?k=SanDisk+Nintendo+Fortnite+Skull+Trooper+microSD+Switch&tag=sd-cc-20'
        };

        nintendoBrandedCardsGrid = nintendoGridTemplate;
        Object.entries(nintendoAffiliateUrls).forEach(([key, url]) => {
            nintendoBrandedCardsGrid = nintendoBrandedCardsGrid.replaceAll(`{{AMAZON_URL_${key}}}`, url);
        });
    }

    // Get category display name (localized label from the category registry)
    const categoryDisplayName = getCategoryLabel(device.category, locale);

    // Subcategory pages (e.g. /categories/drones/dji/) only exist for English brands
    // with at least 3 devices in their category - link up to them when applicable
    let brandCrumb = null;
    if (locale === "en") {
        const brand = extractBrand(device.name);
        const categoryDevices = allDevices.filter((d) => d.category === device.category);
        const qualifies = getQualifyingBrands(categoryDevices).some((b) => b.brand === brand);
        if (qualifies) {
            brandCrumb = { name: brand, url: `/categories/${categorySlug}/${slugify(brand)}/` };
        }
    }

    // Generate breadcrumb schema
    const breadcrumbPath = `${dirPrefix}/categories/${categorySlug}/`;
    const breadcrumbs = [
        { name: t("breadcrumbHome", locale), url: dirPrefix ? `${dirPrefix}/` : "/" },
        { name: categoryDisplayName, url: breadcrumbPath },
        ...(brandCrumb ? [brandCrumb] : []),
        { name: device.name, url: deviceUrlPath }
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

    const brandBreadcrumbHTML = brandCrumb
        ? `<a href="${brandCrumb.url}" class="text-blue-600 hover:underline">${brandCrumb.name}</a>
                <i class="fas fa-chevron-right text-xs"></i>`
        : "";

    const deviceIcon = getCategoryIcon(device.category);
    const categoryImageIcon = getCategoryImageIcon(device.category);

    // Featured device image
    const deviceImage = device.imageUrl || getDeviceImageFallback(device);

    // Try to get enriched explanation, fall back to first sentence of whySpecs
    // (only available in English today - non-English pages fall back to the device's own whySpecs)
    let explanation = locale === "en" ? getExplanation(device.category, device.slug) : null;
    if (!explanation) {
      // Fallback: Extract first sentence from whySpecs
      // Properly match sentence end: period followed by space or end of string (avoids splitting on decimal points like 2.7K)
      const sentenceMatch = device.whySpecs.match(/[^.!?]*[.!?](?:\s|$)/);
      explanation = sentenceMatch ? sentenceMatch[0].trim() : device.whySpecs;
    }

    let html = template
        .replace(/{{DEVICE_TITLE}}/g, title)
        .replace(/{{OG_TITLE}}/g, ogTitle)
        .replace(/{{TWITTER_TITLE}}/g, twitterTitle)
        .replace(/{{SCHEMA_HEADLINE}}/g, schemaHeadline)
        .replace(/{{DEVICE_DESCRIPTION}}/g, description)
        .replace(/{{DEVICE_URL}}/g, deviceUrl)
        .replace(/{{BASE_URL}}/g, baseUrl)
        .replace(/{{DEVICE_NAME}}/g, device.name)
        .replace(/{{DEVICE_NAME_SHORT}}/g, deviceNameShort)
        .replace(/{{DEVICE_ICON}}/g, deviceIcon)
        .replace(/{{CATEGORY_ICON}}/g, categoryImageIcon)
        .replace(/{{CATEGORY_SLUG}}/g, categorySlug)
        .replace(/{{CATEGORY_NAME}}/g, categoryDisplayName)
        .replace(/{{DEVICE_IMAGE}}/g, deviceImage)
        .replace(/{{ANSWER_TEXT}}/g, answerText)
        .replace(/{{ANSWER_EXPLANATION}}/g, explanation)
        .replace(/{{REQUIREMENTS_BOX}}/g, requirementsBoxHTML)
        .replace(/{{SPECS_HTML}}/g, specsHTML)
        .replace(/{{BRANDS_TABLE_ROWS}}/g, brandsTableRows)
        .replace(/{{ENRICHED_CARD_DETAILS}}/g, enrichedCardDetailsHTML)
        .replace(/{{COMPARE_WIDGET}}/g, compareWidgetHTML)
        .replace(/{{ALTERNATIVES_HTML}}/g, alternativesHTML)
        .replace(/{{AMAZON_BADGES_SECTION}}/g, amazonBadgesSection)
        .replace(/{{PROMOTED_CARDS_SECTION}}/g, promotedCardSection)
        .replace(/{{NINTENDO_BRANDED_CARDS_GRID}}/g, nintendoBrandedCardsGrid)
        .replace(/{{FAQ_HTML}}/g, faqHTML)
        .replace(/{{RELATED_DEVICES_SECTION}}/g, relatedDevicesSection)
        .replace(/{{FAQ_SCHEMA}}/g, faqSchema)
        .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
        .replace(/{{BRAND_BREADCRUMB_HTML}}/g, brandBreadcrumbHTML)
        .replace(/{{PRODUCT_SCHEMA}}/g, productSchema)
        .replace(/{{SIDEBAR}}/g, components.generateSidebar(locale))
        .replace(/{{HEADER}}/g, components.generateHeader(locale))
        .replace(/{{FOOTER}}/g, components.generateFooter(locale))
        .replace(/{{GROW_SCRIPT}}/g, components.generateGrowScript())
        .replace(/{{AFFILIATE_DISCLOSURE}}/g, components.generateAffiliateDisclosure(locale, true));

    return html;
}

/**
 * Generate all device pages for a locale
 */
async function generateDevicePages(allDevices, distPath, locale = "en") {
    console.log(`Generating ${locale} device pages...`);

    const localizedTemplates = new Set(["ja", "de", "fr", "it"]);
    const templateFile = localizedTemplates.has(locale) ? `device-${locale}.html` : "device.html";
    let deviceTemplate = readTemplate(
        path.join(srcPath, "templates", templateFile)
    );
    // Process {% include %} tags
    deviceTemplate = processIncludes(deviceTemplate, path.join(srcPath, "templates"));

    const sdcardsMap = loadSDCardData(locale);
    const allCards = locale === "en" ? loadAllCards() : [];

    // Load and merge enrichment data (richDescription, useCase, bestFor, alternatives) - English only
    if (locale === "en") {
        const enrichmentData = loadSDCardEnrichment();
        if (Object.keys(enrichmentData).length > 0) {
            mergeSDCardEnrichment(sdcardsMap, enrichmentData);
            console.log(`  ✓ Loaded enrichment data for ${Object.keys(enrichmentData).length} SD cards`);
        }
    }

    let successCount = 0;
    let failedDevices = [];

    allDevices.forEach((device, index) => {
        try {
            const deviceHTML = generateDevicePage(device, deviceTemplate, allDevices, sdcardsMap, index, locale, allCards);
            const categorySlug = getCategorySlug(device.category);
            const dirPrefix = locales[locale] && locales[locale].dir ? locales[locale].dir : "";
            const devicePath = path.join(distPath, dirPrefix, "categories", categorySlug, device.slug, "index.html");
            writeFile(devicePath, deviceHTML);
            successCount++;
        } catch (error) {
            console.warn(`  Failed to generate ${device.slug}: ${error.message}`);
            failedDevices.push(device.slug);
        }
    });

    console.log(`  ✓ Generated ${successCount}/${allDevices.length} ${locale} device pages`);
    if (failedDevices.length > 0) {
        console.warn(`  ${failedDevices.length} devices failed: ${failedDevices.join(', ')}`);
    }
}

module.exports = { generateDevicePages };
