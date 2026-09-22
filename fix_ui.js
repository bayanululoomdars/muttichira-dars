const fs = require('fs');

// 1. Fix admin.html photo upload
let adminHtml = fs.readFileSync('public/admin.html', 'utf-8');

adminHtml = adminHtml.replace(
  '<input type="url" id="adminStudentPhoto" class="form-control" placeholder="https://...">',
  '<input type="file" id="adminStudentPhoto" class="form-control" accept="image/*" name="photo">'
);

adminHtml = adminHtml.replace(
  '<input type="url" id="adminUsthadPhoto" class="form-control" placeholder="https://...">',
  '<input type="file" id="adminUsthadPhoto" class="form-control" accept="image/*" name="photo">'
);
// In case adminUsthadPhoto wasn't there, let's inject it if missing
if (!adminHtml.includes('adminUsthadPhoto')) {
    adminHtml = adminHtml.replace(
      '<div class="form-group">\n                    <label class="form-label">Place</label>\n                    <input type="text" id="adminUsthadPlace" class="form-control" placeholder="e.g. Muttichira">\n                  </div>',
      '<div class="form-group">\n                    <label class="form-label">Place</label>\n                    <input type="text" id="adminUsthadPlace" class="form-control" placeholder="e.g. Muttichira">\n                  </div>\n                  <div class="form-group">\n                    <label class="form-label">Photo Upload</label>\n                    <input type="file" id="adminUsthadPhoto" class="form-control" accept="image/*" name="photo">\n                  </div>'
    );
}

const studentSubmitOld = `const payload = {
      name: safeGetValue('adminStudentName'),
      phone: safeGetValue('adminStudentPhone'),
      admissionNo: safeGetValue('adminStudentAdmNo'),
      status: safeGetValue('adminStudentStatus'),
      className: safeGetValue('adminStudentClass'),
      batchYear: safeGetValue('adminStudentBatch'),
      place: safeGetValue('adminStudentPlace'),
      photoUrl: safeGetValue('adminStudentPhoto')
    };
    fetch('/api/portal/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })`;

const studentSubmitNew = `const formData = new FormData();
    formData.append('name', safeGetValue('adminStudentName'));
    formData.append('phone', safeGetValue('adminStudentPhone'));
    formData.append('admissionNo', safeGetValue('adminStudentAdmNo'));
    formData.append('status', safeGetValue('adminStudentStatus'));
    formData.append('className', safeGetValue('adminStudentClass'));
    formData.append('batchYear', safeGetValue('adminStudentBatch'));
    formData.append('place', safeGetValue('adminStudentPlace'));
    
    const photoInput = document.getElementById('adminStudentPhoto');
    if(photoInput && photoInput.files && photoInput.files[0]) {
      formData.append('photo', photoInput.files[0]);
    }

    fetch('/api/portal/student', {
      method: 'POST',
      body: formData
    })`;

adminHtml = adminHtml.replace(studentSubmitOld, studentSubmitNew);


const usthadSubmitOld = `const payload = {
      name: safeGetValue('adminUsthadName'),
      phone: safeGetValue('adminUsthadPhone'),
      usthadId: safeGetValue('adminUsthadId'),
      designation: safeGetValue('adminUsthadDesignation'),
      subject: safeGetValue('adminUsthadSubject'),
      place: safeGetValue('adminUsthadPlace'),
      photoUrl: safeGetValue('adminUsthadPhoto')
    };
    fetch('/api/portal/usthad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })`;

const usthadSubmitNew = `const formData = new FormData();
    formData.append('name', safeGetValue('adminUsthadName'));
    formData.append('phone', safeGetValue('adminUsthadPhone'));
    formData.append('usthadId', safeGetValue('adminUsthadId'));
    formData.append('designation', safeGetValue('adminUsthadDesignation'));
    formData.append('subject', safeGetValue('adminUsthadSubject'));
    formData.append('place', safeGetValue('adminUsthadPlace'));
    
    const photoInput = document.getElementById('adminUsthadPhoto');
    if(photoInput && photoInput.files && photoInput.files[0]) {
      formData.append('photo', photoInput.files[0]);
    }

    fetch('/api/portal/usthad', {
      method: 'POST',
      body: formData
    })`;

adminHtml = adminHtml.replace(usthadSubmitOld, usthadSubmitNew);

fs.writeFileSync('public/admin.html', adminHtml);


// 2. Fix login.html multi-subject results
let loginHtml = fs.readFileSync('public/login.html', 'utf-8');
const oldPostMarkHtml = `<div class="form-group mb-2">
                <label class="small font-weight-bold">Subject Name</label>
                <input type="text" id="postMarkSubject" class="form-control" required placeholder="e.g. Fiqh (Fathul Mueen)">
              </div>
              <div class="row g-2 mb-2">
                <div class="col-6">
                  <label class="small font-weight-bold">Marks Obtained</label>
                  <input type="text" id="postMarkObtained" class="form-control" required placeholder="95">
                </div>
                <div class="col-6">
                  <label class="small font-weight-bold">Total Marks</label>
                  <input type="text" id="postMarkTotal" class="form-control" required value="100">
                </div>
              </div>
              <div class="form-group mb-2">
                <label class="small font-weight-bold">Grade</label>
                <input type="text" id="postMarkGrade" class="form-control" placeholder="A+ / Mumtaz">
              </div>`;

const newPostMarkHtml = `<div class="form-group mb-2">
                <label class="small font-weight-bold">Subjects & Marks (Multi-subject)</label>
                <textarea id="postMarkSubject" class="form-control" required rows="4" placeholder="Enter subjects and marks here.\nExample:\nFiqh: 90/100 (A+)\nThafseer: 85/100 (A)"></textarea>
                <small class="text-muted">You can list as many subjects as you want above.</small>
              </div>`;

loginHtml = loginHtml.replace(oldPostMarkHtml, newPostMarkHtml);

const oldPostMarkJs = `marksData: {
            examName: document.getElementById('postMarkExamName').value,
            subjectName: document.getElementById('postMarkSubject').value,
            marksObtained: document.getElementById('postMarkObtained').value,
            totalMarks: document.getElementById('postMarkTotal').value,
            grade: document.getElementById('postMarkGrade').value,
            remarks: document.getElementById('postMarkRemarks').value
            }`;

const newPostMarkJs = `marksData: {
            examName: document.getElementById('postMarkExamName').value,
            subjectName: document.getElementById('postMarkSubject').value,
            remarks: document.getElementById('postMarkRemarks').value
            }`;

loginHtml = loginHtml.replace(oldPostMarkJs, newPostMarkJs);

fs.writeFileSync('public/login.html', loginHtml);

console.log('UI files patched successfully.');
