/**
 * SD Card Checker - Japanese Device Pages Generator
 * Generates Japanese localized device pages at /ja/devices/
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, generateFAQSchema, generateBreadcrumbSchema, generateProductSchema, getDeviceImageFallback, getCardImageFallback, generateSpecsHTML, generateFAQHTML, generateRelatedDevices, loadSDCardData } = require("./helpers");
const { generateHeader: generateHeaderJa, generateFooter: generateFooterJa, generateAffiliateDisclosure: generateAffiliatDisclosureJa, generateSidebar: generateSidebarJa, generateGrowScript: generateGrowScriptJa } = require("../../src/templates/components-ja");

const srcPath = path.join(__dirname, "../../src");

/**
 * Map category names to image icon file names (same for Japanese)
 */
function getCategoryImageIcon(category) {
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
    "Security Cameras": "security-camera",
    "セキュリティカメラ": "security-camera"
  };
  return iconMap[category] || "camera";
}

/**
 * Generate varied meta descriptions for Japanese
 */
function generateUniqueMetaDescriptionJa(device, brandNames, index) {
    const templates = [
        `${device.name}に最適なSDカードを見つけましょう。推奨: ${device.sdCard.type} ${device.sdCard.minSpeed}以上。トップブランド: ${brandNames}。Amazonで購入。`,
        `${device.name}向けの最高のSDカードガイド。速度: ${device.sdCard.minSpeed}。タイプ: ${device.sdCard.type}。専門家によるレビュー。`,
        `${device.category}向けのSDカード推奨情報。${device.name}対応。${brandNames}以上。比較してみましょう。`,
        `${device.name}向けの最高のSDカード。ビデオ録画: ${device.whySpecs.substring(0, 30)}...詳細を確認。`,
        `${device.name}のmicroSDカードとSDカード比較ガイド。${device.sdCard.minSpeed}推奨。トップブランドを参照。`,
    ];
    
    const template = templates[index % templates.length];
    return template.length > 160 ? template.substring(0, 157) + "..." : template;
}

/**
 * Generate brand comparison table rows (Japanese)
 */
function generateBrandsTableJa(brandReferences, sdcardsMap, deviceSlug) {
    return brandReferences
        .map((ref) => {
            const brand = sdcardsMap[ref.id];
            if (!brand) {
                return "";
            }
            
            const utmParams = `utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=${deviceSlug}&utm_content=${brand.tier || 'featured'}`;
            const amazonUrlWithUTM = brand.amazonSearchUrl.includes('?') 
                ? `${brand.amazonSearchUrl}&${utmParams}`
                : `${brand.amazonSearchUrl}?${utmParams}`;
            
            const writeSpeed = brand.writeSpeed || `${brand.speedClass} equivalent`;
            const pros = brand.pros?.substring(0, 40) || "Reliable";
            
            return `
                <tr>
                    <td class="py-3 px-4 font-medium">${brand.name}</td>
                    <td class="py-3 px-4">${brand.speedClass || "V30"}</td>
                    <td class="py-3 px-4">${writeSpeed}</td>
                    <td class="py-3 px-4 text-sm">${pros}</td>
                    <td class="py-3 px-4"><a href="${amazonUrlWithUTM}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Amazon</a></td>
                </tr>
            `;
        })
        .join("");
}

/**
 * Generate Japanese device page
 */
function generateDevicePageJa(device, template, sdcardsMap, deviceIndex) {
    const baseUrl = "https://sdcardchecker.com";
    const deviceUrl = `${baseUrl}/ja/devices/${device.slug}/`;
    const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    
    // Device title and description
    const deviceTitle = `${device.name}向けの最高のSDカード | SD Card Checker`;
    const brandNames = device.recommendedBrands.slice(0, 2).map(ref => sdcardsMap[ref.id]?.name).filter(Boolean).join(", ");
    const deviceDescription = generateUniqueMetaDescriptionJa(device, brandNames, deviceIndex);
    
    // Answer section
    const answerText = device.sdCard.minSpeed || "推奨カードを確認";
    const answerExplanation = device.whySpecs || `${device.name}に最適なSDカードの仕様と推奨情報です。`;
    
    // Requirements box
    let requirementsBox = `
        <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-12">
            <h2 class="text-xl font-bold text-amber-900 mb-4">必要な仕様</h2>
            <div class="grid md:grid-cols-2 gap-4 text-amber-900">
                <div>
                    <p class="text-sm font-semibold text-amber-700">カードタイプ</p>
                    <p class="text-lg font-bold">${device.sdCard.type}</p>
                </div>
                <div>
                    <p class="text-sm font-semibold text-amber-700">最小速度クラス</p>
                    <p class="text-lg font-bold">${device.sdCard.minSpeed}</p>
                </div>
                <div>
                    <p class="text-sm font-semibold text-amber-700">推奨容量</p>
                    <p class="text-lg font-bold">${device.sdCard.recommendedCapacity.join(", ")}</p>
                </div>
                <div>
                    <p class="text-sm font-semibold text-amber-700">最大容量</p>
                    <p class="text-lg font-bold">${device.sdCard.maxCapacity}</p>
                </div>
            </div>
        </div>
    `;
    
    // Specs HTML
    const specsHTML = generateSpecsHTML(device);
    
    // Brands table
    const brandsTableRows = generateBrandsTableJa(device.recommendedBrands, sdcardsMap, device.slug);
    
    // FAQ Schema and HTML
    const faqSchema = generateFAQSchema(device);
    const faqHTML = device.faq ? device.faq.map(item => `
        <div class="faq-item bg-white rounded-lg p-6 border border-slate-200 mb-4">
            <button class="w-full text-left font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-between" onclick="this.nextElementSibling.classList.toggle('hidden')">
                <span>${item.q}</span>
                <i class="fas fa-chevron-down text-sm"></i>
            </button>
            <div class="mt-4 text-slate-700 leading-relaxed hidden">
                ${item.a}
            </div>
        </div>
    `).join("") : "";
    
    // Breadcrumb schema
    const breadcrumbs = [
        { name: "ホーム", url: "/ja/" },
        { name: device.category, url: `/ja/categories/${categorySlug}/` },
        { name: device.name, url: deviceUrl }
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    
    // Product schema
    const productSchema = generateProductSchema(device, deviceUrl, "https://sdcardchecker.com");
    
    // Category icon
    const categoryIcon = getCategoryImageIcon(device.category);
    
    // Device image
    const deviceImage = getDeviceImageFallback(device);
    
    // Related devices HTML
    const relatedDevicesHTML = device.relatedDevices ? device.relatedDevices
        .slice(0, 3)
        .map(slug => `
            <li><a href="/ja/devices/${slug}/" class="text-blue-600 hover:underline">詳細を確認 →</a></li>
        `).join("") : "";
    
    // Replace template placeholders
    let html = template
        .replace(/{{DEVICE_TITLE}}/g, deviceTitle)
        .replace(/{{DEVICE_DESCRIPTION}}/g, deviceDescription)
        .replace(/{{DEVICE_NAME}}/g, device.name)
        .replace(/{{DEVICE_NAME_SHORT}}/g, device.name.split(" ")[0])
        .replace(/{{DEVICE_URL}}/g, deviceUrl)
        .replace(/{{DEVICE_IMAGE}}/g, deviceImage)
        .replace(/{{BASE_URL}}/g, baseUrl)
        .replace(/{{CATEGORY_NAME}}/g, device.category)
        .replace(/{{CATEGORY_SLUG}}/g, categorySlug)
        .replace(/{{CATEGORY_ICON}}/g, categoryIcon)
        .replace(/{{ANSWER_TEXT}}/g, answerText)
        .replace(/{{ANSWER_EXPLANATION}}/g, answerExplanation)
        .replace(/{{REQUIREMENTS_BOX}}/g, requirementsBox)
        .replace(/{{SPECS_HTML}}/g, specsHTML)
        .replace(/{{BRANDS_TABLE_ROWS}}/g, brandsTableRows)
        .replace(/{{FAQ_SCHEMA}}/g, faqSchema)
        .replace(/{{FAQ_HTML}}/g, faqHTML)
        .replace(/{{BREADCRUMB_SCHEMA}}/g, breadcrumbSchema)
        .replace(/{{PRODUCT_SCHEMA}}/g, productSchema)
        .replace(/{{RELATED_DEVICES_HTML}}/g, relatedDevicesHTML)
        .replace(/{{OG_TITLE}}/g, deviceTitle)
        .replace(/{{TWITTER_TITLE}}/g, `${device.name}向けの最高のSDカード`)
        .replace(/{{SCHEMA_HEADLINE}}/g, `${device.name}向けのSDカード推奨情報`)
        .replace(/{{HEADER}}/g, generateHeaderJa())
        .replace(/{{FOOTER}}/g, generateFooterJa())
        .replace(/{{AFFILIATE_DISCLOSURE}}/g, generateAffiliatDisclosureJa())
        .replace(/{{SIDEBAR}}/g, generateSidebarJa())
        .replace(/{{GROW_SCRIPT}}/g, generateGrowScriptJa());
    
    return html;
}

/**
 * Generate all Japanese device pages
 */
async function generateDevicePagesJa(allDevices, distPath) {
    console.log("📄 Generating Japanese device pages...");
    
    // Load SD card data
    const sdcardsMap = loadSDCardData();
    
    // Load Japanese template
    let deviceTemplate = readTemplate(
        path.join(srcPath, "templates/device-ja.html")
    );
    deviceTemplate = processIncludes(deviceTemplate, path.join(srcPath, "templates"));
    
    let successCount = 0;
    let failureCount = 0;
    const failedDevices = [];
    
    // Generate page for each device
    allDevices.forEach((device, index) => {
        try {
            const deviceHTML = generateDevicePageJa(device, deviceTemplate, sdcardsMap, index);
            const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
            const devicePath = path.join(distPath, "ja", "categories", categorySlug, device.slug, "index.html");
            
            writeFile(devicePath, deviceHTML);
            successCount++;
        } catch (error) {
            failureCount++;
            failedDevices.push(device.id);
            console.error(`  ⚠️  Failed to generate ${device.id}: ${error.message}`);
        }
    });
    
    console.log(`  ✓ Generated ${successCount}/${allDevices.length} Japanese device pages`);
    if (failureCount > 0) {
        console.log(`  ⚠️  ${failureCount} devices failed: ${failedDevices.join(", ")}`);
    }
}

module.exports = { generateDevicePagesJa };
