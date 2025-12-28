const fs = require('fs');

// Fix the malformed JSON by removing trailing comma
function fixJSON(content) {
  return content.replace(/,(\s*\])/g, '$1');
}

const engContent = fs.readFileSync('./data/devices.json', 'utf8');
const jaContent = fs.readFileSync('./data/devices-ja.json', 'utf8');

const eng = JSON.parse(fixJSON(engContent));
const ja = JSON.parse(fixJSON(jaContent));

const engHandhelds = eng.devices
  .filter(d => d.category === 'Gaming Handhelds')
  .map(d => ({ name: d.name, id: d.id }))
  .sort((a, b) => a.name.localeCompare(b.name));

const jaHandhelds = ja.devices
  .filter(d => d.category === '携帯ゲーム機')
  .map(d => ({ name: d.name, id: d.id }))
  .sort((a, b) => a.name.localeCompare(b.name));

console.log('=== ENGLISH DEVICES (' + engHandhelds.length + ') ===');
engHandhelds.forEach(d => console.log('  - ' + d.name + ' (' + d.id + ')'));

console.log('\n=== JAPANESE DEVICES (' + jaHandhelds.length + ') ===');
jaHandhelds.forEach(d => console.log('  - ' + d.name + ' (' + d.id + ')'));

// Compare by ID
const engIds = new Set(engHandhelds.map(d => d.id));
const jaIds = new Set(jaHandhelds.map(d => d.id));

const onlyInEng = engHandhelds.filter(d => !jaIds.has(d.id));
const onlyInJa = jaHandhelds.filter(d => !engIds.has(d.id));

console.log('\n=== ONLY IN ENGLISH (' + onlyInEng.length + ') ===');
onlyInEng.forEach(d => console.log('  - ' + d.name));

console.log('\n=== ONLY IN JAPANESE (' + onlyInJa.length + ') ===');
onlyInJa.forEach(d => console.log('  - ' + d.name));
