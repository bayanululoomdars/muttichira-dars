const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldFuncStart = 'function loadUsthadDashboardData() {';
const nextFuncStart = 'function quickSendMark(admNo)';

const startIdx = html.indexOf(oldFuncStart);
const endIdx = html.indexOf(nextFuncStart);

if (startIdx !== -1 && endIdx !== -1) {
  const newFunc = `
function loadUsthadDashboardData() {
      if(!currentUserSession) return;
      
      // Update counts
      fetch('/api/portal/students').then(r=>r.json()).then(data => {
        if(data.success) {
          const active = data.students.filter(s => !s.isAlumni).length;
          const el = document.getElementById('dashTotalStudents');
          if(el) el.textContent = active;
          
          // Also populate students for Direct Message Modal
          const select = document.getElementById('dmTargetStudent');
          if(select) {
            let opts = '<option value="">Select Target Student...</option>';
            data.students.forEach(s => {
              if(!s.isAlumni) opts += \`<option value="\${s.admissionNo}">\${s.name} (\${s.admissionNo})</option>\`;
            });
            select.innerHTML = opts;
          }
        }
      }).catch(()=>{});

      // Update exams
      fetch('/api/portal/exams').then(r=>r.json()).then(data => {
        if(data.success && data.exams) {
          let pubHtml = '';
          let pendHtml = '';
          data.exams.forEach(e => {
            const isPub = e.status === 'Published';
            const item = \`<div class="p-2 mb-2 rounded" style="background:var(--bg-card-2); border-left:4px solid \${isPub ? 'var(--success)' : 'var(--danger)'};">
              <strong style="color:var(--text);">\${e.examName}</strong>
              <div class="small text-muted">\${e.term} • Batch: \${e.batchYear}</div>
            </div>\`;
            if(isPub) pubHtml += item;
            else pendHtml += item;
          });
          document.getElementById('usthadPublishedExamsList').innerHTML = pubHtml || '<div class="text-muted small">No published exams</div>';
          document.getElementById('usthadPendingExamsList').innerHTML = pendHtml || '<div class="text-muted small">No pending exams</div>';
          
          // Also populate select dropdown
          const select = document.getElementById('examSelectUsthad');
          if(select) {
            let opts = '<option value="">Select Exam...</option>';
            data.exams.forEach(e => { opts += \`<option value="\${e._id}">\${e.examName} (\${e.term})</option>\`; });
            select.innerHTML = opts;
          }
        }
      });
}
  `;
  
  html = html.substring(0, startIdx) + newFunc + '\n    ' + html.substring(endIdx);
  fs.writeFileSync('public/login.html', html);
  console.log('Successfully replaced loadUsthadDashboardData');
}
