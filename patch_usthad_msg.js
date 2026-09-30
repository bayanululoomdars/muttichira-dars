const fs = require('fs');

let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Add missing Usthad Messages Modal
const missingModal = `
  <!-- Modal: Usthad Messages -->
  <div class="modal fade" id="modalUsthadMessages" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content rounded-4 border-0 shadow-lg" style="background:var(--bg-card); color:var(--text);">
        <div class="modal-header bg-secondary text-white border-0">
          <h5 class="modal-title font-weight-bold"><i class="fa fa-envelope"></i> Messages from Students</h5>
          <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body p-4" id="usthadMessagesContainer">
          <div class="text-center text-muted"><i class="fa fa-spinner fa-spin fa-2x"></i><br>Loading messages...</div>
        </div>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="modalUsthadMessages"')) {
  html = html.replace('</body>', missingModal + '\n</body>');
}

// 2. Add missing JS for it
const missingJS = `
    function openUsthadMessagesModal() {
      $('#modalUsthadMessages').modal('show');
      fetch('/api/portal/usthad/messages')
        .then(r => r.json())
        .then(data => {
          const container = document.getElementById('usthadMessagesContainer');
          if (!data.success || !data.data || !data.data.messages || data.data.messages.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-5"><i class="fa fa-inbox fa-3x mb-3"></i><br>No messages found.</div>';
            return;
          }
          let h = '';
          data.data.messages.forEach(m => {
            h += \`<div class="card mb-3" style="background:var(--bg-card-2); border-color:var(--border-soft);">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <strong class="text-accent">\${m.subject || 'No Subject'}</strong>
                  <small class="text-muted">\${new Date(m.createdAt).toLocaleString()}</small>
                </div>
                <p class="mb-1" style="color:var(--text);">\${m.content}</p>
              </div>
            </div>\`;
          });
          container.innerHTML = h;
        })
        .catch(() => {
          document.getElementById('usthadMessagesContainer').innerHTML = '<div class="text-center text-danger">Failed to load messages.</div>';
        });
    }
`;

if (!html.includes('function openUsthadMessagesModal()')) {
  html = html.replace('</script>\n</body>', missingJS + '\n</script>\n</body>');
}

fs.writeFileSync('public/login.html', html);
console.log('Patched Usthad Messages UI');
