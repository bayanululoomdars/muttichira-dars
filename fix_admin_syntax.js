const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const regex = /function editUserAdmin\(id, role\) \{\s*try \{\s*const cleanId[\s\S]*?\}\s*\}\s*function closeAddUserModal\(\)/;

const fixedFunction = `function editUserAdmin(id, role) {
  try {
    const cleanId = String(id).trim();
    const user = allPortalUsersCache.find(u => {
      return (u._id && String(u._id).trim() === cleanId) || 
             (u.admissionNo && String(u.admissionNo).trim() === cleanId) || 
             (u.usthadId && String(u.usthadId).trim() === cleanId);
    });
    if (!user) { alert("User not found! ID: " + id); return; }
    editingUserId = user._id || id;
    editingUserRole = role;

    document.getElementById('unifiedAddUserModal').classList.add('show');
    switchUnifiedRole(role);
    
    if (role === 'student') {
      safeSetVal('adminStudentName', user.name);
      safeSetVal('adminStudentFather', user.fatherName || '');
      safeSetVal('adminStudentPhone', user.phone);
      safeSetVal('adminStudentPassword', user.password);
      safeSetVal('adminStudentAdmNo', user.admissionNo);
      safeSetVal('adminStudentStatus', user.status);
      safeSetVal('adminStudentBatchNo', user.batchNumber || user.batchYear);
      if(user.photoUrl) document.getElementById('previewStudentPhoto').src = user.photoUrl;
      safeSetVal('adminStudentPlace', user.place);
      document.querySelector('#formAddStudentAdmin button[type="submit"]').innerHTML = '<i class="fa fa-save"></i> Update Student';
    } else {
      safeSetVal('adminUsthadName', user.name);
      safeSetVal('adminUsthadPhone', user.phone);
      safeSetVal('adminUsthadPassword', user.password);
      safeSetVal('adminUsthadStatus', user.status || 'Active');
      if(user.photoUrl) document.getElementById('previewUsthadPhoto').src = user.photoUrl;
      safeSetVal('adminUsthadDesignation', user.designation);
      safeSetVal('adminUsthadPlace', user.place);
      document.querySelector('#formAddUsthadAdmin button[type="submit"]').innerHTML = '<i class="fa fa-save"></i> Update Usthad';
    }
  } catch(e) {
    console.error(e);
    alert('Error editing user: ' + e.message);
  }
}

function closeAddUserModal()`;

html = html.replace(regex, fixedFunction);

fs.writeFileSync('public/admin.html', html);
console.log('Fixed editUserAdmin syntax error in admin.html');
