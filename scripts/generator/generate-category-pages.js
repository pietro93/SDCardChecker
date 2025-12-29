/**
 * SD Card Checker - Category Pages Generator
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateBreadcrumbSchema, getDeviceImageFallback } = require("./helpers");
const { generateHeader, generateFooter, generateAffiliateDisclosure, generateSidebar, generateGrowScript } = require("../../src/templates/components");

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
    "Cameras": "camera",
    "Action Cameras": "action-camera",
    "Audio & Hi-Fi": "audio-hi-fi",
    "Drones": "drone",
    "Gaming Handhelds": "gaming",
    "Computing & Tablets": "computing",
    "Security Cameras": "security-camera",
    "Dash Cams": "dashcam"
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
"Security Cameras":
"Security cameras require High Endurance microSD cards designed for continuous recording. Find the best cards for 24/7 surveillance systems.",
};

return (
    intros[category] ||
        `Find the best SD cards for your ${category} devices. Compare speeds, prices, and features.`
     );
 }

/**
 * Generate single category page
 */
function generateCategoryPage(category, devices, template) {
const baseUrl = "https://sdcardchecker.com";
const categoryUrl = `${baseUrl}/categories/${category
.toLowerCase()
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
    console.log("📂 Generating category pages...");

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

module.exports = { generateCategoryPages };
