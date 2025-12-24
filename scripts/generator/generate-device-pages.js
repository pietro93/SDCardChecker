/**
 * SD Card Checker - Device Pages Generator
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateFAQSchema, generateBreadcrumbSchema, generateProductSchema, getDeviceImageFallback, getCardImageFallback, generateSpecsHTML, generateFAQHTML, generateRelatedDevices, loadSDCardData } = require("./helpers");
const { generateFAQs, mergeFAQs } = require("./generateFAQs");
const { generateAmazonBadgesSection } = require("./amazon-badges-generator");

const srcPath = path.join(__dirname, "../../src");

/**
 * Translation strings for category names
 */
const CATEGORY_TRANSLATIONS = {
  "Cameras": "カメラ",
  "Action Cameras": "アクションカメラ",
  "Drones": "ドローン",
  "Gaming Handhelds": "携帯ゲーム機",
  "Computing & Tablets": "コンピュータ・タブレット",
  "Dash Cams": "ドライブレコーダー",
  "Security Cameras": "セキュリティカメラ",
  "Trail Cameras": "トレイルカメラ",
  "Accessories": "アクセサリー",
  "SD Card Readers": "SDカードリーダー"
};

/**
 * Get component helpers based on language
 */
function getComponentHelpers(isJapanese = false) {
  if (isJapanese) {
    return require("../../src/templates/components-ja");
  }
  return require("../../src/templates/components");
}

/**
 * Get category slug for URL (always English)
 */
function getCategorySlug(category) {
  return category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

/**
 * Get category display name (English or Japanese)
 */
function getCategoryDisplayName(category, isJapanese = false) {
  if (!isJapanese) {
    return category;
  }
  return CATEGORY_TRANSLATIONS[category] || category;
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
 * Map category names to image icon file names
 */
function getCategoryImageIcon(category) {
  const iconMap = {
    "Cameras": "camera",
    "Action Cameras": "action-camera",
    "Drones": "drone",
    "Gaming Handhelds": "gaming",
    "Computing & Tablets": "computing",
    "Security Cameras": "security-camera"
  };
  return iconMap[category] || "camera"; // Default fallback
}

/**
 * Generate varied meta descriptions for better SEO
 */
function generateUniqueMetaDescription(device, brandNames, index) {
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
function generateBrandsTable(brandReferences, sdcardsMap, deviceSlug) {
    return brandReferences
        .map((ref) => {
            const brand = sdcardsMap[ref.id];
            if (!brand) {
                console.warn(`Warning: SD card not found: ${ref.id}`);
                return "";
            }
            
            // Add UTM parameters to Amazon URL
            const utmParams = `utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=${deviceSlug}&utm_content=${brand.tier || 'featured'}`;
            const amazonUrlWithUTM = brand.amazonSearchUrl.includes('?') 
                ? `${brand.amazonSearchUrl}&${utmParams}`
                : `${brand.amazonSearchUrl}?${utmParams}`;
            
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
            
            return `
            <tr>
            <td class="table-card-cell">
            <a href="${amazonUrlWithUTM}" target="_blank" class="table-card-link-wrapper">
            <div class="table-card-image">
            <img src="${cardImage}" alt="${brand.name} ${brand.speed} SD card - ${brand.priceEstimate}USD" width="115" height="115" loading="lazy" />
            </div>
            <div class="table-card-name">${brand.name}</div>
            </a>
            </td>
            <td data-label="Speed Class">${brand.speed}</td>
            <td data-label="Write Speed">${brand.writeSpeed}</td>
            <td data-label="Pros">${prosHtml}</td>
            <td data-label="Price" class="price-column">
            <span class="price-badge ${priceTierClass}">
            ${priceTierSymbol}
            </span>
            <a href="${amazonUrlWithUTM}" target="_blank" class="btn-check-price">
              <i class="fas fa-shopping-cart"></i> Check Price
            </a>
            </td>
            </tr>
`;
        })
        .join("");
}

/**
 * Generate requirements checklist box
 */
function generateRequirementsBox(device, deviceNameShort) {
    // Ensure deviceNameShort is always a string
    const safeDeviceName = deviceNameShort || device.name;
    const { sdCard, whySpecs } = device;
    
    const rows = [
        {
            icon: 'fas fa-microchip',
            label: 'Format',
            value: sdCard.type,
            color: 'text-blue-600'
        },
        {
            icon: 'fas fa-tachometer-alt',
            label: 'Minimum Speed',
            value: `${sdCard.minSpeed} (${sdCard.minWriteSpeed} write)`,
            color: 'text-emerald-600'
        }
    ];

    // Add App Performance row if it exists
    if (sdCard.minAppPerformance) {
        rows.push({
            icon: 'fas fa-cogs',
            label: 'App Performance',
            value: `${sdCard.minAppPerformance} (Required for OS/Apps)`,
            color: 'text-amber-600'
        });
    }

    rows.push({
        icon: 'fas fa-database',
        label: 'Maximum Capacity',
        value: `Up to ${sdCard.maxCapacity}`,
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
        <h2 class="text-lg font-bold text-slate-900 mb-4">Official ${safeDeviceName} SD Card Requirements</h2>
        <ul class="space-y-0">
            ${rowsHtml}
        </ul>
        <div class="mt-4 text-sm text-slate-600 bg-white p-3 rounded border border-slate-100">
            <strong>Why these requirements?</strong> ${whySpecs}
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
    const amazonUrlWithUTM = brand.amazonSearchUrl.includes('?') 
        ? `${brand.amazonSearchUrl}&${utmParams}`
        : `${brand.amazonSearchUrl}?${utmParams}`;
    
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
        html += createCard(budget, "💰 Budget Option");
    }
    if (professional) {
        html += createCard(professional, "⚡ Professional Option");
    }

    return html;
}

/**
 * Generate single device page
 */
function generateDevicePage(device, template, allDevices, sdcardsMap, deviceIndex = 0, isJapanese = false) {
     const baseUrl = "https://sdcardchecker.com";
     const categorySlug = getCategorySlug(device.category);
     const deviceUrlPath = isJapanese ? `/ja/categories/${categorySlug}/${device.slug}/` : `/categories/${categorySlug}/${device.slug}/`;
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

    const title = `Best SD Cards for ${device.name} | ${device.sdCard.type} Requirements & Recommendations`;
    const ogTitle = `${device.name} ${device.sdCard.type} Guide | Requirements & Best Cards`;
    const twitterTitle = `${device.name} SD Card Guide | Best Recommendations`;
    const schemaHeadline = `${device.name} ${device.sdCard.type} Compatibility & Recommendations`;
    const description = generateUniqueMetaDescription(device, brandNames, deviceIndex);

    let answerText = device.sdCard.type;
    if (device.sdCard.minSpeed !== "No minimum required") {
        answerText += ` (${device.sdCard.minSpeed} or faster)`;
    }

    const requirementsBoxHTML = generateRequirementsBox(device, deviceNameShort);
    const specsHTML = generateSpecsHTML(device);
    const brandsTableRows = generateBrandsTable(device.recommendedBrands, sdcardsMap, device.slug);
    const alternativesHTML = generateAlternatives(device, sdcardsMap);

    // Generate FAQs: use custom FAQs from data, or generate programmatically
    const generatedFAQs = generateFAQs(device, sdcardsMap);
    const finalFAQs = device.faq ? mergeFAQs(device.faq, generatedFAQs) : generatedFAQs;

    // Add "What SD Card Do I Need" question as first FAQ using generated answer
    const speedRating = device.sdCard.minSpeed === 'No minimum required'
        ? device.sdCard.minSpeed.toLowerCase()
        : device.sdCard.minSpeed;
    const firstFAQ = {
        q: `What SD Card Do I Need for ${device.name}?`,
        a: `The ${device.name} requires a <b>${device.sdCard.type} card with ${speedRating} speed rating</b> for reliable performance. <b>We recommend ${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]} capacity as the sweet spot</b> balancing storage capacity with affordability. The device supports up to ${device.sdCard.maxCapacity}, though most users find ${device.sdCard.recommendedCapacity[device.sdCard.recommendedCapacity.length - 1]} sufficient for daily use. <b>Always choose from trusted brands like SanDisk, Lexar, or Kingston</b> to ensure consistent performance and avoid data loss.`
    };
    const faqsWithFirstQuestion = [firstFAQ, ...finalFAQs];
    const faqHTML = generateFAQHTML(faqsWithFirstQuestion);

    const relatedDevicesSection = generateRelatedDevices(device, allDevices);
    const faqSchema = generateFAQSchema(faqsWithFirstQuestion);
    const productSchema = generateProductSchema(device.recommendedBrands, sdcardsMap);
    const amazonBadgesSection = generateAmazonBadgesSection();
    
    // Get component helpers based on language
    const components = getComponentHelpers(isJapanese);
    
    // Get category display name (English or translated)
    const categoryDisplayName = getCategoryDisplayName(device.category, isJapanese);
    
    // Generate breadcrumb schema
    const breadcrumbPath = isJapanese ? `/ja/categories/${categorySlug}/` : `/categories/${categorySlug}/`;
    const breadcrumbs = [
      { name: isJapanese ? "ホーム" : "Home", url: isJapanese ? "/ja/" : "/" },
      { name: categoryDisplayName, url: breadcrumbPath },
      { name: device.name, url: deviceUrlPath }
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

    const deviceIcon = getCategoryIcon(device.category);
    const categoryImageIcon = getCategoryImageIcon(device.category);

    // Featured device image
    const deviceImage = device.imageUrl || getDeviceImageFallback(device);

    // Extract first sentence from whySpecs for the answer explanation
     // Properly match sentence end: period followed by space or end of string (avoids splitting on decimal points like 2.7K)
     const sentenceMatch = device.whySpecs.match(/[^.!?]*[.!?](?:\s|$)/);
     const whySpecsFirstSentence = sentenceMatch ? sentenceMatch[0].trim() : device.whySpecs;
    
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
        .replace(/{{ANSWER_EXPLANATION}}/g, whySpecsFirstSentence)
        .replace(/{{REQUIREMENTS_BOX}}/g, requirementsBoxHTML)
        .replace(/{{SPECS_HTML}}/g, specsHTML)
        .replace(/{{BRANDS_TABLE_ROWS}}/g, brandsTableRows)
        .replace(/{{ALTERNATIVES_HTML}}/g, alternativesHTML)
        .replace(/{{AMAZON_BADGES_SECTION}}/g, amazonBadgesSection)
        .replace(/{{FAQ_HTML}}/g, faqHTML)
        .replace(/{{RELATED_DEVICES_SECTION}}/g, relatedDevicesSection)
        .replace(/{{FAQ_SCHEMA}}/g, faqSchema)
        .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
        .replace(/{{PRODUCT_SCHEMA}}/g, productSchema)
        .replace(/{{SIDEBAR}}/g, components.generateSidebar())
        .replace(/{{HEADER}}/g, components.generateHeader())
        .replace(/{{FOOTER}}/g, components.generateFooter())
        .replace(/{{GROW_SCRIPT}}/g, components.generateGrowScript())
        .replace(/{{AFFILIATE_DISCLOSURE}}/g, components.generateAffiliateDisclosure(true));

    return html;
}

/**
 * Generate all device pages
 */
async function generateDevicePages(allDevices, distPath, isJapanese = false) {
     const lang = isJapanese ? "Japanese" : "";
     console.log(`📄 Generating ${lang} device pages...`);

     const templateFile = isJapanese ? "device-ja.html" : "device.html";
     let deviceTemplate = readTemplate(
         path.join(srcPath, "templates", templateFile)
     );
     // Process {% include %} tags
     deviceTemplate = processIncludes(deviceTemplate, path.join(srcPath, "templates"));
     
     const sdcardsMap = loadSDCardData();

     let successCount = 0;
     let failedDevices = [];

     allDevices.forEach((device, index) => {
         try {
             const deviceHTML = generateDevicePage(device, deviceTemplate, allDevices, sdcardsMap, index, isJapanese);
             const categorySlug = getCategorySlug(device.category);
             const baseDir = isJapanese ? "ja" : "";
             const devicePath = path.join(distPath, baseDir, "categories", categorySlug, device.slug, "index.html");
             writeFile(devicePath, deviceHTML);
             successCount++;
         } catch (error) {
             console.warn(`  ⚠️  Failed to generate ${device.slug}: ${error.message}`);
             failedDevices.push(device.slug);
         }
     });

     console.log(`  ✓ Generated ${successCount}/${allDevices.length} ${lang} device pages`);
     if (failedDevices.length > 0) {
         console.warn(`  ⚠️  ${failedDevices.length} devices failed: ${failedDevices.join(', ')}`);
     }
}

module.exports = { generateDevicePages };
