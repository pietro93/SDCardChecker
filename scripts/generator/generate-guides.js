/**
 * SD Card Checker - Localized Guides Generator
 * Generates translated static guide pages for non-English locales (English guides are
 * handled separately by generate-resource-pages.js, which does much more than guides -
 * FAQ pages, reader buying guides, Amazon product injection - so it wasn't folded in here).
 * Locale-parameterized: add a locale's guide list to GUIDES_BY_LOCALE below once its guide
 * templates exist under src/templates/guides/*-{locale}.html.
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile } = require("./helpers");
const components = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

const GUIDES_BY_LOCALE = {
  ja: [
    { templateFile: "sd-card-speed-classes-ja.html", fileName: "sd-card-speed-classes/index.html", name: "Speed Classes Guide" },
    { templateFile: "is-my-sd-card-fake-ja.html", fileName: "is-my-sd-card-fake/index.html", name: "Fake Card Detection Guide" },
    { templateFile: "nintendo-switch-sd-card-guide-ja.html", fileName: "nintendo-switch-sd-card-guide/index.html", name: "Nintendo Switch Guide" },
  ],
};

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Generate a single localized guide page
 */
function generateGuidePage(templatePath, distPath, fileName, locale) {
    try {
        let template = readTemplate(templatePath);

        // Process {% include %} tags
        template = processIncludes(template, path.dirname(templatePath));

        // Replace placeholders
        let html = template
            .replace(/{{SIDEBAR}}/g, components.generateSidebar(locale))
            .replace(/{{HEADER}}/g, components.generateHeader(locale))
            .replace(/{{FOOTER}}/g, components.generateFooter(locale))
            .replace(/{{GROW_SCRIPT}}/g, components.generateGrowScript())
            .replace(/{{AFFILIATE_DISCLOSURE}}/g, components.generateAffiliateDisclosure(locale))
            .replace(/{{BASE_URL}}/g, "https://sdcardchecker.com");

        // Handle Nintendo Branded Cards Grid (for Nintendo Switch guides)
        if (html.includes('{{NINTENDO_BRANDED_CARDS_GRID}}')) {
            const nintendoGridPath = path.join(srcPath, "templates", "components", "nintendo-branded-cards-grid.html");
            if (fs.existsSync(nintendoGridPath)) {
                let nintendoGridTemplate = fs.readFileSync(nintendoGridPath, 'utf-8');

                // Amazon affiliate URLs for Nintendo-branded cards
                const nintendoAffiliateUrls = {
                    'ZELDA': 'https://amazon.com/s?k=SanDisk+Nintendo+Zelda+microSD+Switch&tag=sd-cc-20',
                    'GENGAR': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Gengar+microSD+Switch&tag=sd-cc-20',
                    'SNORLAX': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Snorlax+microSD+Switch&tag=sd-cc-20',
                    'PIKACHU': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Pikachu+microSD+Switch&tag=sd-cc-20',
                    'YOSHI': 'https://amazon.com/s?k=SanDisk+Nintendo+Yoshi+microSD+Switch&tag=sd-cc-20',
                    'ANIMAL_CROSSING': 'https://amazon.com/s?k=SanDisk+Nintendo+Animal+Crossing+Leaf+microSD+Switch&tag=sd-cc-20',
                    'MARIO_MUSHROOM': 'https://amazon.com/s?k=SanDisk+Nintendo+Super+Mario+Mushroom+microSD+Switch&tag=sd-cc-20',
                    'MARIO_STAR': 'https://amazon.com/s?k=SanDisk+Nintendo+Super+Mario+Super+Star+microSD+Switch&tag=sd-cc-20',
                    'FORTNITE_CUDDLE': 'https://amazon.com/s?k=SanDisk+Nintendo+Fortnite+Cuddle+Team+Leader+microSD+Switch&tag=sd-cc-20',
                    'FORTNITE_SKULL': 'https://amazon.com/s?k=SanDisk+Nintendo+Fortnite+Skull+Trooper+microSD+Switch&tag=sd-cc-20'
                };

                Object.entries(nintendoAffiliateUrls).forEach(([key, url]) => {
                    nintendoGridTemplate = nintendoGridTemplate.replace(`{{AMAZON_URL_${key}}}`, url);
                });

                html = html.replace('{{NINTENDO_BRANDED_CARDS_GRID}}', nintendoGridTemplate);
            } else {
                html = html.replace('{{NINTENDO_BRANDED_CARDS_GRID}}', '');
            }
        }

        const outputPath = path.join(distPath, fileName);
        writeFile(outputPath, html);

        return true;
    } catch (error) {
        console.error(`  Error generating ${fileName}:`, error.message);
        return false;
    }
}

/**
 * Generate all localized guide pages for a locale (no-op if the locale has no guides yet)
 */
function generateLocalizedGuides(distPath, locale) {
    const guides = GUIDES_BY_LOCALE[locale];
    if (!guides || guides.length === 0) return;

    console.log(`Generating ${locale} guide pages...`);

    const guidesDistPath = path.join(distPath, locale, "guides");
    ensureDir(guidesDistPath);

    // Generate main guides index page
    const guideIndexPath = path.join(srcPath, "templates", `guides-${locale}.html`);
    if (fs.existsSync(guideIndexPath)) {
        if (generateGuidePage(guideIndexPath, guidesDistPath, "index.html", locale)) {
            console.log(`  ✓ Generated Guides Index (${locale})`);
        }
    }

    let successCount = 0;
    guides.forEach((guide) => {
        const templatePath = path.join(srcPath, "templates/guides", guide.templateFile);
        if (fs.existsSync(templatePath)) {
            if (generateGuidePage(templatePath, guidesDistPath, guide.fileName, locale)) {
                console.log(`  ✓ Generated ${guide.name} (${locale})`);
                successCount++;
            }
        } else {
            console.log(`  Template not found: ${templatePath}`);
        }
    });

    console.log(`  ✓ Generated ${successCount + 1}/${guides.length + 1} ${locale} guide pages\n`);
}

module.exports = { generateLocalizedGuides };
