const fs = require('fs');

let html = fs.readFileSync('public/admin.html', 'utf8');

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
<div class="unified-modal" id="cropperModal" style="z-index: 10005;">
  <div class="unified-modal-content" style="max-width: 500px; text-align:center;">
    <div class="unified-modal-header">
      <h3 style="color:var(--accent);"><i class="fa fa-crop"></i> Crop Profile Photo</h3>
      <button class="unified-modal-close" onclick="closeCropperModal()">&times;</button>
    </div>
    <div style="max-height: 400px; width: 100%; overflow: hidden; border-radius:8px; margin-bottom: 20px;">
      <img id="cropperImage" style="max-width: 100%; display: block;">
    </div>
    <div style="display:flex; justify-content:flex-end; gap:10px;">
      <button class="btn btn-secondary" onclick="closeCropperModal()">Cancel</button>
      <button class="btn btn-accent" id="btnCropSaveAdmin"><i class="fa fa-upload"></i> Upload & Save</button>
    </div>
  </div>
</div>
`;
if (!html.includes('id="cropperModal"')) {
  html = html.replace('</body>', cropperModal + '\n</body>');
}

// 3. Replace Photo Input in Student and Usthad Form
const newPhotoInputHTML = `
  <label class="form-label">Profile Photo</label>
  <div style="display:flex; align-items:center; gap:10px;">
    <img id="adminPreviewPhoto" src="img/new_logo.png" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--accent); background:white;">
    <input type="hidden" id="TARGET_PHOTO_ID">
    <input type="file" id="TARGET_FILE_ID" accept="image/*" style="display:none;" onchange="initAdminCropper(event)">
    <button type="button" class="btn btn-sm btn-outline-warning" onclick="document.getElementById('TARGET_FILE_ID').click()">Upload Photo</button>
  </div>
`;

if (html.includes('id="adminStudentPhoto"')) {
  html = html.replace(
    /<div class="form-group">\s*<label class="form-label">Photo URL<\/label>\s*<input type="url" id="adminStudentPhoto"[^>]*>\s*<\/div>/,
    '<div class="form-group">' + newPhotoInputHTML.replace('TARGET_PHOTO_ID', 'adminStudentPhoto').replace('TARGET_FILE_ID', 'fileStudentPhoto').replace('adminPreviewPhoto', 'previewStudentPhoto') + '</div>'
  );
}

if (html.includes('id="adminUsthadPhoto"')) {
  html = html.replace(
    /<div class="form-group">\s*<label class="form-label">Photo URL<\/label>\s*<input type="url" id="adminUsthadPhoto"[^>]*>\s*<\/div>/,
    '<div class="form-group">' + newPhotoInputHTML.replace('TARGET_PHOTO_ID', 'adminUsthadPhoto').replace('TARGET_FILE_ID', 'fileUsthadPhoto').replace('adminPreviewPhoto', 'previewUsthadPhoto') + '</div>'
  );
}

// 4. Update populate logic in editUserAdmin
if (!html.includes("document.getElementById('previewStudentPhoto').src = user.photoUrl")) {
  html = html.replace("safeSetVal('adminStudentBatchNo', user.batchNumber || user.batchYear);", "safeSetVal('adminStudentBatchNo', user.batchNumber || user.batchYear);\n    if(user.photoUrl) document.getElementById('previewStudentPhoto').src = user.photoUrl;");
  html = html.replace("safeSetVal('adminUsthadStatus', user.status || 'Active');", "safeSetVal('adminUsthadStatus', user.status || 'Active');\n    if(user.photoUrl) document.getElementById('previewUsthadPhoto').src = user.photoUrl;");
  
  html = html.replace("document.getElementById('formAddStudentAdmin').reset();", "document.getElementById('formAddStudentAdmin').reset();\n  document.getElementById('previewStudentPhoto').src = 'img/new_logo.png';");
  html = html.replace("document.getElementById('formAddUsthadAdmin').reset();", "document.getElementById('formAddUsthadAdmin').reset();\n  document.getElementById('previewUsthadPhoto').src = 'img/new_logo.png';");
}

// 5. Add Admin Cropper JS
const jsLogic = `
let adminCropper = null;
let currentAdminFileInput = null;

function initAdminCropper(e) {
  const file = e.target.files[0];
  if (!file) return;
  currentAdminFileInput = e.target.id;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = document.getElementById('cropperImage');
    img.src = event.target.result;
    
    if (adminCropper) adminCropper.destroy();
    document.getElementById('cropperModal').classList.add('show');
    
    setTimeout(() => {
      adminCropper = new Cropper(img, {
        aspectRatio: 1,
        viewMode: 2,
        autoCropArea: 1,
      });
    }, 100);
  };
  reader.readAsDataURL(file);
  e.target.value = ''; 
}

function closeCropperModal() {
  document.getElementById('cropperModal').classList.remove('show');
  if (adminCropper) {
    adminCropper.destroy();
    adminCropper = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnCropSaveAdmin = document.getElementById('btnCropSaveAdmin');
  if (btnCropSaveAdmin) {
    btnCropSaveAdmin.addEventListener('click', () => {
      if (!adminCropper) return;
      
      // If we are adding a NEW user, editingUserId is null.
      // We can't upload without an ID, so we will generate a temporary ID or base64 data url.
      // Actually, since we need to save the photo locally, if it's a new user, we can just save the base64 string directly in the hidden input, and let the backend handle the upload during POST!
      
      const canvas = adminCropper.getCroppedCanvas({ width: 400, height: 400 });
      const base64Image = canvas.toDataURL('image/jpeg', 0.85);
      
      if (editingUserId) {
        // Upload immediately
        const payload = {
          userId: editingUserId,
          role: currentAdminFileInput.includes('Student') ? 'student' : 'usthad',
          base64Image: base64Image
        };
        
        btnCropSaveAdmin.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Uploading...';
        btnCropSaveAdmin.disabled = true;
        
        fetch('/api/portal/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(res => {
          btnCropSaveAdmin.innerHTML = '<i class="fa fa-upload"></i> Upload & Save';
          btnCropSaveAdmin.disabled = false;
          closeCropperModal();
          if (res.success) {
            const previewId = currentAdminFileInput.includes('Student') ? 'previewStudentPhoto' : 'previewUsthadPhoto';
            const inputId = currentAdminFileInput.includes('Student') ? 'adminStudentPhoto' : 'adminUsthadPhoto';
            document.getElementById(previewId).src = res.photoUrl + '?v=' + Date.now();
            document.getElementById(inputId).value = res.photoUrl;
            showToast('Photo uploaded successfully', false);
            loadPortalUsersAdmin(); // refresh table to show new image
          } else {
            showToast('Upload failed: ' + res.message, true);
          }
        });
      } else {
        // It's a NEW user. We don't have an ID yet.
        // We will just store the base64 in the hidden input.
        const previewId = currentAdminFileInput.includes('Student') ? 'previewStudentPhoto' : 'previewUsthadPhoto';
        const inputId = currentAdminFileInput.includes('Student') ? 'adminStudentPhoto' : 'adminUsthadPhoto';
        document.getElementById(previewId).src = base64Image;
        document.getElementById(inputId).value = base64Image; // We will send base64 to backend
        closeCropperModal();
      }
    });
  }
});
`;

if (!html.includes('initAdminCropper(e)')) {
  html = html.replace('</script>\n</body>', jsLogic + '\n</script>\n</body>');
}

fs.writeFileSync('public/admin.html', html);
console.log('Patched admin.html with Cropper');
