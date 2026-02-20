#!/usr/bin/env node

/**
 * Sitemap Generator for English and Japanese Sites
 * Generates sitemap.xml for both /public/ and /public/ja/
 */

const path = require("path");
const fs = require("fs");
const { readJSON, writeFile } = require("./helpers");

// Paths
const devicesPath = path.join(__dirname, "../../data/devices.json");
const devicesJaPath = path.join(__dirname, "../../data/devices-ja.json");
const readersPath = path.join(__dirname, "../../data/sdCardReaders.json");
const publicPath = path.join(__dirname, "../../public");

/**
 * Generate English sitemap
 */
function generateEnglishSitemap(allDevices, allReaders) {
  console.log("📝 Generating English sitemap...");
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>https://sdcardchecker.com/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/about/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/contact/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/privacy/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/terms/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.5</priority>
  </url>

  <!-- Guides -->
  <url>
    <loc>https://sdcardchecker.com/guides/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/sd-card-guide/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/sd-card-speed-classes/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/video-bitrate-comparison/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/raw-vs-jpeg/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/is-my-sd-card-fake/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/nintendo-switch-sd-card-guide/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/readers/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/readers/macbook/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/readers/photographers/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/readers/iphone/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/guides/readers/android/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.75</priority>
  </url>

  <!-- Tools/Calculators -->
  <url>
    <loc>https://sdcardchecker.com/tools/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/video-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/photo-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/drone-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/security-camera-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/dashcam-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/action-camera-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/gopro-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/timelapse-storage/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>

  <!-- Readers Hub -->
  <url>
    <loc>https://sdcardchecker.com/readers/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.95</priority>
  </url>
`;

  // Add reader type index pages
  const readerTypes = ["dongle", "viewer", "mobile-adapter", "professional-hub", "hub", "stick", "desktop-dock"];
  readerTypes.forEach((type) => {
    sitemap += `  <url>
    <loc>https://sdcardchecker.com/readers/${type}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
`;
  });

  // Add reader product pages
  if (allReaders && allReaders.length > 0) {
    allReaders.forEach((reader) => {
      const readerSlug = reader.slug || reader.id;
      sitemap += `  <url>
    <loc>https://sdcardchecker.com/readers/${readerSlug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.85</priority>
  </url>
`;
    });
  }

  // Add category pages
  const categories = [...new Set(allDevices.map((d) => d.category))];
  sitemap += `
  <!-- Categories -->
`;
  categories.forEach((category) => {
    const slug = category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    sitemap += `  <url>
    <loc>https://sdcardchecker.com/categories/${slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.9</priority>
  </url>
`;
  });

  // Add device pages
  sitemap += `
  <!-- Device Pages -->
`;
  allDevices.forEach((device) => {
    const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    sitemap += `  <url>
    <loc>https://sdcardchecker.com/categories/${categorySlug}/${device.slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add car navigation pages
  sitemap += `
  <!-- Car Navigation Pages -->
  <url>
    <loc>https://sdcardchecker.com/cars/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.85</priority>
  </url>
`;

  // Load and add individual car pages
  const carsPath = path.join(__dirname, "../../data/cars-navigation.json");
  if (fs.existsSync(carsPath)) {
    try {
      const carsData = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
      if (Array.isArray(carsData)) {
        carsData.forEach((car) => {
          sitemap += `  <url>
    <loc>https://sdcardchecker.com/cars/${car.slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
`;
        });
      }
    } catch (e) {
      console.warn("  ⚠️  Could not parse cars-navigation.json for sitemap");
    }
  }

  // Add resource and legal pages
  sitemap += `
  <!-- Resources & Legal -->
  <url>
    <loc>https://sdcardchecker.com/faq.html</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/affiliate-disclosure.html</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/sitemap.html</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.6</priority>
  </url>
</urlset>`;

  writeFile(path.join(publicPath, "sitemap.xml"), sitemap);
  console.log(`  ✓ English sitemap: ${allDevices.length} devices, ${categories.length} categories`);
}

/**
 * Generate Japanese sitemap
 */
function generateJapaneseSitemap(allDevices) {
  console.log("📝 Generating Japanese sitemap...");

  const categorySlugMap = {
    'アクションカメラ': 'action-cameras',
    'Action Cameras': 'action-cameras',
    'カメラ': 'cameras',
    'Cameras': 'cameras',
    'ドローン': 'drones',
    'Drones': 'drones',
    '携帯ゲーム機': 'gaming-handhelds',
    'Gaming Handhelds': 'gaming-handhelds',
    'コンピュータ・タブレット': 'computing-and-tablets',
    'Computing & Tablets': 'computing-and-tablets',
    'スマートフォン': 'smartphones',
    'Smartphones': 'smartphones',
    'ドライブレコーダー': 'dash-cams',
    '高性能ドライブレコーダー': 'dash-cams',
    'バイク用ドライブレコーダー': 'dash-cams',
    'Dash Cams': 'dash-cams',
    'セキュリティカメラ': 'security-cameras',
    'Security Cameras': 'security-cameras',
    'トレイルカメラ': 'trail-cameras',
    'Trail Cameras': 'trail-cameras',
    'アクセサリー': 'accessories',
    'Accessories': 'accessories',
    'オーディオ・ハイファイ': 'audio-and-hi-fi',
    'Audio & Hi-Fi': 'audio-and-hi-fi'
  };

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sdcardchecker.com/ja/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Japanese Tools/Calculators -->
  <url>
    <loc>https://sdcardchecker.com/ja/guides/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/tools/dashcam-storage-calculator-ja/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/tools/recording-time-calculator-ja/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>

  <!-- Legal Pages -->
  <url>
    <loc>https://sdcardchecker.com/ja/about.html</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/privacy.html</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/terms.html</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Guide Pages -->
  <url>
    <loc>https://sdcardchecker.com/ja/guides/sd-card-speed-classes/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/guides/is-my-sd-card-fake/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/guides/nintendo-switch-sd-card-guide/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Category Pages -->
`;

  const categories = [...new Set(allDevices.map((d) => d.category))];
  categories.forEach((category) => {
    const slug = categorySlugMap[category] || category.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
    sitemap += `  <url>
    <loc>https://sdcardchecker.com/ja/categories/${slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  sitemap += `
  <!-- Device Pages -->
`;

  allDevices.forEach((device) => {
    const categorySlug = categorySlugMap[device.category] || device.category.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
    sitemap += `  <url>
    <loc>https://sdcardchecker.com/ja/categories/${categorySlug}/${device.slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;

  const jaPath = path.join(publicPath, "ja");
  if (!fs.existsSync(jaPath)) {
    fs.mkdirSync(jaPath, { recursive: true });
  }
  
  writeFile(path.join(jaPath, "sitemap.xml"), sitemap);
  console.log(`  ✓ Japanese sitemap: ${allDevices.length} devices, ${categories.length} categories`);
}

async function generateSitemaps() {
  console.log("\n📡 Generating sitemaps...\n");

  try {
    // Load device data
    const devicesData = readJSON(devicesPath);
    const allDevices = devicesData.devices;

    const devicesJaData = readJSON(devicesJaPath);
    const allDevicesJa = devicesJaData.devices;

    const readersData = readJSON(readersPath);
    const allReaders = readersData.sdCardReaders || [];

    // Generate sitemaps
    generateEnglishSitemap(allDevices, allReaders);
    generateJapaneseSitemap(allDevicesJa);

    console.log("\n✅ Sitemaps generated successfully!\n");
  } catch (error) {
    console.error("❌ Error generating sitemaps:", error.message);
    process.exit(1);
  }
}

generateSitemaps();

module.exports = { generateEnglishSitemap, generateJapaneseSitemap };
