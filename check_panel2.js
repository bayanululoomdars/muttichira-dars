const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
const lines = html.split('\n');
for (let i = 1965; i >= 0; i--) {
  if (lines[i].includes('id="')) {
    console.log(lines[i]);
    if (lines[i].includes('Panel')) break;
  }
}
