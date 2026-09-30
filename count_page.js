const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
const count = html.split('id="page-portal-users"').length - 1;
console.log('Count:', count);
