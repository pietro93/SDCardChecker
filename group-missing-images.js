const fs = require('fs');
const devices = JSON.parse(fs.readFileSync('./data/devices.json'));

// Get existing images
const imgDir = './img/devices';
const getImageFiles = (dir, prefix = '') => {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  items.forEach(item => {
    const fullPath = require('path').join(dir, item.name);
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

const missing = devices.devices
  .filter(d => !imageMap[d.slug])
  .map(d => ({name: d.name, slug: d.slug, category: d.category}));

// Group by brand/type
const groups = {};
missing.forEach(d => {
  let group = 'Other';
  
  if (d.slug.includes('lenovo-legion')) group = 'Lenovo Legion Go';
  else if (d.slug.includes('asus-rog-ally')) group = 'ASUS ROG Ally';
  else if (d.slug.includes('dji-mini')) group = 'DJI Mini Series';
  else if (d.slug.includes('dji-air')) group = 'DJI Air Series';
  else if (d.slug.includes('canon-eos-r')) group = 'Canon EOS R Series';
  else if (d.slug.includes('canon-')) group = 'Canon Compact/Rebel';
  else if (d.slug.includes('nikon-z')) group = 'Nikon Z Series';
  else if (d.slug.includes('nikon-d')) group = 'Nikon DSLR';
  else if (d.slug.includes('sony-a7') || d.slug.includes('sony-a6')) group = 'Sony Alpha';
  else if (d.slug.includes('sony-')) group = 'Sony Compact';
  else if (d.slug.includes('fujifilm-x')) group = 'Fujifilm X Series';
  else if (d.slug.includes('leica-')) group = 'Leica';
  else if (d.slug.includes('panasonic-')) group = 'Panasonic Lumix';
  else if (d.slug.includes('nextbase-') || d.slug.includes('viofo-') || d.slug.includes('garmin-dash')) group = 'Dash Cams';
  else if (d.slug.includes('anbernic-') || d.slug.includes('retroid-') || d.slug.includes('miyoo-')) group = 'Retro Handhelds';
  else if (d.slug.includes('raspberry-pi')) group = 'Raspberry Pi';
  else if (d.slug.includes('insta360-x4')) group = 'Insta360 X4';
  else if (d.slug.includes('dji-osmo-action')) group = 'DJI Osmo Action';
  
  if (!groups[group]) groups[group] = [];
  groups[group].push(d);
});

console.log('DEVICE IMAGE GROUPING STRATEGY\n');
console.log('================================\n');

const priority = [
  'DJI Mini Series',
  'DJI Air Series',
  'Canon EOS R Series',
  'Sony Alpha',
  'Nikon Z Series',
  'Fujifilm X Series',
  'Dash Cams',
  'Retro Handhelds',
  'Lenovo Legion Go',
  'ASUS ROG Ally',
  'Nikon DSLR',
  'Leica',
  'Panasonic Lumix',
  'Raspberry Pi',
  'Canon Compact/Rebel',
  'Sony Compact',
  'Insta360 X4',
  'DJI Osmo Action',
  'Other'
];

priority.forEach(group => {
  if (groups[group]) {
    console.log(`\n${group.toUpperCase()} (${groups[group].length} devices)`);
    console.log('─'.repeat(50));
    groups[group].forEach(d => console.log(`  • ${d.name}`));
  }
});

console.log('\n\nTOTAL MISSING:', missing.length);
