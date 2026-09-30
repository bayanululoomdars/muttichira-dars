const fs = require('fs');
const html = fs.readFileSync('public/admin.html','utf8');
const lines = html.split('\n');
console.log(lines.slice(3980, 4200).join('\n'));
