/**
 * FAQ Generator - Programmatically generate device-specific FAQ answers
 * Supports both English and Japanese versions
 */

const { generateFAQsJa, mergeFAQsJa } = require("./generateFAQs-ja");
const { generateFAQsDe, mergeFAQsDe } = require("./generateFAQs-de");
const { generateFAQsFr, mergeFAQsFr } = require("./generateFAQs-fr");
const { generateFAQsIt, mergeFAQsIt } = require("./generateFAQs-it");

const LOCALE_GENERATORS = {
  ja: generateFAQsJa,
  de: generateFAQsDe,
  fr: generateFAQsFr,
  it: generateFAQsIt,
};

const LOCALE_MERGERS = {
  ja: mergeFAQsJa,
  de: mergeFAQsDe,
  fr: mergeFAQsFr,
  it: mergeFAQsIt,
};

/**
 * Generate FAQs programmatically based on device specs
 * Answers are specific to each device using its actual data
 * @param {object} device - The device object
 * @param {object} sdcardsMap - A map of all SD cards
 * @param {string} locale - Locale to generate FAQs for (defaults to English)
 * @returns {Array<object>} - An array of FAQ objects {q, a}
 */
const VIDEO_CATEGORIES = ["Cameras", "Action Cameras", "Drones", "Dash Cams", "Security Cameras", "Trail Cameras"];

function generateFAQs(device, sdcardsMap, locale = "en") {
  const localeGenerator = LOCALE_GENERATORS[locale];
  if (localeGenerator) {
    return localeGenerator(device, sdcardsMap);
  }

  const faqs = [];

  const speedClass = device.sdCard.minSpeed || "";
  const writeSpeed = device.sdCard.minWriteSpeed;
  const cardType = device.sdCard.type;
  const capacity = device.sdCard.recommendedCapacity;
  const maxCapacity = device.sdCard.maxCapacity;
  const testedMaxCapacity = device.sdCard.testedMaxCapacity;

  // Devices with no card slot (internal storage only) get no card-spec questions.
  const hasNoSlot = speedClass === "N/A";
  const isNoSpeedRequired = hasNoSlot || speedClass === "No minimum required";
  const isDemandingDevice = ["V60", "V90"].some((v) => speedClass.includes(v));
  const isVideoDevice = VIDEO_CATEGORIES.includes(device.category);
  const failureMode = isVideoDevice
    ? "dropped frames, clips that stop early, or corrupted files"
    : "slow loads, stutter, or write errors";

  if (hasNoSlot) return faqs;

  // 1. Speed class
  if (!isNoSpeedRequired) {
    const speedClassName = speedClass.match(/V\d+/)?.[0] || speedClass;
    const writeClause = writeSpeed && writeSpeed !== "N/A" ? ` guarantees ${writeSpeed} of sustained write, which` : "";
    faqs.push({
      q: `Is ${speedClassName} required for ${device.name}?`,
      a: `Yes. ${speedClassName}${writeClause || " is the minimum that"} keeps the ${device.name} free of ${failureMode}.${!isVideoDevice && device.sdCard.minAppPerformance ? ` For load times, the ${device.sdCard.minAppPerformance} app rating matters more.` : " Faster cards work too."}`,
    });
  }

  // 2. Capacity
  const maxIsFigure = /^\d/.test(String(maxCapacity || "").trim());
  let capacityAnswer = capacity.length > 1
    ? `${capacity[0]} covers light use; ${capacity[capacity.length - 1]} suits heavy use.`
    : `${capacity[0]} suits most owners.`;
  if (maxIsFigure) capacityAnswer += ` The maximum is ${maxCapacity}`;
  else if (maxCapacity) capacityAnswer += ` Maximum capacity: ${maxCapacity}`;
  if (testedMaxCapacity) capacityAnswer += ` (${testedMaxCapacity} confirmed working)`;
  if (maxCapacity) capacityAnswer += ".";
  faqs.push({
    q: `What size SD card should I get for ${device.name}?`,
    a: capacityAnswer,
  });

  // 3. Older or budget cards
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Can I use older or slower cards with ${device.name}?`,
      a: `Not below ${speedClass}. Slower cards cause ${failureMode}. Check the card label for the ${speedClass} mark.`,
    });
  } else {
    faqs.push({
      q: `Can I use a cheap card with ${device.name}?`,
      a: `Yes. The ${device.name} has no speed requirement, so any name-brand card of the right format works. Avoid unbranded cards, which are often counterfeit.`,
    });
  }

  // 4. Card type / bus
  const hasMultipleTypes = cardType.includes(",");
  const hasUhs2Slot = /UHS-II/.test(cardType) && !/(not UHS-II|UHS-II Compatible)/i.test(cardType);
  if (hasMultipleTypes) {
    const types = cardType.split(",").map((t) => t.trim());
    faqs.push({
      q: `Does the card type matter for ${device.name}?`,
      a: `The ${device.name} accepts ${types.join(", ")}. Choose by speed class and capacity; the device's limits are the same for each.`,
    });
  } else if (hasUhs2Slot) {
    faqs.push({
      q: `Do I need a UHS-II card for ${device.name}?`,
      a: `No, but it helps. The ${device.name} has a UHS-II slot, so UHS-II cards write and offload faster. UHS-I cards work at UHS-I speed.`,
    });
  } else if (cardType.includes("UHS")) {
    faqs.push({
      q: `Is a UHS-II card faster in ${device.name}?`,
      a: `No. The ${device.name} has a UHS-I slot, so a UHS-II card runs at UHS-I speed. It only offloads faster in a UHS-II card reader.`,
    });
  }

  // 5. Multiple cards
  if (device.recommendedBrands && device.recommendedBrands.length > 0) {
    const highEndCards = device.recommendedBrands
      .map((ref) => sdcardsMap[ref.id])
      .filter((card) => card && card.tier === "professional");

    if (highEndCards.length > 0 || isDemandingDevice) {
      faqs.push({
        q: `Should I use more than one card with ${device.name}?`,
        a: `For long shoots, yes. Two mid-size cards cost about the same as one large card, and a failure then loses half your files instead of all of them.`,
      });
    }
  }

  // 6. Brand
  faqs.push({
    q: `Does the brand matter for ${device.name}?`,
    a: `Yes. SanDisk, Lexar, Samsung and Kingston cards meet their rated speeds. Buy from the brand's store or a major retailer: counterfeit cards sold under those names are common on marketplaces.`,
  });

  // 7. Wrong card
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `What happens if I use the wrong card with ${device.name}?`,
      a: `A card slower than ${speedClass} causes ${failureMode}. A card over the maximum capacity or in the wrong format may not be recognized.`,
    });
  }

  // 8. Lifespan
  faqs.push({
    q: `How long will an SD card last in ${device.name}?`,
    a: isVideoDevice && device.category === "Dash Cams"
      ? `It depends on write volume. Constant loop recording wears cards out, which is why high-endurance cards are rated in recording hours. Replace the card at the first error message.`
      : `Several years in normal use. Cards usually fail from wear or counterfeit flash, not age. Replace yours at the first write error, corrupted file or "card not recognized" message.`,
  });

  return faqs;
}

/**
 * Merge generated FAQs with custom FAQs from device data
 * Custom FAQs override generated ones (by matching question)
 * @param {Array<object>} customFAQs - Custom FAQs from device data
 * @param {Array<object>} generatedFAQs - Programmatically generated FAQs
 * @param {string} locale - Locale the FAQs are in (defaults to English)
 * @returns {Array<object>} - The final merged array of FAQs
 */
function mergeFAQs(customFAQs, generatedFAQs, locale = "en") {
  const localeMerger = LOCALE_MERGERS[locale];
  if (localeMerger) {
    return localeMerger(customFAQs, generatedFAQs);
  }

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
