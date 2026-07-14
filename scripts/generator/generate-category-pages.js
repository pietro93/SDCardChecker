/**
 * SD Card Checker - Category Pages Generator
 * Locale-parameterized: pass a locale code ("en", "ja", "de", ...) instead of forking this
 * file per language. Category slugs/labels come from data/category-slugs.json (the single
 * source of truth that replaced the per-file categorySlugMap copies this file used to have).
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateBreadcrumbSchema, getDeviceImageFallback, getCategorySlug, getCategoryLabel, getCategoryIconName, generateHreflangTags, t } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");
const locales = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/locales.json"), "utf8"));

const MIN_SUBCATEGORY_DEVICES = 3;
// Manufacturer names that span two words; checked before falling back to the first word of the device name
const TWO_WORD_BRANDS = ["Bambu Lab", "Holy Stone", "Raspberry Pi"];
// Categories hidden from a locale's category index entirely (e.g. Japan doesn't offer readers yet)
const EXCLUDED_CATEGORIES_BY_LOCALE = {
  ja: ["Card Readers"],
};

function slugify(str) {
  return str.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

function extractBrand(deviceName) {
  for (const brand of TWO_WORD_BRANDS) {
    if (deviceName.startsWith(brand + " ")) return brand;
  }
  return deviceName.split(" ")[0];
}

/**
 * Group devices by brand and keep only brands with enough devices to justify a subcategory page
 */
function getQualifyingBrands(devices) {
  const byBrand = {};
  devices.forEach((device) => {
    const brand = extractBrand(device.name);
    if (!byBrand[brand]) byBrand[brand] = [];
    byBrand[brand].push(device);
  });
  return Object.entries(byBrand)
    .filter(([, brandDevices]) => brandDevices.length >= MIN_SUBCATEGORY_DEVICES)
    .map(([brand, brandDevices]) => ({ brand, devices: brandDevices }));
}

/**
* Get device image URL with fallback for missing files
*/
function getDeviceImage(device) {
  if (device.imageUrl) {
    const imagePath = path.join(__dirname, "../../img/devices", device.imageUrl.replace("/img/devices/", ""));
    if (fs.existsSync(imagePath)) {
      return device.imageUrl;
    }
  }
  return getDeviceImageFallback(device);
}

/**
* Generate device cards for a category page
*/
function generateDeviceCards(devices, locale) {
  const dirPrefix = locales[locale] && locales[locale].dir ? `/${locales[locale].dir}` : "";
  const viewLabel = locale === "ja" ? "詳細 →" : "View →";
  // Sort devices alphabetically by name
  const sortedDevices = [...devices].sort((a, b) => a.name.localeCompare(b.name));
  return sortedDevices
    .map((device) => {
      const categorySlug = getCategorySlug(device.category);
      return `
<div class="device-card" style="background-image: url('${getDeviceImage(device)}'); background-size: cover; background-position: center; position: relative;" role="article" aria-label="SD card recommendation for ${device.name}" tabindex="0" onmouseover="this.querySelector('.device-card-overlay').style.opacity='0.95'" onmouseout="this.querySelector('.device-card-overlay').style.opacity='0.85'">
<div class="device-card-overlay" style="position: absolute; inset: 0; background: rgba(240, 240, 240, 0.85); transition: opacity 0.3s ease;"></div>
<a href="${dirPrefix}/categories/${categorySlug}/${device.slug}/" style="position: relative; z-index: 1; text-decoration: none; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; width: 100%; height: 100%;">
<div class="device-card-name" style="color: #2563eb; opacity: 1; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);">${device.name}</div>
<span class="device-card-link" style="color: #666; opacity: 0.75; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);">${viewLabel}</span>
</a>
</div>
`;
    })
    .join("");
}

/**
 * Locale-keyed category intro copy, keyed by canonical category slug (see
 * data/category-slugs.json). A locale/slug combination missing here falls back to a
 * generic templated sentence in that locale.
 */
const CATEGORY_INTROS = {
  en: {
    "action-cameras": "Action cameras require fast SD cards to handle high-bitrate video recording. Find the best cards for GoPro, DJI, and other action cameras.",
    "audio-and-hi-fi": "Digital Audio Players and portable recorders need reliable microSD cards for music libraries and high-quality audio recording. Find the best cards for Sony Walkman, HiBy, Zoom, and other audio devices.",
    "cameras": "Professional cameras including DSLRs, mirrorless, and cinema cameras require fast, reliable cards for RAW photo and high-bitrate video recording. Find the perfect card for your setup.",
    "computing-and-tablets": "Tablets and Chromebooks benefit from reliable microSD cards for expanded storage and media. Compare options for Amazon Fire, Samsung Galaxy, and more.",
    "dash-cams": "Dash cameras require reliable, high-speed microSD cards for stable video recording. Find the best cards for popular dashcam models and ensure continuous, high-quality recording.",
    "drones": "Drones demand reliable, high-speed SD cards for smooth 4K video capture. Compare top recommendations for popular drone models.",
    "gaming-handhelds": "Gaming handhelds need reliable cards for smooth game installation and loading. See the best options for Nintendo Switch, Steam Deck, and more.",
    "smartphones": "Modern smartphones require external card readers to access SD cards. Find the best readers and compatible cards for iPhone, Samsung Galaxy, Google Pixel, and other devices.",
    "security-cameras": "Security cameras require High Endurance microSD cards designed for continuous recording. Find the best cards for 24/7 surveillance systems.",
    "music-production": "Standalone samplers and drum machines stream samples in real time during performance. Find reliable full-size SD cards for the Akai MPC Live II, MPC One+, and Roland SP-404MKII that keep sets dropout-free.",
  },
  ja: {
    "action-cameras": "アクションカメラは高いビットレートのビデオ録画に対応できる高速SDカードが必要です。GoPro、DJI、その他のアクションカメラに最適なカードを見つけてください。",
    "cameras": "デジタル一眼レフカメラ、ミラーレスカメラ、シネマカメラなどのプロフェッショナルカメラは、RAW写真と高ビットレートのビデオ録画に対応できる高速で信頼性の高いカードが必要です。",
    "computing-and-tablets": "タブレットとChromebookは、ストレージ拡張とメディア用に信頼性の高いmicroSDカードから恩恵を受けます。Amazon Fire、Samsung Galaxy、その他のオプションを比較してください。",
    "drones": "ドローンは滑らかな4Kビデオキャプチャのための信頼性の高い高速SDカードが必要です。人気のあるドローンモデルの推奨事項を比較してください。",
    "gaming-handhelds": "携帯ゲーム機はゲームのスムーズなインストールと読み込みのための信頼性の高いカードが必要です。Nintendo Switch、Steam Deck、その他のオプションを確認してください。",
    "security-cameras": "セキュリティカメラは、24時間の連続録画用に設計された高耐久性microSDカードが必要です。24/7監視システムに最適なカードを見つけてください。",
    "dash-cams": "ドライブレコーダーは、安定した高品質ビデオ録画のための信頼性の高い高速microSDカードが必要です。人気のあるドライブレコーダーモデルの推奨事項を見つけてください。",
  },
};

const GENERIC_INTRO_TEMPLATES = {
  en: (label) => `Find the best SD cards for your ${label} devices. Compare speeds, prices, and features.`,
  ja: (label) => `${label}デバイス用の最適なSDカードを見つけてください。速度、価格、機能を比較してください。`,
  de: (label) => `Finden Sie die besten SD-Karten für Ihre ${label}-Geräte. Vergleichen Sie Geschwindigkeiten, Preise und Funktionen.`,
};

function getCategoryIntro(categorySlug, category, locale) {
  const byLocale = CATEGORY_INTROS[locale] || {};
  if (byLocale[categorySlug]) return byLocale[categorySlug];
  const label = getCategoryLabel(category, locale);
  const template = GENERIC_INTRO_TEMPLATES[locale] || GENERIC_INTRO_TEMPLATES.en;
  return template(label);
}

/**
 * Generate "Browse by brand" links to qualifying subcategory pages (English only for now -
 * subcategory pages aren't generated for other locales, see generateSubcategoryPages below)
 */
function generateSubcategoryLinksHTML(category, devices) {
  const qualifyingBrands = getQualifyingBrands(devices);
  if (qualifyingBrands.length === 0) return "";

  const categorySlug = slugify(category);
  const links = qualifyingBrands
    .map(({ brand }) => {
      const brandSlug = slugify(brand);
      return `<a href="/categories/${categorySlug}/${brandSlug}/" class="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 font-medium text-sm transition-all duration-200">${brand}</a>`;
    })
    .join("");

  return `
      <div class="mb-8 flex flex-wrap gap-3 items-center">
        <div class="text-sm font-semibold text-slate-700 mr-2">Browse by brand:</div>
        ${links}
      </div>`;
}

/**
 * Generate single category page
 */
function generateCategoryPage(category, devices, template, locale = "en", categoryLocalesMap = {}) {
  const baseUrl = "https://sdcardchecker.com";
  const dirPrefix = locales[locale] && locales[locale].dir ? `/${locales[locale].dir}` : "";
  const categorySlug = getCategorySlug(category);
  const categoryUrl = `${baseUrl}${dirPrefix}/categories/${categorySlug}/`;
  const categoryLabel = getCategoryLabel(category, locale);
  const categoryTitle = locale === "ja"
    ? `${categoryLabel}向けの最高のSDカード | SD Card Checker`
    : `Best SD Cards for ${categoryLabel} | SD Card Checker`;
  const categoryIntro = getCategoryIntro(categorySlug, category, locale);
  // Build description from intro text, truncating to ~140-150 chars for SEO
  const categoryDescription = categoryIntro.length > 155
    ? categoryIntro.substring(0, 155) + "..."
    : categoryIntro;
  const deviceCardsHTML = generateDeviceCards(devices, locale);

  // Generate breadcrumb schema for category pages
  const breadcrumbs = [
    { name: t("breadcrumbHome", locale), url: dirPrefix ? `${dirPrefix}/` : "/" },
    { name: categoryLabel, url: `${dirPrefix}/categories/${categorySlug}/` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const categoryIcon = getCategoryIconName(category);
  const localesWithCategory = [...(categoryLocalesMap[categorySlug] || [locale])];
  const hreflangTags = generateHreflangTags(`/categories/${categorySlug}/`, localesWithCategory);

  let html = template
    .replace(/{{CATEGORY_TITLE}}/g, categoryTitle)
    .replace(/{{CATEGORY_DESCRIPTION}}/g, categoryDescription)
    .replace(/{{CATEGORY_URL}}/g, categoryUrl)
    .replace(/{{HREFLANG_TAGS}}/g, hreflangTags)
    .replace(/{{CATEGORY_NAME}}/g, categoryLabel)
    .replace(/{{CATEGORY_ICON}}/g, categoryIcon)
    .replace(/{{CATEGORY_INTRO}}/g, categoryIntro)
    .replace(/{{SUBCATEGORY_LINKS}}/g, locale === "en" ? generateSubcategoryLinksHTML(category, devices) : "")
    .replace(/{{DEVICE_CARDS_HTML}}/g, deviceCardsHTML)
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{SIDEBAR}}/g, generateSidebar(locale))
    .replace(/{{HEADER}}/g, generateHeader(locale))
    .replace(/{{FOOTER}}/g, generateFooter(locale))
    .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
    .replace(/{{AFFILIATE_DISCLOSURE}}/g, "");

  return html;
}

/**
 * Generate all category pages for a locale
 */
async function generateCategoryPages(allDevices, distPath, locale = "en", categoryLocalesMap = {}) {
    console.log(`Generating ${locale} category pages...`);

    const templateFile = locale === "ja" ? "category-ja.html" : "category.html";
    let categoryTemplate = readTemplate(
        path.join(srcPath, "templates", templateFile)
    );
    // Process {% include %} tags
    categoryTemplate = processIncludes(categoryTemplate, path.join(srcPath, "templates"));

    const excluded = EXCLUDED_CATEGORIES_BY_LOCALE[locale] || [];
    const dirPrefix = locales[locale] && locales[locale].dir ? locales[locale].dir : "";

    // Group devices by category
    const grouped = {};
    allDevices.forEach((device) => {
        if (excluded.includes(device.category)) return;
        if (!grouped[device.category]) {
            grouped[device.category] = [];
        }
        grouped[device.category].push(device);
    });

    // Generate page for each category
    Object.keys(grouped)
        .sort()
        .forEach((category) => {
            const categoryHTML = generateCategoryPage(
                category,
                grouped[category],
                categoryTemplate,
                locale,
                categoryLocalesMap
            );
            const categorySlug = getCategorySlug(category);
            const categoryPath = path.join(
                distPath,
                dirPrefix,
                "categories",
                categorySlug,
                "index.html"
            );
            writeFile(categoryPath, categoryHTML);
        });

    console.log(`  ✓ Generated ${Object.keys(grouped).length} ${locale} category pages`);
}

/**
 * Get subcategory introduction text
 */
function getSubcategoryIntro(brand, category) {
  return `Browse our SD card recommendations for ${brand} ${category} devices — compare speeds, capacities, and prices to find the right card for your ${brand} gear.`;
}

/**
 * Generate single subcategory (category + brand) page - English only (see generateSubcategoryPages)
 */
function generateSubcategoryPage(category, brand, devices, template) {
  const baseUrl = "https://sdcardchecker.com";
  const categorySlug = slugify(category);
  const brandSlug = slugify(brand);
  const subcategoryUrl = `${baseUrl}/categories/${categorySlug}/${brandSlug}/`;
  const subcategoryTitle = `Best SD Cards for ${brand} ${category} | SD Card Checker`;
  const subcategoryIntro = getSubcategoryIntro(brand, category);
  const subcategoryDescription = subcategoryIntro.length > 155
    ? subcategoryIntro.substring(0, 155) + "..."
    : subcategoryIntro;
  const deviceCardsHTML = generateDeviceCards(devices, "en");

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: category, url: `/categories/${categorySlug}/` },
    { name: brand, url: `/categories/${categorySlug}/${brandSlug}/` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const categoryIcon = getCategoryIconName(category);

  return template
    .replace(/{{SUBCATEGORY_TITLE}}/g, subcategoryTitle)
    .replace(/{{SUBCATEGORY_DESCRIPTION}}/g, subcategoryDescription)
    .replace(/{{SUBCATEGORY_URL}}/g, subcategoryUrl)
    .replace(/{{CATEGORY_NAME}}/g, category)
    .replace(/{{CATEGORY_SLUG}}/g, categorySlug)
    .replace(/{{BRAND_NAME}}/g, brand)
    .replace(/{{CATEGORY_ICON}}/g, categoryIcon)
    .replace(/{{SUBCATEGORY_INTRO}}/g, subcategoryIntro)
    .replace(/{{DEVICE_CARDS_HTML}}/g, deviceCardsHTML)
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{SIDEBAR}}/g, generateSidebar("en"))
    .replace(/{{HEADER}}/g, generateHeader("en"))
    .replace(/{{FOOTER}}/g, generateFooter("en"))
    .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
    .replace(/{{AFFILIATE_DISCLOSURE}}/g, "");
}

/**
 * Generate subcategory pages for brands with at least MIN_SUBCATEGORY_DEVICES
 * devices within a category, e.g. /categories/drones/dji/ - English only, see
 * data/locales.json comment history for why this hasn't been extended to other locales yet.
 */
async function generateSubcategoryPages(allDevices, distPath) {
  console.log("Generating subcategory pages...");

  let subcategoryTemplate = readTemplate(
    path.join(srcPath, "templates/subcategory.html")
  );
  subcategoryTemplate = processIncludes(subcategoryTemplate, path.join(srcPath, "templates"));

  const grouped = {};
  allDevices.forEach((device) => {
    if (!grouped[device.category]) {
      grouped[device.category] = [];
    }
    grouped[device.category].push(device);
  });

  let count = 0;
  Object.keys(grouped)
    .sort()
    .forEach((category) => {
      getQualifyingBrands(grouped[category]).forEach(({ brand, devices }) => {
        const subcategoryHTML = generateSubcategoryPage(category, brand, devices, subcategoryTemplate);
        const categorySlug = slugify(category);
        const brandSlug = slugify(brand);
        const subcategoryPath = path.join(
          distPath,
          "categories",
          categorySlug,
          brandSlug,
          "index.html"
        );
        writeFile(subcategoryPath, subcategoryHTML);
        count++;
      });
    });

  console.log(`  ✓ Generated ${count} subcategory pages`);
}

module.exports = { generateCategoryPages, generateSubcategoryPages, getQualifyingBrands, extractBrand, slugify };
