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
const { generateJapaneseCoreFiles } = require("./generate-core-files-ja");
const { generateHeader, generateFooter, generateGrowScript, generateSidebar } = require("../../src/templates/components-ja");
const { generateJapaneseSitemap } = require("./generate-sitemaps");

// Paths
const devicesPath = path.join(__dirname, "../../data/devices.json"); // Uses merged devices.json
const categoriesPath = path.join(__dirname, "../../data/categories");
const devicesJaPath = path.join(__dirname, "../../data/devices-ja.json"); // Japanese devices
const categoriesJaPath = path.join(__dirname, "../../data/categories-ja");
const distPath = path.join(__dirname, "../../dist");
const jaPath = path.join(distPath, "ja");
const srcPath = path.join(__dirname, "../../src");

/**
 * Merge English category files into devices.json
 * This runs automatically before every build
 */
function mergeDeviceCategories() {
  if (!fs.existsSync(categoriesPath)) {
    return; // No categories directory, use existing devices.json
  }

  try {
    const categoryFiles = fs.readdirSync(categoriesPath)
      .filter(f => f.endsWith('.json') && f !== 'README.md')
      .sort();

    if (categoryFiles.length === 0) {
      return; // No category files, use existing devices.json
    }

    console.log("🔄 Merging English category files...");
    let allDevices = [];

    // Load each category file
    for (const file of categoryFiles) {
      const filepath = path.join(categoriesPath, file);
      try {
        const content = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(content);
        const devices = Array.isArray(data) ? data : (data.devices || []);
        allDevices = allDevices.concat(devices);
        console.log(`  ✓ ${file}: ${devices.length} device(s)`);
      } catch (err) {
        console.warn(`  ⚠️  Error loading ${file}:`, err.message);
      }
    }

    if (allDevices.length > 0) {
      // Write merged devices.json
      const output = {
        devices: allDevices,
        metadata: {
          generated: new Date().toISOString(),
          totalDevices: allDevices.length,
          categories: [...new Set(allDevices.map(d => d.category))].sort(),
          categoryCount: new Set(allDevices.map(d => d.category)).size
        }
      };

      fs.writeFileSync(devicesPath, JSON.stringify(output, null, 2));
      console.log(`  ✓ Merged ${allDevices.length} device(s) → devices.json\n`);
    }
  } catch (err) {
    console.warn("⚠️  Could not merge English category files:", err.message);
    console.log("   Proceeding with existing devices.json\n");
  }
}

/**
 * Merge Japanese category files into devices-ja.json
 * This runs automatically before every build
 */
function mergeJapaneseCategoryFiles() {
  if (!fs.existsSync(categoriesJaPath)) {
    return; // No categories-ja directory, use existing devices-ja.json
  }

  try {
    const categoryFiles = fs.readdirSync(categoriesJaPath)
      .filter(f => f.endsWith('.json') && f !== 'README.md')
      .sort();

    if (categoryFiles.length === 0) {
      return; // No category files, use existing devices-ja.json
    }

    console.log("🔄 Merging Japanese category files...");
    let allDevices = [];

    // Load each category file
    for (const file of categoryFiles) {
      const filepath = path.join(categoriesJaPath, file);
      try {
        const content = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(content);
        const devices = Array.isArray(data) ? data : (data.devices || []);
        allDevices = allDevices.concat(devices);
        console.log(`  ✓ ${file}: ${devices.length} device(s)`);
      } catch (err) {
        console.warn(`  ⚠️  Error loading ${file}:`, err.message);
      }
    }

    if (allDevices.length > 0) {
      // Write merged devices-ja.json with metadata
      const output = {
        _metadata: {
          language: "Japanese (日本語)",
          generated: new Date().toISOString(),
          totalDevices: allDevices.length,
          categories: [...new Set(allDevices.map(d => d.category))].sort(),
          categoryCount: new Set(allDevices.map(d => d.category)).size
        },
        devices: allDevices
      };

      fs.writeFileSync(devicesJaPath, JSON.stringify(output, null, 2));
      console.log(`  ✓ Merged ${allDevices.length} device(s) → devices-ja.json\n`);
    }
  } catch (err) {
    console.warn("⚠️  Could not merge Japanese category files:", err.message);
    console.log("   Proceeding with existing devices-ja.json\n");
  }
}

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
    // 0a. Merge English category files (if they exist)
    mergeDeviceCategories();

    // 0b. Merge Japanese category files (if they exist)
    mergeJapaneseCategoryFiles();

    // 1. Load Japanese Device Data
    console.log("📊 Loading Japanese device data...");
    const devicesData = readJSON(devicesJaPath);
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

    // 7. Generate Japanese Sitemap (to public/ja/)
    console.log("📡 Generating Japanese sitemap...");
    generateJapaneseSitemap(allDevices);
    console.log();

    // 8. Generate Japanese Core Files (robots.txt, etc.)
    console.log("📄 Generating Japanese core files...");
    await generateJapaneseCoreFiles(allDevices, distPath);
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
