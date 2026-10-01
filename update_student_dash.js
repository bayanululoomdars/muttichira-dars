const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const startMarker = '<div id="studentDashContent"';
const startIndex = html.indexOf(startMarker);
const endMarker = '<div id="usthadDashContent"';
let endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const oldContent = html.substring(startIndex, endIndex);

  const newContent = `<div id="studentDashContent" style="display: none; width:100%;">
  <div class="row">
    <!-- LEFT PANEL: ID CARD -->
    <div class="col-lg-3 mb-4">
      <div class="card shadow-sm border-0 rounded-4" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body text-center p-3">
          <div id="studentIdCard" style="border:2px solid var(--accent); border-radius:10px; padding:15px; background: #fff; position:relative; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <img src="img/new_logo.png" style="width:40px; margin-bottom:5px;">
            <h6 style="color:var(--accent); font-weight:800; font-size:11px; margin-bottom:10px;">BAYANUL ULOOM DARS<br>MUTTICHIRA</h6>
            
            <div class="d-flex justify-content-center align-items-center flex-column mb-2">
              <img id="sIdPhoto" src="img/new_logo.png" style="width:75px; height:75px; object-fit:cover; border-radius:50%; border:3px solid var(--border-soft);">
              <button class="btn btn-warning btn-sm mt-2 font-weight-bold" style="font-size:11px; border-radius:20px; padding: 4px 12px; box-shadow:0 2px 5px rgba(0,0,0,0.2);" onclick="openStudentFullProfileModal()">
                <i class="fa fa-edit"></i> Edit Your Profile
              </button>
            </div>
            
            <h5 id="sIdName" style="font-weight:700; margin-bottom:3px; color:#1e293b; font-size:15px; line-height:1.2;">Name</h5>
            <p id="sIdFather" style="font-size:11px; color:#64748b; margin-bottom:5px; font-weight:600;">S/O -</p>
            <p id="sIdBatch" style="font-size:12px; color:var(--primary); font-weight:700; margin-bottom:8px;">Batch</p>
            <div style="background:var(--bg-card-2); border-radius:6px; padding:6px; margin-top:5px;">
              <p id="sIdNo" style="font-weight:800; color:var(--accent); margin-bottom:1px; font-size:13px;">Adm No: -</p>
              <p id="sIdBlood" style="font-size:11px; color:#dc3545; margin-bottom:1px; font-weight:700;"><i class="fa fa-tint"></i> Blood: -</p>
              <p id="sIdPhone" style="font-size:10px; color:#475569; margin-bottom:0; font-weight:600;"><i class="fa fa-phone"></i> -</p>
            </div>
          </div>
          <div class="d-flex justify-content-center gap-2 mt-3" style="gap:10px;">
            <button class="btn btn-outline-info btn-sm font-weight-bold" onclick="viewIdCard('studentIdCard')">
              <i class="fa fa-eye"></i> View
            </button>
            <button class="btn btn-outline-accent btn-sm font-weight-bold" onclick="downloadIdCard('studentIdCard', 'Student_ID')">
              <i class="fa fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: EXAMS & MESSAGES (LARGE BOXES) -->
    <div class="col-lg-9 mb-4">
      <div class="row">
        
        <!-- EXAM RESULTS BOX -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm border-0 rounded-4 h-100" style="background:var(--bg-card); color:var(--text);">
            <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0">
              <h5 class="font-weight-bold text-warning mb-0"><i class="fa fa-trophy"></i> Exam Results</h5>
              <p class="small text-muted mt-1">Your official marks and progress reports.</p>
            </div>
            <div class="card-body p-4" style="overflow-y:auto; max-height:550px;">
              <div id="studentResultsContainer">
                <div class="text-center text-muted"><i class="fa fa-spinner fa-spin"></i> Loading results...</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- MESSAGES BOX -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm border-0 rounded-4 h-100" style="background:var(--bg-card); color:var(--text);">
            <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <div>
                <h5 class="font-weight-bold text-info mb-0"><i class="fa fa-envelope"></i> Messages</h5>
                <p class="small text-muted mt-1">Notices from Usthads and Admin.</p>
              </div>
              <button class="btn btn-sm btn-info font-weight-bold rounded-pill shadow-sm" onclick="$('#modalStudentMsg').modal('show')">
                <i class="fa fa-paper-plane"></i> Send
              </button>
            </div>
            <div class="card-body p-4" style="overflow-y:auto; max-height:550px;">
              <div id="studentNotificationsContainer">
                <div class="text-center text-muted"><i class="fa fa-spinner fa-spin"></i> Loading messages...</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>\n\n\n`;

  html = html.replace(oldContent, newContent);
  fs.writeFileSync('public/login.html', html);
  console.log('Successfully updated Student Dash Content layout.');
} else {
  console.log('Could not find studentDashContent boundaries.');
}
