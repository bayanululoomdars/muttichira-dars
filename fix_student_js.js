const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const replacement = `
            const notifBox = document.getElementById('studentNotificationsContainer');
            if (!notifBox) return; // Prevent crashes
            let combinedHtml = '';
            
            if (data.notifications && data.notifications.length > 0) {
              data.notifications.forEach(n => {
                combinedHtml += \`
                  <div class="p-2 mb-2 rounded border-left" style="background:var(--bg-card-2); border-left:4px solid var(--info) !important;">
                    <h6 class="font-weight-bold text-info m-0">\${n.subject || 'Announcement'}</h6>
                    <small class="text-muted d-block mb-1">\${new Date(n.createdAt).toLocaleDateString()}</small>
                    <p class="m-0 small text-dark">\${n.content}</p>
                  </div>
                \`;
              });
            }

            if (data.messages && data.messages.length > 0) {
              data.messages.forEach(m => {
                const isMe = m.senderRole === 'student';
                combinedHtml += \`
                  <div class="p-2 mb-2 rounded border-left" style="background:\${isMe ? 'var(--bg-card)' : 'var(--bg-card-2)'}; border-left:4px solid \${isMe ? 'var(--secondary)' : 'var(--success)'} !important;">
                    <div class="d-flex justify-content-between">
                      <strong class="small text-\${isMe ? 'secondary' : 'success'}">\${isMe ? 'You' : m.senderName}</strong>
                      <small class="text-muted">\${new Date(m.createdAt).toLocaleDateString()}</small>
                    </div>
                    <p class="m-0 small text-dark mt-1">\${m.content}</p>
                  </div>
                \`;
              });
            }

            if (!combinedHtml) {
              combinedHtml = '<p class="text-muted small">No notifications or messages yet.</p>';
            }
            notifBox.innerHTML = combinedHtml;
            
            // Note: we removed editStudentPhone etc because we have selfPhone populated in renderDashboard.
          }
        });
        
        // Also populate msgUsthadSelect
        fetch('/api/portal/usthads').then(r=>r.json()).then(res => {
          if(res.success) {
            const sel = document.getElementById('msgUsthadSelect');
            if(sel) {
               let opts = '<option value="">Select Usthad...</option>';
               res.usthads.forEach(u => opts += \`<option value="\${u._id}">\${u.name}</option>\`);
               sel.innerHTML = opts;
            }
          }
        });
`;

// Also fix studentResultsList -> studentResultsContainer
html = html.replace("const resultsBox = document.getElementById('studentResultsList');", "const resultsBox = document.getElementById('studentResultsContainer');");

// Strip out the old message/notification handling and insert the new one
const oldMsgStart = "const notifBox = document.getElementById('studentNotificationsList');";
const oldMsgEnd = "document.getElementById('editStudentBio').value = data.student.bio || '';";

if (html.includes(oldMsgStart) && html.includes(oldMsgEnd)) {
  const i1 = html.indexOf(oldMsgStart);
  const i2 = html.indexOf(oldMsgEnd) + oldMsgEnd.length;
  html = html.substring(0, i1) + replacement + html.substring(i2);
}

fs.writeFileSync('public/login.html', html);
console.log('Fixed student dashboard js errors');
