const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const targetNameInput = `<div class="form-group">
                  <label class="form-label">Student Name *</label>
                  <input type="text" id="adminStudentName" class="form-control" placeholder="e.g. Muhammad Rashid" required>
                </div>`;

const newInputs = `<div class="form-group">
                  <label class="form-label">Student Name *</label>
                  <input type="text" id="adminStudentName" class="form-control" placeholder="e.g. Muhammad Rashid" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Son of (Father's Name) *</label>
                  <input type="text" id="adminStudentFather" class="form-control" placeholder="e.g. Abdulla" required>
                </div>`;

html = html.replace(targetNameInput, newInputs);

// Also patch editUserAdmin
const editLogicTarget = `safeSetVal('adminStudentName', user.name);
    safeSetVal('adminStudentPhone', user.phone);`;

const editLogicNew = `safeSetVal('adminStudentName', user.name);
    safeSetVal('adminStudentFather', user.fatherName || '');
    safeSetVal('adminStudentPhone', user.phone);`;

html = html.replace(editLogicTarget, editLogicNew);

// Also patch submitAddStudentAdmin
const submitTarget = `fd.append('name', safeGetValue('adminStudentName'));
  fd.append('phone', safeGetValue('adminStudentPhone'));`;

const submitNew = `fd.append('name', safeGetValue('adminStudentName'));
  fd.append('fatherName', safeGetValue('adminStudentFather'));
  fd.append('phone', safeGetValue('adminStudentPhone'));`;

html = html.replace(submitTarget, submitNew);

fs.writeFileSync('public/admin.html', html);
console.log('Added fatherName to admin.html inputs');
