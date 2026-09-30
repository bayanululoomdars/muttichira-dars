const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('formAddUsthadAdmin'));
console.log(lines.slice(start, start + 30).join('\n'));
