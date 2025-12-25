/**
 * SD Card Checker - Japanese Core Files Generator
 * Generates Japanese sitemap.xml and robots.txt
 */

const path = require("path");
const { writeFile } = require("./helpers");

/**
 * Generate Japanese sitemap.xml
 */
function generateJapaneseSitemap(allDevices, distPath) {
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sdcardchecker.com/ja/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Add tools pages (calculators not translated yet, skip for now)
  
  // Add legal and info pages
  const infoPages = [
    { path: "/about.html", priority: 0.7 },
    { path: "/privacy.html", priority: 0.5 },
    { path: "/terms.html", priority: 0.5 }
  ];

  infoPages.forEach((page) => {
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/ja${page.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add device pages
  allDevices.forEach((device) => {
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

    const categorySlug = categorySlugMap[device.category] || device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/ja/categories/${categorySlug}/${device.slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add category pages
  const categories = [...new Set(allDevices.map((d) => d.category))];
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

  categories.forEach((category) => {
    const slug = categorySlugMap[category] || category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/ja/categories/${slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  // Add guide pages
  const guides = [
    { path: "/guides/sd-card-speed-classes/", priority: 0.8 },
    { path: "/guides/is-my-sd-card-fake/", priority: 0.8 },
    { path: "/guides/nintendo-switch-sd-card-guide/", priority: 0.8 }
  ];

  guides.forEach((guide) => {
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/ja${guide.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${guide.priority}</priority>
  </url>
`;
  });

  sitemapXML += `</urlset>`;
  writeFile(path.join(distPath, "ja", "sitemap.xml"), sitemapXML);
}

/**
 * Generate Japanese robots.txt
 */
function generateJapaneseRobots(distPath) {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://sdcardchecker.com/ja/sitemap.xml
`;
  writeFile(path.join(distPath, "ja", "robots.txt"), robotsTxt);
}

/**
 * Generate all Japanese core files
 */
async function generateJapaneseCoreFiles(allDevices, distPath) {
  console.log("📝 Generating Japanese core files...");
  generateJapaneseSitemap(allDevices, distPath);
  generateJapaneseRobots(distPath);
  console.log(`  ✓ Japanese sitemap & robots.txt generated`);
}

module.exports = { generateJapaneseCoreFiles };
