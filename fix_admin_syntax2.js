const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const regex2 = /function deleteStudentAdmin\(id\) \{\s*try \{\s*if \(\!confirm[\s\S]*?\}\s*\}\s*catch\(e\)\s*\{\s*alert\('Error deleting student: ' \+ e\.message\);\s*\}/;

const fixedFunc2 = `function deleteStudentAdmin(id) {
  try {
    if (!confirm('Delete this student record?')) return;
    fetch('/api/portal/student/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(res => {
        showToast(res.message || 'Deleted', !res.success);
        loadPortalUsersAdmin();
      });
  } catch(e) { 
    alert('Error deleting student: ' + e.message); 
  }
}`;

html = html.replace(regex2, fixedFunc2);

fs.writeFileSync('public/admin.html', html);
console.log('Fixed deleteStudentAdmin syntax');
