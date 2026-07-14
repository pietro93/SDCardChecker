/**
 * Reusable HTML components for consistent headers, footers, sidebars.
 * Locale-parameterized: pass a locale code ("en", "ja", "de", ...) to every generator
 * instead of forking this file per language. See data/locales.json for which nav
 * sections each locale renders, and data/category-slugs.json for category labels.
 */

const fs = require("fs");
const path = require("path");
const { t, getCategorySlug, getCategoryLabel } = require("../../scripts/generator/helpers");

const dataDir = path.join(__dirname, "../../data");
const locales = JSON.parse(fs.readFileSync(path.join(dataDir, "locales.json"), "utf8"));

// Fixed display order for the header dropdown / mobile "Categories" menu - trimmed to
// the categories with the widest device coverage. Sidebar shows a slightly larger set,
// split into a primary list plus a collapsible "More" list.
const HEADER_CATEGORY_ORDER = ["cameras", "action-cameras", "drones", "gaming-handhelds", "dash-cams", "computing-and-tablets"];
const SIDEBAR_PRIMARY_CATEGORIES = ["action-cameras", "cameras", "computing-and-tablets", "drones", "gaming-handhelds", "dash-cams", "smartphones"];
const SIDEBAR_MORE_CATEGORIES = ["audio-and-hi-fi", "security-cameras", "3d-printers-and-fabrication", "music-production"];

const availableCategoriesCache = {};
/**
 * Category slugs that actually have device pages for this locale, so nav links never
 * point at a category the locale hasn't translated yet. Falls back to English devices.json.
 */
function getAvailableCategorySlugs(locale) {
  if (availableCategoriesCache[locale]) return availableCategoriesCache[locale];
  const filename = locale === "en" ? "devices.json" : `devices-${locale}.json`;
  const filePath = path.join(dataDir, filename);
  const resolvedPath = fs.existsSync(filePath) ? filePath : path.join(dataDir, "devices.json");
  const data = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  const slugs = new Set((data.devices || []).map((d) => getCategorySlug(d.category)));
  availableCategoriesCache[locale] = slugs;
  return slugs;
}

function localeHref(locale, urlPath) {
  const dir = locales[locale] && locales[locale].dir;
  return dir ? `/${dir}${urlPath}` : urlPath;
}

function hasSection(locale, section) {
  return !!(locales[locale] && locales[locale].navSections.includes(section));
}

function generateGrowScript() {
    return `<!-- Grow Script -->
<script data-grow-initializer="">!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","U2l0ZTo3YzE2YTcwYi1mNzdjLTQ0MWQtYjJmNi05MmEzZTMzNDc2Yjk=");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();</script>`;
}

function categoryLinks(locale, slugs, linkClass) {
  const available = getAvailableCategorySlugs(locale);
  return slugs
    .filter((slug) => available.has(slug))
    .map((slug) => `<a href="${localeHref(locale, `/categories/${slug}/`)}" class="${linkClass}">${getCategoryLabel(slug, locale)}</a>`)
    .join("\n");
}

function languageSwitcher(locale, { mobile = false } = {}) {
  const enabledLocales = Object.entries(locales).filter(([, cfg]) => cfg.enabled);
  const rows = enabledLocales
    .map(([code, cfg]) => {
      const active = code === locale;
      const activeClasses = mobile
        ? "text-blue-600 bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-between"
        : "block px-4 py-3 text-blue-600 bg-blue-50 last:rounded-b-lg text-sm font-medium flex items-center justify-between";
      const inactiveClasses = mobile
        ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
        : "block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium";
      const cls = mobile ? `block px-3 py-2 ${active ? activeClasses : inactiveClasses}` : (active ? activeClasses : inactiveClasses);
      const check = active ? ' <i class="fas fa-check text-blue-600"></i>' : "";
      return `<a href="${localeHref(code, "/")}" class="${cls}">${cfg.name}${check}</a>`;
    })
    .join("\n");
  return rows;
}

function generateHeader(locale = "en") {
    const home = localeHref(locale, "/");
    const categoriesUrl = localeHref(locale, "/categories/");
    const categoryDropdown = categoryLinks(locale, HEADER_CATEGORY_ORDER, "block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium");
    const categoryMobile = categoryLinks(locale, HEADER_CATEGORY_ORDER, "block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm");

    const calculatorsNav = hasSection(locale, "calculators") ? `
      <div class="relative group flex items-center">
      <a href="/tools/calculators/" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
      ${t("nav.calculators", locale)}
      <i class="fas fa-chevron-down text-xs"></i>
      </a>
      <div class="absolute left-0 top-full pt-2 w-56 hidden group-hover:block z-50">
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
       <a href="/tools/calculators/video-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 first:rounded-t-lg text-sm font-medium">Video Storage Time</a>
       <a href="/tools/calculators/photo-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Photo Storage & Capacity</a>
       <a href="/tools/calculators/drone-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Drone Recording Time</a>
       <a href="/tools/calculators/security-camera-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Security Camera Time</a>
       <a href="/tools/calculators/dashcam-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Dashcam Storage</a>
       <a href="/tools/calculators/action-camera-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Action Camera Storage</a>
       <a href="/tools/calculators/gopro-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">GoPro Recording Time</a>
       <a href="/tools/calculators/" class="block px-4 py-3 text-blue-600 bg-blue-50 last:rounded-b-lg text-xs font-bold border-t border-blue-200 flex items-center gap-2"><i class="fas fa-calculator"></i> ${t("nav.allCalculators", locale)}</a>
       </div>
       </div>
      </div>` : "";

    const guidesNav = hasSection(locale, "guides") ? `
       <div class="relative group flex items-center">
         <a href="${localeHref(locale, "/guides/")}" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
         ${t("nav.guides", locale)}
         <i class="fas fa-chevron-down text-xs"></i>
         </a>
         <div class="absolute left-0 top-full pt-2 w-56 hidden group-hover:block z-50">
         <div class="bg-white rounded-lg shadow-lg border border-slate-200">
          ${guideLinks(locale, "block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 first:rounded-t-lg text-sm font-medium")}
          <a href="${localeHref(locale, "/guides/")}" class="block px-4 py-3 text-blue-600 bg-blue-50 last:rounded-b-lg text-xs font-bold border-t border-blue-200 flex items-center gap-2"><i class="fas fa-book"></i> ${t("nav.allGuides", locale)}</a>
          </div>
          </div>
         </div>` : "";

    const compareNav = hasSection(locale, "compare") ? `<a href="/compare/" class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">${t("nav.compare", locale)}</a>` : "";
    const readersLink = hasSection(locale, "readers") ? `<a href="/readers/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">${t("nav.cardReaders", locale)}</a>` : "";
    const carsLink = hasSection(locale, "cars") ? `<a href="/cars/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">${t("nav.carNavigation", locale)}</a>` : "";
    const readersMobile = hasSection(locale, "readers") ? `<a href="/readers/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">${t("nav.cardReaders", locale)}</a>` : "";
    const carsMobile = hasSection(locale, "cars") ? `<a href="/cars/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">${t("nav.carNavigation", locale)}</a>` : "";

    const calculatorsMobile = hasSection(locale, "calculators") ? `
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="calculators">
        <span>${t("nav.calculators", locale)}</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="calculators">
        <a href="/tools/calculators/video-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Video Storage Time</a>
        <a href="/tools/calculators/photo-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Photo Storage</a>
        <a href="/tools/calculators/drone-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Drone Recording</a>
        <a href="/tools/calculators/security-camera-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Security Camera</a>
        <a href="/tools/calculators/dashcam-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Dashcam Storage</a>
        <a href="/tools/calculators/action-camera-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Action Camera</a>
        <a href="/tools/calculators/gopro-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">GoPro Recording</a>
        <a href="/tools/calculators/" class="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors text-sm font-medium">${t("nav.browseAllCalculators", locale)}</a>
      </div>` : "";

    const guidesMobile = hasSection(locale, "guides") ? `
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="resources">
        <span>${t("nav.guides", locale)}</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="resources">
        ${guideLinks(locale, "block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm")}
        <a href="${localeHref(locale, "/guides/")}" class="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors text-sm font-medium">${t("nav.browseAllGuides", locale)}</a>
      </div>` : "";

    const compareMobile = hasSection(locale, "compare") ? `<a href="/compare/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">${t("nav.compare", locale)}</a>` : "";

return `<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/img/favicon.ico">

<!-- Header -->
<header class="sticky top-0 z-50 bg-white shadow-sm header-nav-container">
<div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
<a href="${home}" class="flex items-center gap-3 group flex-shrink-0">
<img src="/img/brand/logo.webp" alt="SD Card Checker Logo" class="w-10 h-10 rounded-lg shadow-md group-hover:shadow-lg transition-shadow" width="40" height="40">
<span class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">SD Card Checker</span>
</a>
    <nav class="header-nav hidden md:flex gap-8 items-center">
    <a href="${home}" class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">${t("nav.home", locale)}</a>

    <div class="relative group flex items-center">
    <a href="${categoriesUrl}" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
      ${t("nav.categories", locale)}
      <i class="fas fa-chevron-down text-xs"></i>
      </a>
      <div class="absolute left-0 top-full pt-2 w-56 hidden group-hover:block z-50">
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
       ${categoryDropdown}
       ${readersLink}
       ${carsLink}
       <a href="${categoriesUrl}" class="block px-4 py-3 text-blue-600 bg-blue-50 last:rounded-b-lg text-xs font-bold border-t border-blue-200 flex items-center gap-2"><i class="fas fa-grid-2"></i> ${t("nav.allCategories", locale)}</a>
       </div>
        </div>
       </div>
${calculatorsNav}
${guidesNav}
       ${compareNav}
       </nav>

       <!-- Language Switcher (Desktop) -->
       <div class="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
         <div class="relative group">
           <button class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm flex items-center gap-1 cursor-pointer">
             <i class="fas fa-globe"></i>
             <span>${locales[locale].name}</span>
             <i class="fas fa-chevron-down text-xs"></i>
           </button>
           <div class="absolute right-0 top-full pt-2 w-40 hidden group-hover:block z-50">
             <div class="bg-white rounded-lg shadow-lg border border-slate-200">
               ${languageSwitcher(locale)}
             </div>
           </div>
         </div>
       </div>

       <!-- Mobile Menu Button -->
    <button class="md:hidden text-slate-600 hover:text-blue-600 mobile-menu-toggle flex items-center justify-center" aria-label="Toggle menu" id="mobileMenuBtn" style="width: 44px; height: 44px; padding: 0;">
      <i class="fas fa-bars text-xl" style="display: block;"></i>
    </button>
  </div>

  <!-- Mobile Navigation Menu -->
  <nav class="mobile-menu hidden md:hidden bg-slate-50 border-t border-slate-200 max-h-[calc(100vh-80px)] overflow-y-auto" id="mobileMenu">
    <div class="px-4 py-3 space-y-1">
      <!-- Language Switcher (Mobile) -->
      <div class="border-b border-slate-200 pb-3 mb-3">
        <p class="px-3 py-2 text-sm font-semibold text-slate-700 text-slate-600">${t("nav.selectLanguage", locale)}</p>
        ${languageSwitcher(locale, { mobile: true })}
      </div>

      <!-- Direct Links -->
      <a href="${home}" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">${t("nav.home", locale)}</a>

      <!-- Categories Section -->
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="devices">
        <span>${t("nav.categories", locale)}</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="devices">
        ${categoryMobile}
        ${readersMobile}
        ${carsMobile}
        <a href="${categoriesUrl}" class="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors text-sm font-medium">${t("nav.browseAllCategories", locale)}</a>
      </div>
${calculatorsMobile}
${guidesMobile}
      <!-- Direct Links -->
      ${compareMobile}
      </div>
      </nav>
      </header>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });

    // Handle section toggles
    const sectionToggles = mobileMenu.querySelectorAll('.mobile-section-toggle');
    sectionToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        const content = mobileMenu.querySelector('[data-content="' + section + '"]');
        const icon = this.querySelector('i');

        if (content) {
          content.classList.toggle('hidden');
          icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
        }
      });
    });

    // Close menu when a link is clicked
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});
</script>`;
}

// Locale-specific translated guide pages. Only list guides that actually exist for that
// locale - a guide missing here simply won't appear in the nav until it's translated.
const GUIDES_BY_LOCALE = {
  en: [
    { href: "/guides/sd-card-guide/", label: "SD Card Guide" },
    { href: "/guides/sd-card-speed-classes/", label: "Speed Classes" },
    { href: "/guides/video-bitrate-comparison/", label: "Video Bitrate Guide" },
    { href: "/guides/raw-vs-jpeg/", label: "RAW vs JPEG" },
    { href: "/guides/is-my-sd-card-fake/", label: "Fake SD Card Checker" },
  ],
  ja: [
    { href: "/ja/guides/sd-card-speed-classes/", label: "速度クラス" },
    { href: "/ja/guides/is-my-sd-card-fake/", label: "偽造SDカード見分け方" },
    { href: "/ja/guides/nintendo-switch-sd-card-guide/", label: "ニンテンドースイッチガイド" },
  ],
};

function guideLinks(locale, linkClass) {
  const guides = GUIDES_BY_LOCALE[locale] || [];
  return guides.map((g) => `<a href="${g.href}" class="${linkClass}">${g.label}</a>`).join("\n");
}

function generateFooter(locale = "en") {
    const legal = hasSection(locale, "legal") ? `
<div>
<h4 class="font-bold text-white mb-4">${t("footer.legal", locale)}</h4>
<ul class="space-y-2 text-sm">
<li><a href="${localeHref(locale, "/privacy.html")}" class="hover:text-white transition-colors">${t("footer.privacy", locale)}</a></li>
<li><a href="${localeHref(locale, "/terms.html")}" class="hover:text-white transition-colors">${t("footer.terms", locale)}</a></li>
</ul>
</div>` : "";

    const otherLocalesColumn = locale !== "en" ? `
<div>
<h4 class="font-bold text-white mb-4">${t("footer.otherVersions", locale)}</h4>
<ul class="space-y-2 text-sm">
<li><a href="/" class="hover:text-white transition-colors">English Version</a></li>
${!hasSection(locale, "readers") ? `<li><span class="text-slate-400 text-xs">${t("footer.readersNotOffered", locale)}</span></li>` : ""}
</ul>
</div>` : "";

    return `<!-- Footer -->
<footer class="bg-slate-900 text-slate-200 py-12 mt-20">
<div class="max-w-7xl mx-auto px-4">
<div class="grid md:grid-cols-5 gap-8 mb-8">
<div>
<h4 class="font-bold text-white mb-4">${t("footer.company", locale)}</h4>
<ul class="space-y-2 text-sm">
    <li><a href="${localeHref(locale, "/about.html")}" class="hover:text-white transition-colors">${t("footer.aboutUs", locale)}</a></li>
    ${locale === "en" ? `<li><a href="/contact.html" class="hover:text-white transition-colors">${t("footer.contact", locale)}</a></li>` : ""}
</ul>
</div>
${legal}
<div>
<h4 class="font-bold text-white mb-4">${t("footer.site", locale)}</h4>
<ul class="space-y-2 text-sm">
<li><a href="${localeHref(locale, "/sitemap.xml")}" class="hover:text-white transition-colors">${t("footer.sitemap", locale)}</a></li>
</ul>
</div>
${otherLocalesColumn}
</div>

<div class="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
  <p>&copy; 2026 SD Card Checker. All rights reserved.</p>
</div>
</div>
</footer>`;
}

function generateAffiliateDisclosure(locale = "en", compact = false) {
    const baseClasses = "border-l-4 border-amber-400 rounded-r-lg";
    const sizeClasses = compact ? "p-2 mb-4 mx-0" : "p-4 mb-8 mx-4";
    const opacity = compact ? "opacity-80" : "";
    const textSize = compact ? "text-xs" : "text-sm";

    return `<!-- Affiliate Disclosure -->
<section class="${baseClasses} ${sizeClasses} ${opacity}">
   <center><p class="${textSize} text-grey-900">
     <i class="fas fa-circle-info mr-2"></i>
     ${t("disclosure", locale)}
   </p></center>
 </section>`;
}

function generateSidebar(locale = "en") {
    // Alpine.js template literal for the search dropdown - device.slug is resolved client-side,
    // only the locale path prefix is resolved here.
    const searchResultBase = localeHref(locale, "/devices/");
    const searchResultLink = `${searchResultBase}\${device.slug}/`;

    const primaryCategoryItems = categoryLinks(locale, SIDEBAR_PRIMARY_CATEGORIES, "text-sm text-slate-600 hover:text-blue-600 transition-colors")
      .split("\n")
      .filter(Boolean)
      .map((link) => `  <li>${link}</li>`)
      .join("\n");

    const moreCategoryItems = categoryLinks(locale, SIDEBAR_MORE_CATEGORIES, "text-sm text-slate-600 hover:text-blue-600 transition-colors")
      .split("\n")
      .filter(Boolean)
      .map((link) => `      <li>${link}</li>`)
      .join("\n");

    const moreCategoriesBlock = moreCategoryItems ? `
  <li x-data="{ open: false }">
    <button @click="open = !open" class="w-full text-left text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-between">
      ${t("sidebar.moreCategories", locale)}
      <i :class="open ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-xs"></i>
    </button>
    <ul x-show="open" class="mt-2 ml-3 space-y-2 border-l border-slate-200 pl-3">
${moreCategoryItems}
    </ul>
  </li>` : "";

    const calculatorsBlock = hasSection(locale, "calculators") ? `
  <!-- Tools Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">${t("sidebar.calculatorsHeading", locale)}</h3>
    <ul class="space-y-2">
      <li><a href="/tools/calculators/video-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Video Storage & Recording Time</a></li>
      <li><a href="/tools/calculators/photo-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Photo Storage & Capacity</a></li>
      <li><a href="/tools/calculators/drone-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Drone Recording Time & Storage</a></li>
      <li><a href="/tools/calculators/security-camera-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Security Camera Recording Time</a></li>
      <li><a href="/tools/calculators/dashcam-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Dashcam Storage & Loop Time</a></li>
      <li><a href="/tools/calculators/action-camera-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Action Camera Storage & Capacity</a></li>
      <li><a href="/tools/calculators/gopro-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">GoPro Recording Time & Storage</a></li>
      <li><a href="/tools/calculators/timelapse-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Timelapse Storage & Photo Count</a></li>
    </ul>
  </div>` : "";

    const guidesBlock = hasSection(locale, "guides") ? `
  <!-- Guide Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">${t("sidebar.guidesHeading", locale)}</h3>
    <ul class="space-y-2">
      ${(GUIDES_BY_LOCALE[locale] || []).map((g) => `<li><a href="${g.href}" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">${g.label}</a></li>`).join("\n      ")}
    </ul>
  </div>` : "";

     return `<!-- Right Sidebar Navigation -->
<aside style="width: 100%; max-width: 380px; flex-shrink: 0; margin-top: 3rem; position: sticky; top: 80px; background: white; border-radius: 6px; border: 1px solid #e5e5e5; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
   <!-- Search Bar at Top -->
   <div x-data="deviceSearch()" x-init="init()" @click.outside="open = false" class="relative mb-6">
    <div class="relative">
      <i class="fas fa-search absolute left-3 top-3 text-slate-400"></i>
      <input
         type="text"
         x-model="query"
         @input="filterDevices()"
         @focus="open = true; filterDevices()"
         @keydown="handleKeydown($event)"
         placeholder="${t("sidebar.searchPlaceholder", locale)}"
         class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         data-hj-allow
       >
    </div>
    <div class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-50" :class="{ hidden: !open || filtered.length === 0 }">
      <template x-for="(group, category) in groupedDevices()" :key="category">
        <div>
          <div class="px-4 py-2 text-xs font-bold text-slate-500 uppercase bg-slate-50" x-text="category"></div>
          <template x-for="device in groupedDevices()[category]" :key="device.id">
            <a :href="\`${searchResultLink}\`" class="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600" x-text="device.name"></a>
          </template>
        </div>
      </template>
    </div>
  </div>

  <!-- Category Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
  <h3 class="text-sm font-semibold text-slate-900 mb-3">${t("sidebar.categoriesHeading", locale)}</h3>
  <ul class="space-y-2">
${primaryCategoryItems}${moreCategoriesBlock}
     </ul>
  </div>
${calculatorsBlock}
${guidesBlock}
  <!-- About Section -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">${t("sidebar.aboutHeading", locale)}</h3>
    <p class="text-sm italic text-slate-600 opacity-80">${t("sidebar.aboutText", locale)}</p>
  </div>

  <!-- Disclaimer Section -->
   <div class="border-t border-slate-200 pt-6">
     <h3 class="text-sm font-semibold text-slate-900 mb-3">${t("sidebar.disclaimerHeading", locale)}</h3>
     <p class="text-sm italic text-slate-600 opacity-80">${t("sidebar.disclaimerText1", locale)}</p>
     <p class="text-sm italic text-slate-600 opacity-80 mt-3">${t("sidebar.disclaimerText2", locale)}</p>
   </div>
</aside>`;
}

module.exports = {
    generateHeader,
    generateFooter,
    generateAffiliateDisclosure,
    generateSidebar,
    generateGrowScript,
};
