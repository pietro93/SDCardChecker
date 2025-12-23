/**
 * Fix Japanese categories - translate all English categories to Japanese
 */

const fs = require('fs');
const path = require('path');

const categoryMap = {
  'Action Cameras': 'アクションカメラ',
  'Cameras': 'カメラ',
  'Computing & Tablets': 'コンピュータ・タブレット',
  'Drones': 'ドローン',
  'Gaming Handhelds': '携帯ゲーム機',
  'Security Cameras': 'セキュリティカメラ',
  'Dash Cams': 'ドライブレコーダー',
  'Mobile Devices': 'モバイルデバイス',
  'Tablets': 'タブレット',
  'Computers': 'パソコン',
  'Accessories': 'アクセサリー',
  'Hunting Equipment': 'ハンティング機器',
  'SD Card Readers': 'SDカードリーダー'
};

const devicesPath = path.join(__dirname, 'data/devices-ja.json');
const data = JSON.parse(fs.readFileSync(devicesPath, 'utf-8'));

data.devices = data.devices.map(device => {
  if (categoryMap[device.category]) {
    return {
      ...device,
      category: categoryMap[device.category]
    };
  }
  return device;
});

fs.writeFileSync(devicesPath, JSON.stringify(data, null, 2));
console.log('✅ Fixed Japanese categories');
