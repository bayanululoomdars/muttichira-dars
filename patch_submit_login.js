const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldLogic = `      const pass = document.getElementById('inputPassword').value.trim();
      const identifier = document.getElementById('searchIdentifier').value.trim();`;

const newLogic = `      const pass = document.getElementById('inputPassword').value.trim();
      const rawInput = document.getElementById('inputIdentifier').value.trim();
      const identifier = selectedUserObject ? (selectedUserObject.admissionNo || selectedUserObject.usthadId || selectedUserObject._id) : rawInput;`;

html = html.replace(oldLogic, newLogic);
fs.writeFileSync('public/login.html', html);
console.log('Fixed submitLogin in login.html');
