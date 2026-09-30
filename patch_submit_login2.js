const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const loginRegex = /const pass = document\.getElementById\('inputPassword'\)\.value\.trim\(\);\s*const identifier = document\.getElementById\('searchIdentifier'\)\.value\.trim\(\);/;

const newLoginLogic = `const pass = document.getElementById('inputPassword').value.trim();
      const rawInput = document.getElementById('inputIdentifier').value.trim();
      const identifier = selectedUserObject ? (selectedUserObject.admissionNo || selectedUserObject.usthadId || selectedUserObject._id) : rawInput;`;

if (loginRegex.test(html)) {
  html = html.replace(loginRegex, newLoginLogic);
  fs.writeFileSync('public/login.html', html);
  console.log('Fixed submitLogin in login.html');
} else {
  console.log('Could not find the target string in login.html');
}
