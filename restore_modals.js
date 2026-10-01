const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const missingModals = `
  <!-- Modal: Post Notification / Broadcast (Usthad) -->
  <div class="modal fade" id="modalPostNotif" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg" style="background:var(--bg-card); color:var(--text);">
        <div class="modal-header bg-info text-white border-0">
          <h5 class="modal-title font-weight-bold"><i class="fa fa-bullhorn"></i> Broadcast Notification</h5>
          <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body p-4">
          <form onsubmit="handlePostNotifSubmit(event)">
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Title / Subject</label>
              <input type="text" id="notifTitle" class="form-control" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required placeholder="e.g. Exam Tomorrow">
            </div>
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Message Content</label>
              <textarea id="notifMessage" class="form-control" rows="4" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required placeholder="Write your broadcast message here..."></textarea>
            </div>
            <button type="submit" class="btn btn-info font-weight-bold w-100 rounded-pill py-2 text-white">
              <i class="fa fa-send"></i> Send Broadcast
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal: Send Message to Usthad (Student) -->
  <div class="modal fade" id="modalStudentMsg" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg" style="background:var(--bg-card); color:var(--text);">
        <div class="modal-header bg-info text-white border-0">
          <h5 class="modal-title font-weight-bold"><i class="fa fa-envelope"></i> Send Message to Usthad</h5>
          <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body p-4">
          <form onsubmit="handleSendStudentMsg(event)">
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Select Usthad</label>
              <select id="msgUsthadSelect" class="form-control" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required>
                <option value="">Select Usthad...</option>
                <!-- Populated via JS -->
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Subject</label>
              <input type="text" id="msgSubject" class="form-control" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required placeholder="e.g. Leave Request">
            </div>
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Message Details</label>
              <textarea id="msgBody" class="form-control" rows="4" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required placeholder="Write your message here..."></textarea>
            </div>
            <button type="submit" class="btn btn-info font-weight-bold w-100 rounded-pill py-2 text-white">
              <i class="fa fa-paper-plane"></i> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="modalPostNotif"')) {
  html = html.replace('</body>', missingModals + '\n</body>');
  fs.writeFileSync('public/login.html', html);
  console.log('Restored missing modals!');
} else {
  console.log('Modals already exist.');
}
