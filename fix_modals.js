const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Remove trailing literal "\n }\n" garbage
html = html.replace(/\\n\s*\}\n\s*\}\n\s*\}\);\n\s*\}\n/g, '');

// 2. Add custom CSS for z-index
const zindexFix = `<style>
  .modal-backdrop { z-index: 1040 !important; }
  .modal { z-index: 1050 !important; }
</style>
</head>`;
if (!html.includes('.modal-backdrop { z-index: 1040')) {
  html = html.replace('</head>', zindexFix);
}

// 3. Define missing modals
const missingModals = `
  <!-- FULL STUDENT PROFILE MODAL -->
  <div class="modal fade" id="modalStudentFullProfile" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content" style="background:var(--bg-card); color:var(--text); border:1px solid var(--border-soft); border-radius:16px;">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title font-weight-bold text-primary"><i class="fa fa-user-edit"></i> Complete Your Profile (Official Data)</h5>
          <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
        </div>
        <form onsubmit="handleStudentSelfUpdate(event)">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Full Name <span class="text-danger">*</span></label>
                <input type="text" id="selfName" class="form-control" style="background:var(--bg-input); color:var(--text);" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Father / Guardian Name <span class="text-danger">*</span></label>
                <input type="text" id="selfFather" class="form-control" style="background:var(--bg-input); color:var(--text);" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Phone Number <span class="text-danger">*</span></label>
                <input type="text" id="selfPhone" class="form-control" style="background:var(--bg-input); color:var(--text);" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Blood Group</label>
                <select id="selfBlood" class="form-control" style="background:var(--bg-input); color:var(--text);">
                  <option value="">Unknown</option>
                  <option>O+</option><option>O-</option>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Date of Birth</label>
                <input type="date" id="selfDob" class="form-control" style="background:var(--bg-input); color:var(--text);">
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Emergency Contact</label>
                <input type="text" id="selfEmergency" class="form-control" style="background:var(--bg-input); color:var(--text);">
              </div>
              <div class="col-12 mb-3">
                <label class="small font-weight-bold text-muted">Full Address</label>
                <textarea id="selfAddress" class="form-control" rows="2" style="background:var(--bg-input); color:var(--text);"></textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold text-muted">Login Password</label>
                <input type="text" id="selfPassword" class="form-control" style="background:var(--bg-input); color:var(--text);">
                <small class="text-danger">Updates immediately.</small>
              </div>
            </div>
            <hr>
            <div class="form-check p-3 bg-dark rounded border border-warning text-warning mb-3">
              <input class="form-check-input ml-1 mt-2" type="checkbox" id="selfDeclaration" required>
              <label class="form-check-label ml-4" for="selfDeclaration" style="font-size:0.95rem; font-weight:bold;">
                I hereby declare that the information provided above is true and accurate. I understand that my official details like Name, Phone, and Password will be updated in the Admin records upon submission.
              </label>
            </div>
          </div>
          <div class="modal-footer border-top-0">
            <button type="button" class="btn btn-secondary rounded-pill font-weight-bold" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary rounded-pill font-weight-bold px-4"><i class="fa fa-save"></i> Submit Profile</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- SINGLE STUDENT MARK ENTRY MODAL -->
  <div class="modal fade" id="modalSingleStudentMark" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" style="background:var(--bg-card); color:var(--text); border:1px solid var(--border-soft); border-radius:16px;">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title font-weight-bold text-success"><i class="fa fa-graduation-cap"></i> Enter/Edit Marks</h5>
          <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
        </div>
        <form onsubmit="saveSingleStudentMark(event)">
          <div class="modal-body">
            <h6 id="singleMarkStudentName" class="text-warning font-weight-bold mb-4 border-bottom pb-2"></h6>
            <div id="singleMarkInputsContainer"></div>
          </div>
          <div class="modal-footer border-top-0">
            <button type="button" class="btn btn-secondary rounded-pill font-weight-bold" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-success rounded-pill font-weight-bold px-4">Publish/Save Marks</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="modalStudentFullProfile"')) {
  html = html.replace('</body>', missingModals + '\n</body>');
}

fs.writeFileSync('public/login.html', html);
console.log('Fixed modals in login.html');
