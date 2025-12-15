/**
 * SD Card Checker - Resource Pages Generator
 * Generates static HTML pages for resources like guides and FAQs
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");
const { generateAmazonBadgeSectionByType } = require("./amazon-badges-generator");

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
function generateResourcePage(templatePath, distPath, fileName, amazonProductType = null) {
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
    
    // Replace Amazon product placeholders if a product type is specified
    if (amazonProductType) {
        html = replaceAmazonProductPlaceholders(html, amazonProductType);
    }

    const outputPath = path.join(distPath, fileName);
    writeFile(outputPath, html);
    
    return fileName;
}

/**
 * Replace Amazon product placeholders in template
 */
function replaceAmazonProductPlaceholders(html, productType) {
    // Map of placeholder patterns to product types and configurations
    const placeholders = {
        // Speed Classes guide
        '{{AMAZON_FEATURED_SPEED_CLASSES}}': () => 
            generateAmazonBadgeSectionByType('guide-speed-classes', 3, 'Featured Products'),
        
        // Professional Cameras guide
        '{{AMAZON_FEATURED_PROFESSIONAL}}': () => 
            generateAmazonBadgeSectionByType('guide-professional-cameras', 3, 'Professional SD Cards'),
        
        // RAW vs JPEG guide
        '{{AMAZON_FEATURED_RAW_JPEG}}': () => 
            generateAmazonBadgeSectionByType('guide-raw-jpeg', 3, 'Professional-Grade Cards'),
        
        // Fake SD Card Detector guide
        '{{AMAZON_FEATURED_AUTHENTIC}}': () => 
            generateAmazonBadgeSectionByType('guide-fake-detection', 3, 'Buy Authentic Cards'),
        
        // Video Bitrate guide
        '{{AMAZON_FEATURED_VIDEO}}': () => 
            generateAmazonBadgeSectionByType('guide-video-bitrate', 3, 'High-Speed Cards for 4K/8K Video'),
        
        // Readers: Photographers guide
        '{{AMAZON_FEATURED_READERS_PHOTOGRAPHERS}}': () => 
            generateAmazonBadgeSectionByType('readers-photographers', 3, 'Featured SD Card Readers on Amazon'),
        
        // Readers: Android guide
        '{{AMAZON_FEATURED_READERS_ANDROID}}': () => 
            generateAmazonBadgeSectionByType('readers-android', 3, 'Featured SD Card Readers on Amazon'),
        
        // Readers: iPhone guide
        '{{AMAZON_FEATURED_READERS_IPHONE}}': () => 
            generateAmazonBadgeSectionByType('readers-iphone', 3, 'Featured SD Card Readers on Amazon'),
        
        // Readers: MacBook guide
        '{{AMAZON_FEATURED_READERS_MACBOOK}}': () => 
            generateAmazonBadgeSectionByType('readers-macbook', 3, 'Featured SD Card Readers on Amazon')
    };
    
    // Replace all placeholders
    for (const [placeholder, generator] of Object.entries(placeholders)) {
        if (html.includes(placeholder)) {
            html = html.replace(placeholder, generator());
        }
    }
    
    return html;
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
        },
        {
            template: path.join(srcPath, "templates/guides/fake-sd-card-checker.html"),
            file: "is-my-sd-card-fake/index.html",
            name: "Fake SD Card Checker"
        },
        {
            template: path.join(srcPath, "templates/guides/readers-macbook.html"),
            file: "readers/macbook/index.html",
            name: "Best Readers for MacBook"
        },
        {
            template: path.join(srcPath, "templates/guides/readers-photographers.html"),
            file: "readers/photographers/index.html",
            name: "Best Readers for Photographers"
        },
        {
            template: path.join(srcPath, "templates/guides/readers-iphone.html"),
            file: "readers/iphone/index.html",
            name: "Best Readers for iPhone"
        },
        {
            template: path.join(srcPath, "templates/guides/readers-android.html"),
            file: "readers/android/index.html",
            name: "Best Readers for Android"
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
            
            // Process Amazon products (all guides support it)
            generateResourcePage(guide.template, guideFileDir, "index.html", true);
            console.log(`  ✓ Generated ${guide.name} (guides/${guide.file})`);
        } catch (error) {
            console.error(`  ✗ Failed to generate ${guide.name}: ${error.message}`);
        }
    });

    console.log(`  ✓ Generated ${legacyResources.length} legacy + ${guidePages.length} guide pages`);
}

module.exports = { generateResourcePages };
