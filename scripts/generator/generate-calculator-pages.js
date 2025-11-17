/**
 * SD Card Checker - Calculator Pages Generator
 * Generates static HTML pages for storage calculators
 */

const path = require("path");
const { readTemplate, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

/**
 * Generate a calculator page
 */
function generateCalculatorPage(templatePath, distPath, outputPath) {
    let template = readTemplate(templatePath);

    // Replace placeholders
    let html = template
        .replace(/{{SIDEBAR}}/g, generateSidebar())
        .replace(/{{HEADER}}/g, generateHeader())
        .replace(/{{FOOTER}}/g, generateFooter())
        .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
        .replace(/{{AFFILIATE_DISCLOSURE}}/g, generateAffiliateDisclosure());

    const fullOutputPath = path.join(distPath, outputPath);
    writeFile(fullOutputPath, html);
    
    return outputPath;
}

/**
 * Generate all calculator pages
 */
async function generateCalculatorPages(distPath) {
    console.log("🧮 Generating calculator pages...");

    const calculators = [
        {
            template: path.join(srcPath, "templates/calculator/video-storage-calculator.html"),
            file: "tools/video-storage-calculator/index.html",
            name: "Video Storage Calculator"
        },
        {
            template: path.join(srcPath, "templates/calculator/photo-storage-calculator.html"),
            file: "tools/photo-storage-calculator/index.html",
            name: "Photo Storage Calculator"
        }
    ];

    calculators.forEach(calc => {
        try {
            generateCalculatorPage(calc.template, distPath, calc.file);
            console.log(`  ✓ Generated ${calc.name} (${calc.file})`);
        } catch (error) {
            console.error(`  ✗ Failed to generate ${calc.name}: ${error.message}`);
        }
    });

    console.log(`  ✓ Generated ${calculators.length} calculator pages`);
}

module.exports = { generateCalculatorPages };
