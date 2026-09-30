const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('html += \\\'<tr>\\\'') || l.includes('html += \'<tr>\''));
console.log(lines.slice(start, start + 15).join('\n'));
