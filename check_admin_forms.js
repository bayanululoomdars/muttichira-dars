const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
console.log('formAddStudentAdmin exists:', html.includes('id="formAddStudentAdmin"'));
console.log('formAddUsthadAdmin exists:', html.includes('id="formAddUsthadAdmin"'));
console.log('unifiedAddUserModal exists:', html.includes('id="unifiedAddUserModal"'));
