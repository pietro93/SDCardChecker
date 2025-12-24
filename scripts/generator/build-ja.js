#!/usr/bin/env node

/**
 * SD Card Checker - Japanese Build Script (/ja/)
 * Generates Japanese version of the site
 */

const path = require("path");
const fs = require("fs");
const { readJSON, readTemplate, processIncludes, writeFile } = require("./helpers");
const { generateCategoryPagesJa } = require("./generate-category-pages-ja");
const { generateJapaneseHomePage } = require("./generate-ja-home");
const { generateDevicePagesJa } = require("./generate-device-pages-ja");
const { generateJapaneseGuides } = require("./generate-guides-ja");
const { generateHeader, generateFooter, generateGrowScript, generateSidebar } = require("../../src/templates/components-ja");

// Paths
const devicesPath = path.join(__dirname, "../../data/devices-ja.json");
const distPath = path.join(__dirname, "../../dist");
const jaPath = path.join(distPath, "ja");
const srcPath = path.join(__dirname, "../../src");

/**
 * Generate static Japanese pages (about, privacy, terms)
 */
function generateStaticJapanesePages() {
  console.log("📄 Generating static Japanese pages...");
  
  const pages = [
    { template: "about-ja.html", output: "about.html" },
    { template: "privacy-ja.html", output: "privacy.html" },
    { template: "terms-ja.html", output: "terms.html" }
  ];

  pages.forEach(({ template, output }) => {
    const templatePath = path.join(srcPath, "templates", template);
    if (fs.existsSync(templatePath)) {
      let html = readTemplate(templatePath);
      html = processIncludes(html, srcPath);
      html = html
        .replace(/{{SIDEBAR}}/g, generateSidebar())
        .replace(/{{HEADER}}/g, generateHeader())
        .replace(/{{FOOTER}}/g, generateFooter())
        .replace(/{{GROW_SCRIPT}}/g, generateGrowScript());
      
      const outputPath = path.join(jaPath, output);
      writeFile(outputPath, html);
      console.log(`  ✓ Generated ${output}`);
    }
  });
}

async function buildJapanese() {
  console.log("\n🇯🇵 Starting Japanese site generation (/ja/)...\n");

  try {
    // 1. Load Japanese Device Data
    console.log("📊 Loading Japanese device data...");
    const devicesData = readJSON(devicesPath);
    const allDevices = devicesData.devices;
    console.log(`  ✓ Loaded ${allDevices.length} devices\n`);

    // 2. Generate Static Pages (about, privacy, terms)
    generateStaticJapanesePages();
    console.log();

    // 3. Generate Japanese Home Page
    console.log("📄 Generating Japanese home page...");
    generateJapaneseHomePage(distPath);
    console.log();

    // 4. Generate Japanese Device Pages
    console.log("📄 Generating Japanese device pages...");
    await generateDevicePagesJa(allDevices, distPath);
    console.log();
    
    // 5. Generate Japanese Category Pages (no readers)
    console.log("📄 Generating Japanese category pages...");
    generateCategoryPagesJa(allDevices, jaPath);
    console.log();

    // 6. Generate Japanese Guide Pages
    console.log("📄 Generating Japanese guide pages...");
    generateJapaneseGuides(distPath);
    console.log();

    // Success summary
    console.log("✅ Japanese generation complete!");
    console.log(`\n📊 Summary:`);
    const categories = [...new Set(allDevices.map((d) => d.category))].filter(c => c !== "SD Card Readers");
    console.log(`  • Japanese device pages: ${allDevices.length}`);
    console.log(`  • Japanese category pages: ${categories.length}`);
    console.log(`  • Japanese home page: 1`);
    console.log(`\n📁 Output directory: ${jaPath}`);
    console.log(`\n✅ Japanese site ready at /ja/`);
  } catch (error) {
    console.error("❌ Error during Japanese generation:", error);
    process.exit(1);
  }
}

buildJapanese();
