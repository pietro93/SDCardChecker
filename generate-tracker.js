const fs = require('fs');

const devicesEn = JSON.parse(fs.readFileSync('./data/devices.json', 'utf8'));
const devicesJa = JSON.parse(fs.readFileSync('./data/devices-ja.json', 'utf8'));

// Group by category
const groupByCategory = (devices) => {
  const grouped = {};
  devices.forEach(device => {
    const cat = device.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(device.name);
  });
  return grouped;
};

const enGrouped = groupByCategory(devicesEn.devices);
const jaGrouped = groupByCategory(devicesJa.devices);

let output = '# Device Tracker\n\n';
output += `Generated: ${new Date().toISOString()}\n`;
output += `**English Devices:** ${devicesEn.devices.length}\n`;
output += `**Japanese Devices:** ${devicesJa.devices.length}\n\n`;
output += '---\n\n';

output += '## ENGLISH DEVICES\n\n';
Object.keys(enGrouped).sort().forEach(cat => {
  output += `### ${cat} (${enGrouped[cat].length} devices)\n\n`;
  enGrouped[cat].sort().forEach(name => {
    output += `- ${name}\n`;
  });
  output += '\n';
});

output += '---\n\n';
output += '## JAPANESE DEVICES\n\n';
Object.keys(jaGrouped).sort().forEach(cat => {
  output += `### ${cat} (${jaGrouped[cat].length} devices)\n\n`;
  jaGrouped[cat].sort().forEach(name => {
    output += `- ${name}\n`;
  });
  output += '\n';
});

fs.writeFileSync('./DEVICE_TRACKER.md', output);
console.log('✓ Created DEVICE_TRACKER.md');
console.log(`  English: ${devicesEn.devices.length} devices`);
console.log(`  Japanese: ${devicesJa.devices.length} devices`);
