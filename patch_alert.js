const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

html = html.replace('if (!user) return;', 'if (!user) { alert("User not found! ID: " + id); return; }');

fs.writeFileSync('public/admin.html', html);
console.log('Added alert');
