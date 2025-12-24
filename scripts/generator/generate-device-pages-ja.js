/**
 * SD Card Checker - Japanese Device Pages Generator
 * Reuses the English generator with Japanese data and template
 */

const path = require("path");
const { readJSON } = require("./helpers");

/**
 * Generate Japanese device pages
 * Reuses English generator with isJapanese flag
 */
async function generateDevicePagesJa(allDevices, distPath) {
    console.log("📄 Generating Japanese device pages...");
    
    try {
        // Call shared generator with Japanese flag
        const { generateDevicePages } = require("./generate-device-pages");
        await generateDevicePages(allDevices, distPath, true);
        
        console.log(`  ✓ Generated ${allDevices.length} Japanese device pages`);
    } catch (error) {
        console.error(`  ❌ Error generating Japanese device pages: ${error.message}`);
        throw error;
    }
}

module.exports = { generateDevicePagesJa };
