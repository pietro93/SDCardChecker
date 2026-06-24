const fs = require("fs");
const path = require("path");

const categoriesDir = path.join(__dirname, "..", "data", "categories");

const files = fs
  .readdirSync(categoriesDir)
  .filter((f) => f.endsWith(".json"));

let total = 0;
const counts = {};

for (const file of files) {
  const devices = JSON.parse(
    fs.readFileSync(path.join(categoriesDir, file), "utf8")
  );
  for (const device of devices) {
    counts[device.category] = (counts[device.category] || 0) + 1;
    total += 1;
  }
}

console.log(`\nTotal devices: ${total}\n`);
console.log("By category:");
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`  ${String(count).padStart(3)}  ${category}`);
  });
console.log("");
