#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load both files
const devicesJa = JSON.parse(fs.readFileSync('./data/devices-ja.json', 'utf-8'));
const devicesEn = JSON.parse(fs.readFileSync('./data/devices.json', 'utf-8'));

// Create sets of device IDs for quick lookup
const jaIds = new Set(devicesJa.devices.map(d => d.id));

// Fix function: remove broken references
function fixBrokenReferences() {
  let fixedCount = 0;
  let deviceCount = 0;

  devicesJa.devices.forEach(device => {
    if (device.relatedDevices && Array.isArray(device.relatedDevices)) {
      const originalLength = device.relatedDevices.length;
      device.relatedDevices = device.relatedDevices.filter(relatedId => {
        const exists = jaIds.has(relatedId);
        if (!exists) {
          fixedCount++;
        }
        return exists;
      });

      if (device.relatedDevices.length < originalLength) {
        deviceCount++;
      }
    }
  });

  return { fixedCount, deviceCount };
}

const result = fixBrokenReferences();

// Write fixed file
fs.writeFileSync(
  './data/devices-ja.json',
  JSON.stringify(devicesJa, null, 2)
);

console.log(`\n✅ FIXED BROKEN RELATED DEVICE REFERENCES\n`);
console.log(`   Removed: ${result.fixedCount} broken references`);
console.log(`   From: ${result.deviceCount} devices`);
console.log(`\n   ✓ Updated file: data/devices-ja.json`);

// Generate suggestions report
console.log(`\n📋 NEXT STEPS:`);
console.log(`   1. Review the Japanese dataset to find appropriate related devices`);
console.log(`   2. Many devices now have fewer (or no) related devices`);
console.log(`   3. Consider adding relationships between similar devices that exist in JA`);
console.log(`\n   Example categories in JA dataset:`);

const categories = {};
devicesJa.devices.forEach(d => {
  if (!categories[d.category]) {
    categories[d.category] = [];
  }
  categories[d.category].push(d.id);
});

Object.entries(categories).forEach(([cat, ids]) => {
  console.log(`      • ${cat}: ${ids.length} devices`);
});

console.log(`\n`);
