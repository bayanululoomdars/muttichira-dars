const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const endLogic = `  safeSetHtml('userTableBody', html || '<tr><td colspan="6" class="text-center text-muted py-4">No matching records found.</td></tr>');
}`;

const newEndLogic = `  safeSetHtml('userTableBody', html || '<tr><td colspan="6" class="text-center text-muted py-4">No matching records found.</td></tr>');
  
  // Update badges
  var visibleStudents = filtered.filter(u => u.role === 'student' && (!u.isAlumni && !(u.status || '').toLowerCase().includes('alumni') && !(u.status || '').toLowerCase().includes('biruthadhari'))).length;
  var visibleAlumni = filtered.filter(u => u.role === 'student' && (u.isAlumni || (u.status || '').toLowerCase().includes('alumni') || (u.status || '').toLowerCase().includes('biruthadhari'))).length;
  var visibleUsthads = filtered.filter(u => u.role === 'usthad').length;
  
  safeSetText('badge-students', visibleStudents + visibleAlumni);
  safeSetText('badge-usthads', visibleUsthads);
}`;

html = html.replace(endLogic, newEndLogic);
fs.writeFileSync('public/admin.html', html);
console.log('Fixed renderPortalUsersAdmin badges');
