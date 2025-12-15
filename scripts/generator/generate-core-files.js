/**
 * SD Card Checker - Core Files Generator
 * Generates: sitemap.xml, robots.txt, privacy policy, home page
 */

const path = require("path");
const { readTemplate, processIncludes, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");

/**
 * Generate sitemap.xml
 */
function generateSitemap(allDevices, allReaders, distPath) {
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sdcardchecker.com/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Add readers hub pages
  sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/readers/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.95</priority>
  </url>
`;

  // Add reader type index pages
  const readerTypes = ["dongle", "viewer", "mobile-adapter", "professional-hub", "hub", "stick", "desktop-dock"];
  readerTypes.forEach((type) => {
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/readers/${type}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  // Add tools pages
  sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/tools/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://sdcardchecker.com/tools/calculators/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.95</priority>
  </url>
`;

  // Add calculator pages
  const calculators = [
    { path: "/tools/calculators/video-storage/", priority: 0.9 },
    { path: "/tools/calculators/photo-storage/", priority: 0.9 },
    { path: "/tools/calculators/drone-storage/", priority: 0.9 },
    { path: "/tools/calculators/security-camera-storage/", priority: 0.9 },
    { path: "/tools/calculators/dashcam-storage/", priority: 0.9 },
    { path: "/tools/calculators/action-camera-storage/", priority: 0.9 },
    { path: "/tools/calculators/gopro-storage/", priority: 0.9 },
    { path: "/tools/calculators/timelapse-storage/", priority: 0.9 }
  ];

  calculators.forEach((calc) => {
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com${calc.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${calc.priority}</priority>
  </url>
`;
  });

  // Add resource pages
  const resources = [
    { path: "/sd-card-guide.html", priority: 0.8 },
    { path: "/speed-classes.html", priority: 0.8 },
    { path: "/faq.html", priority: 0.8 }
  ];

  resources.forEach((resource) => {
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com${resource.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${resource.priority}</priority>
  </url>
`;
  });

  // Add legal and info pages
  const infoPages = [
    { path: "/about.html", priority: 0.7 },
    { path: "/contact.html", priority: 0.7 },
    { path: "/privacy.html", priority: 0.5 },
    { path: "/terms.html", priority: 0.5 },
    { path: "/affiliate-disclosure.html", priority: 0.5 },
    { path: "/sitemap.html", priority: 0.6 }
  ];

  infoPages.forEach((page) => {
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com${page.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add reader product pages
  if (allReaders && allReaders.length > 0) {
    allReaders.forEach((reader) => {
      const readerSlug = reader.slug || reader.id;
      sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/readers/${readerSlug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
`;
    });
  }

  // Add device pages
  allDevices.forEach((device) => {
    const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
    sitemapXML += `  <url>
    <loc>https://sdcardchecker.com/categories/${categorySlug}/${device.slug}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add category pages
  const categories = [...new Set(allDevices.map((d) => d.category))];
  categories.forEach((category) => {
    const slug = category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
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
const growScript = generateGrowScript();

// Generate Privacy Policy
let privacyTemplate = readTemplate(path.join(srcPath, "templates/privacy.html"));
privacyTemplate = processIncludes(privacyTemplate, path.join(srcPath, "templates"));
const privacyHtml = privacyTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar)
.replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "privacy.html"), privacyHtml);

// Generate Terms of Use
let termsTemplate = readTemplate(path.join(srcPath, "templates/terms.html"));
termsTemplate = processIncludes(termsTemplate, path.join(srcPath, "templates"));
const termsHtml = termsTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar)
.replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "terms.html"), termsHtml);

// Generate Affiliate Disclosure
let affiliateTemplate = readTemplate(path.join(srcPath, "templates/affiliate-disclosure.html"));
affiliateTemplate = processIncludes(affiliateTemplate, path.join(srcPath, "templates"));
const affiliateHtml = affiliateTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar)
.replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "affiliate-disclosure.html"), affiliateHtml);

// Generate About Page
let aboutTemplate = readTemplate(path.join(srcPath, "templates/about.html"));
aboutTemplate = processIncludes(aboutTemplate, path.join(srcPath, "templates"));
const aboutHtml = aboutTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar)
  .replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "about.html"), aboutHtml);

// Generate Contact Page
let contactTemplate = readTemplate(path.join(srcPath, "templates/contact.html"));
contactTemplate = processIncludes(contactTemplate, path.join(srcPath, "templates"));
const contactHtml = contactTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar)
  .replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "contact.html"), contactHtml);

// Generate Sitemap Page
let sitemapTemplate = readTemplate(path.join(srcPath, "templates/sitemap.html"));
sitemapTemplate = processIncludes(sitemapTemplate, path.join(srcPath, "templates"));
const sitemapHtml = sitemapTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar)
  .replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "sitemap.html"), sitemapHtml);
}

/**
* Generate home page
*/
function generateHomepage(distPath) {
const header = generateHeader();
const footer = generateFooter();
const growScript = generateGrowScript();
   let homeTemplate = readTemplate(path.join(srcPath, "templates/home.html"));
   homeTemplate = processIncludes(homeTemplate, path.join(srcPath, "templates"));
   const homeHtml = homeTemplate
     .replace("{{HEADER}}", header)
     .replace("{{FOOTER}}", footer)
     .replace("{{GROW_SCRIPT}}", growScript);
   writeFile(path.join(distPath, "index.html"), homeHtml);
}

/**
* Generate 404 page
*/
function generate404Page(distPath) {
const header = generateHeader();
const footer = generateFooter();
const growScript = generateGrowScript();
const page404Html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - SD Card Checker</title>
    <meta name="description" content="We couldn't find that page. Use our search to find the perfect SD card for your device.">
    <link rel="canonical" href="https://sdcardchecker.com/404.html">
    <link rel="icon" type="image/x-icon" href="/img/brand/favicon.ico">
    <link rel="apple-touch-icon" href="/img/brand/logo.webp">
    <link rel="stylesheet" href="/assets/css/tailwind.css">
    <link rel="stylesheet" href="/assets/css/modern.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="/assets/js/device-search.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    {{GROW_SCRIPT}}
</head>

<body>
    <!-- Header -->
    {{HEADER}}

    <!-- 404 Section -->
    <section style="padding: 4rem 0; min-height: 70vh; display: flex; align-items: center;">
        <div class="container">
            <div style="text-align: center; max-width: 600px; margin: 0 auto;">
                <div style="font-size: 6rem; font-weight: 900; color: #3b82f6; margin-bottom: 1rem;">404</div>
                <h1 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem;">Page Not Found</h1>
                <p style="font-size: 1.1rem; color: #6b7280; margin-bottom: 3rem;">We couldn't find that page, but we can help you find the perfect SD card for your device.</p>
                
                <!-- Device Search -->
                <div x-data="deviceSearch()" x-init="init()" @click.outside="open = false" style="margin-bottom: 3rem;">
                    <div class="search-container" style="max-width: 500px; margin: 0 auto;">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" x-model="query" @input="filterDevices()" @focus="open = true; filterDevices()"
                            @keydown="handleKeydown($event)"
                            placeholder="Search devices or categories..." class="search-input"
                            aria-label="Search for devices and recommended SD cards">
                        <div class="search-dropdown" :class="{ hidden: !open || filtered.length === 0 }">
                            <template x-for="(group, category) in groupedDevices()" :key="category">
                                <div>
                                    <div class="search-group-header" x-text="category"></div>
                                    <template x-for="device in groupedDevices()[category]" :key="device.id">
                                        <a :href="\`/categories/\${$root.getCategorySlug(device.category)}/\${device.slug}/\`" class="search-item">
                                            <div class="search-item-name" x-text="device.name"></div>
                                            <div class="search-item-category" x-text="device.category"></div>
                                        </a>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Quick Links -->
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 3rem;">
                    <a href="/" class="btn" style="padding: 0.75rem 2rem; background: #3b82f6; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.3s ease;">
                        <i class="fas fa-home" style="margin-right: 0.5rem;"></i> Back to Home
                    </a>
                    <a href="/#categories" class="btn" style="padding: 0.75rem 2rem; background: #e5e7eb; color: #1f2937; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.3s ease;">
                        <i class="fas fa-th" style="margin-right: 0.5rem;"></i> Browse Categories
                    </a>
                </div>
            </div>
        </div>
    </section>

    {{FOOTER}}
</body>

</html>`;

writeFile(path.join(distPath, "404.html"), page404Html
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{GROW_SCRIPT}}", growScript));
}

/**
* Generate all core files
*/
async function generateCoreFiles(allDevices, allReaders, distPath) {
console.log("📝 Generating core files...");
generateHomepage(distPath);
generate404Page(distPath);
generateSitemap(allDevices, allReaders, distPath);
generateRobots(distPath);
generateLegalPages(distPath);
console.log(`  ✓ Core files generated (homepage, 404, sitemap, robots.txt, privacy, terms, affiliate-disclosure, about, contact, sitemap-page)`);
}

module.exports = { generateCoreFiles };
