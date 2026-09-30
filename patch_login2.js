const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldLogin = `identifier = currentRole === 'student' ? selectedUserObject.admissionNo : (selectedUserObject.usthadId || selectedUserObject.phone);`;
const newLogin = `identifier = currentRole === 'student' ? (selectedUserObject.admissionNo || selectedUserObject.phone || selectedUserObject._id) : (selectedUserObject.usthadId || selectedUserObject.phone || selectedUserObject._id);`;
html = html.replace(oldLogin, newLogin);

fs.writeFileSync('public/login.html', html);
console.log('Fixed login fallback identifier in login.html');
