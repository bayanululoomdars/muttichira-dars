const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

html = html.replace(/(user\.className \|\| 'Dars')/g, "('Batch ' + (user.batchNumber || '1'))");

fs.writeFileSync('public/login.html', html);
console.log('Fixed dashboard classname in login.html');
