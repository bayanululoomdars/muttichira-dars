const fs = require('fs');
let adminHtml = fs.readFileSync('public/admin.html', 'utf8');

const startIdx = adminHtml.indexOf('<!-- Exam Selection & Filter Controls -->');
const endIdx = adminHtml.indexOf('<!-- Create Exam Modal -->');
if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find boundaries in admin.html');
    process.exit(1);
}

let matrixHtml = adminHtml.substring(startIdx, endIdx);
matrixHtml = matrixHtml.replace(/Select Target Class \*/g, 'Select Target Batch Number *');
matrixHtml = matrixHtml.replace(/examClassSelectAdmin/g, 'examBatchSelectUsthad');
matrixHtml = matrixHtml.replace(/examSelectAdmin/g, 'examSelectUsthad');
matrixHtml = matrixHtml.replace(/loadExamClassRosterMatrix/g, 'loadUsthadExamMatrix');
matrixHtml = matrixHtml.replace(/onExamOrClassChange/g, 'onUsthadExamChange');
matrixHtml = matrixHtml.replace(/saveExamClassMarks/g, 'saveExamMarksUsthad');
matrixHtml = matrixHtml.replace(/<option value="Dars 3rd Year">Dars 3rd Year<\/option>\s*<option value="Dars 2nd Year">Dars 2nd Year<\/option>\s*<option value="Dars 1st Year">Dars 1st Year<\/option>\s*<option value="Dars Senior">Dars Senior<\/option>\s*<option value="Dars Junior">Dars Junior<\/option>\s*<option value="Dars Sub Junior">Dars Sub Junior<\/option>/g, 
  `<option value="1">Batch 1</option><option value="2">Batch 2</option><option value="3">Batch 3</option><option value="4">Batch 4</option><option value="5">Batch 5</option><option value="6">Batch 6</option>`);
  
// Also remove the wrapper </div></div> if they were captured before Create Exam Modal
const lastDivs = matrixHtml.lastIndexOf('</div>');
if(lastDivs !== -1) {
  // Let's just trust it. We might need to trim the end
}

adminHtml = adminHtml.substring(0, startIdx) + '\n        </div>\n\n        ' + adminHtml.substring(endIdx);
fs.writeFileSync('public/admin.html', adminHtml);

let loginHtml = fs.readFileSync('public/login.html', 'utf8');
const loginInjectTarget = '<!-- Student Roster Overview -->';
loginHtml = loginHtml.replace(loginInjectTarget, `
            <div style="background:var(--bg-card); border:1px solid var(--border-soft); border-radius:12px; padding:16px; margin-bottom:24px;">
              <h5 class="font-weight-bold text-dark mb-3"><i class="fa fa-trophy"></i> Exam Mark Entry Panel</h5>
              ` + matrixHtml + `
            </div>
            ` + loginInjectTarget);

// Remove the old simple modal (modalPostMark)
loginHtml = loginHtml.replace(/<!-- Modal 3: Usthad Post Exam Mark \/ Result -->[\s\S]*?<!-- Modal 4: Usthad Post Announcement -->/g, '<!-- Modal 4: Usthad Post Announcement -->');
loginHtml = loginHtml.replace(/<button class="btn btn-action-primary" onclick="openPostMarkModal\(\)">[\s\S]*?<\/button>/g, '');

fs.writeFileSync('public/login.html', loginHtml);
console.log('Moved Matrix HTML from Admin to Login successfully');
