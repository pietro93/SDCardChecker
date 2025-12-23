/**
 * Fix categories in both English and Japanese versions
 * - Replace "Hunting Equipment" with "Trail Cameras"
 * - Consolidate Mobile Devices, Computers, Tablets into Computing & Tablets
 */

const fs = require('fs');
const path = require('path');

const categoryMap = {
  'Hunting Equipment': 'Trail Cameras',
  'Mobile Devices': 'Computing & Tablets',
  'Computers': 'Computing & Tablets',
  'Tablets': 'Computing & Tablets'
};

const categoryMapJa = {
  'ハンティング機器': 'トレイルカメラ',
  'モバイルデバイス': 'コンピュータ・タブレット',
  'パソコン': 'コンピュータ・タブレット',
  'タブレット': 'コンピュータ・タブレット'
};

function fixFile(filePath, categoryMap) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  data.devices = data.devices.map(device => {
    if (categoryMap[device.category]) {
      return {
        ...device,
        category: categoryMap[device.category]
      };
    }
    return device;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Fixed ${filePath}`);
}

fixFile(path.join(__dirname, 'data/devices.json'), categoryMap);
fixFile(path.join(__dirname, 'data/devices-ja.json'), categoryMapJa);

console.log('\n✅ All categories fixed');
