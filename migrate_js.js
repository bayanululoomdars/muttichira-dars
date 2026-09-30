const fs = require('fs');

let adminHtml = fs.readFileSync('public/admin.html', 'utf8');

// Extract the 3 functions
const f1Start = adminHtml.indexOf('function loadExamClassRosterMatrix()');
const f1End = adminHtml.indexOf('function renderExamMatrixTable()');
let f1 = adminHtml.substring(f1Start, f1End);

const f2Start = f1End;
const f2End = adminHtml.indexOf('function submitExamClassMarksMatrix()');
let f2 = adminHtml.substring(f2Start, f2End);

const f3Start = f2End;
const f3End = adminHtml.indexOf('</script>', f3Start);
let f3 = adminHtml.substring(f3Start, f3End);

// Combine and replace IDs for Usthad logic
let usthadJS = `
// ---------------- USTHAD MATRIX LOGIC ----------------
let currentExamRosterData = null;

function loadExamsUsthad() {
  fetch('/api/portal/exams').then(r=>r.json()).then(data => {
    if(data.success && data.exams) {
      const select = document.getElementById('examSelectUsthad');
      if(!select) return;
      let html = '<option value="">Select Exam...</option>';
      data.exams.forEach(e => { html += \`<option value="\${e._id}">\${e.examName} (\${e.term} \${e.batchYear})\</option>\`; });
      select.innerHTML = html;
    }
  });
}

function onUsthadExamChange() {
  loadUsthadExamMatrix();
}

` + f1 + f2 + f3;

usthadJS = usthadJS.replace(/loadExamClassRosterMatrix/g, 'loadUsthadExamMatrix');
usthadJS = usthadJS.replace(/examSelectAdmin/g, 'examSelectUsthad');
usthadJS = usthadJS.replace(/examClassSelectAdmin/g, 'examBatchSelectUsthad');
usthadJS = usthadJS.replace(/submitExamClassMarksMatrix/g, 'submitExamMarksUsthad');
usthadJS = usthadJS.replace(/showToast/g, 'showAlert');
usthadJS = usthadJS.replace(/!res\.success/g, 'res.success ? "success" : "danger"');
usthadJS = usthadJS.replace(/true/g, '"warning"');

// We must also hook `loadExamsUsthad()` into `renderDashboard()` in `login.html` when role is 'usthad'
let loginHtml = fs.readFileSync('public/login.html', 'utf8');
const scriptInject = '    // Counter Stats Loader';
loginHtml = loginHtml.replace(scriptInject, usthadJS + '\n' + scriptInject);
loginHtml = loginHtml.replace('loadUsthadDashboardData();', 'loadUsthadDashboardData();\n        loadExamsUsthad();');

fs.writeFileSync('public/login.html', loginHtml);

// Finally remove those 3 functions from admin.html
adminHtml = adminHtml.substring(0, f1Start) + adminHtml.substring(f3End);
fs.writeFileSync('public/admin.html', adminHtml);

console.log('Successfully migrated JS matrix logic');
