#!/usr/bin/env node

/**
 * SD Card Checker - Build Script
 * Orchestrates the entire site generation process
 */

const path = require("path");
const fs = require("fs");
const { readJSON } = require("./helpers");
const { copyAssets } = require("./copy-assets");
const { generateDevicePages } = require("./generate-device-pages");
const { generateCategoryPages } = require("./generate-category-pages");
const { generateCategoryPagesJa } = require("./generate-category-pages-ja");
const { generateCategoriesIndexPages } = require("./generate-categories-index");
const { generateResourcePages } = require("./generate-resource-pages");
const { generateCalculatorPages } = require("./generate-calculator-pages");
const { generateToolsPages } = require("./generate-tools-pages");
const { generateReaderPages } = require("./generate-reader-pages");
const { generateReadersIndex } = require("./generate-readers-index");
const { generateReadersTypeIndexPages } = require("./generate-readers-type-index");
const { generateCoreFiles } = require("./generate-core-files");
const { generateRedirects } = require("./generate-redirects");
const { generateEnglishSitemap } = require("./generate-sitemaps");

// Paths
const dataPath = path.join(__dirname, "../../data/devices.json");
const categoriesPath = path.join(__dirname, "../../data/categories");
const readersPath = path.join(__dirname, "../../data/sdCardReaders.json");
const distPath = path.join(__dirname, "../../dist");

/**
 * Merge category files into devices.json
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

    console.log("🔄 Merging category files...");
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

      fs.writeFileSync(dataPath, JSON.stringify(output, null, 2));
      console.log(`  ✓ Merged ${allDevices.length} device(s) → devices.json\n`);
    }
  } catch (err) {
    console.warn("⚠️  Could not merge category files:", err.message);
    console.log("   Proceeding with existing devices.json\n");
  }
}

async function build() {
  console.log("\n🚀 Starting SD Card Checker site generation...\n");

  try {
    // 0. Merge category files (if they exist)
    mergeDeviceCategories();

    // 1. Load Data
    console.log("📊 Loading device data...");
    const devicesData = readJSON(dataPath);
    const allDevices = devicesData.devices;
    console.log(`  ✓ Loaded ${allDevices.length} devices`);

    console.log("📊 Loading SD Card Reader data...");
    const readersData = readJSON(readersPath);
    const allReaders = readersData.sdCardReaders || [];
    console.log(`  ✓ Loaded ${allReaders.length} SD Card Readers\n`);

    // 2. Copy Assets
    console.log("📁 Copying assets...");
    await copyAssets();
    console.log();

    // 3. Generate Device Pages (English)
    await generateDevicePages(allDevices, distPath);
    console.log();

    // 3.5. Generate Device Pages (Japanese)
    await generateDevicePages(allDevices, distPath, true);
    console.log();

    // 4. Generate Category Pages
    await generateCategoryPages(allDevices, distPath);
    console.log();

    // 4.2. Generate Japanese Category Pages
    await generateCategoryPagesJa(allDevices, distPath);
    console.log();

    // 4.5. Generate Categories Index Pages (/categories/, /ja/categories/)
    await generateCategoriesIndexPages(allDevices, distPath);
    console.log();

    // 5. Generate Resource Pages
    await generateResourcePages(distPath);
    console.log();

    // 6. Generate Calculator Pages
    await generateCalculatorPages(distPath);
    console.log();

    // 6.5. Generate Tools Pages (/tools/, /tools/calculators/)
    await generateToolsPages(distPath);
    console.log();

    // 6.6. Generate SD Card Reader Pages (/readers/[slug]/)
    await generateReaderPages();
    console.log();

    // 6.7. Generate Readers Index Page (/readers/)
    await generateReadersIndex();
    console.log();

    // 6.8. Generate Reader Type Index Pages (/readers/[type]/)
    await generateReadersTypeIndexPages();
    console.log();

    // 7. Generate URL Redirects for SEO migration
    await generateRedirects(allDevices, distPath);
    console.log();

    // 8. Generate English Sitemap (to public/)
    console.log("📡 Generating English sitemap...");
    generateEnglishSitemap(allDevices, allReaders);
    console.log();

    // 9. Generate Core Files (robots.txt, legal pages, etc.)
    console.log("📝 Generating core files...");
    await generateCoreFiles(allDevices, allReaders, distPath);
    console.log();

    // Success summary
    console.log("✅ Generation complete!");
    console.log(`\n📊 Summary:`);
    console.log(`  • Homepage: 1`);
    console.log(`  • Device pages: ${allDevices.length}`);
    const categories = [...new Set(allDevices.map((d) => d.category))];
    console.log(`  • Category pages: ${categories.length}`);
    console.log(`  • SD Card Reader pages: 14`);
    console.log(`  • Reader Buying Guides: 4`);
    console.log(`  • Sitemap & robots.txt: ✓`);
    console.log(`\n📁 Output directory: ${distPath}`);
    console.log(`\n🚀 To view locally, run: npx http-server dist`);
    console.log(
      `\n💡 Don't forget to add your Mediavine code to your pages!\n`
    );
  } catch (error) {
    console.error(
      "❌ Error during generation:",
      error.message
    );
    process.exit(1);
  }
}

build();
