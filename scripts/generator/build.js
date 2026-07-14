#!/usr/bin/env node

/**
 * SD Card Checker - Build Script
 * Orchestrates the entire site generation process. Loops over every enabled locale in
 * data/locales.json and calls the locale-parameterized generators once per locale, then
 * runs the English-only sections (readers, calculators, cars, cards, compare, etc.) once.
 * Replaces the old build.js + build-ja.js split, which double-invoked the Japanese category
 * generator (once from here, once from build-ja.js) and produced the dist/ja/ja/... bug.
 */

const path = require("path");
const fs = require("fs");
const { readJSON } = require("./helpers");
const locales = require("../../data/locales.json");
const { copyAssets } = require("./copy-assets");
const { generateDevicePages } = require("./generate-device-pages");
const { generateCategoryPages, generateSubcategoryPages } = require("./generate-category-pages");
const { generateCategoriesIndexPage } = require("./generate-categories-index");
const { generateResourcePages } = require("./generate-resource-pages");
const { generateCalculatorPages } = require("./generate-calculator-pages");
const { generateToolsPages } = require("./generate-tools-pages");
const { generateReaderPages } = require("./generate-reader-pages");
const { generateReadersIndex } = require("./generate-readers-index");
const { generateReadersTypeIndexPages } = require("./generate-readers-type-index");
const { generateCoreFiles, generateRobots, generate404Page } = require("./generate-core-files");
const { getCategorySlug } = require("./helpers");
const { generateLocalizedGuides } = require("./generate-guides");
const { generateRedirects } = require("./generate-redirects");
const { generateCarPages } = require("./generate-car-pages");
const { generateCarsIndex } = require("./generate-cars-index");
const { generateCardPages } = require("./generate-card-pages");
const { generateCardsIndex } = require("./generate-cards-index");
const { generateComparePage } = require("./generate-compare");

// Paths
const dataPath = path.join(__dirname, "../../data");
const readersPath = path.join(dataPath, "sdCardReaders.json");
const distPath = path.join(__dirname, "../../dist");

/**
 * Merge a locale's per-category device files into its devices JSON
 * (data/categories/*.json -> devices.json for English, data/categories-{locale}/*.json ->
 * devices-{locale}.json for others). Runs automatically before every build; no-ops when the
 * locale has no categories directory yet.
 */
function mergeLocaleDeviceCategories(locale) {
  const devicesFile = locale === "en" ? "devices.json" : `devices-${locale}.json`;
  const categoriesDir = locale === "en" ? "categories" : `categories-${locale}`;
  const devicesFilePath = path.join(dataPath, devicesFile);
  const categoriesDirPath = path.join(dataPath, categoriesDir);

  if (!fs.existsSync(categoriesDirPath)) return;

  let categoryFiles;
  try {
    categoryFiles = fs.readdirSync(categoriesDirPath)
      .filter((f) => f.endsWith(".json") && f !== "README.md")
      .sort();
  } catch (err) {
    console.warn(`Could not read ${categoriesDir}:`, err.message);
    return;
  }
  if (categoryFiles.length === 0) return;

  console.log(`Merging ${locale} category files...`);
  let allDevices = [];
  for (const file of categoryFiles) {
    const filepath = path.join(categoriesDirPath, file);
    try {
      const content = fs.readFileSync(filepath, "utf8");
      const data = JSON.parse(content);
      const devices = Array.isArray(data) ? data : data.devices || [];
      allDevices = allDevices.concat(devices);
      console.log(`  ✓ ${file}: ${devices.length} device(s)`);
    } catch (err) {
      console.warn(`  Error loading ${file}:`, err.message);
    }
  }
  if (allDevices.length === 0) return;

  const metadata = {
    generated: new Date().toISOString(),
    totalDevices: allDevices.length,
    categories: [...new Set(allDevices.map((d) => d.category))].sort(),
    categoryCount: new Set(allDevices.map((d) => d.category)).size,
  };
  const output =
    locale === "en"
      ? { devices: allDevices, metadata }
      : { _metadata: { language: locales[locale].name, ...metadata }, devices: allDevices };

  fs.writeFileSync(devicesFilePath, JSON.stringify(output, null, 2));
  console.log(`  ✓ Merged ${allDevices.length} device(s) → ${devicesFile}\n`);
}

function loadLocaleDevices(locale) {
  const devicesFile = locale === "en" ? "devices.json" : `devices-${locale}.json`;
  const devicesFilePath = path.join(dataPath, devicesFile);
  if (!fs.existsSync(devicesFilePath)) return [];
  const devicesData = readJSON(devicesFilePath);
  return devicesData.devices || [];
}

async function build() {
  console.log("\nStarting SD Card Checker site generation...\n");

  try {
    const enabledLocales = Object.entries(locales)
      .filter(([, cfg]) => cfg.enabled)
      .map(([code]) => code);

    // 0. Merge category files (if they exist) for every enabled locale
    enabledLocales.forEach(mergeLocaleDeviceCategories);

    // 1. Load device data per locale
    console.log("Loading device data...");
    const devicesByLocale = {};
    enabledLocales.forEach((locale) => {
      devicesByLocale[locale] = loadLocaleDevices(locale);
      console.log(`  ✓ Loaded ${devicesByLocale[locale].length} ${locale} devices`);
    });
    const allDevices = devicesByLocale.en || [];

    // Locales that actually have devices to build (drives hreflang: never point at a
    // locale's page that isn't going to exist)
    const buildableLocales = enabledLocales.filter((locale) => devicesByLocale[locale].length > 0);

    // Category slug -> locales that carry that category, for per-category-page hreflang
    const categoryLocalesMap = {};
    buildableLocales.forEach((locale) => {
      devicesByLocale[locale].forEach((device) => {
        const slug = getCategorySlug(device.category);
        if (!categoryLocalesMap[slug]) categoryLocalesMap[slug] = new Set();
        categoryLocalesMap[slug].add(locale);
      });
    });

    console.log("Loading SD Card Reader data...");
    const readersData = readJSON(readersPath);
    const allReaders = readersData.sdCardReaders || [];
    console.log(`  ✓ Loaded ${allReaders.length} SD Card Readers\n`);

    // 2. Copy Assets
    console.log("Copying assets...");
    await copyAssets();
    console.log();

    // 3. Per-locale generation: device pages, category pages, categories index, core
    // files (homepage/sitemap/legal), localized guides
    for (const locale of enabledLocales) {
      const localeDevices = devicesByLocale[locale];
      if (localeDevices.length === 0) {
        console.warn(`  Skipping ${locale}: no devices loaded\n`);
        continue;
      }

      await generateDevicePages(localeDevices, distPath, locale);
      console.log();

      await generateCategoryPages(localeDevices, distPath, locale, categoryLocalesMap);
      console.log();

      if (locale === "en") {
        // Subcategory pages (e.g. /categories/drones/dji/) are English-only for now
        await generateSubcategoryPages(localeDevices, distPath);
        console.log();
      }

      generateCategoriesIndexPage(localeDevices, distPath, locale, buildableLocales);
      console.log();

      await generateCoreFiles(localeDevices, allReaders, distPath, locale, buildableLocales);
      console.log();

      generateLocalizedGuides(distPath, locale);
      console.log();
    }

    // 4. English-only sections
    await generateResourcePages(distPath);
    console.log();

    await generateCalculatorPages(distPath);
    console.log();

    await generateToolsPages(distPath);
    console.log();

    await generateReaderPages();
    console.log();

    await generateReadersIndex();
    console.log();

    await generateReadersTypeIndexPages();
    console.log();

    await generateCarPages(distPath);
    console.log();

    generateCarsIndex(distPath);
    console.log();

    await generateCardPages(allDevices, distPath);
    console.log();

    generateCardsIndex(distPath);
    console.log();

    generateComparePage(distPath);
    console.log();

    await generateRedirects(allDevices, distPath);
    console.log();

    // 5. Global files (English-only 404, robots.txt listing every enabled locale's sitemap)
    generate404Page(distPath);
    generateRobots(distPath);

    // Success summary
    console.log("Generation complete!");
    console.log(`\nSummary:`);
    console.log(`  • Locales built: ${enabledLocales.join(", ")}`);
    console.log(`  • English device pages: ${allDevices.length}`);
    const categories = [...new Set(allDevices.map((d) => d.category))];
    console.log(`  • English category pages: ${categories.length}`);
    console.log(`  • SD Card Reader pages: 14`);
    console.log(`  • Reader Buying Guides: 4`);
    console.log(`  • Sitemap & robots.txt: ✓`);
    console.log(`\nOutput directory: ${distPath}`);
    console.log(`\nTo view locally, run: npx http-server dist`);
    console.log(
      `\nDon't forget to add your Mediavine code to your pages!\n`
    );
  } catch (error) {
    console.error(
      "Error during generation:",
      error.message
    );
    process.exit(1);
  }
}

build();
