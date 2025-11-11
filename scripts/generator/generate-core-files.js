/**
 * SD Card Checker - Core Files Generator
 * Generates: sitemap.xml, robots.txt, privacy policy, home page
 */

const path = require("path");
const { readTemplate, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

/**
 * Generate sitemap.xml
 */
function generateSitemap(allDevices, distPath) {
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sdcardchecker.com/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Add device pages
  allDevices.forEach((device) => {
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/devices/${device.slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add category pages
  const categories = [...new Set(allDevices.map((d) => d.category))];
  categories.forEach((category) => {
    const slug = category.toLowerCase().replace(/\s+/g, "-");
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/categories/${slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  sitemapXML += `</urlset>`;
  writeFile(path.join(distPath, "sitemap.xml"), sitemapXML);
}

/**
 * Generate robots.txt
 */
function generateRobots(distPath) {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://sdcardchecker.com/sitemap.xml
`;
  writeFile(path.join(distPath, "robots.txt"), robotsTxt);
}

/**
* Generate legal pages from templates
*/
function generateLegalPages(distPath) {
const header = generateHeader();
const footer = generateFooter();
const sidebar = generateSidebar();

// Generate Privacy Policy
const privacyTemplate = readTemplate(path.join(srcPath, "templates/privacy.html"));
const privacyHtml = privacyTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar);
writeFile(path.join(distPath, "privacy.html"), privacyHtml);

// Generate Terms of Use
const termsTemplate = readTemplate(path.join(srcPath, "templates/terms.html"));
const termsHtml = termsTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar);
writeFile(path.join(distPath, "terms.html"), termsHtml);

// Generate Affiliate Disclosure
const affiliateTemplate = readTemplate(path.join(srcPath, "templates/affiliate-disclosure.html"));
const affiliateHtml = affiliateTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar);
writeFile(path.join(distPath, "affiliate-disclosure.html"), affiliateHtml);

// Generate About Page
const aboutTemplate = readTemplate(path.join(srcPath, "templates/about.html"));
const aboutHtml = aboutTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar);
writeFile(path.join(distPath, "about.html"), aboutHtml);

// Generate Contact Page
const contactTemplate = readTemplate(path.join(srcPath, "templates/contact.html"));
const contactHtml = contactTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar);
writeFile(path.join(distPath, "contact.html"), contactHtml);

// Generate Sitemap Page
const sitemapTemplate = readTemplate(path.join(srcPath, "templates/sitemap.html"));
const sitemapHtml = sitemapTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar);
writeFile(path.join(distPath, "sitemap.html"), sitemapHtml);
}

/**
* Generate home page
*/
function generateHomepage(distPath) {
const header = generateHeader();
const footer = generateFooter();
   const homeTemplate = readTemplate(path.join(srcPath, "templates/home.html"));
   const homeHtml = homeTemplate
     .replace("{{HEADER}}", header)
     .replace("{{FOOTER}}", footer);
   writeFile(path.join(distPath, "index.html"), homeHtml);
}

/**
* Generate all core files
*/
async function generateCoreFiles(allDevices, distPath) {
console.log("📝 Generating core files...");
generateHomepage(distPath);
generateSitemap(allDevices, distPath);
generateRobots(distPath);
generateLegalPages(distPath);
console.log(`  ✓ Core files generated (homepage, sitemap, robots.txt, privacy, terms, affiliate-disclosure, about, contact, sitemap-page)`);
}

module.exports = { generateCoreFiles };
