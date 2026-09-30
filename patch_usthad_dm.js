const fs = require('fs');

let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Add "Direct Message Student" button
const dmBtn = `
              <button class="btn btn-primary font-weight-bold rounded-pill text-white" onclick="openUsthadDirectMsgModal()">
                <i class="fa fa-paper-plane"></i> Message Student
              </button>
`;

if (!html.includes('openUsthadDirectMsgModal')) {
  // Find the place to insert it
  html = html.replace('<button class="btn btn-secondary font-weight-bold rounded-pill" onclick="openUsthadMessagesModal()">', dmBtn + '\n              <button class="btn btn-secondary font-weight-bold rounded-pill" onclick="openUsthadMessagesModal()">');
}

// 2. Add Modal
const dmModal = `
  <!-- Modal: Usthad Direct Message to Student -->
  <div class="modal fade" id="modalUsthadDirectMsg" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg" style="background:var(--bg-card); color:var(--text);">
        <div class="modal-header bg-primary text-white border-0">
          <h5 class="modal-title font-weight-bold"><i class="fa fa-paper-plane"></i> Direct Message to Student</h5>
          <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body p-4">
          <form onsubmit="handleUsthadDirectMsgSubmit(event)">
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Select Target Student</label>
              <select id="dmTargetStudent" class="form-control" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required>
                <!-- Populated via JS -->
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Subject / Title</label>
              <input type="text" id="dmSubject" class="form-control" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required placeholder="e.g. Warning / Appreciation">
            </div>
            <div class="form-group mb-3">
              <label class="small font-weight-bold text-muted">Message Details</label>
              <textarea id="dmContent" class="form-control" rows="3" style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-soft);" required placeholder="Write message..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary text-white font-weight-bold w-100 rounded-pill py-2">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="modalUsthadDirectMsg"')) {
  html = html.replace('</body>', dmModal + '\n</body>');
}

// 3. Add JS
const dmJS = `
    function openUsthadDirectMsgModal() {
      // Fetch all students to populate dropdown
      fetch('/api/portal/students')
        .then(r => r.json())
        .then(res => {
          if (res.success && res.students) {
            let opts = '<option value="">-- Select Student --</option>';
            res.students.filter(s => s.status !== 'Alumni').forEach(s => {
              opts += \`<option value="\${s.admissionNo}">\${s.name} (Adm: \${s.admissionNo})</option>\`;
            });
            document.getElementById('dmTargetStudent').innerHTML = opts;
            $('#modalUsthadDirectMsg').modal('show');
          } else {
            showToast('Failed to load students list.', true);
          }
        });
    }

    function handleUsthadDirectMsgSubmit(e) {
      e.preventDefault();
      const targetAdmNo = document.getElementById('dmTargetStudent').value;
      const payload = {
        targetAdmNo: targetAdmNo,
        type: 'message',
        subject: document.getElementById('dmSubject').value,
        content: document.getElementById('dmContent').value,
        postedBy: currentUser.name || currentUser.usthadId
      };

      fetch('/api/portal/usthad/post-mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          showToast('Message sent to student successfully!', false);
          $('#modalUsthadDirectMsg').modal('hide');
          e.target.reset();
        } else {
          showToast(res.message || 'Failed to send message', true);
        }
      })
      .catch(() => showToast('Network Error', true));
    }
`;

if (!html.includes('function openUsthadDirectMsgModal')) {
  html = html.replace('</script>\n</body>', dmJS + '\n</script>\n</body>');
}

fs.writeFileSync('public/login.html', html);
console.log('Patched Usthad DM logic');
