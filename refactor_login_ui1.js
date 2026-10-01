const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Convert col-lg-6 to dynamic column
html = html.replace('<div class="col-lg-6 col-md-8">', '<div class="col-lg-6 col-md-8 transition-all duration-300" id="mainLayoutCol">');

// 2. Add html2canvas library to the head for downloading ID Card
if (!html.includes('html2canvas')) {
  html = html.replace('</head>', '  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n</head>');
}

// 3. Inject new Usthad Dashboard HTML
const newUsthadDash = `
<div id="usthadDashContent" style="display: none; width:100%;">
  <div class="row">
    <!-- LEFT PANEL: PROFILE & ID CARD -->
    <div class="col-lg-4 mb-4">
      <div class="card shadow-sm border-0 rounded-4" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body text-center p-4">
          <h5 class="font-weight-bold mb-3 text-primary"><i class="fa fa-id-badge"></i> Usthad ID Card</h5>
          <div id="usthadIdCard" style="border:2px solid var(--primary); border-radius:10px; padding:15px; background: #fff; max-width:280px; margin:0 auto; position:relative; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <img src="img/new_logo.png" style="width:45px; margin-bottom:10px;">
            <h6 style="color:var(--primary); font-weight:800; font-size:12px; margin-bottom:10px;">BAYANUL ULOOM DARS<br>MUTTICHIRA</h6>
            <img id="uIdPhoto" src="img/new_logo.png" style="width:80px; height:80px; object-fit:cover; border-radius:50%; border:3px solid var(--border-soft); margin-bottom:10px;">
            <h5 id="uIdName" style="font-weight:700; margin-bottom:5px; color:#1e293b; font-size:16px;">Name</h5>
            <p id="uIdRole" style="font-size:12px; color:#64748b; margin-bottom:5px; font-weight:600;">Mudarris</p>
            <div style="background:var(--bg-card-2); border-radius:6px; padding:8px; margin-top:10px;">
              <p id="uIdNo" style="font-weight:800; color:var(--accent); margin-bottom:2px; font-size:14px;">ID: -</p>
              <p id="uIdPhone" style="font-size:11px; color:#475569; margin-bottom:0; font-weight:600;"><i class="fa fa-phone"></i> -</p>
            </div>
          </div>
          <button class="btn btn-outline-primary btn-sm mt-3 font-weight-bold" onclick="downloadIdCard('usthadIdCard', 'Usthad_ID')">
            <i class="fa fa-download"></i> Download ID
          </button>
        </div>
      </div>
    </div>

    <!-- MIDDLE PANEL: MESSAGES & ACTIONS -->
    <div class="col-lg-4 mb-4">
      <div class="card shadow-sm border-0 rounded-4 h-100" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body p-4">
          <h5 class="font-weight-bold mb-4 text-info"><i class="fa fa-comments"></i> Communication</h5>
          
          <div class="d-grid gap-3" style="display:grid;">
            <button class="btn btn-info font-weight-bold rounded-pill text-white py-2" onclick="openPostNotificationModal()">
              <i class="fa fa-bullhorn"></i> Broadcast to All Students
            </button>
            <button class="btn btn-primary font-weight-bold rounded-pill text-white py-2" onclick="openUsthadDirectMsgModal()">
              <i class="fa fa-paper-plane"></i> Message Specific Student
            </button>
            <button class="btn btn-secondary font-weight-bold rounded-pill py-2" onclick="openUsthadMessagesModal()">
              <i class="fa fa-envelope"></i> View Inbox (From Students)
            </button>
          </div>
          
          <hr class="my-4" style="border-color:var(--border-soft);">
          <h5 class="font-weight-bold mb-3 text-secondary"><i class="fa fa-users"></i> Students Overview</h5>
          <div class="d-flex justify-content-between align-items-center p-3 rounded" style="background:var(--bg-card-2); border:1px solid var(--border-soft);">
            <div class="font-weight-bold text-muted">Total Active Students</div>
            <div class="h3 mb-0 font-weight-bold text-primary" id="dashTotalStudents">0</div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: EXAM HALL -->
    <div class="col-lg-4 mb-4">
      <div class="card shadow-sm border-0 rounded-4 h-100" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body p-4">
          <h5 class="font-weight-bold mb-4 text-warning"><i class="fa fa-graduation-cap"></i> Exam Hall</h5>
          
          <!-- Published Exams -->
          <h6 class="font-weight-bold text-success mb-2"><i class="fa fa-check-circle"></i> Published Exams</h6>
          <div id="usthadPublishedExamsList" class="mb-4" style="max-height:180px; overflow-y:auto; padding-right:5px;">
            <div class="text-muted small">Loading...</div>
          </div>

          <!-- Pending Exams -->
          <h6 class="font-weight-bold text-danger mb-2"><i class="fa fa-clock-o"></i> Pending / Upcoming Exams</h6>
          <div id="usthadPendingExamsList" style="max-height:180px; overflow-y:auto; padding-right:5px;">
            <div class="text-muted small">Loading...</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
`;

// 4. Inject new Student Dashboard HTML
const newStudentDash = `
<div id="studentDashContent" style="display: none; width:100%;">
  <div class="row">
    <!-- LEFT PANEL: ID CARD -->
    <div class="col-lg-3 mb-4">
      <div class="card shadow-sm border-0 rounded-4" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body text-center p-3">
          <div id="studentIdCard" style="border:2px solid var(--accent); border-radius:10px; padding:15px; background: #fff; position:relative; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <img src="img/new_logo.png" style="width:40px; margin-bottom:5px;">
            <h6 style="color:var(--accent); font-weight:800; font-size:11px; margin-bottom:10px;">BAYANUL ULOOM DARS<br>MUTTICHIRA</h6>
            <img id="sIdPhoto" src="img/new_logo.png" style="width:75px; height:75px; object-fit:cover; border-radius:50%; border:3px solid var(--border-soft); margin-bottom:5px;">
            <h5 id="sIdName" style="font-weight:700; margin-bottom:3px; color:#1e293b; font-size:15px; line-height:1.2;">Name</h5>
            <p id="sIdFather" style="font-size:11px; color:#64748b; margin-bottom:5px; font-weight:600;">S/O -</p>
            <p id="sIdBatch" style="font-size:12px; color:var(--primary); font-weight:700; margin-bottom:8px;">Batch</p>
            <div style="background:var(--bg-card-2); border-radius:6px; padding:6px; margin-top:5px;">
              <p id="sIdNo" style="font-weight:800; color:var(--accent); margin-bottom:1px; font-size:13px;">Adm No: -</p>
              <p id="sIdBlood" style="font-size:11px; color:#dc3545; margin-bottom:1px; font-weight:700;"><i class="fa fa-tint"></i> Blood: -</p>
              <p id="sIdPhone" style="font-size:10px; color:#475569; margin-bottom:0; font-weight:600;"><i class="fa fa-phone"></i> -</p>
            </div>
          </div>
          <button class="btn btn-outline-accent btn-sm mt-3 font-weight-bold" onclick="downloadIdCard('studentIdCard', 'Student_ID')">
            <i class="fa fa-download"></i> Download ID
          </button>
        </div>
      </div>
    </div>

    <!-- MIDDLE PANEL: DETAILED PROFILE EDIT FORM -->
    <div class="col-lg-5 mb-4">
      <div class="card shadow-sm border-0 rounded-4 h-100" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body p-4">
          <h5 class="font-weight-bold mb-3 text-primary"><i class="fa fa-user-edit"></i> Complete Your Profile</h5>
          <p class="small text-muted mb-4">Please keep your details up to date. You can edit them anytime.</p>
          
          <form onsubmit="handleStudentSelfUpdate(event)">
            <div class="row">
              <div class="col-md-6 mb-2">
                <label class="small font-weight-bold text-muted">Full Name</label>
                <input type="text" id="selfName" class="form-control form-control-sm" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required>
              </div>
              <div class="col-md-6 mb-2">
                <label class="small font-weight-bold text-muted">Father / Guardian Name</label>
                <input type="text" id="selfFather" class="form-control form-control-sm" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required>
              </div>
              <div class="col-md-6 mb-2">
                <label class="small font-weight-bold text-muted">Phone Number</label>
                <input type="text" id="selfPhone" class="form-control form-control-sm" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required>
              </div>
              <div class="col-md-6 mb-2">
                <label class="small font-weight-bold text-muted">Blood Group</label>
                <select id="selfBlood" class="form-control form-control-sm" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);">
                  <option value="">Unknown</option>
                  <option>O+</option><option>O-</option>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option>
                </select>
              </div>
              <div class="col-md-6 mb-2">
                <label class="small font-weight-bold text-muted">Date of Birth</label>
                <input type="date" id="selfDob" class="form-control form-control-sm" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);">
              </div>
              <div class="col-md-6 mb-2">
                <label class="small font-weight-bold text-muted">Emergency Contact</label>
                <input type="text" id="selfEmergency" class="form-control form-control-sm" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);">
              </div>
              <div class="col-12 mb-3">
                <label class="small font-weight-bold text-muted">Full Address</label>
                <textarea id="selfAddress" class="form-control form-control-sm" rows="2" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);"></textarea>
              </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted d-block">Login Password:</small>
                <input type="text" id="selfPassword" class="form-control form-control-sm d-inline-block" style="width:120px; background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);">
              </div>
              <button type="submit" class="btn btn-primary font-weight-bold rounded-pill px-4">
                <i class="fa fa-save"></i> Save Profile
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: EXAMS & MESSAGES -->
    <div class="col-lg-4 mb-4">
      <div class="card shadow-sm border-0 rounded-4 h-100" style="background:var(--bg-card); color:var(--text);">
        <div class="card-body p-4 d-flex flex-column">
          <ul class="nav nav-pills mb-3 border-bottom pb-2" style="gap:10px;">
            <li class="nav-item">
              <a class="nav-link active font-weight-bold px-3 py-1" data-toggle="tab" href="#tabStudentResultsTab">
                <i class="fa fa-trophy text-warning"></i> Results
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link font-weight-bold px-3 py-1" data-toggle="tab" href="#tabStudentMsgsTab">
                <i class="fa fa-envelope text-info"></i> Messages
              </a>
            </li>
          </ul>
          
          <div class="tab-content flex-grow-1" style="overflow-y:auto; max-height:400px; padding-right:5px;">
            <div class="tab-pane fade show active" id="tabStudentResultsTab">
              <div id="studentResultsContainer">
                <div class="text-center text-muted"><i class="fa fa-spinner fa-spin"></i> Loading results...</div>
              </div>
            </div>
            <div class="tab-pane fade" id="tabStudentMsgsTab">
              <button class="btn btn-sm btn-outline-info w-100 mb-3 font-weight-bold" onclick="$('#modalStudentMsg').modal('show')">
                <i class="fa fa-paper-plane"></i> Send Msg to Usthad
              </button>
              <div id="studentNotificationsContainer">
                <div class="text-center text-muted"><i class="fa fa-spinner fa-spin"></i> Loading messages...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// Extract indices to safely replace the old dashboards
const uIdx1 = html.indexOf('<div id="usthadDashContent"');
const uIdx2 = html.indexOf('<!-- JS Dependencies -->');
if (uIdx1 !== -1 && uIdx2 !== -1) {
  // Wait, studentDashContent is before usthadDashContent.
  const sIdx1 = html.indexOf('<div id="studentDashContent"');
  if (sIdx1 !== -1) {
    // Replace both entirely
    html = html.substring(0, sIdx1) + newStudentDash + '\n\n' + newUsthadDash + '\n\n          ' + html.substring(uIdx2 - 30);
  }
}

fs.writeFileSync('public/login.html', html);
console.log('Dashboards structurally updated');
