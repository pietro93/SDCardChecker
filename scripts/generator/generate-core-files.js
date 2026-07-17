/**
 * SD Card Checker - Core Files Generator
 * Generates per locale: sitemap.xml, homepage, legal pages (where the locale has them).
 * robots.txt and 404.html are global/English-only (see generateRobots, generate404Page).
 * Locale-parameterized: replaces the old generate-core-files.js + generate-core-files-ja.js +
 * generate-ja-home.js split, and folds in generate-sitemaps.js's sitemap logic (which used to
 * write a second, unused copy to public/ - see JAPANESE_LOCALIZATION_MASTER.md history).
 */

const path = require("path");
const fs = require("fs");
const { readTemplate, processIncludes, writeFile, getCategorySlug, generateHreflangTags, t } = require("./helpers");
const { generateHeader, generateFooter, generateSidebar, generateGrowScript, generateAffiliateDisclosure } = require("../../src/templates/components");

const srcPath = path.join(__dirname, "../../src");
const locales = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/locales.json"), "utf8"));

function hasSection(locale, section) {
  return !!(locales[locale] && locales[locale].navSections.includes(section));
}

function dirSegment(locale) {
  return locales[locale] && locales[locale].dir ? locales[locale].dir : "";
}

/**
 * Guides available per locale, kept in sync with src/templates/components.js's
 * GUIDES_BY_LOCALE (duplicated here rather than imported to avoid a require cycle -
 * components.js doesn't depend on this file).
 */
const GUIDES_BY_LOCALE = {
  en: [
    "/guides/sd-card-guide/", "/guides/sd-card-speed-classes/", "/guides/video-bitrate-comparison/",
    "/guides/raw-vs-jpeg/", "/guides/is-my-sd-card-fake/", "/guides/nintendo-switch-sd-card-guide/",
    "/guides/readers/", "/guides/readers/macbook/", "/guides/readers/photographers/",
    "/guides/readers/iphone/", "/guides/readers/android/",
  ],
  ja: [
    "/ja/guides/sd-card-speed-classes/", "/ja/guides/is-my-sd-card-fake/", "/ja/guides/nintendo-switch-sd-card-guide/",
  ],
};

/**
 * Generate sitemap.xml for a locale
 */
function generateSitemap(allDevices, allReaders, distPath, locale = "en") {
  const baseUrl = "https://sdcardchecker.com";
  const dir = dirSegment(locale);
  const prefix = dir ? `/${dir}` : "";
  const today = new Date().toISOString().split("T")[0];

  const urls = [];
  const add = (loc, changefreq = "monthly", priority = 0.7) => urls.push({ loc, changefreq, priority });

  add(`${baseUrl}${prefix}/`, "weekly", 1.0);

  // English-only sections: readers, calculators/tools, misc resource pages
  if (locale === "en") {
    add(`${baseUrl}/readers/`, "monthly", 0.95);
    ["dongle", "viewer", "mobile-adapter", "professional-hub", "hub", "stick", "desktop-dock"].forEach((type) => {
      add(`${baseUrl}/readers/${type}/`, "monthly", 0.9);
    });
    add(`${baseUrl}/tools/`, "monthly", 0.95);
    add(`${baseUrl}/tools/calculators/`, "monthly", 0.95);
    ["video-storage", "photo-storage", "drone-storage", "security-camera-storage", "dashcam-storage", "action-camera-storage", "gopro-storage", "timelapse-storage"].forEach((calc) => {
      add(`${baseUrl}/tools/calculators/${calc}/`, "monthly", 0.9);
    });
    add(`${baseUrl}/faq.html`, "monthly", 0.8);
    if (allReaders && allReaders.length > 0) {
      allReaders.forEach((reader) => add(`${baseUrl}/readers/${reader.slug || reader.id}/`, "monthly", 0.85));
    }
  }

  if (hasSection(locale, "guides")) {
    (GUIDES_BY_LOCALE[locale] || []).forEach((p) => add(`${baseUrl}${p}`, "monthly", 0.8));
    add(`${baseUrl}${prefix}/guides/`, "monthly", 0.85);
  }

  if (hasSection(locale, "legal")) {
    add(`${baseUrl}${prefix}/about.html`, "yearly", 0.7);
    add(`${baseUrl}${prefix}/privacy.html`, "yearly", 0.5);
    add(`${baseUrl}${prefix}/terms.html`, "yearly", 0.5);
    if (locale === "en") {
      add(`${baseUrl}/contact.html`, "yearly", 0.7);
      add(`${baseUrl}/affiliate-disclosure.html`, "yearly", 0.5);
      add(`${baseUrl}/sitemap.html`, "yearly", 0.6);
    }
  }

  // Device + category pages
  allDevices.forEach((device) => {
    const slug = getCategorySlug(device.category);
    add(`${baseUrl}${prefix}/categories/${slug}/${device.slug}/`, "monthly", 0.8);
  });
  [...new Set(allDevices.map((d) => d.category))].forEach((category) => {
    add(`${baseUrl}${prefix}/categories/${getCategorySlug(category)}/`, "monthly", 0.9);
  });

  const body = urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join("\n");
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

  writeFile(path.join(distPath, dir, "sitemap.xml"), sitemapXML);
  console.log(`  ✓ ${locale} sitemap: ${allDevices.length} devices, ${new Set(allDevices.map((d) => d.category)).size} categories`);
}

/**
 * Generate a sitemapindex at the site root listing every enabled locale's sitemap.xml.
 * A single index is what Google Search Console / Bing Webmaster Tools expect you to submit
 * (one URL instead of one per locale), while robots.txt keeps listing the individual
 * sitemaps too since some crawlers only read robots.txt and never fetch the index itself.
 */
function generateSitemapIndex(distPath) {
  const baseUrl = "https://sdcardchecker.com";
  const today = new Date().toISOString().split("T")[0];

  const entries = Object.entries(locales)
    .filter(([, cfg]) => cfg.enabled)
    .map(([, cfg]) => `  <sitemap>\n    <loc>${baseUrl}${cfg.dir ? "/" + cfg.dir : ""}/sitemap.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`)
    .join("\n");

  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
  writeFile(path.join(distPath, "sitemap-index.xml"), sitemapIndexXML);
  console.log(`  ✓ sitemap index: ${Object.values(locales).filter((cfg) => cfg.enabled).length} locale sitemaps`);
}

/**
 * Generate robots.txt (single file at the site root - crawlers only ever fetch /robots.txt,
 * so a per-locale copy under /ja/robots.txt etc. is never actually requested)
 */
function generateRobots(distPath) {
  const sitemapLines = Object.entries(locales)
    .filter(([, cfg]) => cfg.enabled)
    .map(([, cfg]) => `Sitemap: https://sdcardchecker.com${cfg.dir ? "/" + cfg.dir : ""}/sitemap.xml`)
    .join("\n");

  const robotsTxt = `User-agent: *
Allow: /

# Priority access for major search engines
User-agent: bingbot
Allow: /

User-agent: Googlebot
Allow: /

# Block resource-heavy scraper bots
User-agent: PetalBot
Disallow: /
User-agent: AhrefsBot
Disallow: /
User-agent: SemrushBot
Disallow: /

# Sitemap index (submit this one URL to Search Console / Webmaster Tools)
Sitemap: https://sdcardchecker.com/sitemap-index.xml

# Localization Sitemaps
${sitemapLines}
`;
  writeFile(path.join(distPath, "robots.txt"), robotsTxt);
}

/**
 * Generate legal/static pages (about, privacy, terms - plus English-only contact,
 * affiliate-disclosure, sitemap.html) for locales that have navSections include "legal".
 */
function generateLegalPages(distPath, locale = "en") {
  if (!hasSection(locale, "legal")) return;

  const dir = dirSegment(locale);
  const header = generateHeader(locale);
  const footer = generateFooter(locale);
  const sidebar = generateSidebar(locale);
  const growScript = generateGrowScript();

  const renderPage = (templateName, outputName) => {
    const suffix = locale === "en" ? "" : `-${locale}`;
    const templatePath = path.join(srcPath, "templates", `${templateName}${suffix}.html`);
    if (!fs.existsSync(templatePath)) return;
    let template = readTemplate(templatePath);
    template = processIncludes(template, path.join(srcPath, "templates"));
    const html = template
      .replace("{{HEADER}}", header)
      .replace("{{FOOTER}}", footer)
      .replace("{{SIDEBAR}}", sidebar)
      .replace("{{GROW_SCRIPT}}", growScript);
    writeFile(path.join(distPath, dir, outputName), html);
  };

  renderPage("privacy", "privacy.html");
  renderPage("terms", "terms.html");
  renderPage("about", "about.html");

  if (locale === "en") {
    renderPage("affiliate-disclosure", "affiliate-disclosure.html");
    renderPage("contact", "contact.html");
    renderPage("sitemap", "sitemap.html");
  }
}

/**
 * Generate the homepage for a locale
 */
function generateHomepage(distPath, locale = "en", availableLocales = [locale]) {
  const dir = dirSegment(locale);
  const header = generateHeader(locale);
  const footer = generateFooter(locale);
  const growScript = generateGrowScript();

  const templateFile = locale === "en" ? "home.html" : `home-${locale}.html`;
  const templatePath = path.join(srcPath, "templates", templateFile);
  if (!fs.existsSync(templatePath)) {
    console.warn(`  Skipping ${locale} homepage: ${templateFile} not found`);
    return;
  }
  let homeTemplate = readTemplate(templatePath);
  homeTemplate = processIncludes(homeTemplate, path.join(srcPath, "templates"));
  // Only hreflang to locales that actually have a homepage template of their own
  const localesWithPage = availableLocales.filter((l) => {
    const f = l === "en" ? "home.html" : `home-${l}.html`;
    return fs.existsSync(path.join(srcPath, "templates", f));
  });
  const homeHtml = homeTemplate
    .replace("{{HREFLANG_TAGS}}", generateHreflangTags("/", localesWithPage))
    .replace("{{HEADER}}", header)
    .replace("{{FOOTER}}", footer)
    .replace("{{GROW_SCRIPT}}", growScript);
  writeFile(path.join(distPath, dir, "index.html"), homeHtml);
}

/**
* Generate 404 page (English only - no other locale has had one)
*/
function generate404Page(distPath) {
const header = generateHeader("en");
const footer = generateFooter("en");
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
* Generate all core files for a locale (homepage, sitemap, legal pages). robots.txt and
* 404.html are global/English-only and generated once by the caller, not per locale.
*/
async function generateCoreFiles(allDevices, allReaders, distPath, locale = "en", availableLocales = [locale]) {
  console.log(`Generating ${locale} core files...`);
  generateHomepage(distPath, locale, availableLocales);
  generateSitemap(allDevices, allReaders, distPath, locale);
  generateLegalPages(distPath, locale);
  console.log(`  ✓ ${locale} core files generated`);
}

module.exports = { generateCoreFiles, generateHomepage, generateSitemap, generateSitemapIndex, generateRobots, generateLegalPages, generate404Page };
