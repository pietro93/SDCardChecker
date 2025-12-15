#!/usr/bin/env node

/**
 * SD Card Checker - Build Script
 * Orchestrates the entire site generation process
 */

const path = require("path");
const { readJSON } = require("./helpers");
const { copyAssets } = require("./copy-assets");
const { generateDevicePages } = require("./generate-device-pages");
const { generateCategoryPages } = require("./generate-category-pages");
const { generateResourcePages } = require("./generate-resource-pages");
const { generateCalculatorPages } = require("./generate-calculator-pages");
const { generateToolsPages } = require("./generate-tools-pages");
const { generateReaderPages } = require("./generate-reader-pages");
const { generateReadersIndex } = require("./generate-readers-index");
const { generateReadersTypeIndexPages } = require("./generate-readers-type-index");
const { generateCoreFiles } = require("./generate-core-files");
const { generateRedirects } = require("./generate-redirects");

// Paths
const dataPath = path.join(__dirname, "../../data/devices.json");
const readersPath = path.join(__dirname, "../../data/sdCardReaders.json");
const distPath = path.join(__dirname, "../../dist");

async function build() {
  console.log("\n🚀 Starting SD Card Checker site generation...\n");

  try {
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

    // 3. Generate Device Pages
    await generateDevicePages(allDevices, distPath);
    console.log();

    // 4. Generate Category Pages
    await generateCategoryPages(allDevices, distPath);
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

    // 8. Generate Core Files (Sitemap, robots.txt, etc.)
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
