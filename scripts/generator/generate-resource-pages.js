/**
 * SD Card Checker - Resource Pages Generator
 * Generates static HTML pages for resources like guides and FAQs
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Generate a resource page
 */
function generateResourcePage(templatePath, distPath, fileName) {
    let template = readTemplate(templatePath);

    // Process {% include %} tags
    template = processIncludes(template, path.dirname(templatePath));

    // Replace placeholders
    let html = template
        .replace(/{{SIDEBAR}}/g, generateSidebar())
        .replace(/{{HEADER}}/g, generateHeader())
        .replace(/{{FOOTER}}/g, generateFooter())
        .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
        .replace(/{{AFFILIATE_DISCLOSURE}}/g, generateAffiliateDisclosure());

    const outputPath = path.join(distPath, fileName);
    writeFile(outputPath, html);
    
    return fileName;
}

/**
 * Generate all resource pages
 */
async function generateResourcePages(distPath) {
    console.log("📚 Generating resource pages...");

    // Legacy pages (root directory)
    const legacyResources = [
        {
            template: path.join(srcPath, "templates/faq.html"),
            file: "faq.html",
            name: "FAQ"
        }
    ];

    // New guide pages (under /guides/)
    const guidesDir = path.join(distPath, "guides");
    ensureDir(guidesDir);

    const guidePages = [
        {
            template: path.join(srcPath, "templates/guides/index.html"),
            file: "index.html",
            name: "Guides Hub"
        },
        {
            template: path.join(srcPath, "templates/guides/sd-card-guide.html"),
            file: "sd-card-guide/index.html",
            name: "SD Card Guide"
        },
        {
            template: path.join(srcPath, "templates/guides/sd-card-speed-classes.html"),
            file: "sd-card-speed-classes/index.html",
            name: "Speed Classes"
        },
        {
            template: path.join(srcPath, "templates/guides/video-bitrate-comparison.html"),
            file: "video-bitrate-comparison/index.html",
            name: "Video Bitrate Comparison"
        },
        {
            template: path.join(srcPath, "templates/guides/raw-vs-jpeg.html"),
            file: "raw-vs-jpeg/index.html",
            name: "RAW vs JPEG"
        }
    ];

    // Generate legacy pages
    legacyResources.forEach(resource => {
        try {
            generateResourcePage(resource.template, distPath, resource.file);
            console.log(`  ✓ Generated ${resource.name} (${resource.file})`);
        } catch (error) {
            console.error(`  ✗ Failed to generate ${resource.name}: ${error.message}`);
        }
    });

    // Generate guide pages
    guidePages.forEach(guide => {
        try {
            const guideFilePath = path.join(guidesDir, guide.file);
            const guideFileDir = path.dirname(guideFilePath);
            ensureDir(guideFileDir);
            
            generateResourcePage(guide.template, guideFileDir, "index.html");
            console.log(`  ✓ Generated ${guide.name} (guides/${guide.file})`);
        } catch (error) {
            console.error(`  ✗ Failed to generate ${guide.name}: ${error.message}`);
        }
    });

    console.log(`  ✓ Generated ${legacyResources.length} legacy + ${guidePages.length} guide pages`);
}

module.exports = { generateResourcePages };
