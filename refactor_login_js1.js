const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. In handleLiveLookup, update the selectHtml string for student matching
const oldLookupHTML = `const badgeClass = item.role === 'usthad' ? 'badge-usthad' : (item.isAlumni ? 'badge-alumni' : 'badge-student');
                  const badgeLabel = item.role === 'usthad' ? 'Usthad' : (item.isAlumni ? 'Alumni' : 'Student');

                  selectHtml += \`<div onclick="selectMatchFromList(\${index})" style="padding:10px; cursor:pointer; border-bottom:1px solid #f1f5f9; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                    <div style="font-weight:700; color:#1e293b;">\${item.name} <span class="badge \${badgeClass} float-right">\${badgeLabel}</span></div>
                    <div style="font-size:0.8rem; color:#64748b;">\${subText}</div>
                    <div style="font-size:0.8rem; font-weight:600; color:#3b82f6; mt-1"><i class="fa fa-id-card"></i> \${idText}</div>
                  </div>\`;`;

const newLookupHTML = `const badgeClass = item.role === 'usthad' ? 'badge-usthad' : (item.isAlumni ? 'badge-alumni' : 'badge-student');
                  const badgeLabel = item.role === 'usthad' ? 'Usthad' : (item.isAlumni ? 'Alumni' : 'Student');
                  
                  let fatherStr = item.role === 'student' && item.fatherName ? \`<div style="font-size:0.85rem; color:#64748b; font-weight:600; margin-bottom:2px;">S/O \${item.fatherName}</div>\` : \`<div style="font-size:0.85rem; color:#64748b; font-weight:600; margin-bottom:2px;">\${item.role === 'usthad' ? item.designation || 'Usthad' : 'Batch ' + (item.batchNumber || '')}</div>\`;
                  let phoneStr = item.phone ? \`<span style="color:#64748b; font-weight:600;"><i class="fa fa-phone"></i> \${item.phone}</span>\` : '';

                  selectHtml += \`<div onclick="selectMatchFromList(\${index})" style="padding:10px; cursor:pointer; border-bottom:1px solid #f1f5f9; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                    <div style="font-weight:700; color:#1e293b; font-size:1.05rem;">\${item.name} <span class="badge \${badgeClass} float-right">\${badgeLabel}</span></div>
                    \${fatherStr}
                    <div class="d-flex justify-content-between mt-1" style="font-size:0.8rem;">
                      \${phoneStr}
                      <span style="font-weight:700; color:#3b82f6;"><i class="fa fa-id-card"></i> \${idText}</span>
                    </div>
                  </div>\`;`;

html = html.replace(oldLookupHTML, newLookupHTML);

// 2. Add downloadIdCard function
const downloadJs = `
    function downloadIdCard(elemId, filename) {
      if(typeof html2canvas === 'undefined') { alert('Library loading, please wait.'); return; }
      html2canvas(document.getElementById(elemId), { scale: 3 }).then(canvas => {
        let link = document.createElement('a');
        link.download = filename + '.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }

    function handleStudentSelfUpdate(e) {
      e.preventDefault();
      if (!currentUserSession || currentUserSession.role !== 'student') return;
      
      const payload = {
        name: document.getElementById('selfName').value,
        fatherName: document.getElementById('selfFather').value,
        phone: document.getElementById('selfPhone').value,
        bloodGroup: document.getElementById('selfBlood').value,
        dob: document.getElementById('selfDob').value,
        emergencyContact: document.getElementById('selfEmergency').value,
        address: document.getElementById('selfAddress').value,
        password: document.getElementById('selfPassword').value
      };

      fetch('/api/portal/student/' + currentUserSession._id, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
      .then(r => r.json())
      .then(res => {
        if(res.success) {
          showToast('Profile updated successfully!', false);
          // Update session object locally
          Object.assign(currentUserSession, payload);
          populateStudentDash(currentUserSession);
        } else {
          showToast(res.message || 'Error updating profile', true);
        }
      });
    }
`;
html = html.replace('// Switch Role between Student & Usthad', downloadJs + '\n    // Switch Role between Student & Usthad');

// 3. Widening container on login success
// Inside verifyLogin function
html = html.replace(`document.getElementById('loginCard').style.display = 'none';`, `document.getElementById('loginCard').style.display = 'none';\n        const mainCol = document.getElementById('mainLayoutCol'); if(mainCol) mainCol.className = 'col-lg-11 col-xl-10 transition-all duration-300';\n        const pContainer = document.querySelector('.portal-card-container'); if(pContainer) { pContainer.classList.remove('container'); pContainer.classList.add('container-fluid'); }`);

fs.writeFileSync('public/login.html', html);
console.log('Patched JS logic in login.html');
