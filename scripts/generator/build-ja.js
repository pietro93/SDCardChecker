#!/usr/bin/env node

/**
 * SD Card Checker - Japanese Build Script (/ja/)
 * Generates Japanese version of the site
 */

const path = require("path");
const { readJSON } = require("./helpers");
const { generateCategoryPagesJa } = require("./generate-category-pages-ja");
const { generateJapaneseHomePage } = require("./generate-ja-home");

// Paths
const devicesPath = path.join(__dirname, "../../data/devices-ja.json");
const distPath = path.join(__dirname, "../../dist");
const jaPath = path.join(distPath, "ja");

async function buildJapanese() {
  console.log("\n🇯🇵 Starting Japanese site generation (/ja/)...\n");

  try {
    // 1. Load Japanese Device Data
    console.log("📊 Loading Japanese device data...");
    const devicesData = readJSON(devicesPath);
    const allDevices = devicesData.devices;
    console.log(`  ✓ Loaded ${allDevices.length} devices\n`);

    // 2. Generate Japanese Home Page
    console.log("📄 Generating Japanese home page...");
    generateJapaneseHomePage(distPath);
    console.log();

    // 3. Japanese Device Pages - Planned for Phase 2
    // Currently using English pages with Japanese category structure
    // Full Japanese device pages coming in future update
    
    // 4. Generate Japanese Category Pages (no readers)
    console.log("📄 Generating Japanese category pages...");
    generateCategoryPagesJa(allDevices, jaPath);
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
