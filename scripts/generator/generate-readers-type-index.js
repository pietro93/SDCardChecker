/**
 * SD Card Checker - Readers Type Index Generator
 * Generates /readers/[type]/ index pages for each reader type
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, writeFile, generateBreadcrumbSchema, readJSON, ensureDir } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");
const distPath = path.join(__dirname, "../../dist");

/**
 * Type descriptions and info
 */
const TYPE_INFO = {
    "Dongle": {
        intro: "Compact, portable dongles that connect directly to your device's USB port. Perfect for travel and mobile users.",
        infoTitle: "About Dongles",
        infoContent: `
            <p>SD card reader dongles are ultra-compact adapters that provide quick access to your cards with minimal bulk. They're ideal for:</p>
            <ul class="list-disc list-inside space-y-2 mt-3">
                <li>Travelers who need portable storage solutions</li>
                <li>Mobile device users (USB-C dongles for phones/tablets)</li>
                <li>Emergency card recovery in the field</li>
                <li>Backup connectivity options</li>
            </ul>
            <p class="mt-3"><strong>Trade-offs:</strong> Limited durability and slot count compared to hubs, but maximum portability.</p>
        `
    },
    "Viewer": {
        intro: "Standalone card viewers and file browsers. Designed for photographers to preview images and transfer files without a computer.",
        infoTitle: "About Card Viewers",
        infoContent: `
            <p>Card viewers are specialized devices for photographers and video professionals who need to:</p>
            <ul class="list-disc list-inside space-y-2 mt-3">
                <li>Preview photos and videos on-location</li>
                <li>Backup cards without a computer</li>
                <li>Organize and rename files directly from the card</li>
                <li>Check technical metadata and image info</li>
            </ul>
            <p class="mt-3"><strong>Ideal for:</strong> Professional photographers, filmmakers, and content creators working in remote locations.</p>
        `
    },
    "Mobile Adapter": {
        intro: "Lightweight adapters for smartphones and tablets. Enable direct card access from iOS and Android devices.",
        infoTitle: "About Mobile Adapters",
        infoContent: `
            <p>Mobile adapters bridge the gap between traditional SD cards and smartphones/tablets:</p>
            <ul class="list-disc list-inside space-y-2 mt-3">
                <li>Direct connection to USB-C or Lightning ports</li>
                <li>Import photos and videos directly to your phone</li>
                <li>Edit files on mobile apps without cloud upload</li>
                <li>Emergency backup for mobile devices</li>
            </ul>
            <p class="mt-3"><strong>Perfect for:</strong> Mobile photographers, content creators, and anyone wanting local file management on their phone.</p>
        `
    },
    "Professional Hub": {
        intro: "Advanced multi-slot readers with high-speed connections. Designed for professional workflows requiring multiple card types simultaneously.",
        infoTitle: "About Professional Hubs",
        infoContent: `
            <p>Professional hubs are feature-rich readers built for demanding workflows:</p>
            <ul class="list-disc list-inside space-y-2 mt-3">
                <li>Support multiple card formats (SD, CFexpress, CompactFlash, etc.)</li>
                <li>High-speed UHS-II or Thunderbolt connections</li>
                <li>Daisy-chaining and advanced firmware</li>
                <li>Designed for studio and production environments</li>
            </ul>
            <p class="mt-3"><strong>Best for:</strong> Professional photographers, video production teams, and broadcast facilities.</p>
        `
    },
    "Hub": {
        intro: "Multi-function adapters with SD card reading capabilities. Often include additional USB ports and charging features.",
        infoTitle: "About Hubs",
        infoContent: `
            <p>Multi-port hubs combine SD card reading with other essential connectors:</p>
            <ul class="list-disc list-inside space-y-2 mt-3">
                <li>USB-C or USB-A to SD card reading</li>
                <li>Additional USB 3.0/3.1 ports for peripherals</li>
                <li>Often include HDMI, power delivery, or Ethernet</li>
                <li>Great for expanding laptop connectivity</li>
            </ul>
            <p class="mt-3"><strong>Ideal for:</strong> MacBook users, USB-C laptop owners, and anyone needing a compact docking solution.</p>
        `
    },
    "Stick / Box": {
        intro: "Box-shaped or stick-form readers. Usually sit on desktop and support multiple card types with good stability.",
        infoTitle: "About Stick & Box Readers",
        infoContent: `
            <p>Desktop-oriented readers in convenient form factors:</p>
            <ul class="list-disc list-inside space-y-2 mt-3">
                <li>Standalone desktop readers (no required cable)</li>
                <li>USB stick-like portable readers</li>
                <li>Compact boxes with good cable organization</li>
                <li>Often support multiple card types</li>
            </ul>
            <p class="mt-3"><strong>Best for:</strong> Desktop users, photographers with home offices, and anyone wanting a stationary card reader.</p>
        `
    },
    "Desktop Dock": {
        intro: "Premium desktop docking stations. Often feature Thunderbolt, multiple slots, and professional-grade construction.",
        infoTitle: "About Desktop Docks",
        infoContent: `
            <p>Professional desktop docks for demanding workflows:</p>
            <ul class="list-disc list-inside space-y-2 mt-3">
                <li>Thunderbolt 3/4 connections for maximum speed</li>
                <li>Multiple slot support for parallel workflows</li>
                <li>Robust, studio-quality construction</li>
                <li>Often include data recovery features</li>
            </ul>
            <p class="mt-3"><strong>Perfect for:</strong> Professional studios, post-production facilities, and high-volume data workflows.</p>
        `
    }
};

/**
 * Generate price range for type
 */
function getPriceRange(readers) {
    const prices = {
        "Budget": 1,
        "Mid-Range": 2,
        "Premium": 3
    };

    const readerPrices = readers.map(r => prices[r.priceTier] || 0).filter(p => p > 0);
    if (readerPrices.length === 0) return "Varies";

    const minPrice = Math.min(...readerPrices);
    const maxPrice = Math.max(...readerPrices);

    const priceLabels = { 1: "Budget", 2: "Mid-Range", 3: "Premium" };
    return `${priceLabels[minPrice]} - ${priceLabels[maxPrice]}`;
}

/**
 * Convert type name to URL slug
 */
function typeToSlug(type) {
    return type.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
}

/**
 * Generate reader card HTML
 */
function generateReaderCard(reader) {
    return `
        <a href="/readers/${reader.id}/" class="reader-card-grid group block">
            <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-slate-200 h-full flex flex-col">
                <!-- Image -->
                <div class="aspect-square bg-slate-100 overflow-hidden">
                    <img 
                        src="/img/readers/sd-card-reader-placeholder.webp" 
                        alt="${reader.name}" 
                        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                        width="200"
                        height="200"
                        loading="lazy"
                        decoding="async"
                    >
                </div>

                <!-- Content -->
                <div class="p-4 flex-1 flex flex-col">
                    <h3 class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg mb-1">
                        ${reader.name}
                    </h3>
                    <p class="text-sm text-slate-600 mb-3">
                        ${reader.brand} • ${reader.type}
                    </p>

                    <!-- Quick Specs -->
                    <div class="space-y-1 text-xs text-slate-700 mb-3 flex-1">
                        <p><strong>Interface:</strong> ${reader.interface.join(", ")}</p>
                        <p><strong>Speed:</strong> ${reader.maxSpeed}</p>
                        <p><strong>Price:</strong> <span class="${getPriceColor(reader.priceTier)} font-semibold">${reader.priceTier}</span></p>
                    </div>

                    <!-- CTA Button -->
                    <button class="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-auto group-hover:underline">
                        View Full Review <i class="fas fa-arrow-right text-xs ml-1"></i>
                    </button>
                </div>
            </div>
        </a>
    `;
}

/**
 * Get price tier color
 */
function getPriceColor(priceTier) {
    const colors = {
        "Budget": "text-green-600",
        "Mid-Range": "text-amber-600",
        "Premium": "text-purple-600"
    };
    return colors[priceTier] || "text-slate-600";
}

/**
 * Generate reader schema list
 */
function generateReaderSchemaList(readers) {
    return readers
        .map((reader, index) => {
            return `{
        "@type": "ListItem",
        "position": ${index + 1},
        "name": "${reader.name}",
        "url": "https://sdcardchecker.com/readers/${reader.id}/",
        "image": "https://sdcardchecker.com/img/readers/sd-card-reader-placeholder.webp"
    }`;
        })
        .join(",\n        ");
}

/**
 * Generate reader type index page
 */
function generateReaderTypeIndexPage(type, readers) {
    const typeInfo = TYPE_INFO[type] || {
        intro: `Explore our collection of ${type.toLowerCase()} SD card readers.`,
        infoTitle: `About ${type}s`,
        infoContent: `<p>Learn more about ${type.toLowerCase()} readers and their use cases.</p>`
    };

    const slug = typeToSlug(type);
    const template = readTemplate(path.join(srcPath, "templates", "readers-type-index.html"));

    const variables = {
        TYPE_TITLE: `Best ${type} SD Card Readers`,
        TYPE_DESCRIPTION: `Compare ${readers.length} top-rated ${type.toLowerCase()} SD card readers. Full specs, pros/cons, and pricing on Amazon.`,
        TYPE_SLUG: slug,
        TYPE_COUNT: readers.length.toString(),
        TYPE_INTRO: typeInfo.intro,
        TYPE_PRICE_RANGE: getPriceRange(readers),
        TYPE_INFO_TITLE: typeInfo.infoTitle,
        TYPE_INFO_CONTENT: typeInfo.infoContent,
        READERS_GRID_HTML: readers.map(generateReaderCard).join(""),
        READER_SCHEMA_LIST: generateReaderSchemaList(readers),
        BREADCRUMB_SCHEMA: generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "SD Card Readers", url: "/readers/" },
            { name: type, url: `/readers/${slug}/` }
        ]),
        HEADER: generateHeader(),
        FOOTER: generateFooter(),
        SIDEBAR: generateSidebar(),
        GROW_SCRIPT: generateGrowScript(),
    };

    let html = template;
    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        html = html.replace(new RegExp(placeholder, "g"), value || "");
    }

    const outputPath = path.join(distPath, "readers", slug, "index.html");
    ensureDir(path.dirname(outputPath));
    writeFile(outputPath, html);

    return slug;
}

/**
 * Generate all reader type index pages
 */
async function generateReadersTypeIndexPages() {
    console.log("\n📂 Generating Reader Type Index Pages...");

    try {
        // Read readers data
        const readersPath = path.join(__dirname, "../../data", "sdCardReaders.json");
        const readersData = readJSON(readersPath);
        const allReaders = readersData.sdCardReaders || [];

        // Group by type
        const typeMap = {};
        allReaders.forEach(reader => {
            if (!typeMap[reader.type]) {
                typeMap[reader.type] = [];
            }
            typeMap[reader.type].push(reader);
        });

        // Generate page for each type
        const generatedTypes = [];
        for (const [type, readers] of Object.entries(typeMap)) {
            const slug = generateReaderTypeIndexPage(type, readers);
            generatedTypes.push(slug);
            console.log(`  ✓ dist/readers/${slug}/index.html`);
        }

        console.log(`  ✅ Generated ${generatedTypes.length} reader type pages`);
        return generatedTypes;
    } catch (err) {
        console.error("  ❌ Error generating reader type pages:", err.message);
        throw err;
    }
}

module.exports = { generateReadersTypeIndexPages };
