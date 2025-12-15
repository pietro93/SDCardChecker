/**
 * SD Card Checker - Reader Pages Generator
 * Generates product review pages for SD card readers from sdCardReaders.json
 * 
 * SEO Optimizations:
 * - Uses curated metaDescription from JSON (not rotated templates)
 * - Leverages whyChooseThis for unique selling propositions
 * - Implements relatedReaders cross-linking strategy
 * - Dynamic image paths per reader for Google Image Search
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateFAQSchema, generateBreadcrumbSchema, readJSON, ensureDir } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");
const distPath = path.join(__dirname, "../../dist");

/**
 * Generate SEO-optimized meta description
 * Priority: 1. Custom JSON field 2. Constructed from key data points
 */
function generateReaderMetaDescription(reader) {
    if (reader.metaDescription) {
        return reader.metaDescription;
    }

    // Fallback construction if manual description is missing
    const speed = reader.maxSpeed || "standard speed";
    const type = reader.type || "adapter";
    return `${reader.name} review and specs. A ${type} from ${reader.brand} supporting ${reader.supportedSlots.join(", ")}. Max speed: ${speed}. See compatibility and pricing.`;
}

/**
 * Generate HTML for reader pros
 */
function generateProsHTML(reader) {
    // If pros is a string, split by period, otherwise treat as array if future-proofed
    const prosList = typeof reader.pros === 'string' 
        ? reader.pros.split('.').filter(p => p.trim().length > 0)
        : [reader.pros];

    return prosList
        .map(pro => `<li class="flex gap-3 mb-2"><span class="text-green-600 font-bold">✓</span><span>${pro.trim()}</span></li>`)
        .join("");
}

/**
 * Generate HTML for reader cons
 */
function generateConsHTML(reader) {
    const consList = typeof reader.cons === 'string' 
        ? reader.cons.split('.').filter(p => p.trim().length > 0)
        : [reader.cons];

    return consList
        .map(con => `<li class="flex gap-3 mb-2"><span class="text-red-600 font-bold">✗</span><span>${con.trim()}</span></li>`)
        .join("");
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
            <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td class="py-3 px-4 font-semibold text-slate-700 w-1/3">${spec.label}</td>
                <td class="py-3 px-4 text-slate-600">${spec.value}</td>
            </tr>
        `)
        .join("");
}

/**
 * Generate features list HTML
 */
function generateFeaturesHTML(reader) {
    return reader.features
        .map(feature => `<li class="flex gap-2 items-center mb-1"><span class="text-blue-500 text-lg">•</span><span class="text-slate-700">${feature}</span></li>`)
        .join("");
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
            <div class="faq-item border-b border-slate-200 py-4">
                <h3 class="font-bold text-slate-900 mb-2">${item.q}</h3>
                <div class="faq-answer text-slate-700 prose">${item.a}</div>
            </div>
        `
        )
        .join("");
}

/**
 * Generate related readers section
 * Handles cross-linking to other reader reviews
 */
function generateRelatedReadersSection(reader, allReaders) {
    // Check if relatedReaders exists in JSON, otherwise fallback to finding same 'Type' or 'Brand'
    let relatedIds = reader.relatedReaders || [];
    
    // Auto-fill if empty based on Type (simple recommendation engine)
    if (relatedIds.length === 0) {
        relatedIds = allReaders
            .filter(r => r.type === reader.type && r.id !== reader.id)
            .map(r => r.id)
            .slice(0, 3);
    }

    if (relatedIds.length === 0) return "";

    const relatedCards = relatedIds
        .map(relatedId => {
            const related = allReaders.find(r => r.id === relatedId);
            if (!related) return "";
            
            // SEO-friendly internal link using slug
            const readerSlug = related.slug || related.id;
            return `
                <a href="/readers/${readerSlug}/" class="group block bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition">
                    <div class="font-bold text-blue-600 group-hover:underline mb-1">${related.name}</div>
                    <div class="text-sm text-slate-500 mb-2">${related.brand} • ${related.type}</div>
                    <div class="text-xs text-slate-400">Max Speed: ${related.maxSpeed}</div>
                </a>
            `;
        })
        .join("");

    if (!relatedCards) return "";

    return `
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Compare Similar Readers</h2>
            <div class="grid md:grid-cols-3 gap-4">
                ${relatedCards}
            </div>
        </section>
    `;
}

/**
 * Generate device recommendations section
 */
function generateDeviceRecommendationsSection(reader) {
    if (!reader.relatedDevices || reader.relatedDevices.length === 0) {
        return "";
    }

    const deviceLinks = reader.relatedDevices
        .map(deviceId => `
            <a href="/devices/${deviceId}/" class="group block bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition">
                <div class="font-semibold text-blue-600 group-hover:underline">${formatDeviceName(deviceId)}</div>
                <div class="text-xs text-slate-400 mt-1">View compatibility guide</div>
            </a>
        `)
        .join("");

    return `
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Perfect For These Devices</h2>
            <p class="text-slate-700 mb-6">
                Based on our compatibility testing, the ${reader.name} works excellently with:
            </p>
            <div class="grid md:grid-cols-3 gap-4">
                ${deviceLinks}
            </div>
        </section>
    `;
}

/**
 * Format device ID to readable name
 */
function formatDeviceName(deviceId) {
    return deviceId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Generate all template variables for a reader
 */
function buildReaderVariables(reader, baseUrl, allReaders) {
    const readerUrl = `${baseUrl}/readers/${reader.id}/`;
    const priceColorMap = {
        "Budget": "text-green-600",
        "Mid-Range": "text-amber-600",
        "Premium": "text-purple-600"
    };

    // Use specific "whyChooseThis" if available, fallback to full pros
    const whoIsThisFor = reader.whyChooseThis || reader.pros;

    return {
        // Meta
        READER_TITLE: `${reader.name} Review | Specs, Speed & Price`,
        READER_DESCRIPTION: generateReaderMetaDescription(reader),
        READER_URL: readerUrl,
        OG_TITLE: `${reader.name} Review - ${reader.brand}`,
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
        READER_PRICE_ESTIMATE: reader.priceEstimate ? `$${reader.priceEstimate}` : reader.priceTier,
        PRICE_COLOR: priceColorMap[reader.priceTier] || "text-slate-600",

        // Description sections
        READER_TAGLINE: `${reader.brand} ${reader.model}`,
        READER_WHO_IS_THIS_FOR: whoIsThisFor,

        // HTML Sections
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
        DEVICE_RECOMMENDATIONS_SECTION: generateDeviceRecommendationsSection(reader),

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
function generateReaderPage(reader, template, baseUrl, allReaders) {
    const variables = buildReaderVariables(reader, baseUrl, allReaders);
    
    let html = template;
    
    // Replace all variables
    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        html = html.replace(new RegExp(placeholder, "g"), value || "");
    }

    // Write file
    const outputPath = path.join(distPath, "readers", reader.id, "index.html");
    ensureDir(path.dirname(outputPath));
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
        
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found at ${templatePath}`);
        }
        
        const template = readTemplate(templatePath);

        // Read readers data
        const readersPath = path.join(__dirname, "../../data", "sdCardReaders.json");
        const readersData = readJSON(readersPath);
        const readers = readersData.sdCardReaders || [];

        console.log(`  Found ${readers.length} readers in dataset`);

        // Generate pages
        readers.forEach((reader) => {
            try {
                generateReaderPage(reader, template, baseUrl, readers);
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
