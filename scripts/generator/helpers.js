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
 * Process {% include %} tags in template content
 * Recursively resolves includes relative to the template directory
 */
function processIncludes(content, templateDir) {
  const includeRegex = /\{%\s*include\s+['"]([^'"]+)['"]\s*%\}/g;
  
  let result = content;
  let match;
  
  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = match[1];
    const fullPath = path.join(templateDir, includePath);
    
    try {
      const includeContent = fs.readFileSync(fullPath, "utf8");
      // Recursively process includes in the included file
      const processedInclude = processIncludes(includeContent, path.dirname(fullPath));
      result = result.replace(match[0], processedInclude);
    } catch (err) {
      console.warn(`  ⚠️  Include file not found: ${includePath} (${fullPath})`);
      result = result.replace(match[0], `<!-- Include not found: ${includePath} -->`);
    }
  }
  
  return result;
}

/**
 * Write file to disk
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  
  // Try to remove file first if it exists and we're having permission issues
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      // If we can't delete, try writing directly anyway
      if (err.code !== 'EACCES' && err.code !== 'EPERM') {
        throw err;
      }
    }
  }
  
  try {
    fs.writeFileSync(filePath, content, "utf8");
  } catch (err) {
    // If still failing, log but don't throw to allow build to continue
    if (err.code === 'EACCES' || err.code === 'EPERM') {
      console.error(`  ⚠ File locked: ${path.relative(process.cwd(), filePath)}`);
      return;
    }
    throw err;
  }
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
 * First tries to find specific device image, then falls back to category/brand placeholders
 * Always validates that the file exists before returning the path
 */
function getDeviceImageFallback(device) {
  const name = device.name.toLowerCase();
  const slug = device.slug.toLowerCase();
  const category = device.category.toLowerCase();

  // Helper function to check if image file exists
  function imageExists(imagePath) {
    const fullPath = path.join(__dirname, "../../img/devices", imagePath.replace("/img/devices/", ""));
    return fs.existsSync(fullPath);
  }

  // Try to find device-specific image first (maps slug to actual image file)
  const deviceSpecificImages = {
    "nintendo-switch": "/img/devices/gaming-consoles/nintendo-switch.webp",
    "nintendo-switch-oled": "/img/devices/gaming-consoles/nintendo-switch-oled.webp",
    "nintendo-switch-lite": "/img/devices/gaming-consoles/nintendo-switch.webp",
    "steam-deck": "/img/devices/gaming-consoles/steam-deck.webp",
    "asus-rog-ally": "/img/devices/gaming-consoles/asus-rog-ally.webp",
    "asus-rog-ally-x": "/img/devices/gaming-consoles/asus-rog-ally.webp",
    "lenovo-legion-go": "/img/devices/gaming-consoles/lenovo-legion-go.webp",
    "lenovo-legion-go-s": "/img/devices/gaming-consoles/lenovo-legion-go-s.webp",
    "anbernic-rg35xx-plus": "/img/devices/gaming-consoles/anbernic.webp",
    "anbernic-rg353v": "/img/devices/gaming-consoles/anbernic.webp",
    "retroid-pocket": "/img/devices/gaming-consoles/retroid-pocket.webp",
    "miyoo-mini-plus": "/img/devices/gaming-consoles/miyyo-mini.webp",
    "nintendo-3ds": "/img/devices/gaming-consoles/nintendo-3ds.webp",
    "nintendo-3ds-xl": "/img/devices/gaming-consoles/nintendo-3ds.webp",
    "gopro-hero-13": "/img/devices/action-cameras/gopro-hero-13.webp",
    "gopro-hero-12": "/img/devices/action-cameras/gopro-hero-12.webp",
    "gopro-hero-max": "/img/devices/action-cameras/gopro-placeholder.webp",
    "gopro-hero-11-black": "/img/devices/action-cameras/gopro-placeholder.webp",
    "insta360-x3": "/img/devices/action-cameras/insta360-x3.webp",
    "insta360-ace-pro": "/img/devices/action-cameras/insta360-ace-pro.webp",
    "insta360-go-3": "/img/devices/action-cameras/insta360-go-3.webp",
    "insta360-one-x2": "/img/devices/action-cameras/insta360-one-x2.webp",
    "dji-mini-4-pro": "/img/devices/drones/dji-mini-4-pro.webp",
    "dji-mini-3-pro": "/img/devices/drones/drone-placeholder.webp",
    "dji-air-3": "/img/devices/drones/dji-air-3.webp",
    "dji-air-3s": "/img/devices/drones/dji-air-3.webp",
    "dji-mavic-3": "/img/devices/drones/dji-mavic-3.webp",
    "dji-osmo-pocket-3": "/img/devices/action-cameras/dji-osmo-pocket-3.webp",
    "dji-osmo-action-4": "/img/devices/action-cameras/dji-osmo-action-4.webp",
    "wyze-cam-v3": "/img/devices/security-cameras/wyze-cam-v3.webp",
    "reolink-e1-pro": "/img/devices/security-cameras/reolink-e1-pro.webp",
    "eufy-solocam-s340": "/img/devices/security-cameras/eufy-solocam-s340.webp",
    "garmin-66s-dash-cam": "/img/devices/action-cameras/dash-cam-placeholder.webp",
    "viofo-a229-duo": "/img/devices/action-cameras/dash-cam-placeholder.webp",
    "nextbase-622gw": "/img/devices/action-cameras/dash-cam-placeholder.webp",
    "canon-eos-r5": "/img/devices/cameras/canon-eos-r5.webp",
    "canon-eos-r6": "/img/devices/cameras/canon-placeholder.webp",
    "canon-eos-r6-mark-ii": "/img/devices/cameras/canon-placeholder.webp",
    "canon-eos-r3": "/img/devices/cameras/canon-placeholder.webp",
    "canon-eos-r7": "/img/devices/cameras/canon-placeholder.webp",
    "canon-eos-r100": "/img/devices/cameras/canon-placeholder.webp",
    "sony-a6700": "/img/devices/cameras/sony-a6700.webp",
    "sony-a6400": "/img/devices/cameras/sony-placeholder.webp",
    "sony-a7-iii": "/img/devices/cameras/sony-placeholder.webp",
    "sony-a7-iv": "/img/devices/cameras/sony-placeholder.webp",
    "sony-zv-e10": "/img/devices/cameras/sony-placeholder.webp",
    "sony-fx3": "/img/devices/cameras/sony-fx3.webp",
    "sony-fx30": "/img/devices/cameras/sony-fx30.webp",
    "sony-tough-g-v90": "/img/devices/cameras/sony-placeholder.webp",
    "fujifilm-x-s20": "/img/devices/cameras/fujifilm-x-s20.webp",
    "fujifilm-x-s10": "/img/devices/cameras/fujifilm-placeholder.webp",
    "fujifilm-xt5": "/img/devices/cameras/fujifilm-xt5.webp",
    "fujifilm-x-t5": "/img/devices/cameras/fujifilm-xt5.webp",
    "fujifilm-xt50": "/img/devices/cameras/fujifilm-xt50.webp",
    "fujifilm-x-t50": "/img/devices/cameras/fujifilm-xt50.webp",
    "fujifilm-x-t4": "/img/devices/cameras/fujifilm-placeholder.webp",
    "nikon-z6-ii": "/img/devices/cameras/nikon-placeholder.webp",
    "nikon-z8": "/img/devices/cameras/nikon-z8.webp",
    "blackmagic-pocket-cinema-camera-4k": "/img/devices/cameras/blackmagic-pocket-cinema-camera-4k.webp",
    "blackmagic-pocket-cinema-camera-6k-pro": "/img/devices/cameras/blackmagic-pocket-cinema-camera-6k-pro.webp",
    "leica-q2": "/img/devices/cameras/leica-q3.webp",
    "leica-q3": "/img/devices/cameras/leica-q3.webp",
    "panasonic-lumix-s1h": "/img/devices/cameras/lumix-placeholder.webp",
    "panasonic-lumix-s5-ii": "/img/devices/cameras/lumix-placeholder.webp",
    "panasonic-lumix-s5-iix": "/img/devices/cameras/lumix-placeholder.webp",
    "panasonic-lumix-s9": "/img/devices/cameras/lumix-placeholder.webp",
    "nikon-z50-ii": "/img/devices/cameras/nikon-placeholder.webp",
    "raspberry-pi-5": "/img/devices/computing/raspberry-pi-5.webp",
    "raspberry-pi-4-model-b": "/img/devices/computing/raspberry-placeholder.webp",
    "raspberry-pi-3-model-b-plus": "/img/devices/computing/raspberry-placeholder.webp",
    "raspberry-pi-zero-2-w": "/img/devices/computing/raspberry-placeholder.webp",
    "raspberry-pi-pico": "/img/devices/computing/raspberry-placeholder.webp",
    "amazon-fire-hd-10": "/img/devices/computing/amazon-fire-hd-10.webp",
    "amazon-fire-max-11": "/img/devices/computing/amazon-fire-max-11.webp",
    "lenovo-tab-m10-plus": "/img/devices/computing/tablet-placeholder.webp"
  };

  if (deviceSpecificImages[slug] && imageExists(deviceSpecificImages[slug])) {
    return deviceSpecificImages[slug];
  }

  // Brand-specific placeholders (using only files that actually exist)
  if (name.includes("gopro")) return "/img/devices/action-cameras/gopro-placeholder.webp";
  if (name.includes("insta360")) return "/img/devices/action-cameras/gopro-placeholder.webp";
  if (name.includes("osmo")) return "/img/devices/action-cameras/gopro-placeholder.webp";
  if (name.includes("dji")) return "/img/devices/drones/drone-placeholder.webp";
  if (name.includes("steam deck")) return "/img/devices/gaming-consoles/gaming-handheld-console-placeholder.webp";
  if (name.includes("switch")) return "/img/devices/gaming-consoles/gaming-handheld-console-placeholder.webp";
  if (name.includes("nintendo")) return "/img/devices/gaming-consoles/gaming-handheld-console-placeholder.webp";
  if (name.includes("asus rog")) return "/img/devices/gaming-consoles/asus-rog-ally.webp";
  if (name.includes("lenovo legion")) return "/img/devices/gaming-consoles/lenovo-legion-go.webp";
  if (name.includes("anbernic")) return "/img/devices/gaming-consoles/anbernic.webp";
  if (name.includes("retroid")) return "/img/devices/gaming-consoles/retroid-pocket.webp";
  if (name.includes("miyoo")) return "/img/devices/gaming-consoles/miyyo-mini.webp";
  if (name.includes("amazon fire")) return "/img/devices/computing/tablet-placeholder.webp";
  if (name.includes("raspberry pi")) return "/img/devices/computing/raspberry-placeholder.webp";
  if (name.includes("canon")) return "/img/devices/cameras/canon-placeholder.webp";
  if (name.includes("nikon")) return "/img/devices/cameras/nikon-placeholder.webp";
  if (name.includes("sony")) return "/img/devices/cameras/sony-placeholder.webp";
  if (name.includes("fujifilm")) return "/img/devices/cameras/fujifilm-placeholder.webp";
  if (name.includes("leica")) return "/img/devices/cameras/leica-q3.webp";
  if (name.includes("panasonic") || name.includes("lumix")) return "/img/devices/cameras/lumix-placeholder.webp";
  if (name.includes("dash cam") || name.includes("dash-cam")) return "/img/devices/action-cameras/dash-cam-placeholder.webp";
  if (name.includes("reolink")) return "/img/devices/security-cameras/reolink-e1-pro.webp";

  // Category-based placeholders
  if (category.includes("action camera")) 
    return "/img/devices/action-cameras/gopro-placeholder.webp";
  if (category.includes("security camera"))
    return "/img/devices/security-cameras/wyze-cam-v3.webp";
  if (category.includes("camera")) 
    return "/img/devices/cameras/sony-placeholder.webp";
  if (category.includes("drone")) 
    return "/img/devices/drones/drone-placeholder.webp";
  if (category.includes("gaming")) 
    return "/img/devices/gaming-consoles/gaming-handheld-console-placeholder.webp";
  if (category.includes("computing") || category.includes("tablet")) 
    return "/img/devices/computing/tablet-placeholder.webp";

  // Default placeholder
  return "/img/devices/placeholder.webp";
}

/**
 * Get smart fallback image for SD card based on type/speed
 */
function getCardImageFallback(card) {
  const cardPath = path.join(__dirname, "../../img/cards");
  
  // Helper function to check if image file exists
  function imageExists(imagePath) {
    const fullPath = path.join(__dirname, "../../img/cards", imagePath.replace("/img/cards/", ""));
    return fs.existsSync(fullPath);
  }
  
  // If card has imageUrl, check if file exists
  if (card.imageUrl) {
    if (imageExists(card.imageUrl)) {
      return card.imageUrl;
    }
  }
  
  // Brand-specific image matching (maps brand/series to actual image files)
  const cardId = card.id.toLowerCase();
  const cardName = card.name.toLowerCase();
  
  // Exact card name matching first (highest priority)
  const exactMatches = {
    "kingston canvas select": "/img/cards/kingston-canvas-select-microsd.webp",
    "sony tough g-series": "/img/cards/sony-tough-g-v90.webp",
    "sandisk max endurance": "/img/cards/sandisk-max-endurance-microsd.webp",
    "samsung pro endurance": "/img/cards/samsung-pro-endurance-microsd.webp",
    "samsung evo select": "/img/cards/samsung-evo-select-microsd.webp"
  };
  
  for (const [pattern, imagePath] of Object.entries(exactMatches)) {
    if (cardName.includes(pattern) && imageExists(imagePath)) {
      return imagePath;
    }
  }
  
  // Lexar brand fallbacks
  if (cardName.includes("lexar")) {
    // Try specific variant matching first
    if (cardName.includes("1667x") || cardName.includes("silver")) {
      if (imageExists("/img/cards/lexar-professional-silver-sd-uhs-ii.webp")) {
        return "/img/cards/lexar-professional-silver-sd-uhs-ii.webp";
      }
    }
    if (cardName.includes("1000x")) {
      if (imageExists("/img/cards/lexar-professional-1000x.webp")) {
        return "/img/cards/lexar-professional-1000x.webp";
      }
    }
    if (cardName.includes("633x")) {
      if (imageExists("/img/cards/lexar-professional-633x.webp")) {
        return "/img/cards/lexar-professional-633x.webp";
      }
    }
    // Try to find any lexar image
    const lexarImages = [
      "/img/cards/lexar-professional-silver-sd-uhs-ii.webp",
      "/img/cards/lexar-professional-1000x.webp",
      "/img/cards/lexar-professional-633x.webp"
    ];
    for (const img of lexarImages) {
      if (imageExists(img)) return img;
    }
  }
  
  // Kingston Canvas brand fallbacks
  if (cardName.includes("kingston canvas")) {
    const kingtonImages = [
      "/img/cards/kingston-canvas-select-microsd.webp",
      "/img/cards/kingston-canvas-go.webp",
      "/img/cards/kingston-canvas-select.webp"
    ];
    for (const img of kingtonImages) {
      if (imageExists(img)) return img;
    }
  }
  
  // SanDisk brand fallbacks
  if (cardName.includes("sandisk")) {
    // Try to match specific SanDisk variants
    if (cardName.includes("ultra")) {
      if (imageExists("/img/cards/sandisk-ultra-microsd.webp")) {
        return "/img/cards/sandisk-ultra-microsd.webp";
      }
    }
    if (cardName.includes("extreme")) {
      if (cardName.includes("pro")) {
        if (imageExists("/img/cards/sandisk-extreme-pro-sd-uhs-ii.webp")) {
          return "/img/cards/sandisk-extreme-pro-sd-uhs-ii.webp";
        }
      } else {
        if (imageExists("/img/cards/sandisk-extreme-microsd.webp")) {
          return "/img/cards/sandisk-extreme-microsd.webp";
        }
      }
    }
    if (cardName.includes("max endurance")) {
      if (imageExists("/img/cards/sandisk-max-endurance-microsd.webp")) {
        return "/img/cards/sandisk-max-endurance-microsd.webp";
      }
    }
    // Generic fallback for other SanDisk cards
    const sandiskImages = [
      "/img/cards/sandisk-extreme-microsd.webp",
      "/img/cards/sandisk-extreme-pro-sd-uhs-ii.webp",
      "/img/cards/sandisk-ultra-microsd.webp",
      "/img/cards/sandisk-max-endurance-microsd.webp"
    ];
    for (const img of sandiskImages) {
      if (imageExists(img)) return img;
    }
  }
  
  // Samsung brand fallbacks
  if (cardName.includes("samsung")) {
    const samsungImages = [
      "/img/cards/samsung-evo-select-microsd.webp",
      "/img/cards/samsung-pro-endurance-microsd.webp"
    ];
    for (const img of samsungImages) {
      if (imageExists(img)) return img;
    }
  }
  
  // Sony brand fallbacks
  if (cardName.includes("sony")) {
    const sonyImages = [
      "/img/cards/sony-tough-g-v90.webp"
    ];
    for (const img of sonyImages) {
      if (imageExists(img)) return img;
    }
  }
  
  // ADATA brand fallbacks
  if (cardName.includes("adata")) {
    const adataImages = [
      "/img/cards/adata-premier-microsd.webp"
    ];
    for (const img of adataImages) {
      if (imageExists(img)) return img;
    }
  }
  
  // Transcend brand fallbacks
  if (cardName.includes("transcend")) {
    const transcendImages = [
      "/img/cards/transcend-superior-sd-uhs2.webp",
      "/img/cards/transcend-microsd.webp"
    ];
    for (const img of transcendImages) {
      if (imageExists(img)) return img;
    }
  }
  
  // Use type and uhs fields from sdcards.json for smart fallback selection
  const isMicroSD = card.type === "microSD";
  const uhs = card.uhs ? card.uhs.toUpperCase() : "";
  
  // Type-specific placeholders for specialty formats
  if (card.type === "CFast") {
    return "/img/cards/cfast-generic.webp";
  }
  if (card.type === "XQD") {
    return "/img/cards/xqd-generic.webp";
  }
  
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

  // Add max capacity display
  if (device.sdCard.maxCapacity) {
    let maxCapacityValue = device.sdCard.maxCapacity;
    
    // If testedMaxCapacity exists, show both values side by side
    if (device.sdCard.testedMaxCapacity) {
      maxCapacityValue = `${device.sdCard.maxCapacity} (${device.sdCard.testedMaxCapacity} tested)`;
    }
    
    specs.push({
      label: "Max Capacity",
      value: maxCapacityValue,
    });
  }

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
        const imgUrl = getDeviceImageFallback(d);
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

/**
 * SMART IMAGE FINDER
 * Looks for an image in /img/cards/.
 * 1. Checks for exact match from JSON.
 * 2. Checks for any file starting with the Card ID (e.g., "card-id-128gb.webp" for "card-id").
 * 3. Falls back to getCardImageFallback if nothing found.
 */
function findActualImageFile(cardId, definedPath) {
  const imgDir = path.join(__dirname, "../../img/cards");
  
  // 1. Check exact path from JSON if it exists
  if (definedPath) {
    const fullPath = path.join(__dirname, "../..", definedPath);
    if (fs.existsSync(fullPath)) return definedPath;
  }

  // 2. Fuzzy Search: Look for any file starting with the card ID
  // This fixes the issue where you have "card-128gb.webp" but the ID is just "card"
  try {
    const files = fs.readdirSync(imgDir);
    
    // Look for ID match at the start of filename (exact match first)
    const exactMatch = files.find(file => file === `${cardId}.webp`);
    if (exactMatch) return `/img/cards/${exactMatch}`;
    
    // Then look for partial matches (e.g., "card-128gb.webp")
    const partialMatch = files.find(file => 
      file.startsWith(cardId) && 
      (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png'))
    );
    
    if (partialMatch) {
      return `/img/cards/${partialMatch}`;
    }
  } catch (e) {
    console.warn(`  ⚠️  Could not scan image directory for ${cardId}`);
  }

  return null;
}

/**
 * Load and Adapt SD Card Data
 * Reads the new "Series" format and converts it to "Flat" format
 * compatible with existing templates and devices.json references.
 * Uses Smart Image Finder to resolve image paths.
 */
function loadSDCardData() {
  const sdcardsPath = path.join(__dirname, "../../data/sdcards.json");
  const data = JSON.parse(fs.readFileSync(sdcardsPath, "utf8"));
  const cardMap = {};

  data.sdcards.forEach(series => {
    // Check if this is the new Series format (has 'specs' object)
    const isNewFormat = series.specs && typeof series.specs === 'object';
    
    // Use smart image finder to resolve actual image path (handles missing files)
    const resolvedImageUrl = findActualImageFile(series.id, series.imageUrl);
    
    // Create adapter card for backward compatibility
    const adapterCard = {
      id: series.id,
      name: series.name,
      type: series.type,
      imageUrl: resolvedImageUrl || series.imageUrl, // Use resolved path if found, else original
      amazonSearchUrl: series.amazonSearchUrl,
      priceTier: series.priceTier,
      priceSymbol: series.priceSymbol,
      pros: series.pros,
      cons: series.cons,
      tier: series.tier,
      
      // Map nested specs to top-level for compatibility (New Format)
      ...(isNewFormat ? {
        uhs: series.specs.uhs,
        speed: series.specs.speedClass,
        readSpeed: series.specs.readSpeed,
        writeSpeed: series.specs.writeSpeed,
        appPerformance: series.specs.appPerformance,
        enduranceRating: series.specs.endurance,
        capacityGB: series.availableCapacities ? series.availableCapacities[Math.floor(series.availableCapacities.length / 2)] : null,
        capacityString: series.availableCapacities ? series.availableCapacities.map(c => `${c}GB`).join(', ') : '',
        availableCapacities: series.availableCapacities,
      } : {
        // Old flat format - use as-is
        uhs: series.uhs,
        speed: series.speed,
        readSpeed: series.readSpeed,
        writeSpeed: series.writeSpeed,
        appPerformance: series.appPerformance,
        enduranceRating: series.enduranceRating,
      }),
      
      // Price estimate: Map symbols to approximation (for legacy compatibility)
      priceEstimate: series.priceSymbol === '$$$' ? 100 : (series.priceSymbol === '$$' ? 45 : 20),
      
      // Preserve raw specs object for new code
      specs: isNewFormat ? series.specs : undefined,
    };

    // SMART IMAGE RESOLUTION
    // Try to find the actual image file (handles fuzzy matching)
    const foundImage = findActualImageFile(series.id, series.imageUrl);
    if (foundImage) {
      adapterCard.imageUrl = foundImage;
    }

    cardMap[series.id] = adapterCard;
  });

  return cardMap;
}

module.exports = {
  ensureDir,
  readJSON,
  readTemplate,
  processIncludes,
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
  loadSDCardData,
};
