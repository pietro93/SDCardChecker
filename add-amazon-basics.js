const fs = require('fs');
const devices = JSON.parse(fs.readFileSync('./data/devices.json'));

let updatedCount = 0;
devices.devices.forEach((device) => {
  const hasBudgetCard = device.recommendedBrands.some(b => 
    b.id === 'samsung-evo-select-microsd' || 
    b.id === 'lexar-professional-633x'
  );
  
  if (hasBudgetCard) {
    const hasAmazonBasics = device.recommendedBrands.some(b => b.id === 'amazon-basics-microsd');
    if (!hasAmazonBasics) {
      device.recommendedBrands.push({ id: 'amazon-basics-microsd' });
      updatedCount++;
    }
  }
});

fs.writeFileSync('./data/devices.json', JSON.stringify(devices, null, 2));
console.log('Updated ' + updatedCount + ' devices with Amazon Basics');
