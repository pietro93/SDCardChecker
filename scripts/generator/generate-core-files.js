/**
 * SD Card Checker - Core Files Generator
 * Generates: sitemap.xml, robots.txt, privacy policy, home page
 */

const path = require("path");
const { readTemplate, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript } = require("../../src/templates/components");

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
const privacyTemplate = readTemplate(path.join(srcPath, "templates/privacy.html"));
const privacyHtml = privacyTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar)
.replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "privacy.html"), privacyHtml);

// Generate Terms of Use
const termsTemplate = readTemplate(path.join(srcPath, "templates/terms.html"));
const termsHtml = termsTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar)
.replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "terms.html"), termsHtml);

// Generate Affiliate Disclosure
const affiliateTemplate = readTemplate(path.join(srcPath, "templates/affiliate-disclosure.html"));
const affiliateHtml = affiliateTemplate
.replace("{{HEADER}}", header)
.replace("{{FOOTER}}", footer)
.replace("{{SIDEBAR}}", sidebar)
.replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "affiliate-disclosure.html"), affiliateHtml);

// Generate About Page
const aboutTemplate = readTemplate(path.join(srcPath, "templates/about.html"));
const aboutHtml = aboutTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar)
  .replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "about.html"), aboutHtml);

// Generate Contact Page
const contactTemplate = readTemplate(path.join(srcPath, "templates/contact.html"));
const contactHtml = contactTemplate
  .replace("{{HEADER}}", header)
  .replace("{{FOOTER}}", footer)
  .replace("{{SIDEBAR}}", sidebar)
  .replace("{{GROW_SCRIPT}}", growScript);
writeFile(path.join(distPath, "contact.html"), contactHtml);

// Generate Sitemap Page
const sitemapTemplate = readTemplate(path.join(srcPath, "templates/sitemap.html"));
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
   const homeTemplate = readTemplate(path.join(srcPath, "templates/home.html"));
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
                                        <a :href="\`/devices/\${device.slug}/\`" class="search-item">
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

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('deviceSearch', () => ({
                query: '',
                allDevices: [],
                filtered: [],
                open: false,

                init() {
                    this.loadDevices();
                },

                loadDevices() {
                    fetch('/data/devices.json')
                        .then(res => res.json())
                        .then(data => {
                            this.allDevices = data.devices;
                            this.filtered = this.allDevices.slice(0, 30);
                        })
                        .catch(err => console.error('Failed to load devices:', err));
                },

                filterDevices() {
                    const q = this.query.toLowerCase();
                    if (!q) {
                        this.filtered = this.allDevices.slice(0, 30);
                        return;
                    }

                    this.filtered = this.allDevices.filter(device =>
                        device.name.toLowerCase().includes(q) ||
                        device.category.toLowerCase().includes(q) ||
                        (device.searchTerms && device.searchTerms.some(term =>
                            term.toLowerCase().includes(q)
                        ))
                    );
                },

                groupedDevices() {
                    const grouped = {};
                    this.filtered.forEach(device => {
                        if (!grouped[device.category]) {
                            grouped[device.category] = [];
                        }
                        grouped[device.category].push(device);
                    });
                    return Object.keys(grouped).sort().reduce((acc, key) => {
                        acc[key] = grouped[key];
                        return acc;
                    }, {});
                },

                handleKeydown(e) {
                    if (e.key === 'Escape') {
                        this.open = false;
                    }
                }
            }));
        });
    </script>
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
async function generateCoreFiles(allDevices, distPath) {
console.log("📝 Generating core files...");
generateHomepage(distPath);
generate404Page(distPath);
generateSitemap(allDevices, distPath);
generateRobots(distPath);
generateLegalPages(distPath);
console.log(`  ✓ Core files generated (homepage, 404, sitemap, robots.txt, privacy, terms, affiliate-disclosure, about, contact, sitemap-page)`);
}

module.exports = { generateCoreFiles };
