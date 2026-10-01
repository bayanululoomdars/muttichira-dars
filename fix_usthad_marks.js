const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const startMarker = 'function renderExamMatrixTable() {';
const startIndex = html.indexOf(startMarker);

// We need to find where renderExamMatrixTable ends. It probably ends right before function saveUsthadMarks() or something similar.
// Let's just find the end of the function manually or use a more robust regex.
// Looking at the code, saveUsthadMarks was the old save function. Let's find it.
const oldSaveFuncIdx = html.indexOf('function saveUsthadMarks() {');

if (startIndex !== -1 && oldSaveFuncIdx !== -1) {
  // We will replace everything from renderExamMatrixTable() to the end of saveUsthadMarks() 
  // Let's find where saveUsthadMarks() ends.
  let contentToReplace = html.substring(startIndex, html.indexOf('}', oldSaveFuncIdx) + 1);
  // Actually, saveUsthadMarks has multiple lines. Let's just replace from startIndex to the start of the next function.
  
  const nextFuncIdx = html.indexOf('// ---------------- USTHAD DIRECT MESSAGING ----------------');
  if (nextFuncIdx !== -1) {
    const oldCode = html.substring(startIndex, nextFuncIdx);
    
    const newCode = `function renderExamMatrixTable() {
  const container = document.getElementById('examMatrixContainer');
  if (!currentExamRosterData) {
    container.innerHTML = '<p class="text-muted">Select an exam and batch to load students.</p>';
    return;
  }
  const students = currentExamRosterData.students;
  const existingResults = currentExamRosterData.existingResults || [];
  currentSubjectInputList = currentExamRosterData.examConfig.classSubjects[safeGetValue('examBatchSelectUsthad')] || [];
  
  if (students.length === 0) {
    container.innerHTML = '<div class="alert alert-info">No active students in this batch.</div>';
    return;
  }
  
  let html = '<table class="table table-hover table-bordered mb-0" style="background:var(--bg-card); color:var(--text);">\\n' +
    '<thead style="background:var(--bg-card-2);">\\n' +
      '<tr>\\n' +
        '<th width="15%">Adm No</th>\\n' +
        '<th width="35%">Student Name</th>\\n' +
        '<th width="15%">Status</th>\\n' +
        '<th width="35%" class="text-right">Actions</th>\\n' +
      '</tr>\\n' +
    '</thead>\\n' +
    '<tbody>';
    
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
    
    html += \`<tr>\\n\` +
      \`<td class="align-middle"><code style="font-weight:700; color:var(--accent); font-size:14px;">\${s.admissionNo}</code></td>\\n\` +
      \`<td class="align-middle"><strong style="color:var(--text); font-size:15px;">\${s.name}</strong></td>\\n\` +
      \`<td class="align-middle">\${statusBadge}</td>\\n\` +
      \`<td class="align-middle text-right">\${actionBtns}</td>\\n\` +
    \`</tr>\`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

let editingMarkStudentAdmNo = null;

function openSingleStudentMarkModal(admNo, name) {
  editingMarkStudentAdmNo = admNo;
  document.getElementById('singleMarkStudentName').textContent = name + " (" + admNo + ")";
  const existingResults = currentExamRosterData.existingResults || [];
  const existing = existingResults.find(r => r.admissionNo === admNo) || {};
  const existingSubMarks = existing.subjectMarks || [];
  let html = '';
  
  currentSubjectInputList.forEach((subj, idx) => {
    const prefill = existingSubMarks.find(em => em.subjectName === subj.subjectName);
    const val = prefill ? prefill.marksObtained : '';
    html += \`<div class="form-group mb-3">\\n\` +
      \`<label class="form-label font-weight-bold text-dark">\${subj.subjectName} <span class="text-muted">(Max: \${subj.maxMarks})</span></label>\\n\` +
      \`<input type="number" id="singleMarkInput_\${idx}" class="form-control" style="background:var(--bg-input); color:var(--text); font-weight:bold;" max="\${subj.maxMarks}" placeholder="Enter mark obtained" value="\${val}" required>\\n\` +
    \`</div>\`;
  });
  
  document.getElementById('singleMarkInputsContainer').innerHTML = html;
  $('#modalSingleStudentMark').modal('show');
}

function saveSingleStudentMark(e) {
  e.preventDefault();
  const examId = safeGetValue('examSelectUsthad');
  const className = safeGetValue('examBatchSelectUsthad');
  if (!examId || !className || !editingMarkStudentAdmNo) return;
  
  const marksData = [];
  const subjMarks = [];
  let isComplete = true;
  
  currentSubjectInputList.forEach((subj, idx) => {
    const val = document.getElementById('singleMarkInput_' + idx).value;
    if (val === '') { isComplete = false; } else {
      subjMarks.push({
        subjectName: subj.subjectName,
        maxMarks: subj.maxMarks,
        marksObtained: Number(val)
      });
    }
  });
  
  if (!isComplete) { showToast('Please fill all marks before publishing!', true); return; }
  
  marksData.push({ admissionNo: editingMarkStudentAdmNo, subjectMarks: subjMarks });
  
  fetch('/api/portal/exam/save-marks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examId, className, marksData })
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
  }
}
