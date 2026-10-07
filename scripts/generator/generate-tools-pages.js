/**
 * SD Card Checker - Tools Pages Generator
 * Generates /tools/ and /tools/calculators/ pages
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, readJSON } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

/**
 * Generate calculator cards HTML for display
 */
function generateCalculatorCards(calculators) {
  return calculators
    .map(
      (calc) => `
        <a href="${calc.url}" class="calculator-card group">
          <img src="${calc.heroImage}" alt="${calc.alt}" width="400" height="300" />
          <div class="calculator-card-overlay">
            <div class="calculator-card-content">
              <div class="calculator-card-title">${calc.title}</div>
              <div class="calculator-card-description">${calc.description}</div>
            </div>
          </div>
        </a>
      `
    )
    .join("\n");
}

/**
 * Generate /tools/ page
 */
function generateToolsPage(distPath, calculators) {
  const header = generateHeader();
  const footer = generateFooter();
  const sidebar = generateSidebar();
  const growScript = generateGrowScript();
  const calculatorCards = generateCalculatorCards(calculators);

  let template = readTemplate(path.join(srcPath, "templates/tools.html"));
  template = processIncludes(template, path.join(srcPath, "templates"));

  const html = template
    .replace(/{{HEADER}}/g, header)
    .replace(/{{FOOTER}}/g, footer)
    .replace(/{{SIDEBAR}}/g, sidebar)
    .replace(/{{GROW_SCRIPT}}/g, growScript)
    .replace(/{{CALCULATOR_CARDS}}/g, calculatorCards);

  writeFile(path.join(distPath, "tools/index.html"), html);
}

/**
 * Generate /tools/calculators/ page
 */
function generateCalculatorsPage(distPath, calculators) {
  const header = generateHeader();
  const footer = generateFooter();
  const sidebar = generateSidebar();
  const growScript = generateGrowScript();
  const calculatorCards = generateCalculatorCards(calculators);

  let template = readTemplate(path.join(srcPath, "templates/tools/calculators.html"));
  template = processIncludes(template, path.join(srcPath, "templates"));

  const html = template
    .replace(/{{HEADER}}/g, header)
    .replace(/{{FOOTER}}/g, footer)
    .replace(/{{SIDEBAR}}/g, sidebar)
    .replace(/{{GROW_SCRIPT}}/g, growScript)
    .replace(/{{CALCULATOR_CARDS}}/g, calculatorCards);

  writeFile(path.join(distPath, "tools/calculators/index.html"), html);
}

/**
 * Generate all tools pages
 */
async function generateToolsPages(distPath) {
  console.log("Generating tools pages...");

  try {
    // Load calculator metadata
    const calculatorsData = readJSON(path.join(srcPath, "data/calculators.json"));
    const calculators = calculatorsData.calculators;

    // Generate tools index page
    generateToolsPage(distPath, calculators);
    console.log(`  ✓ Generated /tools/ page`);

    // Generate calculators listing page
    generateCalculatorsPage(distPath, calculators);
    console.log(`  ✓ Generated /tools/calculators/ page`);

    console.log(`  ✓ Generated 2 tools pages`);
  } catch (error) {
    console.error(`  ✗ Failed to generate tools pages: ${error.message}`);
    throw error;
  }
}

/**
 * The two Japanese calculators are static pages in public/ja/tools/ that carry shell
 * placeholders. Without this pass they ship with literal {{HEADER}} / {{FOOTER}} text.
 * The Amazon badge block is a US-marketplace English feature, so it renders empty.
 */
function renderJapaneseToolPages(distPath) {
  const dir = path.join(distPath, "ja", "tools");
  let count = 0;
  for (const slug of ["recording-time-calculator", "dashcam-storage-calculator"]) {
    const file = path.join(dir, slug, "index.html");
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8")
      .replace(/{{HEADER}}/g, generateHeader("ja"))
      .replace(/{{FOOTER}}/g, generateFooter("ja"))
      .replace(/{{SIDEBAR}}/g, generateSidebar("ja"))
      .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
      .replace(/{{AMAZON_FEATURED_CALCULATOR_PRICE}}/g, "");
    fs.writeFileSync(file, html);
    count++;
  }
  console.log(`  ✓ Rendered ${count} ja calculator pages`);
}

module.exports = { generateToolsPages, renderJapaneseToolPages };
