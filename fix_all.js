const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Hide the dash-header entirely to prevent double ID card confusion
if (!html.includes("document.querySelector('.dash-header').style.display = 'none';")) {
  html = html.replace("document.getElementById('dashboardCard').style.display = 'block';", "document.getElementById('dashboardCard').style.display = 'block';\n      const dh = document.querySelector('.dash-header'); if(dh) dh.style.display = 'none';");
}

// 2. Inject the missing Exam Mark Matrix if it's missing
if (!html.includes('id="examSelectUsthad"')) {
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
                <option value="Batch 6">Batch 6</option>
                <option value="Batch 7">Batch 7</option>
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
                  <th>Action</th>
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
  
  // Find where usthadDashContent closes.
  // It's just before "</div>\n  </div>\n\n  <!-- JS Dependencies -->"
  const endOfUsthad = html.indexOf('<!-- JS Dependencies -->');
  // Backtrack to insert it inside usthadDashContent.
  // We'll insert it right after the closing </div> of the <div class="row"> inside usthadDashContent.
  const searchStr = 'Pending / Upcoming Exams</h6>\n          <div id="usthadPendingExamsList" style="max-height:180px; overflow-y:auto; padding-right:5px;">\n            <div class="text-muted small">Loading...</div>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  </div>';
  const insertPos = html.indexOf(searchStr);
  
  if (insertPos !== -1) {
    const afterInsert = insertPos + searchStr.length;
    html = html.substring(0, afterInsert) + '\n' + matrixHTML + html.substring(afterInsert);
  }
}

fs.writeFileSync('public/login.html', html);
console.log('Fixed missing matrix and double ID card issue.');
