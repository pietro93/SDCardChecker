/**
 * SD Card Checker - Reader Pages Generator
 * Generates product review pages for SD card readers from sdCardReaders.json
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateFAQSchema, generateBreadcrumbSchema, readJSON, ensureDir } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");
const distPath = path.join(__dirname, "../../dist");

/**
 * Generate varied meta descriptions for readers
 */
function generateReaderMetaDescription(reader, index) {
    const templates = [
        `${reader.name} review. Specs: ${reader.maxSpeed}, ${reader.interface.join("/")}. Compare prices and buy on Amazon.`,
        `${reader.brand} ${reader.model} review. Best for ${reader.targetAudience.join(", ")}. Compare SD card readers.`,
        `${reader.name}: ${reader.pros.substring(0, 40)}... Read the full review and see prices on Amazon.`,
        `Is the ${reader.name} worth it? Full specs, pros/cons, and compatibility guide. Check Amazon.`,
        `${reader.name} vs competitors. ${reader.maxSpeed} speed, ${reader.interface.join("/")}. See all features.`,
    ];
    
    const template = templates[index % templates.length];
    return template.length > 160 ? template.substring(0, 157) + "..." : template;
}

/**
 * Generate HTML for reader pros
 */
function generateProsHTML(reader) {
    return `<li class="flex gap-3"><span class="text-green-600">✓</span><span>${reader.pros}</span></li>`;
}

/**
 * Generate HTML for reader cons
 */
function generateConsHTML(reader) {
    return `<li class="flex gap-3"><span class="text-red-600">✗</span><span>${reader.cons}</span></li>`;
}

/**
 * Generate specifications table rows
 */
function generateSpecsTableHTML(reader) {
    const specs = [
        { label: "Brand", value: reader.brand },
        { label: "Model", value: reader.model },
        { label: "Type", value: reader.type },
        { label: "Interface", value: reader.interface.join(", ") },
        { label: "Supported Slots", value: reader.supportedSlots.join(", ") },
        { label: "Max Speed", value: reader.maxSpeed },
        { label: "Transfer Rate", value: reader.transferRate },
        { label: "Price Tier", value: reader.priceTier },
    ];

    return specs
        .map(spec => `
            <tr class="specs-table-row">
                <td class="specs-label">${spec.label}</td>
                <td class="specs-value">${spec.value}</td>
            </tr>
        `)
        .join("");
}

/**
 * Generate features list HTML
 */
function generateFeaturesHTML(reader) {
    return reader.features
        .map(feature => `<li class="flex gap-2"><span class="text-blue-600">•</span><span>${feature}</span></li>`)
        .join("");
}

/**
 * Generate compatibility HTML
 */
function generateCompatibilityHTML(reader) {
    const devices = reader.compatibility.devices.join(", ");
    const os = reader.compatibility.os.join(", ");
    return `<strong>Devices:</strong> ${devices}<br><strong>Operating Systems:</strong> ${os}`;
}

/**
 * Generate FAQ section HTML
 */
function generateFAQHTML(faqItems) {
    if (!faqItems || faqItems.length === 0) {
        return "";
    }

    return faqItems
        .map(
            (item) => `
            <div class="faq-item">
                <div class="faq-question">
                    <span>${item.q}</span>
                    <span class="faq-toggle">▼</span>
                </div>
                <div class="faq-answer">${item.a}</div>
            </div>
        `
        )
        .join("");
}

/**
 * Generate related readers section
 */
function generateRelatedReadersSection(reader, allReaders) {
    if (!reader.relatedReaders || reader.relatedReaders.length === 0) {
        return "";
    }

    const relatedCards = reader.relatedReaders
        .map(relatedId => {
            const related = allReaders.find(r => r.id === relatedId);
            if (!related) return "";
            
            return `
                <a href="/readers/${related.id}/" class="reader-card no-underline">
                    <p class="reader-card-name">${related.name}</p>
                    <p class="reader-card-info">${related.brand} • ${related.type}</p>
                </a>
            `;
        })
        .join("");

    if (!relatedCards) return "";

    return `
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">You Might Also Like</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${relatedCards}
            </div>
        </section>
    `;
}

/**
 * Generate all template variables for a reader
 */
function buildReaderVariables(reader, baseUrl, allReaders, index) {
    const readerUrl = `${baseUrl}/readers/${reader.id}/`;
    const priceColorMap = {
        "Budget": "text-green-600",
        "Mid-Range": "text-amber-600",
        "Premium": "text-purple-600"
    };

    return {
        // Meta
        READER_TITLE: `${reader.name} Review | Specs & Comparison`,
        READER_DESCRIPTION: generateReaderMetaDescription(reader, index),
        READER_URL: readerUrl,
        OG_TITLE: `${reader.name} - ${reader.brand}`,
        TWITTER_TITLE: `${reader.name} Review - ${reader.brand}`,
        BASE_URL: baseUrl,

        // Content
        READER_NAME: reader.name,
        READER_BRAND: reader.brand,
        READER_MODEL: reader.model,
        READER_TYPE: reader.type,
        READER_INTERFACE: reader.interface.join(" + "),
        READER_SLOTS: reader.supportedSlots.join(", "),
        READER_MAX_SPEED: reader.maxSpeed,
        READER_TRANSFER_RATE: reader.transferRate,
        READER_PRICE_SYMBOL: reader.priceSymbol,
        READER_PRICE: reader.priceEstimate || "Contact",
        PRICE_COLOR: priceColorMap[reader.priceTier] || "text-slate-600",

        // Description sections
        READER_TAGLINE: `${reader.brand} ${reader.model} - ${reader.type}`,
        READER_WHO_IS_THIS_FOR: reader.pros,

        // HTML Sections
        // TODO: Replace with actual product images from img/readers/[reader-id].webp
        // For now using generic SD card reader placeholder
        READER_IMAGE: `sd-card-reader-placeholder.webp`,
        READER_PROS_HTML: generateProsHTML(reader),
        READER_CONS_HTML: generateConsHTML(reader),
        READER_SPECS_TABLE: generateSpecsTableHTML(reader),
        READER_FEATURES_HTML: generateFeaturesHTML(reader),
        READER_COMPATIBLE_DEVICES: reader.compatibility.devices.join(", "),
        READER_OS_SUPPORT: reader.compatibility.os.join(", "),

        // FAQ and schema
        FAQ_HTML: generateFAQHTML(reader.faq),
        FAQ_SCHEMA: generateFAQSchema(reader.faq || []),
        BREADCRUMB_SCHEMA: generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "SD Card Readers", url: "/readers/" },
            { name: reader.name, url: `/readers/${reader.id}/` }
        ]),

        // Related content
        RELATED_READERS_SECTION: generateRelatedReadersSection(reader, allReaders),

        // Components
        HEADER: generateHeader(),
        FOOTER: generateFooter(),
        SIDEBAR: generateSidebar(),
        GROW_SCRIPT: generateGrowScript(),
        AMAZON_SEARCH_URL: reader.amazonSearchUrl,
    };
}

/**
 * Generate individual reader page
 */
function generateReaderPage(reader, template, baseUrl, allReaders, index) {
    const variables = buildReaderVariables(reader, baseUrl, allReaders, index);
    
    let html = template;
    
    // Replace all variables
    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        html = html.replace(new RegExp(placeholder, "g"), value || "");
    }

    // Write file
    const outputPath = path.join(distPath, "readers", reader.id, "index.html");
    writeFile(outputPath, html);
}

/**
 * Main: Generate all reader pages
 */
async function generateReaderPages() {
    console.log("\n📖 Generating SD Card Reader Pages...");

    const baseUrl = "https://sdcardchecker.com";
    
    try {
        // Read template
        const templatePath = path.join(srcPath, "templates", "reader-product-review.html");
        const template = readTemplate(templatePath);

        // Read readers data
        const readersPath = path.join(__dirname, "../../data", "sdCardReaders.json");
        const readersData = readJSON(readersPath);
        const readers = readersData.sdCardReaders || [];

        console.log(`  Found ${readers.length} readers in dataset`);

        // Generate pages
        readers.forEach((reader, index) => {
            try {
                generateReaderPage(reader, template, baseUrl, readers, index);
            } catch (err) {
                console.error(`  ❌ Error generating reader page for ${reader.id}:`, err.message);
            }
        });

        console.log(`  ✅ Generated ${readers.length} reader pages`);
        return readers.length;
    } catch (err) {
        console.error("  ❌ Error generating reader pages:", err.message);
        throw err;
    }
}

module.exports = { generateReaderPages };
