/**
 * SD Card Checker - Category Pages Generator
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateBreadcrumbSchema, getDeviceImageFallback } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

const MIN_SUBCATEGORY_DEVICES = 3;
// Manufacturer names that span two words; checked before falling back to the first word of the device name
const TWO_WORD_BRANDS = ["Bambu Lab", "Holy Stone", "Raspberry Pi"];

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
* Generate device cards for category page
*/
function generateDeviceCards(devices) {
// Sort devices alphabetically by name
const sortedDevices = [...devices].sort((a, b) => a.name.localeCompare(b.name));
return sortedDevices
.map(
(device) => {
   const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
  return `
<div class="device-card" style="background-image: url('${getDeviceImage(device)}'); background-size: cover; background-position: center; position: relative;" role="article" aria-label="SD card recommendation for ${device.name}" tabindex="0" onmouseover="this.querySelector('.device-card-overlay').style.opacity='0.95'" onmouseout="this.querySelector('.device-card-overlay').style.opacity='0.85'">
<div class="device-card-overlay" style="position: absolute; inset: 0; background: rgba(240, 240, 240, 0.85); transition: opacity 0.3s ease;"></div>
<a href="/categories/${categorySlug}/${device.slug}/" style="position: relative; z-index: 1; text-decoration: none; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; width: 100%; height: 100%;">
<div class="device-card-name" style="color: #2563eb; opacity: 1; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);">${device.name}</div>
<span class="device-card-link" style="color: #666; opacity: 0.75; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);">View →</span>
</a>
</div>
`;
}
)
.join("");
}

/**
 * Map category names to icon file names
 */
function getCategoryIcon(category) {
    const iconMap = {
      // Title case (English names)
      "Cameras": "camera",
      "Action Cameras": "action-camera",
      "Audio & Hi-Fi": "audio-hi-fi",
      "Drones": "drone",
      "Gaming Handhelds": "gaming",
      "Computing & Tablets": "computing",
      "Smartphones": "smartphone",
      "Smartphones & Tablets": "smartphone",
      "Security Cameras": "security-camera",
      "Dash Cams": "dashcam",
      "Film Cameras": "camera",
      "DSLR Cameras": "camera",
      "Mirrorless Cameras": "camera",
      "Cinema Cameras": "camera",
      "Trail Cameras": "camera",
      "Music Production": "music-production",
      "Accessories": "accessory",

      // Kebab case (as used in category data files)
      "cameras": "camera",
      "action-cameras": "action-camera",
      "audio-and-hi-fi": "audio-hi-fi",
      "drones": "drone",
      "gaming-handhelds": "gaming",
      "computing-and-tablets": "computing",
      "smartphones": "smartphone",
      "security-cameras": "security-camera",
      "dash-cams": "dashcam",
      "film-cameras": "camera",
      "dslr-cameras": "camera",
      "mirrorless-cameras": "camera",
      "cinema-cameras": "camera",
      "trail-cameras": "camera",
      "music-production": "music-production",
      "accessories": "accessory"
    };
    return iconMap[category] || "camera"; // Default fallback
  }

/**
 * Get category introduction text
 */
function getCategoryIntro(category) {
const intros = {
"Action Cameras":
"Action cameras require fast SD cards to handle high-bitrate video recording. Find the best cards for GoPro, DJI, and other action cameras.",
"Audio & Hi-Fi":
"Digital Audio Players and portable recorders need reliable microSD cards for music libraries and high-quality audio recording. Find the best cards for Sony Walkman, HiBy, Zoom, and other audio devices.",
Cameras:
"Professional cameras including DSLRs, mirrorless, and cinema cameras require fast, reliable cards for RAW photo and high-bitrate video recording. Find the perfect card for your setup.",
"Computing & Tablets":
"Tablets and Chromebooks benefit from reliable microSD cards for expanded storage and media. Compare options for Amazon Fire, Samsung Galaxy, and more.",
"Dash Cams":
"Dash cameras require reliable, high-speed microSD cards for stable video recording. Find the best cards for popular dashcam models and ensure continuous, high-quality recording.",
Drones:
"Drones demand reliable, high-speed SD cards for smooth 4K video capture. Compare top recommendations for popular drone models.",
"Gaming Handhelds":
"Gaming handhelds need reliable cards for smooth game installation and loading. See the best options for Nintendo Switch, Steam Deck, and more.",
Smartphones:
"Modern smartphones require external card readers to access SD cards. Find the best readers and compatible cards for iPhone, Samsung Galaxy, Google Pixel, and other devices.",
"Security Cameras":
"Security cameras require High Endurance microSD cards designed for continuous recording. Find the best cards for 24/7 surveillance systems.",
"Music Production":
"Standalone samplers and drum machines stream samples in real time during performance. Find reliable full-size SD cards for the Akai MPC Live II, MPC One+, and Roland SP-404MKII that keep sets dropout-free.",
};

return (
    intros[category] ||
        `Find the best SD cards for your ${category} devices. Compare speeds, prices, and features.`
     );
 }

/**
 * Generate "Browse by brand" links to qualifying subcategory pages
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
function generateCategoryPage(category, devices, template) {
const baseUrl = "https://sdcardchecker.com";
const categoryUrl = `${baseUrl}/categories/${category
.toLowerCase()
.replace(/&/g, "and")
.replace(/\s+/g, "-")}/`;
const categoryTitle = `Best SD Cards for ${category} | SD Card Checker`;
const categoryIntro = getCategoryIntro(category);
// Build description from intro text, truncating to ~140-150 chars for SEO
     const categoryDescription = categoryIntro.length > 155 
       ? categoryIntro.substring(0, 155) + "..."
       : categoryIntro;
    const deviceCardsHTML = generateDeviceCards(devices);

    // Generate breadcrumb schema for category pages
    const categorySlug = category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: category, url: `/categories/${categorySlug}/` }
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
        .replace(/{{SUBCATEGORY_LINKS}}/g, generateSubcategoryLinksHTML(category, devices))
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
 * Generate all category pages
 */
async function generateCategoryPages(allDevices, distPath) {
    console.log("Generating category pages...");

    let categoryTemplate = readTemplate(
        path.join(srcPath, "templates/category.html")
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

    // Generate page for each category
    Object.keys(grouped)
        .sort()
        .forEach((category) => {
            const categoryHTML = generateCategoryPage(
                category,
                grouped[category],
                categoryTemplate
            );
            const categorySlug = category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
            const categoryPath = path.join(
                distPath,
                "categories",
                categorySlug,
                "index.html"
            );
            writeFile(categoryPath, categoryHTML);
        });

    console.log(`  ✓ Generated ${Object.keys(grouped).length} category pages`);
}

/**
 * Get subcategory introduction text
 */
function getSubcategoryIntro(brand, category) {
  return `Browse our SD card recommendations for ${brand} ${category} devices — compare speeds, capacities, and prices to find the right card for your ${brand} gear.`;
}

/**
 * Generate single subcategory (category + brand) page
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
  const deviceCardsHTML = generateDeviceCards(devices);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: category, url: `/categories/${categorySlug}/` },
    { name: brand, url: `/categories/${categorySlug}/${brandSlug}/` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const categoryIcon = getCategoryIcon(category);

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
    .replace(/{{SIDEBAR}}/g, generateSidebar())
    .replace(/{{HEADER}}/g, generateHeader())
    .replace(/{{FOOTER}}/g, generateFooter())
    .replace(/{{GROW_SCRIPT}}/g, generateGrowScript())
    .replace(/{{AFFILIATE_DISCLOSURE}}/g, "");
}

/**
 * Generate subcategory pages for brands with at least MIN_SUBCATEGORY_DEVICES
 * devices within a category, e.g. /categories/drones/dji/
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

module.exports = { generateCategoryPages, generateSubcategoryPages, getQualifyingBrands };
