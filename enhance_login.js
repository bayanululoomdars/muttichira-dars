const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const examFetch = "document.getElementById('usthadPendingExamsList').innerHTML = pendHtml || '<div class=\"text-muted small\">No pending exams</div>';";
if (html.includes(examFetch) && !html.includes('window.allExamsUsthadCache = data.exams;')) {
  html = html.replace(examFetch, examFetch + "\n          window.allExamsUsthadCache = data.exams;");
}

const selectFuncOld = "    function selectExamInMatrix(examId) {\n" +
"      const el = document.getElementById('examSelectUsthad');\n" +
"      if(el) {\n" +
"        el.value = examId;\n" +
"        el.scrollIntoView({ behavior: 'smooth', block: 'center' });\n" +
"        showToast('Exam selected. Please select a Target Batch to view/edit marks.', false);\n" +
"      }\n" +
"    }";
const selectFuncNew = "    function selectExamInMatrix(examId) {\n" +
"      const el = document.getElementById('examSelectUsthad');\n" +
"      if(el) {\n" +
"        el.value = examId;\n" +
"        onUsthadExamChange();\n" +
"        el.scrollIntoView({ behavior: 'smooth', block: 'center' });\n" +
"        showToast('Exam selected!', false);\n" +
"      }\n" +
"    }";
if(html.includes(selectFuncOld)) html = html.replace(selectFuncOld, selectFuncNew);

const onUsthadExamChangeOld = "function onUsthadExamChange() {\n  loadUsthadExamMatrix();\n}";
const onUsthadExamChangeNew = "function onUsthadExamChange() {\n" +
"  const examId = safeGetValue('examSelectUsthad');\n" +
"  const batchSelect = document.getElementById('examBatchSelectUsthad');\n" +
"  if (examId && window.allExamsUsthadCache) {\n" +
"    const exam = window.allExamsUsthadCache.find(e => e._id === examId);\n" +
"    if (exam && exam.classSubjects) {\n" +
"      const batches = Object.keys(exam.classSubjects);\n" +
"      let opts = '<option value=\"\">Select Target Batch</option>';\n" +
"      batches.forEach(b => {\n" +
"        opts += `<option value=\"${b}\">${b}</option>`;\n" +
"      });\n" +
"      batchSelect.innerHTML = opts;\n" +
"      if (batches.length === 1) {\n" +
"        batchSelect.value = batches[0];\n" +
"      }\n" +
"    }\n" +
"  }\n" +
"  loadUsthadExamMatrix();\n" +
"}";
if(html.includes(onUsthadExamChangeOld)) html = html.replace(onUsthadExamChangeOld, onUsthadExamChangeNew);

const studentRowOld = "    html += `<tr data-student-id=\"${s.admissionNo}\">\n" +
"      <td><code style=\"font-weight:700; color:var(--accent);\">${s.admissionNo}</code></td>\n" +
"      <td><strong style=\"color:var(--text);\">${s.name}</strong></td>`;";
const studentRowNew = "    const hasResult = existing.totalMarksObtained !== undefined;\n" +
"    const statusBadge = hasResult ? '<span class=\"badge badge-success\" style=\"font-size:10px;\">Entered</span>' : '<span class=\"badge badge-danger\" style=\"font-size:10px;\">Pending</span>';\n" +
"    html += `<tr data-student-id=\"${s.admissionNo}\">\n" +
"      <td><code style=\"font-weight:700; color:var(--accent);\">${s.admissionNo}</code></td>\n" +
"      <td>\n" +
"        <strong style=\"color:var(--text);\">${s.name}</strong><br>\n" +
"        ${statusBadge}\n" +
"      </td>`;";
if(html.includes(studentRowOld)) html = html.replace(studentRowOld, studentRowNew);

fs.writeFileSync('public/login.html', html);
console.log('Done login');
