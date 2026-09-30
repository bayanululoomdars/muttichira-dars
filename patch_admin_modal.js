const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const regexModal = /function openAddUserModal\(\) \{/;
html = html.replace(regexModal, `function openAddUserModal() {
  try {
    console.log('Opening Add User Modal...');`);

const regexModalEnd = /document\.getElementById\('unifiedAddUserModal'\)\.classList\.add\('show'\);\s*\}/;
html = html.replace(regexModalEnd, `document.getElementById('unifiedAddUserModal').classList.add('show');
  } catch(e) {
    alert('Error opening modal: ' + e.message);
  }
}`);

fs.writeFileSync('public/admin.html', html);
console.log('Patched admin.html openAddUserModal with try/catch');
