const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// editUserAdmin
html = html.replace(/function editUserAdmin\(id, role\) \{/, `function editUserAdmin(id, role) {
  try {`);
html = html.replace(/document\.getElementById\('unifiedAddUserModal'\)\.classList\.add\('show'\);\s*switchUnifiedRole\(role\);[\s\S]*?safeSetVal\('adminUsthadStatus', user\.status \|\| 'Active'\);\s*\}\s*\}/, (match) => {
  return match + `
  } catch(e) { alert('Error editing user: ' + e.message); }`;
});

// deleteStudentAdmin
html = html.replace(/function deleteStudentAdmin\(id\) \{/, `function deleteStudentAdmin(id) {
  try {`);
html = html.replace(/loadPortalUsersAdmin\(\);\s*\}\);\s*\}/, (match) => {
  return match + `
  } catch(e) { alert('Error deleting student: ' + e.message); }`;
});

fs.writeFileSync('public/admin.html', html);
console.log('Patched edit/delete with try/catch');
