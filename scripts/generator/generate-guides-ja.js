/**
 * SD Card Checker - Japanese Guides Generator
 * Generates static Japanese guide pages from templates
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components-ja");

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
 * Generate a Japanese guide page
 */
function generateGuidePageJa(templatePath, distPath, fileName) {
    try {
        let template = readTemplate(templatePath);

        // Process {% include %} tags
        template = processIncludes(template, path.dirname(templatePath));

        // Replace placeholders
        let html = template
            .replace(/{{SIDEBAR}}/g, generateSidebar())
            .replace(/{{HEADER}}/g, generateHeader())
            .replace(/{{FOOTER}}/g, generateFooter())
            .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
            .replace(/{{AFFILIATE_DISCLOSURE}}/g, generateAffiliateDisclosure())
            .replace(/{{BASE_URL}}/g, "https://sdcardchecker.com");

        const outputPath = path.join(distPath, fileName);
        writeFile(outputPath, html);
        
        return true;
    } catch (error) {
        console.error(`  ❌ Error generating ${fileName}:`, error.message);
        return false;
    }
}

/**
 * Generate all Japanese guide pages
 */
function generateJapaneseGuides(distPath) {
    console.log("📚 Generating Japanese guide pages...");

    const guidesDistPath = path.join(distPath, "ja", "guides");
    ensureDir(guidesDistPath);

    const guides = [
        {
            templatePath: path.join(srcPath, "templates/guides/sd-card-speed-classes-ja.html"),
            fileName: "sd-card-speed-classes/index.html",
            name: "Speed Classes Guide (Japanese)"
        },
        {
            templatePath: path.join(srcPath, "templates/guides/is-my-sd-card-fake-ja.html"),
            fileName: "is-my-sd-card-fake/index.html",
            name: "Fake Card Detection Guide (Japanese)"
        },
        {
            templatePath: path.join(srcPath, "templates/guides/nintendo-switch-sd-card-guide.html"),
            fileName: "nintendo-switch-sd-card-guide/index.html",
            name: "Nintendo Switch Guide (English)"
        }
    ];

    let successCount = 0;
    guides.forEach(guide => {
        if (fs.existsSync(guide.templatePath)) {
            if (generateGuidePageJa(guide.templatePath, guidesDistPath, guide.fileName)) {
                console.log(`  ✓ Generated ${guide.name}`);
                successCount++;
            }
        } else {
            console.log(`  ⚠️  Template not found: ${guide.templatePath}`);
        }
    });

    console.log(`  ✓ Generated ${successCount}/${guides.length} Japanese guide pages\n`);
}

module.exports = { generateJapaneseGuides };
