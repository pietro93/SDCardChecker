const en = require('./data/devices.json');
const ja = require('./data/devices-ja.json');

const enIds = en.devices.map(d => d.id);
const jaIds = ja.devices.map(d => d.id);

const missing = enIds.filter(id => !jaIds.includes(id));

console.log('English devices:', enIds.length);
console.log('Japanese devices:', jaIds.length);
console.log('Missing devices:', missing.length);
console.log('\nMissing IDs:');
missing.forEach(id => {
  const device = en.devices.find(d => d.id === id);
  console.log(`- ${id} (${device.name})`);
});
