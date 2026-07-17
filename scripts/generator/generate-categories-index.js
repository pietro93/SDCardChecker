/**
 * SD Card Checker - Categories Index Generator
 * Generates /categories/, /ja/categories/, etc. Locale-parameterized: each locale renders
 * from its own device list (previously the Japanese index reused the English device list
 * with translated labels only - this also fixes that mismatch).
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateBreadcrumbSchema, getCategorySlug, getCategoryLabel, getCategoryIconName, generateHreflangTags, t } = require("./helpers");
const components = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");
const locales = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/locales.json"), "utf8"));

/**
 * Locale-keyed category card descriptions, keyed by canonical category slug.
 */
const CATEGORY_DESCRIPTIONS = {
  en: {
    "cameras": "Find the best SD cards for DSLR and mirrorless cameras, including professional models for RAW photography and high-bitrate video.",
    "action-cameras": "Discover SD cards optimized for GoPro, DJI, and other action cameras that demand fast, reliable storage for 4K+ video.",
    "drones": "Compare SD cards designed for DJI, Autel, and other drone systems requiring dependable 4K video capture.",
    "gaming-handhelds": "Explore SD card options for Nintendo Switch, Steam Deck, and other gaming handhelds that need reliable fast storage.",
    "computing-and-tablets": "Browse microSD cards perfect for iPad, Chromebook, Android tablets, and other computing devices.",
    "smartphones": "Explore external SD card readers and recommendations for iPhones, Samsung Galaxy, Google Pixel, and other smartphones.",
    "dash-cams": "Find durable SD cards suited for dash cam and vehicle recorder systems.",
    "security-cameras": "Discover 24/7 surveillance-grade microSD cards for security camera systems.",
    "3d-printers-and-fabrication": "Find reliable microSD cards for Bambu Lab, Creality, and other 3D printers — where a single corrupt read can ruin a multi-hour, real-material print.",
    "music-production": "Find the best SD cards for standalone samplers and drum machines like the Akai MPC and Roland SP-404MKII — reliable cards that keep sample streaming dropout-free on stage.",
    "accessories": "Explore SD card readers, adapters, and other accessories for your devices.",
  },
  ja: {
    "cameras": "RAW写真撮影と高ビットレート動画に対応したDSLRおよびミラーレスカメラ向けの最高のSDカードを見つけてください。",
    "action-cameras": "4K以上の動画撮影のための高速で信頼性の高いストレージが必要なGoPro、DJI、その他のアクションカメラ向けのSDカードをお探しください。",
    "drones": "DJI、Autel、その他のドローンシステム向けの4K動画キャプチャに対応したSDカードを比較してください。",
    "gaming-handhelds": "信頼性の高い高速ストレージが必要なNintendo Switch、Steam Deck、その他の携帯ゲーム機向けのSDカードオプションをお探しください。",
    "computing-and-tablets": "iPad、Chromebook、Androidタブレット、その他のコンピュータデバイス向けの完璧なmicroSDカードをお探しください。",
    "smartphones": "iPhone、Samsung Galaxy、Google Pixel、その他のスマートフォン向けの外部SDカードリーダーおよび推奨事項をご確認ください。",
    "dash-cams": "ドライブレコーダーおよび車載レコーダーシステム向けの耐久性の高いSDカードを見つけてください。",
    "security-cameras": "セキュリティカメラシステム向けの24時間監視対応のmicroSDカードをお探しください。",
    "music-production": "Akai MPCやRoland SP-404MKIIなどのスタンドアロンサンプラー・ドラムマシン向けの最高のSDカードを見つけてください。ライブ中のサンプルストリーミングをドロップアウトさせない信頼性の高いカードをお探しください。",
    "accessories": "SDカードリーダー、アダプター、およびデバイス用のその他のアクセサリーをお探しください。",
  },
};

const VIEW_CATEGORY_LABEL = { en: "View Category", ja: "詳細を見る", de: "Kategorie ansehen", fr: "Voir la catégorie", it: "Vedi categoria" };
const DEVICE_COUNT_LABEL = {
  en: (n) => `${n} devices`,
  ja: (n) => `${n}個のデバイス`,
  de: (n) => `${n} Geräte`,
  fr: (n) => `${n} appareils`,
  it: (n) => `${n} dispositivi`,
};

/**
 * Categories hidden from a locale's index entirely
 */
const EXCLUDED_CATEGORIES_BY_LOCALE = { ja: ["Card Readers"] };

function generateCategoryCard(category, deviceCount, locale) {
  const dirPrefix = locales[locale] && locales[locale].dir ? `/${locales[locale].dir}` : "";
  const categorySlug = getCategorySlug(category);
  const descriptions = CATEGORY_DESCRIPTIONS[locale] || {};
  const description = descriptions[categorySlug] || "";
  const icon = getCategoryIconName(category);
  const viewLabel = VIEW_CATEGORY_LABEL[locale] || VIEW_CATEGORY_LABEL.en;
  const countFn = DEVICE_COUNT_LABEL[locale] || DEVICE_COUNT_LABEL.en;

  return `
    <a href="${dirPrefix}/categories/${categorySlug}/" class="category-card">
      <div class="category-card-icon">
        <img src="/img/brand/icon-${icon}.webp" alt="${getCategoryLabel(category, locale)} icon" loading="lazy" decoding="async" width="40" height="40">
      </div>
      <h2 class="category-card-title">${getCategoryLabel(category, locale)}</h2>
      <p class="category-card-description">${description}</p>
      <div class="category-card-link">
        ${viewLabel} →
      </div>
      <div class="category-card-count">${countFn(deviceCount)}</div>
    </a>
  `;
}

/**
 * Generate categories index page markup for a locale
 */
function generateCategoriesIndex(allDevices, template, locale, availableLocales = [locale]) {
  const excluded = EXCLUDED_CATEGORIES_BY_LOCALE[locale] || [];
  const dirPrefix = locales[locale] && locales[locale].dir ? `/${locales[locale].dir}` : "";

  // Group devices by category
  const grouped = {};
  allDevices.forEach((device) => {
    if (excluded.includes(device.category)) return;
    if (!grouped[device.category]) {
      grouped[device.category] = [];
    }
    grouped[device.category].push(device);
  });

  const categoryCards = Object.keys(grouped)
    .sort()
    .map((category) => generateCategoryCard(category, grouped[category].length, locale))
    .join("\n");

  const categoriesUrl = `https://sdcardchecker.com${dirPrefix}/categories/`;
  const breadcrumbs = [
    { name: t("breadcrumbHome", locale), url: dirPrefix ? `${dirPrefix}/` : "/" },
    { name: t("categoriesIndex.breadcrumbLabel", locale), url: `${dirPrefix}/categories/` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return template
    .replace(/{{CATEGORIES_GRID}}/g, categoryCards)
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{HREFLANG_TAGS}}/g, generateHreflangTags("/categories/", availableLocales))
    .replace(/{{LANG}}/g, locale)
    .replace(/{{PAGE_TITLE}}/g, t("categoriesIndex.pageTitle", locale))
    .replace(/{{PAGE_DESCRIPTION}}/g, t("categoriesIndex.pageDescription", locale))
    .replace(/{{CATEGORIES_URL}}/g, categoriesUrl)
    .replace(/{{HERO_TITLE}}/g, t("categoriesIndex.heroTitle", locale))
    .replace(/{{HERO_SUBTITLE}}/g, t("categoriesIndex.heroSubtitle", locale))
    .replace(/{{BREADCRUMB_LABEL}}/g, t("categoriesIndex.breadcrumbLabel", locale))
    .replace(/{{HOME_URL}}/g, dirPrefix ? `${dirPrefix}/` : "/")
    .replace(/{{HOME_LABEL}}/g, t("breadcrumbHome", locale))
    .replace(/{{HEADER}}/g, components.generateHeader(locale))
    .replace(/{{FOOTER}}/g, components.generateFooter(locale))
    .replace(/{{GROW_SCRIPT}}/g, components.generateGrowScript())
    .replace(/{{SIDEBAR}}/g, components.generateSidebar(locale));
}

/**
 * Generate the categories index page for a single locale. Every enabled locale renders
 * from the shared categories-index.html template (locale-parameterized via t()); Japanese
 * keeps its own template file for CJK-specific styling/copy.
 */
function generateCategoriesIndexPage(allDevices, distPath, locale = "en", availableLocales = [locale]) {
  const templateFile = locale === "ja" ? "categories-index-ja.html" : "categories-index.html";
  const templatePath = path.join(srcPath, "templates", templateFile);
  if (!fs.existsSync(templatePath)) return;

  let template = readTemplate(templatePath);
  template = processIncludes(template, path.join(srcPath, "templates"));

  const html = generateCategoriesIndex(allDevices, template, locale, availableLocales);
  const dir = locales[locale] && locales[locale].dir ? locales[locale].dir : "";
  const outPath = path.join(distPath, dir, "categories", "index.html");
  writeFile(outPath, html);
  console.log(`  ✓ Generated ${dir ? "/" + dir : ""}/categories/index.html`);
}

module.exports = { generateCategoriesIndexPage };
