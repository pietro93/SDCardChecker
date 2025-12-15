/**
 * SD Card Checker - Readers Index Generator
 * Generates /readers/ index page listing all 14 readers
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, writeFile, generateBreadcrumbSchema, readJSON, ensureDir } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");
const distPath = path.join(__dirname, "../../dist");

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
 * Generate reader schema list for CollectionPage
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
 * Generate readers index page
 */
async function generateReadersIndex() {
    console.log("\n📖 Generating Readers Index Page...");

    const baseUrl = "https://sdcardchecker.com";

    try {
        // Read template
        const templatePath = path.join(srcPath, "templates", "readers-index.html");
        const template = readTemplate(templatePath);

        // Read readers data
        const readersPath = path.join(__dirname, "../../data", "sdCardReaders.json");
        const readersData = readJSON(readersPath);
        const readers = readersData.sdCardReaders || [];

        if (readers.length === 0) {
            throw new Error("No readers found in sdCardReaders.json");
        }

        // Get unique reader types
        const readerTypes = new Set(readers.map(r => r.type));

        // Build variables
        const variables = {
            // Meta
            BASE_URL: baseUrl,

            // Content
            READER_COUNT: readers.length.toString(),
            READER_TYPES_COUNT: readerTypes.size.toString(),

            // HTML Sections
            READERS_GRID_HTML: readers.map(generateReaderCard).join(""),
            READER_SCHEMA_LIST: generateReaderSchemaList(readers),

            // Breadcrumbs
            BREADCRUMB_SCHEMA: generateBreadcrumbSchema([
                { name: "Home", url: "/" },
                { name: "SD Card Readers", url: "/readers/" }
            ]),

            // Components
            HEADER: generateHeader(),
            FOOTER: generateFooter(),
            SIDEBAR: generateSidebar(),
            GROW_SCRIPT: generateGrowScript(),
        };

        // Replace all variables
        let html = template;
        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            html = html.replace(new RegExp(placeholder, "g"), value || "");
        }

        // Ensure directory exists
        const readersDir = path.join(distPath, "readers");
        ensureDir(readersDir);

        // Write file
        const outputPath = path.join(readersDir, "index.html");
        writeFile(outputPath, html);

        console.log(`  ✓ dist/readers/index.html`);
        console.log(`  ✅ Readers index page generated`);
        return true;
    } catch (err) {
        console.error("  ❌ Error generating readers index:", err.message);
        throw err;
    }
}

module.exports = { generateReadersIndex };
