const fs = require('fs');
const path = require('path');

// Read devices.json
const devicesPath = path.join(__dirname, 'data', 'devices.json');
const data = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));

// Devices to fix
const fixes = {
  'canon-g7x-mark-iii': '/img/devices/cameras/canon-g7x-mark-iii.webp',
  'sony-zv-e10': '/img/devices/cameras/sony-zv-e10.webp',
  'insta360-x4': '/img/devices/action-cameras/insta360-x4.webp'
};

let modified = 0;
data.devices.forEach(device => {
  if (fixes[device.slug] && !device.imageUrl) {
    device.imageUrl = fixes[device.slug];
    modified++;
    console.log(`✓ Added imageUrl for ${device.name}: ${fixes[device.slug]}`);
  }
});

// Write back
fs.writeFileSync(devicesPath, JSON.stringify(data, null, 2) + '\n');
console.log(`\n✅ Successfully modified ${modified} devices`);
console.log('Next: Run npm run build to regenerate pages with correct images');
