const fs = require('fs');

let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Replace the modal body to add photo upload
const oldFormModal = `<div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Login Password</label>
                <input type="text" id="selfPassword" class="form-control" style="background:var(--bg-input); color:var(--text);">
                <small class="text-danger">Updates immediately.</small>
              </div>`;

const newFormModal = `<div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Login Password</label>
                <input type="text" id="selfPassword" class="form-control" style="background:var(--bg-input); color:var(--text);">
                <small class="text-danger">Updates immediately.</small>
              </div>
              <div class="col-12 mb-3">
                <label class="small font-weight-bold text-muted"><i class="fa fa-camera"></i> Profile Photo (Optional)</label>
                <input type="file" id="selfPhoto" accept="image/*" class="form-control" style="background:var(--bg-input); color:var(--text); padding-bottom: 35px;">
                <small class="text-info">Upload a square image for best results.</small>
              </div>`;

html = html.replace(oldFormModal, newFormModal);

// 2. Rewrite handleStudentSelfUpdate to use FormData and fix the ID bug
const oldFnStart = 'function handleStudentSelfUpdate(e) {';
const oldFnEnd = 'function switchRole(role) {';
const i1 = html.indexOf(oldFnStart);
const i2 = html.indexOf(oldFnEnd);

if (i1 !== -1 && i2 !== -1) {
  const oldFn = html.substring(i1, i2);
  const newFn = `function handleStudentSelfUpdate(e) {
      e.preventDefault();
      if (!currentUserSession || currentUserSession.role !== 'student') return;
      
      const formData = new FormData();
      formData.append('name', document.getElementById('selfName').value);
      formData.append('fatherName', document.getElementById('selfFather').value);
      formData.append('phone', document.getElementById('selfPhone').value);
      formData.append('bloodGroup', document.getElementById('selfBlood').value);
      formData.append('dob', document.getElementById('selfDob').value);
      formData.append('emergencyContact', document.getElementById('selfEmergency').value);
      formData.append('address', document.getElementById('selfAddress').value);
      formData.append('password', document.getElementById('selfPassword').value);
      
      const photoFile = document.getElementById('selfPhoto').files[0];
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      // Handle memory db vs mongo db
      const studentId = currentUserSession._id || currentUserSession.admissionNo;
      
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
      btn.disabled = true;

      fetch('/api/portal/student/' + studentId, {
        method: 'PUT',
        body: formData // No Content-Type header so browser sets multipart boundary
      })
      .then(r => r.json())
      .then(res => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        if(res.success) {
          showToast('Profile updated successfully!', false);
          $('#modalStudentFullProfile').modal('hide');
          Object.assign(currentUserSession, res.student || {});
          renderDashboard(currentUserSession);
        } else {
          showToast(res.message || 'Error updating profile', true);
        }
      }).catch(err => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        showToast('Network error while saving.', true);
      });
    }

    `;
  html = html.replace(oldFn, newFn);
}

fs.writeFileSync('public/login.html', html);
console.log('Fixed self-update and added photo upload');

