const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'devices.json'), 'utf8'));
const devices = data.devices;
const deviceIds = new Set(devices.map(d => d.id));

console.log('=== FINAL DEVICES.JSON VERIFICATION ===\n');
console.log(`Total devices: ${devices.length}\n`);

// Check for orphaned references
const orphaned = [];
devices.forEach(device => {
  if (device.relatedDevices && device.relatedDevices.length > 0) {
    device.relatedDevices.forEach(ref => {
      if (!deviceIds.has(ref)) {
        orphaned.push({ device: device.id, ref: ref });
      }
    });
  }
});

if (orphaned.length === 0) {
  console.log('✅ SUCCESS: No orphaned references found!');
  console.log('\nAll relatedDevices references are valid.\n');
} else {
  console.log(`❌ FOUND ${orphaned.length} orphaned references:\n`);
  orphaned.forEach(o => {
    console.log(`  "${o.device}" -> "${o.ref}" (NOT FOUND)`);
  });
}

// Summary stats
console.log('--- Device Categories ---');
const categories = {};
devices.forEach(d => {
  if (!categories[d.category]) categories[d.category] = [];
  categories[d.category].push(d.id);
});

Object.entries(categories).sort().forEach(([cat, ids]) => {
  console.log(`  ${cat}: ${ids.length}`);
});

console.log(`\nTotal devices: ${devices.length}`);
