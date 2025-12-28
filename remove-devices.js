const fs = require('fs');
const path = require('path');

const devicesToRemove = [
  'nextbase-622gw',
  'wyze-cam-v3',
  'viofo-a229-duo',
  'garmin-dash-cam-mini-2'
];

const filePath = path.join(__dirname, 'data', 'devices-ja.json');

try {
  // Read the JSON file
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Count before
  const countBefore = data.devices.length;

  // Filter out devices to remove
  data.devices = data.devices.filter(device => !devicesToRemove.includes(device.id));

  // Count after
  const countAfter = data.devices.length;

  // Write the updated JSON back
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');

  console.log('✓ Devices removed successfully');
  console.log(`  Before: ${countBefore} devices`);
  console.log(`  After: ${countAfter} devices`);
  console.log(`  Removed: ${countBefore - countAfter} devices`);
  console.log('\nRemoved devices:');
  devicesToRemove.forEach(id => console.log(`  - ${id}`));
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
