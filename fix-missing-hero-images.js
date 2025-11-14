/**
 * Fix missing hero images by removing imageUrl for devices without corresponding image files
 * Devices will fall back to placeholder images based on category/name
 */

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, 'data/devices.json');
const imgPath = path.join(__dirname, 'img/devices');

// Get all existing image files
function getAllExistingImages() {
  const images = new Set();
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.webp')) {
        // Convert to URL path
        const urlPath = fullPath
          .replace(path.join(__dirname, 'img'), '')
          .replace(/\\/g, '/');
        images.add(urlPath);
      }
    });
  }
  
  walkDir(imgPath);
  return images;
}

// Load and fix devices
function fixMissingImages() {
  const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
  const existingImages = getAllExistingImages();
  
  let removedCount = 0;
  const removedDevices = [];
  
  devices.devices.forEach(device => {
    if (device.imageUrl && !existingImages.has(device.imageUrl)) {
      console.log(`❌ Missing: ${device.imageUrl} (${device.name})`);
      removedDevices.push({
        name: device.name,
        imageUrl: device.imageUrl
      });
      delete device.imageUrl;
      removedCount++;
    }
  });
  
  if (removedCount > 0) {
    fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2), 'utf8');
    console.log(`\n✓ Fixed ${removedCount} devices with missing images`);
    console.log('\nDevices that will now use placeholder fallbacks:');
    removedDevices.forEach(d => {
      console.log(`  - ${d.name}`);
    });
  } else {
    console.log('✓ All device images are present!');
  }
}

fixMissingImages();
