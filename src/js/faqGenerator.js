/**
 * FAQ Generator - Node.js version for static site generation
 * Generates SEO-optimized FAQs based on device specifications
 */

// Helper functions
const hasMinSpeedRequirement = (minSpeed) => {
  return !minSpeed.toLowerCase().includes("no minimum") && minSpeed !== "Not specified";
};

const getDeviceFunction = (category) => {
  const map = {
    "Action Cameras": "video recording",
    "Mirrorless Cameras": "video recording",
    Drones: "4K video recording",
    "Gaming Consoles": "game loading",
  };
  return map[category] || "recording";
};

const isConsole = (category) => {
  return category.includes("Console") || category.includes("Gaming");
};

const isCamera = (category) => {
  return (
    category.includes("Camera") ||
    category.includes("mirrorless") ||
    category.includes("action")
  );
};

const isDrone = (category) => {
  return category.includes("Drone");
};

const supportsUHSII = (type) => {
  return type.toLowerCase().includes("uhs-ii") || type.toLowerCase().includes("uhs2");
};

const supportsUHSI = (type) => {
  return (
    !type.toLowerCase().includes("(not uhs-ii)") &&
    !type.toLowerCase().includes("no uhs")
  );
};

/**
 * Generates a FAQ about what SD card is needed for the device
 */
function generateWhatCardNeededFAQ(device) {
  const { name, sdCard, category } = device;
  const hasMinSpeed = hasMinSpeedRequirement(sdCard.minSpeed);

  if (!hasMinSpeed) {
    return null;
  }

  const highestCapacity =
    sdCard.recommendedCapacity[sdCard.recommendedCapacity.length - 1];
  const maxCapacity = sdCard.maxCapacity;

  let useCase = "recording";
  if (isDrone(category)) {
    useCase = "flight and 4K video recording";
  } else if (isCamera(category)) {
    useCase = "professional video capture";
  } else if (isConsole(category)) {
    useCase = "game library storage";
  }

  const speedRating = sdCard.minSpeed === 'No minimum required' 
    ? sdCard.minSpeed.toLowerCase() 
    : sdCard.minSpeed;

  return {
    q: `What SD card do I need for the ${name}?`,
    a: `The ${name} requires a <b>${sdCard.type} card with ${speedRating} speed rating</b> for reliable ${useCase}. <b>We recommend ${highestCapacity} capacity as the sweet spot</b> balancing storage capacity with affordability. The device supports up to ${maxCapacity}, though most users find ${highestCapacity} sufficient for daily use. <b>Always choose from trusted brands like SanDisk, Lexar, or Kingston</b> to ensure consistent performance and avoid data loss.`,
  };
}

/**
 * Generates a FAQ about minimum speed rating
 */
function generateMinimumSpeedFAQ(device) {
  const { name, sdCard, category } = device;
  const hasMinSpeed = hasMinSpeedRequirement(sdCard.minSpeed);

  if (!hasMinSpeed) {
    return null;
  }

  const deviceFunction = getDeviceFunction(category);

  return {
    q: `What is the minimum speed rating needed for ${name} ${deviceFunction}?`,
    a: `<b>A minimum ${sdCard.minSpeed} rating is required</b> for stable ${deviceFunction} on the ${name}. <b>This guarantees ${sdCard.minWriteSpeed} sustained write speed</b>, which is necessary to prevent dropped frames, file corruption, or interrupted recording.`,
  };
}

/**
 * Generates a FAQ about card type compatibility
 */
function generateCardTypeFAQ(device) {
  const { name, sdCard, category } = device;
  const cardType = sdCard.type.includes("microSD")
    ? "microSD"
    : sdCard.type.includes("SD")
    ? "SD"
    : sdCard.type.includes("CFexpress")
    ? "CFexpress"
    : sdCard.type.split(" ")[0];
  const hasMinSpeed = hasMinSpeedRequirement(sdCard.minSpeed);

  if (!cardType.includes("SD") && !cardType.includes("microSD")) {
    return null;
  }

  if (hasMinSpeed) {
    return {
      q: `Can I use any ${cardType} card for the ${name}?`,
      a: `<b>No, not all ${cardType} cards are suitable</b>. You must use a card with at least <b>${sdCard.minSpeed} speed rating</b> to avoid dropped frames, file corruption, and device instability. <b>Always purchase from trusted brands like SanDisk, Lexar, or Kingston</b> to ensure reliability.`,
    };
  }

  return {
    q: `Can I use any ${cardType} card for the ${name}?`,
    a: `<b>Yes, any ${cardType} card works with the ${name}</b>. However, <b>we recommend V30-rated cards for better reliability and longer lifespan</b>. Budget cards may experience issues with consistent performance.`,
  };
}

/**
 * Generates a FAQ about recommended storage capacity
 */
function generateStorageFAQ(device) {
  const { name, sdCard, category } = device;
  const highestCapacity =
    sdCard.recommendedCapacity[sdCard.recommendedCapacity.length - 1];
  const maxCapacity = sdCard.maxCapacity;

  if (isConsole(category)) {
    return {
      q: `How much storage should I get for the ${name}?`,
      a: `<b>A ${highestCapacity} card is generally recommended</b> for a substantial game library on the ${name}. Depending on your usage, <b>a smaller capacity like ${sdCard.recommendedCapacity[0]} may be sufficient for casual gaming</b>. Maximum supported capacity is ${maxCapacity}.`,
    };
  }

  if (isCamera(category) || isDrone(category)) {
    return {
      q: `How much storage should I get for the ${name}?`,
      a: `<b>A ${highestCapacity} card is recommended</b> for the ${name}, providing extended recording time for professional work. The device supports up to ${maxCapacity} capacity, and <b>carrying multiple cards is ideal for full-day shoots without interruptions</b>.`,
    };
  }

  return null;
}

/**
 * Generates a FAQ about recommended brands
 */
function generateRecommendedBrandsFAQ(device) {
  const { name, category } = device;
  let context =
    "reliability ensures consistent performance and device longevity";

  if (isDrone(category)) {
    context =
      "reliability is critical for drone operations to prevent mid-flight failures";
  } else if (isCamera(category)) {
    context =
      "reliability is essential for professional video and photography work";
  }

  return {
    q: `What are the recommended SD card brands for the ${name}?`,
    a: `<b>We recommend trusted brands like SanDisk, Lexar, Kingston, and Crucial</b> for the ${name}. Quality matters because <b>${context}</b>. Budget or unknown brands have higher failure rates and risk data loss.`,
  };
}

/**
 * Generates a FAQ about UHS interface
 */
function generateUHSInterfaceFAQ(device) {
  const { name, sdCard } = device;

  if (!sdCard.type.toLowerCase().includes("uhs")) {
    return null;
  }

  const hasUHSII = supportsUHSII(sdCard.type);
  const onlyUHSI =
    !hasUHSII && sdCard.type.toLowerCase().includes("uhs-i");

  if (onlyUHSI) {
    return {
      q: `Do I need UHS-II cards for the ${name}?`,
      a: `<b>No, the ${name} only supports UHS-I interface</b>. <b>UHS-II cards are physically compatible but provide no speed benefit</b> since the device cannot utilize faster speeds. Standard UHS-I cards with ${sdCard.minSpeed} rating are fully sufficient.`,
    };
  }

  if (hasUHSII && hasMinSpeedRequirement(sdCard.minSpeed)) {
    return {
      q: `Do I need UHS-II for the ${name}?`,
      a: `<b>UHS-II is recommended for optimal performance and faster file transfers</b> on the ${name}, but <b>UHS-I cards with ${sdCard.minSpeed} will function properly</b> for recording. The difference in performance is minimal during normal operation.`,
    };
  }

  return null;
}

/**
 * Main function to generate all applicable generic FAQs for a device
 */
function generateFAQs(device) {
  const faqs = [];

  const whatCardFAQ = generateWhatCardNeededFAQ(device);
  if (whatCardFAQ) faqs.push(whatCardFAQ);

  const minSpeedFAQ = generateMinimumSpeedFAQ(device);
  if (minSpeedFAQ) faqs.push(minSpeedFAQ);

  const cardTypeFAQ = generateCardTypeFAQ(device);
  if (cardTypeFAQ) faqs.push(cardTypeFAQ);

  const storageFAQ = generateStorageFAQ(device);
  if (storageFAQ) faqs.push(storageFAQ);

  const brandsFAQ = generateRecommendedBrandsFAQ(device);
  if (brandsFAQ) faqs.push(brandsFAQ);

  const uhsFAQ = generateUHSInterfaceFAQ(device);
  if (uhsFAQ) faqs.push(uhsFAQ);

  return faqs;
}

/**
 * Merges generated FAQs with device-specific FAQs
 */
function mergeFAQs(device, deviceSpecificFAQs = []) {
  const generated = generateFAQs(device);
  return [...deviceSpecificFAQs, ...generated];
}

module.exports = {
  generateWhatCardNeededFAQ,
  generateMinimumSpeedFAQ,
  generateCardTypeFAQ,
  generateStorageFAQ,
  generateRecommendedBrandsFAQ,
  generateUHSInterfaceFAQ,
  generateFAQs,
  mergeFAQs,
};
