const sharp = require('sharp');
const path = require('path');
const svgPath = process.argv[2];
const outPath = process.argv[3];
sharp(svgPath)
  .resize(256, 256)
  .webp({ quality: 90 })
  .toFile(outPath)
  .then(() => console.log('done'))
  .catch(e => { console.error(e); process.exit(1); });
