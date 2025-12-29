#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load both files
const devicesEn = JSON.parse(fs.readFileSync('./data/devices.json', 'utf-8'));
const devicesJa = JSON.parse(fs.readFileSync('./data/devices-ja.json', 'utf-8'));

// Create sets of device IDs for quick lookup
const enIds = new Set(devicesEn.devices.map(d => d.id));
const jaIds = new Set(devicesJa.devices.map(d => d.id));

console.log(`\n📊 DATASET COMPARISON:`);
console.log(`English devices.json: ${enIds.size} devices`);
console.log(`Japanese devices-ja.json: ${jaIds.size} devices`);

// Find devices in EN but not in JA
const missingInJa = Array.from(enIds).filter(id => !jaIds.has(id));
console.log(`\n⚠️  Devices in EN but NOT in JA: ${missingInJa.length}`);
if (missingInJa.length > 0 && missingInJa.length <= 20) {
  missingInJa.forEach(id => console.log(`   - ${id}`));
}

// Find devices in JA but not in EN
const missingInEn = Array.from(jaIds).filter(id => !enIds.has(id));
console.log(`\n⚠️  Devices in JA but NOT in EN: ${missingInEn.length}`);
if (missingInEn.length > 0 && missingInEn.length <= 20) {
  missingInEn.forEach(id => console.log(`   - ${id}`));
}

// Check relatedDevices in JA file
console.log(`\n🔍 ANALYZING RELATED DEVICES IN JAPANESE FILE:\n`);

let brokenRelatedCount = 0;
const brokenDevices = [];

devicesJa.devices.forEach(device => {
  if (device.relatedDevices && Array.isArray(device.relatedDevices)) {
    device.relatedDevices.forEach(relatedId => {
      if (!jaIds.has(relatedId)) {
        brokenRelatedCount++;
        brokenDevices.push({
          deviceId: device.id,
          deviceName: device.name,
          brokenRef: relatedId,
          existsInEn: enIds.has(relatedId)
        });
      }
    });
  }
});

console.log(`❌ BROKEN RELATED DEVICE REFERENCES: ${brokenRelatedCount}`);

if (brokenRelatedCount > 0) {
  // Group by device
  const groupedByDevice = {};
  brokenDevices.forEach(item => {
    if (!groupedByDevice[item.deviceId]) {
      groupedByDevice[item.deviceId] = [];
    }
    groupedByDevice[item.deviceId].push(item);
  });

  console.log(`\n   Devices with broken references:`);
  Object.entries(groupedByDevice).forEach(([devId, items]) => {
    const device = devicesJa.devices.find(d => d.id === devId);
    console.log(`\n   📱 ${device.name} (${devId}):`);
    items.forEach(item => {
      const status = item.existsInEn ? '⚠️ (exists in EN)' : '❌ (missing everywhere)';
      console.log(`      → "${item.brokenRef}" ${status}`);
    });
  });

  console.log(`\n\n💾 Writing detailed report to "broken-related-devices.json"...`);
  fs.writeFileSync(
    './broken-related-devices.json',
    JSON.stringify({
      summary: {
        totalBroken: brokenRelatedCount,
        affectedDevices: Object.keys(groupedByDevice).length
      },
      byDevice: Object.entries(groupedByDevice).map(([devId, items]) => ({
        deviceId: devId,
        deviceName: devicesJa.devices.find(d => d.id === devId)?.name,
        brokenReferences: items.map(i => ({
          referenceId: i.brokenRef,
          existsInEnglishDataset: i.existsInEn
        }))
      }))
    }, null, 2)
  );
}

console.log(`\n\n✅ Analysis complete!`);
