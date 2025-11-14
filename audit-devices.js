const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'devices.json'), 'utf8'));
const devices = data.devices;
const deviceIds = new Set(devices.map(d => d.id));

console.log('=== DEVICES.JSON AUDIT ===\n');
console.log(`Total devices: ${devices.length}\n`);

// Check for orphaned references
console.log('--- Checking for orphaned references ---');
const orphaned = [];
const deviceCategories = {};

devices.forEach(device => {
  // Track categories
  if (!deviceCategories[device.category]) {
    deviceCategories[device.category] = [];
  }
  deviceCategories[device.category].push(device.id);

  // Check related devices
  if (device.relatedDevices && device.relatedDevices.length > 0) {
    device.relatedDevices.forEach(ref => {
      if (!deviceIds.has(ref)) {
        orphaned.push({ device: device.id, ref: ref });
        console.log(`  ❌ "${device.id}" references "${ref}" (NOT FOUND)`);
      }
    });
  }
});

if (orphaned.length === 0) {
  console.log('  ✅ All references are valid!\n');
} else {
  console.log(`\n  Found ${orphaned.length} orphaned references!\n`);
}

// Suggest related devices by category
console.log('--- Devices by category ---');
Object.entries(deviceCategories).sort().forEach(([cat, ids]) => {
  console.log(`  ${cat}: ${ids.length} devices`);
});

// Check for devices with few or no related devices
console.log('\n--- Devices with incomplete related devices ---');
const suggestions = [];

devices.forEach(device => {
  const relatedCount = device.relatedDevices ? device.relatedDevices.length : 0;
  if (relatedCount < 2) {
    // Find similar devices from same category
    const sameCategory = devices.filter(d => 
      d.category === device.category && d.id !== device.id
    ).map(d => d.id);
    
    if (sameCategory.length > 0) {
      suggestions.push({
        device: device.id,
        currentRelated: device.relatedDevices || [],
        suggestedAdd: sameCategory.filter(d => !(device.relatedDevices || []).includes(d)).slice(0, 3)
      });
    }
  }
});

if (suggestions.length > 0) {
  suggestions.slice(0, 15).forEach(s => {
    console.log(`\n  "${s.device}"`);
    console.log(`    Current: ${s.currentRelated.length > 0 ? s.currentRelated.join(', ') : '(none)'}`);
    if (s.suggestedAdd.length > 0) {
      console.log(`    Could add: ${s.suggestedAdd.join(', ')}`);
    }
  });
  console.log(`\n  (${suggestions.length} devices total with <2 related devices)`);
}

console.log('\n');
