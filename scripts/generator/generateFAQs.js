/**
 * FAQ Generator - Programmatically generate device-specific FAQ answers
 */

/**
 * Generate FAQs programmatically based on device specs
 * Answers are specific to each device using its actual data
 */
function generateFAQs(device, sdcardsMap) {
  const faqs = [];

  const speedClass = device.sdCard.minSpeed;
  const writeSpeed = device.sdCard.minWriteSpeed;
  const cardType = device.sdCard.type;
  const capacity = device.sdCard.recommendedCapacity;
  const maxCapacity = device.sdCard.maxCapacity;
  const testedMaxCapacity = device.sdCard.testedMaxCapacity;

  // Determine if this device has demanding speed requirements
  const isDemandingDevice = ["V60", "V90", "U3"].some((v) =>
    speedClass.includes(v)
  );
  const isNoSpeedRequired = speedClass === "No minimum required";

  // 1. Speed Class Question
  if (!isNoSpeedRequired) {
    const speedClassName = speedClass.match(/V\d+/)?.[0] || speedClass;
    faqs.push({
      q: `Is ${speedClassName} required for ${device.name}?`,
      a: `Yes, ${speedClassName} is recommended for ${device.name}. It guarantees a minimum sustained write speed of ${writeSpeed}, which is necessary for stable ${isDemandingDevice ? "professional" : ""} recording without dropped frames or errors.`,
    });
  }

  // 2. Storage Capacity Question
  let capacityAnswer = `We recommend ${capacity.join(" or ")} cards. A ${capacity[0]} card is good for typical use, with ${maxCapacity} as the maximum supported capacity`;
  if (testedMaxCapacity) {
    capacityAnswer += ` (${testedMaxCapacity} tested and verified working)`;
  }
  capacityAnswer += `. Larger sizes are useful if you shoot frequently and want to minimize card swaps.`;
  
  faqs.push({
    q: `What storage capacity should I get for ${device.name}?`,
    a: capacityAnswer,
  });

  // 3. Older/Budget Card Compatibility
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Can I use older or slower cards with ${device.name}?`,
      a: `Not recommended. Cards slower than ${speedClass} may cause dropped frames, corrupted files, or recording failures. Always use ${speedClass} minimum for reliability.`,
    });
  } else {
    faqs.push({
      q: `Can I use slower budget cards with ${device.name}?`,
      a: `Yes, any microSD card works with ${device.name}. It doesn't require high-speed cards. Cheaper, slower cards will work fine, though ${device.sdCard.minSpeed || "standard speed"} cards offer better reliability.`,
    });
  }

  // 4. Card Type Compatibility
  const hasMultipleTypes = cardType.includes(",");
  if (hasMultipleTypes) {
    const types = cardType.split(",").map((t) => t.trim());
    faqs.push({
      q: `Does the card type matter for ${device.name}?`,
      a: `${device.name} accepts ${types.join(", ")}. All types work the same, so choose based on price and availability. They have the same speed and capacity limits.`,
    });
  } else if (cardType.includes("UHS")) {
    faqs.push({
      q: `Do I need a UHS card for ${device.name}?`,
      a: `UHS cards are recommended for best performance with ${device.name}. Non-UHS cards will work but may have slower transfer speeds. For this device, UHS-${cardType.match(/UHS-\d/)?.[0] || "II"} is optimal.`,
    });
  }

  // 5. Professional/Dual Cards Question
  if (device.recommendedBrands && device.recommendedBrands.length > 0) {
    const hasMultipleBrands = device.recommendedBrands.length > 1;
    const highEndCards = device.recommendedBrands
      .map((ref) => sdcardsMap[ref.id])
      .filter((card) => card && card.tier === "professional");

    if (highEndCards.length > 0 || isDemandingDevice) {
      faqs.push({
        q: `Should I use more than one card with ${device.name}?`,
        a: `For professional use or extended shooting sessions, dual cards provide redundancy and backup. Using multiple cards ensures you won't lose footage if one card fails. This is especially important for valuable recordings.`,
      });
    }
  }

  // 6. Brand Reliability Question
  faqs.push({
    q: `Does the brand matter for ${device.name}?`,
    a: `Yes, trusted brands like SanDisk, Lexar, and Kingston are recommended. Quality brands have better reliability and warranty support. Avoid unknown brands, especially for demanding devices.`,
  });

  // 7. Data Loss/Corruption Risk
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `What happens if I use the wrong card with ${device.name}?`,
      a: `Using cards slower than ${speedClass} can cause: dropped frames during recording, corrupted files, or complete recording failure. Stick to ${speedClass} minimum to avoid data loss.`,
    });
  }

  // 8. Card Lifespan Question
  faqs.push({
    q: `How long will an SD card last with ${device.name}?`,
    a: `Quality SD cards typically last 3-5 years with normal use. Replace your card if you experience read/write errors, corrupted files, or if it's been dropped or exposed to extreme conditions.`,
  });

  return faqs;
}

/**
 * Merge generated FAQs with custom FAQs from device data
 * Custom FAQs override generated ones (by matching question)
 */
function mergeFAQs(customFAQs, generatedFAQs) {
  if (!customFAQs || customFAQs.length === 0) {
    return generatedFAQs;
  }

  // Custom FAQs take priority - filter out generated ones with matching questions
  const customQuestions = new Set(customFAQs.map((f) => f.q.toLowerCase()));
  const merged = customFAQs.slice();

  generatedFAQs.forEach((generated) => {
    if (!customQuestions.has(generated.q.toLowerCase())) {
      merged.push(generated);
    }
  });

  return merged;
}

module.exports = { generateFAQs, mergeFAQs };
