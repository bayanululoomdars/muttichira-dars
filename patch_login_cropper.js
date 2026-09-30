const fs = require('fs');

let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Add Cropper CSS/JS
if (!html.includes('cropper.min.css')) {
  html = html.replace('</head>', `
  <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
</head>`);
}

// 2. Add Cropper Modal globally
const cropperModal = `
<!-- Global Cropper Modal -->
<div class="modal fade" id="cropperModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content" style="background:var(--bg-card); color:var(--text); border-radius:12px; border:1px solid var(--border-soft);">
      <div class="modal-header border-0">
        <h5 class="modal-title font-weight-bold text-accent"><i class="fa fa-crop"></i> Crop Profile Photo</h5>
        <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body text-center">
        <div style="max-height: 400px; width: 100%; overflow: hidden; border-radius:8px;">
          <img id="cropperImage" style="max-width: 100%; display: block;">
        </div>
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-secondary rounded-pill" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-accent rounded-pill" id="btnCropSave">Upload & Save</button>
      </div>
    </div>
  </div>
</div>
`;
if (!html.includes('id="cropperModal"')) {
  html = html.replace('</body>', cropperModal + '\n</body>');
}

// 3. Rewrite Usthad Dashboard Content to have tabs
const oldUsthadDash = `<div id="usthadDashContent" style="display: none;">`;
const newUsthadDash = `<div id="usthadDashContent" style="display: none;">
  <!-- Usthad Tabs -->
  <ul class="nav nav-pills nav-fill mb-4 custom-nav-pills">
    <li class="nav-item">
      <a class="nav-link active font-weight-bold" data-toggle="tab" href="#tabUsthadHome">
        <i class="fa fa-home text-warning"></i> Dashboard
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link font-weight-bold" data-toggle="tab" href="#tabUsthadProfile">
        <i class="fa fa-user text-primary"></i> Edit Profile
      </a>
    </li>
  </ul>
  
  <div class="tab-content">
    <div class="tab-pane fade show active" id="tabUsthadHome">
`;

// Insert the new Tabs wrapper
if (!html.includes('tabUsthadHome')) {
  html = html.replace(oldUsthadDash, newUsthadDash);
  
  // Close the tabUsthadHome and add tabUsthadProfile
  // First, find the end of the Usthad Dashboard Content block.
  // It ends where <!-- ADMIN LOGIN --> starts.
  const oldUsthadDashEnd = `</div>

        </div>
      </div>
    </div>
  </div>
  
  <!-- ADMIN LOGIN -->`;
  
  const newUsthadDashEnd = `</div> <!-- End tabUsthadHome -->
      
      <!-- Usthad Profile Tab -->
      <div class="tab-pane fade" id="tabUsthadProfile">
        <div class="card mb-4 border-0 shadow-sm" style="background:var(--bg-card); border-radius:12px;">
          <div class="card-body">
            <h5 class="font-weight-bold text-accent mb-4"><i class="fa fa-user-circle"></i> Personal Details</h5>
            <div class="text-center mb-4">
              <img id="usthadProfilePicEdit" src="img/new_logo.png" style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:3px solid var(--accent); margin-bottom:15px; background:white;">
              <br>
              <input type="file" id="usthadPhotoInput" accept="image/*" style="display:none;" onchange="initCropper(event, 'usthad')">
              <button class="btn btn-sm btn-outline-warning rounded-pill font-weight-bold" onclick="document.getElementById('usthadPhotoInput').click()">
                <i class="fa fa-camera"></i> Change Photo
              </button>
            </div>
            <form onsubmit="updateUsthadProfileForm(event)">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="font-weight-bold text-muted small">Full Name</label>
                  <input type="text" id="editUsthadName" class="form-control" style="background:var(--bg-input); color:var(--text); border:none;" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="font-weight-bold text-muted small">Designation / Role</label>
                  <input type="text" id="editUsthadDesig" class="form-control" style="background:var(--bg-input); color:var(--text); border:none;" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="font-weight-bold text-muted small">Phone Number</label>
                  <input type="text" id="editUsthadPhone" class="form-control" style="background:var(--bg-input); color:var(--text); border:none;" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="font-weight-bold text-muted small">Password</label>
                  <input type="text" id="editUsthadPassword" class="form-control" style="background:var(--bg-input); color:var(--text); border:none;" required>
                </div>
                <div class="col-md-12 mb-3">
                  <label class="font-weight-bold text-muted small">Place</label>
                  <input type="text" id="editUsthadPlace" class="form-control" style="background:var(--bg-input); color:var(--text); border:none;" required>
                </div>
              </div>
              <button type="submit" class="btn btn-accent rounded-pill w-100 font-weight-bold mt-3">
                <i class="fa fa-save"></i> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      
    </div> <!-- End tab-content -->
  </div> <!-- End usthadDashContent -->
` + oldUsthadDashEnd.replace('</div>\n\n        </div>', '        </div>');

  html = html.replace(oldUsthadDashEnd, newUsthadDashEnd);
}

// 4. Update Student Profile Tab to include Cropper UI
const oldStudentPhoto = `<div class="form-group">
                      <label class="font-weight-bold text-muted small">Photo URL</label>
                      <input type="url" id="editStudentPhotoUrl" class="form-control" placeholder="https://..." style="background:var(--bg-input); color:var(--text); border:none;">
                    </div>`;
const newStudentPhoto = `<div class="text-center mb-4">
              <img id="studentProfilePicEdit" src="img/new_logo.png" style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:3px solid var(--accent); margin-bottom:15px; background:white;">
              <br>
              <input type="file" id="studentPhotoInput" accept="image/*" style="display:none;" onchange="initCropper(event, 'student')">
              <button type="button" class="btn btn-sm btn-outline-warning rounded-pill font-weight-bold" onclick="document.getElementById('studentPhotoInput').click()">
                <i class="fa fa-camera"></i> Change Photo
              </button>
            </div>`;
if (html.includes('editStudentPhotoUrl')) {
  // Replace the Photo URL text box with the Image Upload UI (put it at the top of the form)
  html = html.replace(oldStudentPhoto, '');
  html = html.replace('<form onsubmit="updateStudentProfileForm(event)">', '<form onsubmit="updateStudentProfileForm(event)">\n' + newStudentPhoto);
}

// 5. Add JS logic for Cropper and Usthad Profile
const jsLogic = `
let cropper = null;
let currentCropRole = null;
let currentCropFile = null;

function initCropper(e, role) {
  const file = e.target.files[0];
  if (!file) return;
  currentCropRole = role;
  currentCropFile = file;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = document.getElementById('cropperImage');
    img.src = event.target.result;
    
    if (cropper) cropper.destroy();
    
    $('#cropperModal').modal('show');
    
    // Initialize Cropper when modal is fully shown
    $('#cropperModal').on('shown.bs.modal', function () {
      cropper = new Cropper(img, {
        aspectRatio: 1,
        viewMode: 2,
        autoCropArea: 1,
      });
    }).on('hidden.bs.modal', function() {
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
    });
  };
  reader.readAsDataURL(file);
  e.target.value = ''; // Reset file input
}

document.addEventListener('DOMContentLoaded', () => {
  const btnCropSave = document.getElementById('btnCropSave');
  if (btnCropSave) {
    btnCropSave.addEventListener('click', () => {
      if (!cropper) return;
      const canvas = cropper.getCroppedCanvas({ width: 400, height: 400 });
      const base64Image = canvas.toDataURL('image/jpeg', 0.85);
      
      const payload = {
        userId: currentUser._id,
        role: currentCropRole,
        base64Image: base64Image
      };
      
      const btn = document.getElementById('btnCropSave');
      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Uploading...';
      btn.disabled = true;
      
      fetch('/api/portal/upload-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(r => r.json())
      .then(res => {
        btn.innerHTML = 'Upload & Save';
        btn.disabled = false;
        $('#cropperModal').modal('hide');
        if (res.success) {
          currentUser.photoUrl = res.photoUrl + '?v=' + Date.now();
          if (currentCropRole === 'student') {
            document.getElementById('studentProfilePicEdit').src = currentUser.photoUrl;
            document.getElementById('dashUserPhoto').src = currentUser.photoUrl;
          } else {
            document.getElementById('usthadProfilePicEdit').src = currentUser.photoUrl;
            document.getElementById('dashUserPhoto').src = currentUser.photoUrl;
          }
          showToast('Profile photo updated successfully!', false);
        } else {
          showToast('Failed to upload photo: ' + res.message, true);
        }
      })
      .catch(err => {
        btn.innerHTML = 'Upload & Save';
        btn.disabled = false;
        showToast('Error uploading photo', true);
      });
    });
  }
});

function updateUsthadProfileForm(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('editUsthadName').value,
    designation: document.getElementById('editUsthadDesig').value,
    phone: document.getElementById('editUsthadPhone').value,
    password: document.getElementById('editUsthadPassword').value,
    place: document.getElementById('editUsthadPlace').value
  };
  
  fetch('/api/portal/usthad/' + currentUser._id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) {
      showToast('Profile updated successfully!', false);
      Object.assign(currentUser, payload);
      document.getElementById('dashUserName').innerText = payload.name;
    } else {
      showToast(res.message || 'Error updating profile', true);
    }
  });
}
`;

if (!html.includes('initCropper(e, role)')) {
  html = html.replace('</script>\n</body>', jsLogic + '\n</script>\n</body>');
}

// Populate Usthad profile form on login
const populateLogic = `
  if (user.role === 'usthad') {
    safeSetVal('editUsthadName', user.name);
    safeSetVal('editUsthadDesig', user.designation);
    safeSetVal('editUsthadPhone', user.phone);
    safeSetVal('editUsthadPassword', user.password);
    safeSetVal('editUsthadPlace', user.place);
    if (user.photoUrl) document.getElementById('usthadProfilePicEdit').src = user.photoUrl;
  }
`;
if (!html.includes('editUsthadName')) {
  html = html.replace("if (user.role === 'student' || user.role === 'alumni') {", populateLogic + "\n  if (user.role === 'student' || user.role === 'alumni') {");
}

fs.writeFileSync('public/login.html', html);
console.log('Patched login.html with Cropper and Usthad Edit Profile');
