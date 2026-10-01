const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldRender = /function renderExamMatrixTable\(\) \{[\s\S]*?\} \/\/ end renderExamMatrixTable/g;
// I didn't append `// end renderExamMatrixTable`. So I'll find it via substring.

const startIdx = html.indexOf('function renderExamMatrixTable() {');
const endIdx = html.indexOf('function submitExamMarksUsthad() {');

if (startIdx !== -1 && endIdx !== -1) {
  const newRender = `
function renderExamMatrixTable() {
  if (!currentExamRosterData) return;

  const { exam, subjects, students, existingResults } = currentExamRosterData;
  const className = safeGetValue('examBatchSelectUsthad');

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

  // Render Matrix Header
  const headerRow = document.getElementById('examMatrixHeaderRow');
  let headerHtml = '<th>Adm No</th><th>Student Name</th>';
  subjects.forEach(s => {
    headerHtml += \`<th>\${s.subjectName} <small>(\${s.maxMarks})</small></th>\`;
  });
  headerHtml += '<th>Attendance (Present/Total)</th><th>Total Score</th><th>%</th><th>Grade</th><th>Batch Rank</th><th>Action</th>';
  headerRow.innerHTML = headerHtml;

  // Render Student Rows
  const tbody = document.getElementById('examMatrixTableBody');
  if (!students || students.length === 0) {
    tbody.innerHTML = \`<tr><td colspan="\${subjects.length + 8}" class="text-center text-muted py-4">No students enrolled in Batch \${className}.</td></tr>\`;
    return;
  }

  let html = '';
  students.forEach((s, idx) => {
    const existing = existingResults.find(r => r.admissionNo === s.admissionNo) || {};
    const existingSubMarks = existing.subjectMarks || [];
    
    html += \`<tr data-student-id="\${s.admissionNo}">
      <td><code style="font-weight:700; color:var(--accent);">\${s.admissionNo}</code></td>
      <td><strong style="color:var(--text);">\${s.name}</strong></td>\`;

    // Input for each subject
    subjects.forEach(sub => {
      const exSub = existingSubMarks.find(m => m.subjectName === sub.subjectName) || {};
      const score = exSub.marksObtained !== undefined ? exSub.marksObtained : '';
      html += \`<td>
        <input type="number" class="form-control form-control-sm matrix-score-input" data-student="\${s.admissionNo}" data-subject="\${sub.subjectName}" data-max="\${sub.maxMarks}" value="\${score}" style="width:75px; background:var(--bg-input); color:var(--text); font-weight:700;" min="0" max="\${sub.maxMarks}">
      </td>\`;
    });

    // Attendance inputs
    const presDays = existing.attendancePresentDays !== undefined ? existing.attendancePresentDays : 100;
    const totDays = existing.attendanceTotalDays !== undefined ? existing.attendanceTotalDays : 100;

    html += \`<td>
      <div style="display:flex; gap:4px; align-items:center;">
        <input type="number" class="form-control form-control-sm matrix-att-pres" data-student="\${s.admissionNo}" value="\${presDays}" style="width:60px; background:var(--bg-input); color:var(--text);" title="Present Days"> /
        <input type="number" class="form-control form-control-sm matrix-att-tot" data-student="\${s.admissionNo}" value="\${totDays}" style="width:60px; background:var(--bg-input); color:var(--text);" title="Total Days">
      </div>
    </td>
    <td><strong id="matrixTotal_\${s.admissionNo}" style="color:var(--accent);">\${existing.totalMarksObtained || 0} / \${existing.totalMaxMarks || 100}</strong></td>
    <td><span id="matrixPct_\${s.admissionNo}">\${existing.percentage || 0}%</span></td>
    <td><span class="badge badge-info" id="matrixGrade_\${s.admissionNo}">\${existing.grade || '—'}</span></td>
    <td><span class="badge badge-accent" id="matrixRank_\${s.admissionNo}">\${existing.rank || '—'}</span></td>
    <td>
      <button class="btn btn-outline-danger btn-sm font-weight-bold" onclick="deleteExamMarkUsthad('\${s.admissionNo}')" title="Delete Mark">
        <i class="fa fa-trash"></i>
      </button>
    </td>
    </tr>\`;
  });

  tbody.innerHTML = html;
}
`;
  html = html.substring(0, startIdx) + newRender + '\n' + html.substring(endIdx);
  
  // Add deleteExamMarkUsthad function
  if (!html.includes('function deleteExamMarkUsthad')) {
    const delFunc = `
function deleteExamMarkUsthad(admissionNo) {
  const examId = safeGetValue('examSelectUsthad');
  if (!examId) return;
  if (!confirm('Are you sure you want to completely delete the mark record for this student?')) return;
  
  fetch('/api/portal/exam/delete-mark', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examId, admissionNo })
  })
  .then(r => r.json())
  .then(res => {
    if(res.success) {
      showToast('Mark deleted successfully', false);
      loadUsthadExamMatrix(); // refresh
    } else {
      showToast('Failed to delete: ' + res.message, true);
    }
  });
}
`;
    html = html.replace('function submitExamMarksUsthad() {', delFunc + '\nfunction submitExamMarksUsthad() {');
  }

  fs.writeFileSync('public/login.html', html);
  console.log('Matrix rendering updated with delete button');
} else {
  console.log('Could not find render boundaries');
}
