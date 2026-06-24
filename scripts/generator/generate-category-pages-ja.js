/**
 * SD Card Checker - Japanese Category Pages Generator
 * Generates category index pages for the Japanese localization
 * NOTE: Does NOT include card reader category
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateBreadcrumbSchema, getDeviceImageFallback } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components-ja");

const srcPath = path.join(__dirname, "../../src");

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
 * Generate device cards for Japanese category page
 */
function generateDeviceCards(devices) {
    // Map Japanese category names to English slugs
    const categorySlugMap = {
      "アクションカメラ": "action-cameras",
      "Action Cameras": "action-cameras",
      "カメラ": "cameras",
      "Cameras": "cameras",
      "ドローン": "drones",
      "Drones": "drones",
      "携帯ゲーム機": "gaming-handhelds",
      "Gaming Handhelds": "gaming-handhelds",
      "コンピュータ・タブレット": "computing-and-tablets",
      "Computing & Tablets": "computing-and-tablets",
      "スマートフォン": "smartphones",
      "Smartphones": "smartphones",
      "ドライブレコーダー": "dash-cams",
      "Dash Cams": "dash-cams",
      "セキュリティカメラ": "security-cameras",
      "Security Cameras": "security-cameras",
      "トレイルカメラ": "trail-cameras",
      "Trail Cameras": "trail-cameras",
      "アクセサリー": "accessories",
      "Accessories": "accessories"
    };

   // Sort devices alphabetically by name
   const sortedDevices = [...devices].sort((a, b) => a.name.localeCompare(b.name));
   return sortedDevices
     .map(
       (device) => {
         // Use the category slug map to get the correct English slug
         const categorySlug = categorySlugMap[device.category] || device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
         return `
<div class="device-card" style="background-image: url('${getDeviceImage(device)}'); background-size: cover; background-position: center; position: relative;" role="article" aria-label="SD card recommendation for ${device.name}" tabindex="0" onmouseover="this.querySelector('.device-card-overlay').style.opacity='0.95'" onmouseout="this.querySelector('.device-card-overlay').style.opacity='0.85'">
<div class="device-card-overlay" style="position: absolute; inset: 0; background: rgba(240, 240, 240, 0.85); transition: opacity 0.3s ease;"></div>
<a href="/ja/categories/${categorySlug}/${device.slug}/" style="position: relative; z-index: 1; text-decoration: none; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; width: 100%; height: 100%;">
<div class="device-card-name" style="color: #2563eb; opacity: 1; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);">${device.name}</div>
<span class="device-card-link" style="color: #666; opacity: 0.75; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);">詳細 →</span>
</a>
</div>
`;
       }
     )
     .join("");
}

/**
 * Map category names to icon file names (same for Japanese)
 */
function getCategoryIcon(category) {
    const iconMap = {
      // Title case (English names)
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
      "Smartphones & Tablets": "smartphone",
      "Security Cameras": "security-camera",
      "セキュリティカメラ": "security-camera",
      "Dash Cams": "dashcam",
      "ドライブレコーダー": "dashcam",
      "Accessories": "accessory",
      "Audio & Hi-Fi": "audio-hi-fi",
      "Music Production": "music-production",
      "Film Cameras": "camera",
      "DSLR Cameras": "camera",
      "Mirrorless Cameras": "camera",
      "Cinema Cameras": "camera",
      "Trail Cameras": "camera",
      
      // Kebab case (as used in category data files)
      "cameras": "camera",
      "action-cameras": "action-camera",
      "drones": "drone",
      "gaming-handhelds": "gaming",
      "computing-and-tablets": "computing",
      "smartphones": "smartphone",
      "security-cameras": "security-camera",
      "dash-cams": "dashcam",
      "accessories": "accessory",
      "audio-and-hi-fi": "audio-hi-fi",
      "music-production": "music-production",
      "film-cameras": "camera",
      "dslr-cameras": "camera",
      "mirrorless-cameras": "camera",
      "cinema-cameras": "camera",
      "trail-cameras": "camera"
    };
    return iconMap[category] || "camera"; // Default fallback
  }

/**
 * Get category introduction text in Japanese
 */
function getCategoryIntro(category) {
  const intros = {
    "Action Cameras":
      "アクションカメラは高いビットレートのビデオ録画に対応できる高速SDカードが必要です。GoPro、DJI、その他のアクションカメラに最適なカードを見つけてください。",
    "アクションカメラ":
      "アクションカメラは高いビットレートのビデオ録画に対応できる高速SDカードが必要です。GoPro、DJI、その他のアクションカメラに最適なカードを見つけてください。",
    "Cameras":
      "デジタル一眼レフカメラ、ミラーレスカメラ、シネマカメラなどのプロフェッショナルカメラは、RAW写真と高ビットレートのビデオ録画に対応できる高速で信頼性の高いカードが必要です。",
    "カメラ":
      "デジタル一眼レフカメラ、ミラーレスカメラ、シネマカメラなどのプロフェッショナルカメラは、RAW写真と高ビットレートのビデオ録画に対応できる高速で信頼性の高いカードが必要です。",
    "Computing & Tablets":
      "タブレットとChromebookは、ストレージ拡張とメディア用に信頼性の高いmicroSDカードから恩恵を受けます。Amazon Fire、Samsung Galaxy、その他のオプションを比較してください。",
    "コンピュータ・タブレット":
      "タブレットとChromebookは、ストレージ拡張とメディア用に信頼性の高いmicroSDカードから恩恵を受けます。Amazon Fire、Samsung Galaxy、その他のオプションを比較してください。",
    "Drones":
      "ドローンは滑らかな4Kビデオキャプチャのための信頼性の高い高速SDカードが必要です。人気のあるドローンモデルの推奨事項を比較してください。",
    "ドローン":
      "ドローンは滑らかな4Kビデオキャプチャのための信頼性の高い高速SDカードが必要です。人気のあるドローンモデルの推奨事項を比較してください。",
    "Gaming Handhelds":
      "携帯ゲーム機はゲームのスムーズなインストールと読み込みのための信頼性の高いカードが必要です。Nintendo Switch、Steam Deck、その他のオプションを確認してください。",
    "携帯ゲーム機":
      "携帯ゲーム機はゲームのスムーズなインストールと読み込みのための信頼性の高いカードが必要です。Nintendo Switch、Steam Deck、その他のオプションを確認してください。",
    "Security Cameras":
      "セキュリティカメラは、24時間の連続録画用に設計された高耐久性microSDカードが必要です。24/7監視システムに最適なカードを見つけてください。",
    "セキュリティカメラ":
      "セキュリティカメラは、24時間の連続録画用に設計された高耐久性microSDカードが必要です。24/7監視システムに最適なカードを見つけてください。",
    "Dash Cams":
      "ドライブレコーダーは、安定した高品質ビデオ録画のための信頼性の高い高速microSDカードが必要です。人気のあるドライブレコーダーモデルの推奨事項を見つけてください。",
    "ドライブレコーダー":
      "ドライブレコーダーは、安定した高品質ビデオ録画のための信頼性の高い高速microSDカードが必要です。人気のあるドライブレコーダーモデルの推奨事項を見つけてください。",
    "Music Production":
      "スタンドアロンのサンプラーやドラムマシンは、パフォーマンス中にリアルタイムでサンプルをストリーミングします。Akai MPC Live II、MPC One+、Roland SP-404MKII向けの、ライブをドロップアウトさせない信頼性の高いフルサイズSDカードを見つけてください。",
  };

  return (
    intros[category] ||
    `${category}デバイス用の最適なSDカードを見つけてください。速度、価格、機能を比較してください。`
  );
}

/**
 * Generate single Japanese category page
 */
function generateCategoryPage(category, devices, template, categorySlug) {
  const baseUrl = "https://sdcardchecker.com";
  const categoryUrl = `${baseUrl}/ja/categories/${categorySlug}/`;
  const categoryTitle = `${category}向けの最高のSDカード | SD Card Checker`;
  const categoryIntro = getCategoryIntro(category);
  
  // Build description from intro text, truncating to ~140-150 chars for SEO
  const categoryDescription = categoryIntro.length > 155
    ? categoryIntro.substring(0, 155) + "..."
    : categoryIntro;
  const deviceCardsHTML = generateDeviceCards(devices);

  // Generate breadcrumb schema for category pages
  // (categorySlug is already provided, no need to recalculate)
  const breadcrumbs = [
    { name: "ホーム", url: "/ja/" },
    { name: category, url: `/ja/categories/${categorySlug}/` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const categoryIcon = getCategoryIcon(category);

  let html = template
    .replace(/{{CATEGORY_TITLE}}/g, categoryTitle)
    .replace(/{{CATEGORY_DESCRIPTION}}/g, categoryDescription)
    .replace(/{{CATEGORY_URL}}/g, categoryUrl)
    .replace(/{{CATEGORY_NAME}}/g, category)
    .replace(/{{CATEGORY_ICON}}/g, categoryIcon)
    .replace(/{{CATEGORY_INTRO}}/g, categoryIntro)
    .replace(/{{DEVICE_CARDS_HTML}}/g, deviceCardsHTML)
    .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
    .replace(/{{SIDEBAR}}/g, generateSidebar())
    .replace(/{{HEADER}}/g, generateHeader())
    .replace(/{{FOOTER}}/g, generateFooter())
    .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
    .replace(/{{AFFILIATE_DISCLOSURE}}/g, "");

  return html;
}

/**
 * Generate all Japanese category pages (excluding Card Readers)
 */
async function generateCategoryPagesJa(allDevices, distPath) {
  console.log("Generating Japanese category pages...");

  let categoryTemplate = readTemplate(
    path.join(srcPath, "templates/category-ja.html")
  );
  // Process {% include %} tags
  categoryTemplate = processIncludes(categoryTemplate, path.join(srcPath, "templates"));

  // Group devices by category
  const grouped = {};
  allDevices.forEach((device) => {
    if (!grouped[device.category]) {
      grouped[device.category] = [];
    }
    grouped[device.category].push(device);
  });

  // Categories to EXCLUDE for Japanese version
  const excludeCategories = ["Card Readers"];

  // Map Japanese category names to English slugs
  const categorySlugMap = {
    "アクションカメラ": "action-cameras",
    "Action Cameras": "action-cameras",
    "カメラ": "cameras",
    "Cameras": "cameras",
    "ドローン": "drones",
    "Drones": "drones",
    "携帯ゲーム機": "gaming-handhelds",
    "Gaming Handhelds": "gaming-handhelds",
    "コンピュータ・タブレット": "computing-and-tablets",
    "Computing & Tablets": "computing-and-tablets",
    "ドライブレコーダー": "dash-cams",
    "Dash Cams": "dash-cams",
    "セキュリティカメラ": "security-cameras",
    "Security Cameras": "security-cameras",
    "トレイルカメラ": "trail-cameras",
    "Trail Cameras": "trail-cameras",
    "アクセサリー": "accessories",
    "Accessories": "accessories"
  };

  // Generate page for each category (excluding readers)
  Object.keys(grouped)
    .filter(category => !excludeCategories.includes(category))
    .sort()
    .forEach((category) => {
      const categorySlug = categorySlugMap[category] || category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
      const categoryHTML = generateCategoryPage(
        category,
        grouped[category],
        categoryTemplate,
        categorySlug  // Pass the slug to use for the URL
      );
      const categoryPath = path.join(
        distPath,
        "ja",
        "categories",
        categorySlug,
        "index.html"
      );
      writeFile(categoryPath, categoryHTML);
    });

  const generatedCount = Object.keys(grouped).filter(c => !excludeCategories.includes(c)).length;
  console.log(`✓ Generated ${generatedCount} Japanese category pages (excluding Card Readers)`);
}

module.exports = { generateCategoryPagesJa };
