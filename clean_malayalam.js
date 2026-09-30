const fs = require('fs');
let c = fs.readFileSync('public/about.html', 'utf8');

c = c.replace(/ \([\u0D00-\u0D7F ]+\)/g, '');
c = c.replace(/\([\u0D00-\u0D7F ]+\)/g, '');
c = c.replace(/[\u0D00-\u0D7F]/g, '');

fs.writeFileSync('public/about.html', c);
console.log('Done cleaning');
