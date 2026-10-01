const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const missingFunctions = `
    function openUsthadDirectMsgModal() {
      $('#modalUsthadDirectMsg').modal('show');
    }

    function openUsthadMessagesModal() {
      if(!currentUserSession) return;
      fetch('/api/portal/usthad/messages?usthadId=' + currentUserSession.usthadId)
        .then(r => r.json())
        .then(data => {
          const container = document.getElementById('usthadMessagesList');
          if(data.success && data.messages && data.messages.length > 0) {
            let h = '';
            data.messages.forEach(m => {
              h += \`<div class="p-2 mb-2 border rounded" style="background:var(--bg-card-2);">
                <div class="d-flex justify-content-between">
                  <strong class="text-primary">\${m.senderName} (\${m.senderRole})</strong>
                  <small class="text-muted">\${new Date(m.createdAt).toLocaleDateString()}</small>
                </div>
                <strong class="small text-dark">\${m.subject}</strong>
                <p class="m-0 small text-dark mt-1">\${m.content}</p>
              </div>\`;
            });
            container.innerHTML = h;
          } else {
            container.innerHTML = '<div class="text-muted text-center p-3">No messages in inbox.</div>';
          }
          $('#modalUsthadMessages').modal('show');
        });
    }

    function handleUsthadDirectMsgSubmit(e) {
      e.preventDefault();
      if(!currentUserSession) return;
      fetch('/api/portal/usthad/post-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          usthadId: currentUserSession.usthadId,
          usthadName: currentUserSession.name,
          studentAdmNo: document.getElementById('dmTargetStudent').value,
          subject: document.getElementById('dmSubject').value,
          content: document.getElementById('dmBody').value
        })
      }).then(r=>r.json()).then(res=>{
        if(res.success) {
          showToast('Direct message sent!', false);
          $('#modalUsthadDirectMsg').modal('hide');
        } else {
          showToast(res.message, true);
        }
      });
    }
`;

if (!html.includes('function openUsthadDirectMsgModal()')) {
  html = html.replace('function openPostNotificationModal() {', missingFunctions + '\n    function openPostNotificationModal() {');
  fs.writeFileSync('public/login.html', html);
  console.log('Injected missing Usthad JS functions');
} else {
  console.log('Functions already exist');
}
