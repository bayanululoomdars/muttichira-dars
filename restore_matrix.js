const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const matrixHTML = `
  <!-- MARK ENTRY MATRIX (Restored) -->
  <div class="row mt-4">
    <div class="col-12">
      <div class="card shadow-sm border-0 rounded-4" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body p-4">
          <h5 class="font-weight-bold mb-4 text-primary"><i class="fa fa-edit"></i> Mark Entry Panel</h5>
          <div class="row mb-3">
            <div class="col-md-6 mb-2">
              <label class="small font-weight-bold text-muted">Select Exam</label>
              <select id="examSelectUsthad" class="form-control" onchange="onUsthadExamChange()" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);">
                <option value="">Select Exam...</option>
              </select>
            </div>
            <div class="col-md-6 mb-2">
              <label class="small font-weight-bold text-muted">Target Batch</label>
              <select id="examBatchSelectUsthad" class="form-control" onchange="onUsthadExamChange()" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);">
                <option value="">Select Batch...</option>
                <option value="Batch 1">Batch 1</option>
                <option value="Batch 2">Batch 2</option>
                <option value="Batch 3">Batch 3</option>
                <option value="Batch 4">Batch 4</option>
                <option value="Batch 5">Batch 5</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>
          
          <div id="examSubjectConfigBanner" style="display:none; background:var(--bg-card-2); padding:15px; border-radius:10px; border:1px solid var(--border-soft); margin-bottom:15px;">
            <strong id="examBannerTitle" style="color:var(--text);">Configured Subjects:</strong>
            <div id="examBannerBadges" class="mt-2" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
          </div>

          <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
            <table class="table table-hover table-bordered table-sm text-center align-middle" style="color:var(--text); border-color:var(--border-soft);">
              <thead class="bg-primary text-white" style="position: sticky; top: 0; z-index: 10;">
                <tr id="examMatrixHeaderRow">
                  <th>Adm No</th>
                  <th>Student Name</th>
                  <th>Loading...</th>
                </tr>
              </thead>
              <tbody id="examMatrixTableBody" style="background:var(--bg-card-2);">
                <tr><td colspan="10" class="text-center text-muted py-4">Please select Exam and Batch to load student roster.</td></tr>
              </tbody>
            </table>
          </div>
          
          <button class="btn btn-success font-weight-bold w-100 rounded-pill py-2 mt-3" onclick="submitExamMarksUsthad()">
            <i class="fa fa-save"></i> Save All Marks
          </button>
        </div>
      </div>
    </div>
  </div>
`;

if (!html.includes('examSelectUsthad')) {
  // Inject at the end of usthadDashContent
  html = html.replace('</div>\n</div>\n\n          <!-- JS Dependencies -->', matrixHTML + '\n</div>\n</div>\n\n          <!-- JS Dependencies -->');
}

// Update loadUsthadDashboardData and loadStudentDashboardData logic
const scriptUpdates = `
    function loadUsthadDashboardData() {
      if(!currentUserSession) return;
      
      // Update counts
      fetch('/api/portal/students').then(r=>r.json()).then(data => {
        if(data.success) {
          const active = data.students.filter(s => !s.isAlumni).length;
          const el = document.getElementById('dashTotalStudents');
          if(el) el.textContent = active;
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

html = html.replace(/function loadUsthadDashboardData\(\) \{[\s\S]*?\} \/\/ end loadUsthadDashboardData/g, scriptUpdates + "\n    // end loadUsthadDashboardData");

// If regex fails because of no end comment, I'll just use string replacement.
fs.writeFileSync('public/login.html', html);
console.log('Restored Matrix and updated Usthad Data loader');
