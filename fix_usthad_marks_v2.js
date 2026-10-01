const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const startMarker = 'function renderExamMatrixTable() {';
const startIndex = html.indexOf(startMarker);
const endMarker = '// Counter Stats Loader';
let endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const oldCode = html.substring(startIndex, endIndex);

  const newCode = `function renderExamMatrixTable() {
  const container = document.getElementById('examMatrixTableBody'); // Wait, let's replace the whole table structure properly
  if (!currentExamRosterData) return;
  const { students, existingResults, exam, subjects } = currentExamRosterData;
  const className = safeGetValue('examBatchSelectUsthad');
  currentSubjectInputList = subjects || [];
  
  // Render Subject Badges Banner
  const banner = document.getElementById('examSubjectConfigBanner');
  const bannerTitle = document.getElementById('examBannerTitle');
  const bannerBadges = document.getElementById('examBannerBadges');

  if (subjects && subjects.length > 0) {
    bannerTitle.textContent = \`Configured Subjects for Batch \${className}:\`;
    let bHtml = '';
    subjects.forEach(s => {
      bHtml += \`<span class="badge badge-accent">\${s.subjectName} (Max: \${s.maxMarks})</span>\`;
    });
    bannerBadges.innerHTML = bHtml;
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }

  // Rewrite Table Header
  const headerRow = document.getElementById('examMatrixHeaderRow');
  headerRow.innerHTML = '<th>Adm No</th><th>Student Name</th><th>Status</th><th>Actions</th>';

  if (!students || students.length === 0) {
    container.innerHTML = \`<tr><td colspan="4" class="text-center text-muted py-4">No active students in this batch.</td></tr>\`;
    return;
  }
  
  let htmlStr = '';
  students.forEach((s) => {
    const existing = existingResults.find(r => r.admissionNo === s.admissionNo) || {};
    const hasResult = existing.totalMarksObtained !== undefined;
    const statusBadge = hasResult ? '<span class="badge badge-success px-2 py-1"><i class="fa fa-check-circle"></i> Published</span>' : '<span class="badge badge-warning px-2 py-1 text-dark"><i class="fa fa-clock-o"></i> Pending</span>';
    let actionBtns = '';
    
    if (hasResult) {
      actionBtns = \`<button class="btn btn-sm btn-info rounded-pill font-weight-bold" onclick="openSingleStudentMarkModal('\${s.admissionNo}', '\${s.name}')"><i class="fa fa-edit"></i> Edit</button> \` +
                   \`<button class="btn btn-sm btn-danger rounded-pill font-weight-bold ml-1" onclick="unpublishStudentMark('\${s.admissionNo}')"><i class="fa fa-times"></i> Unpublish</button>\`;
    } else {
      actionBtns = \`<button class="btn btn-sm btn-success rounded-pill font-weight-bold" onclick="openSingleStudentMarkModal('\${s.admissionNo}', '\${s.name}')"><i class="fa fa-upload"></i> Publish Marks</button>\`;
    }
    
    htmlStr += \`<tr>\\n\` +
      \`<td class="align-middle"><code style="font-weight:700; color:var(--accent); font-size:14px;">\${s.admissionNo}</code></td>\\n\` +
      \`<td class="align-middle"><strong style="color:var(--text); font-size:15px;">\${s.name}</strong></td>\\n\` +
      \`<td class="align-middle">\${statusBadge}</td>\\n\` +
      \`<td class="align-middle">\${actionBtns}</td>\\n\` +
    \`</tr>\`;
  });
  container.innerHTML = htmlStr;
}

let editingMarkStudentAdmNo = null;

function openSingleStudentMarkModal(admNo, name) {
  editingMarkStudentAdmNo = admNo;
  document.getElementById('singleMarkStudentName').textContent = name + " (" + admNo + ")";
  const existingResults = currentExamRosterData.existingResults || [];
  const existing = existingResults.find(r => r.admissionNo === admNo) || {};
  const existingSubMarks = existing.subjectMarks || {};
  let htmlStr = '';
  
  currentSubjectInputList.forEach((subj, idx) => {
    // Determine the prefill value
    let val = '';
    // Look at existingSubMarks - originally it was an object { "Subject1": 50 }
    if (existingSubMarks[subj.subjectName] !== undefined) {
      val = existingSubMarks[subj.subjectName];
    } else if (Array.isArray(existingSubMarks)) {
      const prefill = existingSubMarks.find(em => em.subjectName === subj.subjectName);
      if (prefill) val = prefill.marksObtained;
    }
    
    htmlStr += \`<div class="form-group mb-3">\\n\` +
      \`<label class="form-label font-weight-bold text-dark">\${subj.subjectName} <span class="text-muted">(Max: \${subj.maxMarks})</span></label>\\n\` +
      \`<input type="number" id="singleMarkInput_\${idx}" class="form-control" style="background:var(--bg-input); color:var(--text); font-weight:bold;" max="\${subj.maxMarks}" placeholder="Enter mark obtained" value="\${val}" required>\\n\` +
    \`</div>\`;
  });
  
  document.getElementById('singleMarkInputsContainer').innerHTML = htmlStr;
  
  // Make sure Bootstrap modal backdrop works
  $('#modalSingleStudentMark').modal('show');
}

function saveSingleStudentMark(e) {
  e.preventDefault();
  const examId = safeGetValue('examSelectUsthad');
  const className = safeGetValue('examBatchSelectUsthad');
  if (!examId || !className || !editingMarkStudentAdmNo) return;
  
  const marksData = [];
  const subMarksObj = {};
  let isComplete = true;
  
  currentSubjectInputList.forEach((subj, idx) => {
    const val = document.getElementById('singleMarkInput_' + idx).value;
    if (val === '') { isComplete = false; } else {
      subMarksObj[subj.subjectName] = Number(val);
    }
  });
  
  if (!isComplete) { showToast('Please fill all marks before publishing!', true); return; }
  
  const student = currentExamRosterData.students.find(s => s.admissionNo === editingMarkStudentAdmNo);
  
  marksData.push({
    admissionNo: editingMarkStudentAdmNo,
    studentName: student ? student.name : 'Student',
    subjectsConfig: currentSubjectInputList,
    subjectMarks: subMarksObj,
    attendancePresentDays: 100,
    attendanceTotalDays: 100,
    usthadRemarks: 'Published via single edit'
  });
  
  fetch('/api/portal/exam/save-marks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      examId,
      examName: currentExamRosterData.exam.examName,
      term: currentExamRosterData.exam.term,
      batchYear: className,
      marksData: marksData
    })
  }).then(r => r.json()).then(res => {
    if (res.success) {
      showToast('Student marks published/updated!', false);
      $('#modalSingleStudentMark').modal('hide');
      loadUsthadExamMatrix();
    } else { showToast(res.message, true); }
  });
}

function unpublishStudentMark(admNo) {
  if (!confirm('Are you sure you want to unpublish and delete this student\\'s marks?')) return;
  const examId = safeGetValue('examSelectUsthad');
  if (!examId) return;
  
  fetch('/api/portal/exam/delete-mark', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examId, admissionNo: admNo })
  }).then(r => r.json()).then(res => {
    if (res.success) {
      showToast('Marks unpublished.', false);
      loadUsthadExamMatrix();
    } else { showToast(res.message, true); }
  });
}

    `;
  html = html.replace(oldCode, newCode);
  fs.writeFileSync('public/login.html', html);
  console.log('Successfully injected Usthad Mark buttons.');
} else {
  console.log('Could not find boundaries.');
}
