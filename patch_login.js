const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldLogin = `    function submitLogin() {
      const pass = document.getElementById('inputPassword').value.trim();
      const identifier = document.getElementById('searchIdentifier').value.trim();
      if (!pass) {`;
const newLogin = `    function submitLogin() {
      const pass = document.getElementById('inputPassword').value.trim();
      let identifier = document.getElementById('searchIdentifier').value.trim();
      if (selectedUserObject) {
        identifier = currentRole === 'student' ? selectedUserObject.admissionNo : (selectedUserObject.usthadId || selectedUserObject.phone);
      }
      if (!pass) {`;
html = html.replace(oldLogin, newLogin);

fs.writeFileSync('public/login.html', html);
console.log('Fixed login identifier bug in login.html');
