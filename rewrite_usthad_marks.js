const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const renderExamMatrixTableRegex = /function renderExamMatrixTable\(\) \{[\s\S]*?\/\/\s*-+\s*USTHAD DIRECT MESSAGING/m;

const newMatrixJS = "function renderExamMatrixTable() {\n" +
"  const container = document.getElementById('examMatrixContainer');\n" +
"  if (!container) return;\n" +
"  if (!currentExamRosterData || !currentExamRosterData.students) {\n" +
"    container.innerHTML = '<div class=\"alert alert-info\">No students found in this batch.</div>';\n" +
"    return;\n" +
"  }\n" +
"  const students = currentExamRosterData.students;\n" +
"  const existingResults = currentExamRosterData.existingResults || [];\n" +
"  currentSubjectInputList = currentExamRosterData.examConfig.classSubjects[safeGetValue('examBatchSelectUsthad')] || [];\n" +
"  if (students.length === 0) {\n" +
"    container.innerHTML = '<div class=\"alert alert-info\">No active students in this batch.</div>';\n" +
"    return;\n" +
"  }\n" +
"  let html = '<table class=\"table table-hover table-bordered mb-0\" style=\"background:var(--bg-card); color:var(--text);\">\\n' +\n" +
"    '<thead style=\"background:var(--bg-card-2);\">\\n' +\n" +
"      '<tr>\\n' +\n" +
"        '<th width=\"15%\">Adm No</th>\\n' +\n" +
"        '<th width=\"35%\">Student Name</th>\\n' +\n" +
"        '<th width=\"15%\">Status</th>\\n' +\n" +
"        '<th width=\"35%\" class=\"text-right\">Actions</th>\\n' +\n" +
"      '</tr>\\n' +\n" +
"    '</thead>\\n' +\n" +
"    '<tbody>';\n" +
"  students.forEach((s) => {\n" +
"    const existing = existingResults.find(r => r.admissionNo === s.admissionNo) || {};\n" +
"    const hasResult = existing.totalMarksObtained !== undefined;\n" +
"    const statusBadge = hasResult ? '<span class=\"badge badge-success px-2 py-1\"><i class=\"fa fa-check-circle\"></i> Published</span>' : '<span class=\"badge badge-warning px-2 py-1 text-dark\"><i class=\"fa fa-clock-o\"></i> Pending</span>';\n" +
"    let actionBtns = '';\n" +
"    if (hasResult) {\n" +
"      actionBtns = `<button class=\"btn btn-sm btn-info rounded-pill font-weight-bold\" onclick=\"openSingleStudentMarkModal('${s.admissionNo}', '${s.name}')\"><i class=\"fa fa-edit\"></i> Edit</button> ` +\n" +
"                   `<button class=\"btn btn-sm btn-danger rounded-pill font-weight-bold ml-1\" onclick=\"unpublishStudentMark('${s.admissionNo}')\"><i class=\"fa fa-times\"></i> Unpublish</button>`;\n" +
"    } else {\n" +
"      actionBtns = `<button class=\"btn btn-sm btn-success rounded-pill font-weight-bold\" onclick=\"openSingleStudentMarkModal('${s.admissionNo}', '${s.name}')\"><i class=\"fa fa-upload\"></i> Publish Marks</button>`;\n" +
"    }\n" +
"    html += `<tr>\\n` +\n" +
"      `<td class=\"align-middle\"><code style=\"font-weight:700; color:var(--accent); font-size:14px;\">${s.admissionNo}</code></td>\\n` +\n" +
"      `<td class=\"align-middle\"><strong style=\"color:var(--text); font-size:15px;\">${s.name}</strong></td>\\n` +\n" +
"      `<td class=\"align-middle\">${statusBadge}</td>\\n` +\n" +
"      `<td class=\"align-middle text-right\">${actionBtns}</td>\\n` +\n" +
"    `</tr>`;\n" +
"  });\n" +
"  html += '</tbody></table>';\n" +
"  container.innerHTML = html;\n" +
"}\n" +
"let editingMarkStudentAdmNo = null;\n" +
"function openSingleStudentMarkModal(admNo, name) {\n" +
"  editingMarkStudentAdmNo = admNo;\n" +
"  document.getElementById('singleMarkStudentName').textContent = name + \" (\" + admNo + \")\";\n" +
"  const existingResults = currentExamRosterData.existingResults || [];\n" +
"  const existing = existingResults.find(r => r.admissionNo === admNo) || {};\n" +
"  const existingSubMarks = existing.subjectMarks || [];\n" +
"  let html = '';\n" +
"  currentSubjectInputList.forEach((subj, idx) => {\n" +
"    const prefill = existingSubMarks.find(em => em.subjectName === subj.subjectName);\n" +
"    const val = prefill ? prefill.marksObtained : '';\n" +
"    html += `<div class=\"form-group mb-3\">\\n` +\n" +
"      `<label class=\"form-label font-weight-bold text-dark\">${subj.subjectName} <span class=\"text-muted\">(Max: ${subj.maxMarks})</span></label>\\n` +\n" +
"      `<input type=\"number\" id=\"singleMarkInput_${idx}\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text); font-weight:bold;\" max=\"${subj.maxMarks}\" placeholder=\"Enter mark obtained\" value=\"${val}\" required>\\n` +\n" +
"    `</div>`;\n" +
"  });\n" +
"  document.getElementById('singleMarkInputsContainer').innerHTML = html;\n" +
"  $('#modalSingleStudentMark').modal('show');\n" +
"}\n" +
"function saveSingleStudentMark(e) {\n" +
"  e.preventDefault();\n" +
"  const examId = safeGetValue('examSelectUsthad');\n" +
"  const className = safeGetValue('examBatchSelectUsthad');\n" +
"  if (!examId || !className || !editingMarkStudentAdmNo) return;\n" +
"  const marksData = [];\n" +
"  const subjMarks = [];\n" +
"  let isComplete = true;\n" +
"  currentSubjectInputList.forEach((subj, idx) => {\n" +
"    const val = document.getElementById('singleMarkInput_' + idx).value;\n" +
"    if (val === '') { isComplete = false; } else {\n" +
"      subjMarks.push({\n" +
"        subjectName: subj.subjectName,\n" +
"        maxMarks: subj.maxMarks,\n" +
"        marksObtained: Number(val)\n" +
"      });\n" +
"    }\n" +
"  });\n" +
"  if (!isComplete) { showToast('Please fill all marks before publishing!', true); return; }\n" +
"  marksData.push({ admissionNo: editingMarkStudentAdmNo, subjectMarks: subjMarks });\n" +
"  fetch('/api/portal/exam/save-marks', {\n" +
"    method: 'POST',\n" +
"    headers: { 'Content-Type': 'application/json' },\n" +
"    body: JSON.stringify({ examId, className, marksData })\n" +
"  }).then(r => r.json()).then(res => {\n" +
"    if (res.success) {\n" +
"      showToast('Student marks published/updated!', false);\n" +
"      $('#modalSingleStudentMark').modal('hide');\n" +
"      loadUsthadExamMatrix();\n" +
"    } else { showToast(res.message, true); }\n" +
"  });\n" +
"}\n" +
"function unpublishStudentMark(admNo) {\n" +
"  if (!confirm('Are you sure you want to unpublish and delete this student\\'s marks?')) return;\n" +
"  const examId = safeGetValue('examSelectUsthad');\n" +
"  if (!examId) return;\n" +
"  fetch('/api/portal/exam/delete-mark', {\n" +
"    method: 'DELETE',\n" +
"    headers: { 'Content-Type': 'application/json' },\n" +
"    body: JSON.stringify({ examId, admissionNo: admNo })\n" +
"  }).then(r => r.json()).then(res => {\n" +
"    if (res.success) {\n" +
"      showToast('Marks unpublished.', false);\n" +
"      loadUsthadExamMatrix();\n" +
"    } else { showToast(res.message, true); }\n" +
"  });\n" +
"}\n" +
"// ---------------- USTHAD DIRECT MESSAGING ----------------";

html = html.replace(renderExamMatrixTableRegex, newMatrixJS);

const modalHTML = "<!-- SINGLE STUDENT MARK ENTRY MODAL -->\n" +
"  <div class=\"modal fade\" id=\"modalSingleStudentMark\" tabindex=\"-1\">\n" +
"    <div class=\"modal-dialog modal-dialog-centered\">\n" +
"      <div class=\"modal-content\" style=\"background:var(--bg-card); color:var(--text); border:1px solid var(--border-soft); border-radius:16px;\">\n" +
"        <div class=\"modal-header border-bottom-0\">\n" +
"          <h5 class=\"modal-title font-weight-bold text-success\"><i class=\"fa fa-graduation-cap\"></i> Enter/Edit Marks</h5>\n" +
"          <button type=\"button\" class=\"close text-white\" data-dismiss=\"modal\">&times;</button>\n" +
"        </div>\n" +
"        <form onsubmit=\"saveSingleStudentMark(event)\">\n" +
"          <div class=\"modal-body\">\n" +
"            <h6 id=\"singleMarkStudentName\" class=\"text-warning font-weight-bold mb-4 border-bottom pb-2\"></h6>\n" +
"            <div id=\"singleMarkInputsContainer\"></div>\n" +
"          </div>\n" +
"          <div class=\"modal-footer border-top-0\">\n" +
"            <button type=\"button\" class=\"btn btn-secondary rounded-pill font-weight-bold\" data-dismiss=\"modal\">Cancel</button>\n" +
"            <button type=\"submit\" class=\"btn btn-success rounded-pill font-weight-bold px-4\">Publish/Save Marks</button>\n" +
"          </div>\n" +
"        </form>\n" +
"      </div>\n" +
"    </div>\n" +
"  </div>\n";

if (!html.includes('id="modalSingleStudentMark"')) {
  html = html.replace('<!-- MODALS -->', '<!-- MODALS -->\n' + modalHTML);
}

const matrixFooterRegex = /<div class="mt-4 text-right">[\s\S]*?<\/button>\s*<\/div>/;
html = html.replace(matrixFooterRegex, '');

fs.writeFileSync('public/login.html', html);
console.log('Usthad Mark Entry Modernized!');
