const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const targetStr = "const item = `<div class=\"p-2 mb-2 rounded\" style=\"background:var(--bg-card-2); border-left:4px solid ${isPub ? 'var(--success)' : 'var(--danger)'};\">";
const replacer = "const item = `<div class=\"p-2 mb-2 rounded\" style=\"background:var(--bg-card-2); border-left:4px solid ${isPub ? 'var(--success)' : 'var(--danger)'}; cursor:pointer;\" onclick=\"selectExamInMatrix('${e._id}')\" title=\"Click to manage marks\">";

if(html.includes(targetStr)) {
  html = html.replace(targetStr, replacer);
}

const jsFunc = `
    function selectExamInMatrix(examId) {
      const el = document.getElementById('examSelectUsthad');
      if(el) {
        el.value = examId;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Exam selected. Please select a Target Batch to view/edit marks.', false);
      }
    }
`;

if(!html.includes('function selectExamInMatrix')) {
  html = html.replace('function renderExamMatrixTable() {', jsFunc + '\n    function renderExamMatrixTable() {');
}

fs.writeFileSync('public/login.html', html);
console.log('Made dashboard exams clickable');
