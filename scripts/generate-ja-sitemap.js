#!/usr/bin/env node

/**
 * Generate Japanese sitemap from devices-ja.json
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, '../data/devices-ja.json');
const outputPath = path.join(__dirname, '../public/ja/sitemap.xml');

// Read devices
const devicesData = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));
const devices = devicesData.devices;

// Category slug mapping
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
  'ドライブレコーダー': 'dash-cams',
  '高性能ドライブレコーダー': 'dash-cams',
  'バイク用ドライブレコーダー': 'dash-cams',
  'Dash Cams': 'dash-cams',
  'セキュリティカメラ': 'security-cameras',
  'Security Cameras': 'security-cameras',
  'トレイルカメラ': 'trail-cameras',
  'Trail Cameras': 'trail-cameras',
  'アクセサリー': 'accessories',
  'Accessories': 'accessories'
};

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sdcardchecker.com/ja/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Japanese Tools/Calculators -->
  <url>
    <loc>https://sdcardchecker.com/ja/guides/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/tools/dashcam-storage-calculator-ja/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/tools/recording-time-calculator-ja/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>

  <!-- Legal Pages -->
  <url>
    <loc>https://sdcardchecker.com/ja/about.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/privacy.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/terms.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Guide Pages -->
  <url>
    <loc>https://sdcardchecker.com/ja/guides/sd-card-speed-classes/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/guides/is-my-sd-card-fake/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/ja/guides/nintendo-switch-sd-card-guide/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Category Pages -->
`;

  // Get unique categories
  const categories = [...new Set(devices.map(d => d.category))];
  
  categories.forEach(category => {
    const slug = categorySlugMap[category] || category.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
    sitemap += `  <url>
    <loc>https://sdcardchecker.com/ja/categories/${slug}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  sitemap += `
  <!-- Device Pages -->
`;

  // Add all device pages
  devices.forEach(device => {
    const categorySlug = categorySlugMap[device.category] || device.category.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
    sitemap += `  <url>
    <loc>https://sdcardchecker.com/ja/categories/${categorySlug}/${device.slug}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;

  return sitemap;
}

// Generate and write
const sitemap = generateSitemap();
fs.writeFileSync(outputPath, sitemap, 'utf-8');

console.log(`✓ Japanese sitemap generated: ${outputPath}`);
console.log(`✓ Total devices: ${devices.length}`);
console.log(`✓ Total categories: ${new Set(devices.map(d => d.category)).size}`);
