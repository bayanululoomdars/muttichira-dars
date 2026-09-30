const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

html = html.replace("fetch('/api/portal/lookup?q=' + encodeURIComponent(val))", "fetch('/api/portal/lookup?q=' + encodeURIComponent(val) + '&role=' + currentRole)");

fs.writeFileSync('public/login.html', html);
console.log('Fixed login lookup fetch');
