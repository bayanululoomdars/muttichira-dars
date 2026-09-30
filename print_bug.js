const fs = require('fs');
const html = fs.readFileSync('public/login.html','utf8');
const lines = html.split('\n');
console.log(lines.slice(1635, 1660).join('\n'));
