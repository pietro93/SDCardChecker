const fs = require('fs');
const path = require('path');

const listPath = process.argv[2];
const files = fs.readFileSync(listPath, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);

const pattern = /((?:console\.(?:log|warn|error)\()(?:[`'"]))( {2,})/g;

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const orig = fs.readFileSync(f, 'utf8');
  const fixed = orig.replace(pattern, (m, p1) => p1);
  if (fixed !== orig) {
    fs.writeFileSync(f, fixed, 'utf8');
    console.log('fixed', f);
  }
}
