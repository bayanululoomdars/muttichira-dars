const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Remove the broken "Save All Marks" button
const btnSaveAll = `<button class="btn btn-success font-weight-bold w-100 rounded-pill py-2 mt-3" onclick="submitExamMarksUsthad()">
            <i class="fa fa-save"></i> Save All Marks
          </button>`;
html = html.replace(btnSaveAll, '');

// 2. Add "Edit Profile" to Usthad ID Card
const usthadPhotoOld = `<img id="uIdPhoto" src="img/new_logo.png" style="width:75px; height:75px; object-fit:cover; border-radius:50%; border:3px solid var(--border-soft); margin-bottom:5px;">`;
const usthadPhotoNew = `<div class="d-flex justify-content-center align-items-center flex-column mb-2 relative">
              <img id="uIdPhoto" src="img/new_logo.png" style="width:75px; height:75px; object-fit:cover; border-radius:50%; border:3px solid var(--border-soft);">
              <button class="btn btn-warning btn-sm mt-2 font-weight-bold" style="font-size:11px; border-radius:20px; padding: 4px 12px; box-shadow:0 2px 5px rgba(0,0,0,0.2);" onclick="openUsthadFullProfileModal()">
                <i class="fa fa-edit"></i> Edit Your Profile
              </button>
            </div>`;
html = html.replace(usthadPhotoOld, usthadPhotoNew);

// 3. Add modalUsthadFullProfile before modalStudentFullProfile
const usthadModalHTML = `
  <!-- USTHAD FULL PROFILE MODAL -->
  <div class="modal fade" id="modalUsthadFullProfile">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content" style="background:#1e293b; color:var(--text); border:1px solid var(--border-soft); border-radius:16px;">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title font-weight-bold text-primary"><i class="fa fa-user-edit"></i> Complete Your Profile</h5>
          <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
        </div>
        <form onsubmit="handleUsthadSelfUpdate(event)">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Full Name <span class="text-danger">*</span></label>
                <input type="text" id="uSelfName" class="form-control" style="background:var(--bg-input); color:var(--text);" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Phone Number <span class="text-danger">*</span></label>
                <input type="text" id="uSelfPhone" class="form-control" style="background:var(--bg-input); color:var(--text);" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Designation</label>
                <input type="text" id="uSelfDesignation" class="form-control" style="background:var(--bg-input); color:var(--text);">
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Subject</label>
                <input type="text" id="uSelfSubject" class="form-control" style="background:var(--bg-input); color:var(--text);">
              </div>
              <div class="col-12 mb-3">
                <label class="small font-weight-bold text-muted">Full Address</label>
                <textarea id="uSelfAddress" class="form-control" rows="2" style="background:var(--bg-input); color:var(--text);"></textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Login Password</label>
                <input type="text" id="uSelfPassword" class="form-control" style="background:var(--bg-input); color:var(--text);">
                <small class="text-danger">Updates immediately.</small>
              </div>
              <div class="col-12 mb-3">
                <label class="small font-weight-bold text-muted"><i class="fa fa-camera"></i> Profile Photo (Optional)</label>
                <input type="file" id="uSelfPhoto" accept="image/*" class="form-control" style="background:var(--bg-input); color:var(--text); padding-bottom: 35px;">
              </div>
            </div>
          </div>
          <div class="modal-footer border-top-0">
            <button type="button" class="btn btn-secondary rounded-pill font-weight-bold" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary rounded-pill font-weight-bold px-4"><i class="fa fa-save"></i> Submit Profile</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="modalUsthadFullProfile"')) {
  html = html.replace('<div class="modal fade" id="modalStudentFullProfile">', usthadModalHTML + '\n  <div class="modal fade" id="modalStudentFullProfile">');
}

// 4. Add openUsthadFullProfileModal and handleUsthadSelfUpdate JS
const usthadJS = `
    function openUsthadFullProfileModal() {
      if(!currentUserSession) return;
      document.getElementById('uSelfName').value = currentUserSession.name || '';
      document.getElementById('uSelfPhone').value = currentUserSession.phone || '';
      document.getElementById('uSelfDesignation').value = currentUserSession.designation || '';
      document.getElementById('uSelfSubject').value = currentUserSession.subject || '';
      document.getElementById('uSelfAddress').value = currentUserSession.address || '';
      document.getElementById('uSelfPassword').value = currentUserSession.password || '';
      document.getElementById('uSelfPhoto').value = '';
      $('#modalUsthadFullProfile').modal('show');
    }

    function handleUsthadSelfUpdate(e) {
      e.preventDefault();
      if (!currentUserSession || currentUserSession.role !== 'usthad') return;
      
      const formData = new FormData();
      formData.append('name', document.getElementById('uSelfName').value);
      formData.append('phone', document.getElementById('uSelfPhone').value);
      formData.append('designation', document.getElementById('uSelfDesignation').value);
      formData.append('subject', document.getElementById('uSelfSubject').value);
      formData.append('address', document.getElementById('uSelfAddress').value);
      formData.append('password', document.getElementById('uSelfPassword').value);
      
      const photoFile = document.getElementById('uSelfPhoto').files[0];
      if (photoFile) formData.append('photo', photoFile);

      const usthadId = currentUserSession._id || currentUserSession.usthadId;
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
      btn.disabled = true;

      fetch('/api/portal/usthad/' + usthadId, {
        method: 'PUT',
        body: formData
      })
      .then(r => r.json())
      .then(res => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        if(res.success) {
          showToast('Profile updated successfully!', false);
          $('#modalUsthadFullProfile').modal('hide');
          Object.assign(currentUserSession, res.usthad || {});
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

if (!html.includes('function openUsthadFullProfileModal')) {
  html = html.replace('function openStudentFullProfileModal()', usthadJS + '\n    function openStudentFullProfileModal()');
}

fs.writeFileSync('public/login.html', html);
console.log('Fixed Usthad profile UI and forms');
