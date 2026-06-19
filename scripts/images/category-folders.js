/**
 * Maps the `category` field used in data/categories/*.json to the
 * physical folder under img/devices/ where hero images live.
 */
const CATEGORY_FOLDERS = {
  "Action Cameras": "action-cameras",
  "Audio & Hi-Fi": "audio-hi-fi",
  "Cameras": "cameras",
  "Computing & Tablets": "computing",
  "Dash Cams": "dashcams",
  "Drones": "drones",
  "Gaming Handhelds": "gaming-consoles",
  "Security Cameras": "security-cameras",
  "Smartphones": "smartphones",
};

function getCategoryFolder(category) {
  const folder = CATEGORY_FOLDERS[category];
  if (!folder) {
    throw new Error(`No img/devices folder mapped for category "${category}". Add it to scripts/images/category-folders.js`);
  }
  return folder;
}

module.exports = { CATEGORY_FOLDERS, getCategoryFolder };
