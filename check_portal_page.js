const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('id="page-portal-users"'));
if (idx !== -1) {
  console.log(lines.slice(idx, idx + 40).join('\n'));
} else {
  console.log('Not found');
}
