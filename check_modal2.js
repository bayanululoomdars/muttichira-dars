const fs = require('fs');
const html = fs.readFileSync('public/admin.html','utf8');
console.log('HTML Modal Exists?', html.includes('id="unifiedAddUserModal"'));
