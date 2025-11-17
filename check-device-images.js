const fs = require('fs');
const path = require('path');

const devices = JSON.parse(fs.readFileSync('./data/devices.json'));

// Get all existing device images
const imgDir = './img/devices';
const getImageFiles = (dir, prefix = '') => {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  items.forEach(item => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getImageFiles(fullPath, item.name + '/'));
    } else if (item.isFile() && item.name.endsWith('.webp')) {
      files.push(prefix + item.name);
    }
  });
  return files;
};

const existingImages = getImageFiles(imgDir);
const imageMap = {};
existingImages.forEach(img => {
  const base = img.replace('.webp', '').replace(/^[^/]+\//, '');
  imageMap[base] = img;
});

const missing = [];
devices.devices.forEach(device => {
  const slug = device.slug;
  if (!imageMap[slug]) {
    missing.push({name: device.name, slug: slug, category: device.category});
  }
});

console.log('Total devices:', devices.devices.length);
console.log('Devices with images:', devices.devices.length - missing.length);
console.log('\nMissing images (' + missing.length + '):');
missing.forEach(m => console.log('  - ' + m.name + ' (' + m.slug + ') [' + m.category + ']'));
