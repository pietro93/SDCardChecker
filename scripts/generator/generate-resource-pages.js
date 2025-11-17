/**
 * SD Card Checker - Resource Pages Generator
 * Generates static HTML pages for resources like guides and FAQs
 */

const path = require("path");
const { readTemplate, processIncludes, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

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

    const resources = [
        {
            template: path.join(srcPath, "templates/sd-card-guide.html"),
            file: "sd-card-guide.html",
            name: "SD Card Guide"
        },
        {
            template: path.join(srcPath, "templates/speed-classes.html"),
            file: "speed-classes.html",
            name: "Speed Classes"
        },
        {
            template: path.join(srcPath, "templates/faq.html"),
            file: "faq.html",
            name: "FAQ"
        }
    ];

    resources.forEach(resource => {
        try {
            generateResourcePage(resource.template, distPath, resource.file);
            console.log(`  ✓ Generated ${resource.name} (${resource.file})`);
        } catch (error) {
            console.error(`  ✗ Failed to generate ${resource.name}: ${error.message}`);
        }
    });

    console.log(`  ✓ Generated ${resources.length} resource pages`);
}

module.exports = { generateResourcePages };
