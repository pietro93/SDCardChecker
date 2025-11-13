/**
 * SD Card Checker - Shared Helper Functions
 */

const fs = require("fs");
const path = require("path");

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Read JSON file
 */
function readJSON(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

/**
 * Read template file
 */
function readTemplate(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

/**
 * Write file to disk
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  ✓ ${path.relative(process.cwd(), filePath)}`);
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  ensureDir(dest);
  const files = fs.readdirSync(src);

  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * Generate FAQ schema for structured data
 */
function generateFAQSchema(faqItems) {
  const faqList = faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a.replace(/<[^>]*>/g, ''), // Strip HTML tags for plain text
    },
  }));
  
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList
  });
}

/**
 * Get smart fallback image for device based on name/category
 */
function getDeviceImageFallback(device) {
  const name = device.name.toLowerCase();
  const category = device.category.toLowerCase();

  // Brand-specific placeholders (exact match first)
  if (name.includes("gopro")) return "/img/devices/gopro-hero-13.webp";
  if (name.includes("dji mavic")) return "/img/devices/dji-mavic-3.webp";
  if (name.includes("dji mini")) return "/img/devices/dji-mini-4-pro.webp";
  if (name.includes("dji osmo")) return "/img/devices/dji-pocket-3.webp";
  if (name.includes("dji")) return "/img/devices/drone-placeholder.webp";
  if (name.includes("steam deck")) return "/img/devices/steam-deck.webp";
  if (name.includes("switch lite")) return "/img/devices/nintendo-switch.webp";
  if (name.includes("nintendo")) return "/img/devices/nintendo-switch-oled.webp";
  if (name.includes("amazon fire")) return "/img/devices/amazon-fire-max-11.webp";
  if (name.includes("samsung galaxy")) return "/img/devices/placeholder.webp";
  if (name.includes("wyze")) return "/img/devices/wyze-cam-v3.webp";
  if (name.includes("eufy")) return "/img/devices/eufy-solocam-s340.webp";
  if (name.includes("insta360")) return "/img/devices/insta360-x3.webp";
  if (name.includes("raspberry pi")) return "/img/devices/raspberry-pi-5.webp";
  if (name.includes("asus rog")) return "/img/devices/asus-rog-ally.webp";
  if (name.includes("chromebook")) return "/img/devices/placeholder.webp";
  if (name.includes("hp")) return "/img/devices/placeholder.webp";
  if (name.includes("canon")) return "/img/devices/canon-eos-r5.webp";
  if (name.includes("nikon")) return "/img/devices/nikon-placeholder.webp";
  if (name.includes("sony")) return "/img/devices/sony-placeholder.webp";
  if (name.includes("fujifilm")) return "/img/devices/fujifilm-placeholder.webp";
  if (name.includes("blackmagic")) return "/img/devices/blackmagic-pocket-cinema-camera-6k-pro.webp";

  // Category-based placeholders
  if (category.includes("action camera")) 
    return "/img/devices/gopro-placeholder.webp";
  if (category.includes("security camera")) 
    return "/img/devices/wyze-cam-v3.webp";
  if (category.includes("mirrorless")) 
    return "/img/devices/sony-placeholder.webp";
  if (category.includes("camera")) 
    return "/img/devices/placeholder.webp";
  if (category.includes("drone")) 
    return "/img/devices/drone-placeholder.webp";
  if (category.includes("gaming")) 
    return "/img/devices/nintendo-switch-oled.webp";
  if (category.includes("computing") || category.includes("tablet")) 
    return "/img/devices/placeholder.webp";

  return "/img/devices/placeholder.webp";
}

/**
 * Get smart fallback image for SD card based on type/speed
 */
function getCardImageFallback(card) {
  const cardPath = path.join(__dirname, "../../img/cards");
  
  // If card has imageUrl, check if file exists
  if (card.imageUrl) {
    const imagePath = path.join(__dirname, "../../img/cards", card.imageUrl.replace("/img/cards/", ""));
    if (fs.existsSync(imagePath)) {
      return card.imageUrl;
    }
  }
  
  // Use type and uhs fields from sdcards.json for smart fallback selection
  const isMicroSD = card.type === "microSD";
  const uhs = card.uhs ? card.uhs.toUpperCase() : "";
  
  // UHS-II cards
  if (uhs.includes("UHS-II")) {
    return isMicroSD ? "/img/cards/micro-uhs2-generic.webp" : "/img/cards/uhs2-generic.webp";
  }
  
  // UHS-I cards
  if (uhs.includes("UHS-I")) {
    return isMicroSD ? "/img/cards/micro-uhs1-generic.webp" : "/img/cards/uhs1-generic.webp";
  }

  return "/img/cards/placeholder.webp";
}

/**
 * Generate BreadcrumbList schema for breadcrumb navigation
 */
function generateBreadcrumbSchema(breadcrumbs, baseUrl = "https://sdcardchecker.com") {
  const itemListElements = breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": baseUrl + item.url
  }));

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElements
  });
}

/**
 * Generate Product schema for SD card recommendations
 */
function generateProductSchema(brandReferences, sdcardsMap, baseUrl = "https://sdcardchecker.com") {
  const products = brandReferences
    .slice(0, 3) // Top 3 recommendations
    .map((ref) => {
      const card = sdcardsMap[ref.id];
      if (!card) return null;
      
      return {
        "@type": "Product",
        "name": card.name,
        "image": baseUrl + (card.imageUrl || getCardImageFallback(card)),
        "description": card.pros,
        "offers": {
          "@type": "Offer",
          "url": card.amazonSearchUrl,
          "priceCurrency": "USD",
          "price": card.priceEstimate.toString(),
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "reviewCount": "100"
        }
      };
    })
    .filter(p => p !== null);
  
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": product
    }))
  });
}

/**
 * Generate specs HTML table
 */
function generateSpecsHTML(device) {
  const specs = [
    { label: "Type", value: device.sdCard.type },
    { label: "Min Speed Class", value: device.sdCard.minSpeed },
    { label: "Write Speed", value: device.sdCard.minWriteSpeed },
    {
      label: "Recommended Size",
      value: device.sdCard.recommendedCapacity.join(", "),
    },
  ];

  return specs
    .map(
      (spec) => `
    <div class="spec-item">
      <div class="spec-label">${spec.label}</div>
      <div class="spec-value">${spec.value}</div>
    </div>
  `
    )
    .join("");
}

/**
 * Generate FAQ HTML with accordion markup
 */
function generateFAQHTML(faqItems) {
  return faqItems
    .map(
      (item) => `
    <div class="faq-item">
      <div class="faq-question">
        <span>${item.q}</span>
      </div>
      <div class="faq-answer">
        ${item.a}
      </div>
    </div>
  `
    )
    .join("");
}

/**
 * Generate related devices section
 */
function generateRelatedDevices(device, allDevices) {
  if (!device.relatedDevices || device.relatedDevices.length === 0) {
    return "";
  }

  const relatedDevices = device.relatedDevices
    .map((id) => allDevices.find((d) => d.id === id))
    .filter((d) => d);

  if (relatedDevices.length === 0) {
    return "";
  }

  const cards = relatedDevices
  .map(
  (d) => {
        const imgUrl = d.imageUrl || getDeviceImageFallback(d);
        return `
  <div class="device-card" style="background-image: url('${imgUrl}'); background-size: cover; background-position: center; position: relative; background-color: #f3f4f6;" role="article" aria-label="SD card recommendation for ${d.name}" onmouseover="this.querySelector('.device-card-overlay').style.opacity='0.95'" onmouseout="this.querySelector('.device-card-overlay').style.opacity='0.85'">
  <div class="device-card-overlay" style="position: absolute; inset: 0; background: rgba(240, 240, 240, 0.85); transition: opacity 0.3s ease;"></div>
  <a href="/devices/${d.slug}/" style="position: relative; z-index: 1; text-decoration: none; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px; width: 100%; height: 100%;">
  <div class="device-card-text" style="font-weight: bold; font-size: 16px; color: #2563eb; opacity: 1; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);">Best SD Cards For ${d.name}</div>
  </a>
  </div>
  `;
       }
     )
     .join("");

  return `
    <section class="card">
      <h2>Related</h2>
      <div class="related-devices">
        <div class="devices-grid">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

module.exports = {
  ensureDir,
  readJSON,
  readTemplate,
  writeFile,
  copyDir,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
  getDeviceImageFallback,
  getCardImageFallback,
  generateSpecsHTML,
  generateFAQHTML,
  generateRelatedDevices,
};
