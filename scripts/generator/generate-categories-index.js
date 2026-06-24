/**
 * SD Card Checker - Categories Index Generator
 * Generates /categories/ and /ja/categories/ index pages
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateBreadcrumbSchema } = require("./helpers");
const { generateHeader, generateFooter, generateGrowScript, generateSidebar } = require("../../src/templates/components");
const { generateHeader: generateHeaderJa, generateFooter: generateFooterJa, generateGrowScript: generateGrowScriptJa, generateSidebar: generateSidebarJa } = require("../../src/templates/components-ja");

const srcPath = path.join(__dirname, "../../src");

/**
 * Map category names to descriptions
 */
function getCategoryDescriptions(lang = "en") {
  const descriptions = {
    en: {
      "Cameras": "Find the best SD cards for DSLR and mirrorless cameras, including professional models for RAW photography and high-bitrate video.",
      "Action Cameras": "Discover SD cards optimized for GoPro, DJI, and other action cameras that demand fast, reliable storage for 4K+ video.",
      "Drones": "Compare SD cards designed for DJI, Autel, and other drone systems requiring dependable 4K video capture.",
      "Gaming Handhelds": "Explore SD card options for Nintendo Switch, Steam Deck, and other gaming handhelds that need reliable fast storage.",
      "Computing & Tablets": "Browse microSD cards perfect for iPad, Chromebook, Android tablets, and other computing devices.",
      "Smartphones": "Explore external SD card readers and recommendations for iPhones, Samsung Galaxy, Google Pixel, and other smartphones.",
      "Dash Cams": "Find durable SD cards suited for dash cam and vehicle recorder systems.",
      "Security Cameras": "Discover 24/7 surveillance-grade microSD cards for security camera systems.",
      "3D Printers & Fabrication": "Find reliable microSD cards for Bambu Lab, Creality, and other 3D printers — where a single corrupt read can ruin a multi-hour, real-material print.",
      "Music Production": "Find the best SD cards for standalone samplers and drum machines like the Akai MPC and Roland SP-404MKII — reliable cards that keep sample streaming dropout-free on stage.",
      "Accessories": "Explore SD card readers, adapters, and other accessories for your devices."
    },
    ja: {
      "Cameras": "RAW写真撮影と高ビットレート動画に対応したDSLRおよびミラーレスカメラ向けの最高のSDカードを見つけてください。",
      "カメラ": "RAW写真撮影と高ビットレート動画に対応したDSLRおよびミラーレスカメラ向けの最高のSDカードを見つけてください。",
      "Action Cameras": "4K以上の動画撮影のための高速で信頼性の高いストレージが必要なGoPro、DJI、その他のアクションカメラ向けのSDカードをお探しください。",
      "アクションカメラ": "4K以上の動画撮影のための高速で信頼性の高いストレージが必要なGoPro、DJI、その他のアクションカメラ向けのSDカードをお探しください。",
      "Drones": "DJI、Autel、その他のドローンシステム向けの4K動画キャプチャに対応したSDカードを比較してください。",
      "ドローン": "DJI、Autel、その他のドローンシステム向けの4K動画キャプチャに対応したSDカードを比較してください。",
      "Gaming Handhelds": "信頼性の高い高速ストレージが必要なNintendo Switch、Steam Deck、その他の携帯ゲーム機向けのSDカードオプションをお探しください。",
      "携帯ゲーム機": "信頼性の高い高速ストレージが必要なNintendo Switch、Steam Deck、その他の携帯ゲーム機向けのSDカードオプションをお探しください。",
      "Computing & Tablets": "iPad、Chromebook、Androidタブレット、その他のコンピュータデバイス向けの完璧なmicroSDカードをお探しください。",
      "コンピュータ・タブレット": "iPad、Chromebook、Androidタブレット、その他のコンピュータデバイス向けの完璧なmicroSDカードをお探しください。",
      "Smartphones": "iPhone、Samsung Galaxy、Google Pixel、その他のスマートフォン向けの外部SDカードリーダーおよび推奨事項をご確認ください。",
      "スマートフォン": "iPhone、Samsung Galaxy、Google Pixel、その他のスマートフォン向けの外部SDカードリーダーおよび推奨事項をご確認ください。",
      "Dash Cams": "ドライブレコーダーおよび車載レコーダーシステム向けの耐久性の高いSDカードを見つけてください。",
      "Security Cameras": "セキュリティカメラシステム向けの24時間監視対応のmicroSDカードをお探しください。",
      "Music Production": "Akai MPCやRoland SP-404MKIIなどのスタンドアロンサンプラー・ドラムマシン向けの最高のSDカードを見つけてください。ライブ中のサンプルストリーミングをドロップアウトさせない信頼性の高いカードをお探しください。",
      "Accessories": "SDカードリーダー、アダプター、およびデバイス用のその他のアクセサリーをお探しください。"
    }
  };
  return descriptions[lang] || descriptions["en"];
}

/**
 * Map category names to icons
 */
function getCategoryIcon(category) {
  const iconMap = {
    "Cameras": "camera",
    "カメラ": "camera",
    "Action Cameras": "action-camera",
    "アクションカメラ": "action-camera",
    "Drones": "drone",
    "ドローン": "drone",
    "Gaming Handhelds": "gaming",
    "携帯ゲーム機": "gaming",
    "Computing & Tablets": "computing",
    "コンピュータ・タブレット": "computing",
    "Smartphones": "smartphone",
    "スマートフォン": "smartphone",
    "Security Cameras": "security-camera",
    "セキュリティカメラ": "security-camera",
    "Dash Cams": "dashcam",
    "ダッシュカメラ": "dashcam",
    "3D Printers & Fabrication": "3d-printer",
    "Music Production": "music-production",
    "Accessories": "accessory",
    "Audio & Hi-Fi": "audio-hi-fi"
  };
  return iconMap[category] || "camera";
}

/**
 * Generate category card HTML
 */
function generateCategoryCard(category, deviceCount, isJapanese = false) {
  const categorySlug = category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
  const descriptions = getCategoryDescriptions(isJapanese ? "ja" : "en");
  const description = descriptions[category] || "";
  const icon = getCategoryIcon(category);
  const baseUrl = isJapanese ? "/ja" : "";
  
  const deviceCountText = isJapanese 
    ? `${deviceCount}個のデバイス`
    : `${deviceCount} devices`;

  return `
    <a href="${baseUrl}/categories/${categorySlug}/" class="category-card">
      <div class="category-card-icon">
        <img src="/img/brand/icon-${icon}.webp" alt="${category} icon" loading="lazy" decoding="async" width="40" height="40">
      </div>
      <h2 class="category-card-title">${category}</h2>
      <p class="category-card-description">${description}</p>
      <div class="category-card-link">
        ${isJapanese ? "詳細を見る" : "View Category"} →
      </div>
      <div class="category-card-count">${deviceCountText}</div>
    </a>
  `;
}

/**
 * Generate categories index page
 */
function generateCategoriesIndex(allDevices, template, isJapanese = false) {
  // Group devices by category
  const grouped = {};
  allDevices.forEach((device) => {
    if (!grouped[device.category]) {
      grouped[device.category] = [];
    }
    grouped[device.category].push(device);
  });

  // Categories to exclude
  const excludeCategories = ["Card Readers"];

  // Generate category cards
  const categoryCards = Object.keys(grouped)
    .filter(category => !excludeCategories.includes(category))
    .sort()
    .map(category => generateCategoryCard(category, grouped[category].length, isJapanese))
    .join("\n");

  // Generate breadcrumb schema
  const baseUrl = isJapanese ? "https://sdcardchecker.com/ja" : "https://sdcardchecker.com";
  const breadcrumbs = [
    { name: isJapanese ? "ホーム" : "Home", url: isJapanese ? "/ja/" : "/" },
    { name: isJapanese ? "カテゴリー" : "Categories", url: `${baseUrl}/categories/` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  let html = template
    .replace(/{{CATEGORIES_GRID}}/g, categoryCards)
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{HEADER}}/g, isJapanese ? generateHeaderJa() : generateHeader())
    .replace(/{{FOOTER}}/g, isJapanese ? generateFooterJa() : generateFooter())
    .replace(/{{GROW_SCRIPT}}/g, isJapanese ? generateGrowScriptJa() : generateGrowScript())
    .replace(/{{SIDEBAR}}/g, isJapanese ? generateSidebarJa() : generateSidebar());

  return html;
}

/**
 * Main export function
 */
async function generateCategoriesIndexPages(allDevices, distPath) {
  console.log("Generating categories index pages...");

  // English categories index
  let englishTemplate = readTemplate(
    path.join(srcPath, "templates/categories-index.html")
  );
  englishTemplate = processIncludes(englishTemplate, path.join(srcPath, "templates"));
  
  const englishIndexHTML = generateCategoriesIndex(allDevices, englishTemplate, false);
  const englishPath = path.join(distPath, "categories", "index.html");
  writeFile(englishPath, englishIndexHTML);
  console.log("  ✓ Generated /categories/index.html");

  // Japanese categories index
  let japaneseTemplate = readTemplate(
    path.join(srcPath, "templates/categories-index-ja.html")
  );
  japaneseTemplate = processIncludes(japaneseTemplate, path.join(srcPath, "templates"));
  
  const japaneseIndexHTML = generateCategoriesIndex(allDevices, japaneseTemplate, true);
  const japanesePath = path.join(distPath, "ja", "categories", "index.html");
  writeFile(japanesePath, japaneseIndexHTML);
  console.log("  ✓ Generated /ja/categories/index.html");
}

module.exports = { generateCategoriesIndexPages };
