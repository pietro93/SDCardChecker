/**
 * SD Card Checker - Device Pages Generator
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateFAQSchema, generateBreadcrumbSchema, generateProductSchema, getDeviceImageFallback, getCardImageFallback, generateSpecsHTML, generateFAQHTML, generateRelatedDevices } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");
const { generateFAQs, mergeFAQs } = require("./generateFAQs");

const srcPath = path.join(__dirname, "../../src");

/**
 * Load SD card data from sdcards.json
 */
function loadSDCardData() {
    const sdcardsPath = path.join(__dirname, "../../data/sdcards.json");
    const data = JSON.parse(fs.readFileSync(sdcardsPath, "utf8"));
    const cardMap = {};
    data.sdcards.forEach(card => {
        cardMap[card.id] = card;
    });
    return cardMap;
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
function generateBrandsTable(brandReferences, sdcardsMap) {
    return brandReferences
        .map((ref) => {
            const brand = sdcardsMap[ref.id];
            if (!brand) {
                console.warn(`Warning: SD card not found: ${ref.id}`);
                return "";
            }
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
            <a href="${brand.amazonSearchUrl}" target="_blank" class="table-card-link-wrapper">
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
            <a href="${brand.amazonSearchUrl}" target="_blank" class="btn-check-price">
              <i class="fas fa-shopping-cart"></i> Check Price
            </a>
            </td>
            </tr>
`;
        })
        .join("");
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
    const cardImage = brand.imageUrl || getCardImageFallback(brand);
    return `
    <div class="alternative-card card">
    <div class="alternative-label">${label}</div>
    <div class="alternative-image">
    <img src="${cardImage}" alt="${brand.name} ${brand.speed} microSD card - ${label}" width="150" height="150" loading="lazy" />
    </div>
      <div class="alternative-content">
        <div class="alternative-title">${brand.name}</div>
        <div class="alternative-price">$${brand.priceEstimate}</div>
        <div class="pros">${brand.pros}</div>
        ${brand.cons ? `<div class="cons">${brand.cons}</div>` : ""}
        <a href="${brand.amazonSearchUrl}" target="_blank" class="btn btn-amazon">
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
function generateDevicePage(device, template, allDevices, sdcardsMap, deviceIndex = 0) {
    const baseUrl = "https://sdcardchecker.com";
    const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    const deviceUrl = `${baseUrl}/categories/${categorySlug}/${device.slug}/`;

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

    const specsHTML = generateSpecsHTML(device);
    const brandsTableRows = generateBrandsTable(device.recommendedBrands, sdcardsMap);
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
    
    // Generate breadcrumb schema
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: device.category, url: `/categories/${categorySlug}/` },
      { name: device.name, url: `/categories/${categorySlug}/${device.slug}/` }
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

    const deviceIcon = getCategoryIcon(device.category);
    const categoryImageIcon = getCategoryImageIcon(device.category);

    // Featured device image
    const deviceImage = device.imageUrl || getDeviceImageFallback(device);

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
        .replace(/{{CATEGORY_NAME}}/g, device.category)
        .replace(/{{DEVICE_IMAGE}}/g, deviceImage)
        .replace(/{{ANSWER_TEXT}}/g, answerText)
        .replace(/{{ANSWER_EXPLANATION}}/g, device.whySpecs)
        .replace(/{{SPECS_HTML}}/g, specsHTML)
        .replace(/{{BRANDS_TABLE_ROWS}}/g, brandsTableRows)
        .replace(/{{ALTERNATIVES_HTML}}/g, alternativesHTML)
        .replace(/{{FAQ_HTML}}/g, faqHTML)
        .replace(/{{RELATED_DEVICES_SECTION}}/g, relatedDevicesSection)
        .replace(/{{FAQ_SCHEMA}}/g, faqSchema)
        .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
        .replace(/{{PRODUCT_SCHEMA}}/g, productSchema)
        .replace(/{{SIDEBAR}}/g, generateSidebar())
        .replace(/{{HEADER}}/g, generateHeader())
        .replace(/{{FOOTER}}/g, generateFooter())
        .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
        .replace(/{{AFFILIATE_DISCLOSURE}}/g, generateAffiliateDisclosure(true));

    return html;
}

/**
 * Generate all device pages
 */
async function generateDevicePages(allDevices, distPath) {
    console.log("📄 Generating device pages...");

    let deviceTemplate = readTemplate(
        path.join(srcPath, "templates/device.html")
    );
    // Process {% include %} tags
    deviceTemplate = processIncludes(deviceTemplate, path.join(srcPath, "templates"));
    
    const sdcardsMap = loadSDCardData();

    let successCount = 0;
    let failedDevices = [];

    allDevices.forEach((device, index) => {
        try {
            const deviceHTML = generateDevicePage(device, deviceTemplate, allDevices, sdcardsMap, index);
            const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
            const devicePath = path.join(distPath, "categories", categorySlug, device.slug, "index.html");
            writeFile(devicePath, deviceHTML);
            successCount++;
        } catch (error) {
            console.warn(`  ⚠️  Failed to generate ${device.slug}: ${error.message}`);
            failedDevices.push(device.slug);
        }
    });

    console.log(`  ✓ Generated ${successCount}/${allDevices.length} device pages`);
    if (failedDevices.length > 0) {
        console.warn(`  ⚠️  ${failedDevices.length} devices failed: ${failedDevices.join(', ')}`);
    }
}

module.exports = { generateDevicePages };
