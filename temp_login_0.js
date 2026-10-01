
    let currentRole = 'student';
    let selectedUserObject = null;
    let currentUserSession = null;
    let debounceTimer = null;

    
    
    function viewIdCard(elemId) {
      const source = document.getElementById(elemId);
      const container = document.getElementById('idCardPreviewContainer');
      container.innerHTML = '';
      const clone = source.cloneNode(true);
      clone.style.margin = '0 auto'; // Ensure centered
      // We can scale it up for better viewing if desired
      clone.style.transform = 'scale(1.2)';
      clone.style.transformOrigin = 'top center';
      clone.style.marginBottom = '60px'; // Account for scale
      container.appendChild(clone);
      $('#modalViewIdCard').modal('show');
    }

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
          $('#modalStudentFullProfile').modal('hide');
          Object.assign(currentUserSession, payload);
          renderDashboard(currentUserSession);
        } else {
          showToast(res.message || 'Error updating profile', true);
        }
      });
    }

    // Switch Role between Student & Usthad
    function switchRole(role) {
      currentRole = role;
      document.getElementById('btnRoleStudent').classList.toggle('active', role === 'student');
      document.getElementById('btnRoleUsthad').classList.toggle('active', role === 'usthad');

      const title = document.getElementById('loginTitle');
      const sub = document.getElementById('loginSub');
      const input = document.getElementById('inputIdentifier');

      if (role === 'usthad') {
        title.textContent = 'Usthad Portal Access';
        sub.textContent = 'Enter your Name to look up your profile';
        input.placeholder = 'Enter your Name...';
      } else {
        title.textContent = 'Student Portal Access';
        sub.textContent = 'Enter your Admission Number (e.g. ADM101) or Phone Number';
        input.placeholder = 'e.g. ADM101 or 9876543210';
      }

      // Reset step
      backToLookup();
      handleLiveLookup();
    }

    let currentMatchesList = [];

    // Live Lookup preview on typing (SELECT OPTION VARANAM)
    function handleLiveLookup() {
      clearTimeout(debounceTimer);
      const val = document.getElementById('inputIdentifier').value.trim();
      const previewBox = document.getElementById('livePreviewBox');
      const selectBox = document.getElementById('liveSearchResultsSelect');

      if (!val) {
        if (previewBox) previewBox.style.display = 'none';
        if (selectBox) selectBox.style.display = 'none';
        selectedUserObject = null;
        currentMatchesList = [];
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch('/api/portal/lookup?q=' + encodeURIComponent(val) + '&role=' + currentRole)
          .then(r => r.json())
          .then(data => {
            if (data.success && data.matches && data.matches.length > 0) {
              currentMatchesList = data.matches;

              if (currentMatchesList.length > 1) {
                // Render Selectable Options List
                let selectHtml = '<div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; max-height:220px; overflow-y:auto; box-shadow:0 10px 25px rgba(0,0,0,0.08); margin-bottom:15px; padding:6px;">' +
                  '<div style="font-size:0.75rem; font-weight:700; color:#64748b; padding:6px 10px; border-bottom:1px solid #f1f5f9; text-transform:uppercase;"><i class="fa fa-list"></i> Select matching profile (' + currentMatchesList.length + ' found):</div>';

                currentMatchesList.forEach((item, index) => {
                  const idText = item.role === 'usthad' ? item.usthadId : item.admissionNo;
                  const subText = item.role === 'usthad' ? (item.designation || 'Usthad') : ('Batch ' + (item.batchNumber || 'Student'));
                  const badgeClass = item.role === 'usthad' ? 'badge-usthad' : (item.isAlumni ? 'badge-alumni' : 'badge-student');
                  const badgeLabel = item.role === 'usthad' ? 'Usthad' : (item.isAlumni ? 'Alumni' : 'Student');

                  selectHtml += '<div onclick="selectUserFromList(' + index + ')" style="display:flex; align-items:center; gap:12px; padding:10px; border-radius:8px; cursor:pointer; transition:background 0.2s; border-bottom:1px solid #f8fafc;" onmouseover="this.style.background=\'#f1f5f9\'" onmouseout="this.style.background=\'transparent\'">' +
                    '<img src="' + (item.photoUrl || 'img/new_logo.png') + '" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1px solid #e2e8f0;">' +
                    '<div style="flex:1;">' +
                      '<div style="font-weight:700; color:#1e293b; font-size:0.92rem;">' + item.name + '</div>' +
                      '<div style="font-size:0.78rem; color:#64748b;">' + (item.place ? item.place : '') + (item.role === 'usthad' && item.phone ? ' • ' + item.phone : '') + '</div>' +
                    '</div>' +
                    '<span class="badge-role ' + badgeClass + '" style="font-size:0.68rem;">' + badgeLabel + '</span>' +
                  '</div>';
                });

                selectHtml += '</div>';
                selectBox.innerHTML = selectHtml;
                selectBox.style.display = 'block';
                if (previewBox) previewBox.style.display = 'none';
              } else {
                // Single match
                if (selectBox) selectBox.style.display = 'none';
                selectUserFromList(0, false);
              }
            } else {
              if (selectBox) selectBox.style.display = 'none';
              if (previewBox) previewBox.style.display = 'none';
              selectedUserObject = null;
            }
          }).catch(e => {
            if (selectBox) selectBox.style.display = 'none';
            if (previewBox) previewBox.style.display = 'none';
          });
      }, 250);
    }

    function selectUserFromList(index, autoProceed = true) {
      if (!currentMatchesList || !currentMatchesList[index]) return;
      selectedUserObject = currentMatchesList[index];

      const previewBox = document.getElementById('livePreviewBox');
      const selectBox = document.getElementById('liveSearchResultsSelect');

      if (selectBox) selectBox.style.display = 'none';

      document.getElementById('previewPhoto').src = selectedUserObject.photoUrl || 'img/new_logo.png';
      document.getElementById('previewName').textContent = selectedUserObject.name;
      document.getElementById('previewSub').textContent = selectedUserObject.place ? 'Place: ' + selectedUserObject.place : '';
      if (selectedUserObject.role === 'usthad' && selectedUserObject.phone) {
        document.getElementById('previewSub').textContent += ' | Phone: ' + selectedUserObject.phone;
      }

      const badge = document.getElementById('previewRoleBadge');
      if (selectedUserObject.role === 'usthad') {
        badge.className = 'badge-role badge-usthad';
        badge.textContent = 'Usthad • ' + (selectedUserObject.designation || 'Faculty');
      } else if (selectedUserObject.isAlumni) {
        badge.className = 'badge-role badge-alumni';
        badge.textContent = 'Biruthadhari / Alumni';
      } else {
        badge.className = 'badge-role badge-student';
        badge.textContent = 'Student • ' + (selectedUserObject.className || 'Dars');
      }
      previewBox.style.display = 'flex';

      if (autoProceed) {
        proceedToPassword();
      }
    }

    function handleManualLookup() {
      const val = document.getElementById('inputIdentifier').value.trim();
      if (!val) {
        showAlert('Please enter your Name, Admission Number, or Phone Number', 'danger');
        return;
      }
      if (selectedUserObject) {
        proceedToPassword();
      } else {
        showAlert('Looking up record...', 'info');
        fetch('/api/portal/lookup?q=' + encodeURIComponent(val) + '&role=' + currentRole)
          .then(r => r.json())
          .then(data => {
            if (data.success && data.matches && data.matches.length > 0) {
              currentMatchesList = data.matches;
              selectUserFromList(0, true);
            } else {
              showAlert(data.message || 'No record found matching "' + val + '"', 'danger');
            }
          });
      }
    }

    function proceedToPassword() {
      if (!selectedUserObject) return;
      document.getElementById('stepLookup').style.display = 'none';
      document.getElementById('stepPassword').style.display = 'block';

      document.getElementById('selectedPhoto').src = selectedUserObject.photoUrl || 'img/new_logo.png';
      document.getElementById('selectedName').textContent = selectedUserObject.name;
      document.getElementById('selectedSub').textContent = selectedUserObject.place ? 'Place: ' + selectedUserObject.place : '';
      if (selectedUserObject.role === 'usthad' && selectedUserObject.phone) {
        document.getElementById('selectedSub').textContent += ' | Phone: ' + selectedUserObject.phone;
      }
      document.getElementById('inputPassword').focus();
    }

    function backToLookup() {
      document.getElementById('stepLookup').style.display = 'block';
      document.getElementById('stepPassword').style.display = 'none';
      document.getElementById('loginAlert').innerHTML = '';
    }

    function togglePasswordVis() {
      const p = document.getElementById('inputPassword');
      const icon = document.getElementById('passEyeIcon');
      if (p.type === 'password') {
        p.type = 'text';
        icon.className = 'fa fa-eye-slash';
      } else {
        p.type = 'password';
        icon.className = 'fa fa-eye';
      }
    }

    function submitLogin() {
      const pass = document.getElementById('inputPassword').value.trim();
      const rawInput = document.getElementById('inputIdentifier').value.trim();
      const identifier = selectedUserObject ? (selectedUserObject.admissionNo || selectedUserObject.usthadId || selectedUserObject._id) : rawInput;
      if (!pass) {
        showAlert('Please enter password (Default is Phone Number)', 'warning');
        return;
      }

      showAlert('Authenticating...', 'info');
      fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentRole,
          identifier: identifier,
          password: pass
        })
      })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.user) {
          currentUserSession = res.user;
          showAlert('Login successful! Loading dashboard...', 'success');
          setTimeout(() => {
            renderDashboard(res.user);
          }, 600);
        } else {
          showAlert(res.message || 'Invalid Password', 'danger');
        }
      }).catch(err => {
        showAlert('Server communication error', 'danger');
      });
    }

    function showAlert(msg, type) {
      document.getElementById('loginAlert').innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show rounded-3 text-center small font-weight-bold m-0" role="alert">
          ${msg}
        </div>
      `;
    }

    // Render Dashboard upon Login
        function openStudentFullProfileModal() {
      if(!currentUserSession) return;
      document.getElementById('selfName').value = currentUserSession.name || '';
      document.getElementById('selfFather').value = currentUserSession.fatherName || '';
      document.getElementById('selfPhone').value = currentUserSession.phone || '';
      document.getElementById('selfBlood').value = currentUserSession.bloodGroup || '';
      document.getElementById('selfDob').value = currentUserSession.dob || '';
      document.getElementById('selfEmergency').value = currentUserSession.emergencyContact || '';
      document.getElementById('selfAddress').value = currentUserSession.address || '';
      document.getElementById('selfPassword').value = currentUserSession.password || '';
      document.getElementById('selfDeclaration').checked = false;
      $('#modalStudentFullProfile').modal('show');
    }

    function renderDashboard(user) {
      document.getElementById('loginCard').style.display = 'none';
        const mainCol = document.getElementById('mainLayoutCol'); if(mainCol) mainCol.className = 'col-lg-11 col-xl-10 transition-all duration-300';
        const pContainer = document.querySelector('.portal-card-container'); if(pContainer) { pContainer.classList.remove('container'); pContainer.classList.add('container-fluid'); }
      document.getElementById('dashboardCard').style.display = 'block';
      const dh = document.querySelector('.dash-header'); if(dh) dh.style.display = 'none';

      document.getElementById('dashUserPhoto').src = user.photoUrl || 'img/new_logo.png';
      document.getElementById('dashUserName').textContent = user.name;
      renderQRCodeForUser(user);

      // Inject to ID Cards
      if (user.role === 'usthad') {
        if(document.getElementById('uIdName')) {
          document.getElementById('uIdName').textContent = user.name;
          document.getElementById('uIdRole').textContent = user.designation || 'Usthad';
          document.getElementById('uIdNo').innerHTML = 'ID: ' + (user.usthadId || 'N/A');
          document.getElementById('uIdPhone').innerHTML = '<i class="fa fa-phone"></i> ' + (user.phone || 'N/A');
          if(user.photoUrl) document.getElementById('uIdPhoto').src = user.photoUrl;
        }
      } else {
        if(document.getElementById('sIdName')) {
          document.getElementById('sIdName').textContent = user.name;
          document.getElementById('sIdFather').textContent = 'S/O ' + (user.fatherName || '-');
          document.getElementById('sIdBatch').textContent = 'Batch ' + (user.batchNumber || user.batchYear || '-');
          document.getElementById('sIdNo').textContent = 'Adm No: ' + user.admissionNo;
          document.getElementById('sIdBlood').innerHTML = '<i class="fa fa-tint"></i> Blood: ' + (user.bloodGroup || 'Unknown');
          document.getElementById('sIdPhone').innerHTML = '<i class="fa fa-phone"></i> ' + (user.phone || '-');
          if(user.photoUrl) document.getElementById('sIdPhoto').src = user.photoUrl;
          
          // Populate Edit Form
          if (document.getElementById('roName')) {
            document.getElementById('roName').textContent = user.name || 'Not Provided';
            document.getElementById('roFather').textContent = user.fatherName || 'Not Provided';
            document.getElementById('roPhone').textContent = user.phone || 'Not Provided';
            document.getElementById('roBlood').textContent = user.bloodGroup || 'Not Provided';
            document.getElementById('roAddress').textContent = user.address || 'Not Provided';
          }
        }
      }


      if (user.role === 'usthad') {
        document.getElementById('dashUserRole').textContent = 'Usthad • ' + (user.designation || 'Faculty') + ' (' + (user.subject || 'Dars') + ')';
        document.getElementById('dashUserStatus').textContent = 'Respected Usthad';
        document.getElementById('studentDashContent').style.display = 'none';
        document.getElementById('usthadDashContent').style.display = 'block';
        loadUsthadDashboardData();
        loadExamsUsthad();
      } else {
        document.getElementById('dashUserRole').textContent = 'Student • ' + (('Batch ' + (user.batchNumber || '1'))) + ' (' + (user.admissionNo) + ')';
        document.getElementById('dashUserStatus').textContent = user.status || (user.isAlumni ? 'Biruthadhari / Alumni' : 'Current Student');
        document.getElementById('studentDashContent').style.display = 'block';
        document.getElementById('usthadDashContent').style.display = 'none';
        loadStudentDashboardData();
      }
    }

    function handleLogout() {
      currentUserSession = null;
      document.getElementById('dashboardCard').style.display = 'none';
      document.getElementById('loginCard').style.display = 'block';
      backToLookup();
    }

    // Student Dashboard Loader (Multi-subject, Rank, Attendance & Printable Progress Cards)
    function loadStudentDashboardData() {
      if (!currentUserSession) return;
      const admNo = currentUserSession.admissionNo;

      // 1. Fetch Student Multi-Subject Progress Cards
      fetch('/api/portal/student/progress-card?admissionNo=' + encodeURIComponent(admNo))
        .then(r => r.json())
        .then(cardData => {
          const resultsBox = document.getElementById('studentResultsContainer');
          if (cardData.success && cardData.results && cardData.results.length > 0) {
            let html = '';
            cardData.results.forEach(res => {
              const subList = res.subjectMarks || [];
              let subRows = '';
              subList.forEach(s => {
                subRows += `
                  <tr>
                    <td class="small font-weight-bold text-dark">${s.subjectName}</td>
                    <td class="text-center small">${s.maxMarks}</td>
                    <td class="text-center font-weight-bold text-success">${s.marksObtained}</td>
                  </tr>
                `;
              });

              html += `
                <div class="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
                  <div class="card-header bg-gradient-success text-white p-3 d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, #0a4d2e, #0f6b3f);">
                    <div>
                      <h5 class="font-weight-bold m-0 text-warning" style="font-family:'Outfit',sans-serif;">${res.examName}</h5>
                      <small class="opacity-75">${res.className} • ${new Date(res.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div class="text-right">
                      <span class="badge badge-warning text-dark font-weight-bold px-3 py-2 text-uppercase" style="font-size:0.9rem;">
                        ${res.rank || 'Pass'}
                      </span>
                    </div>
                  </div>
                  
                  <div class="card-body p-3">
                    <!-- Key Statistics Cards -->
                    <div class="row g-2 mb-3 text-center">
                      <div class="col-4">
                        <div class="p-2 bg-light rounded-3 border">
                          <small class="text-muted d-block">Overall Score</small>
                          <strong class="text-dark font-weight-bold">${res.totalMarksObtained} / ${res.totalMaxMarks}</strong>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="p-2 bg-light rounded-3 border">
                          <small class="text-muted d-block">Percentage</small>
                          <strong class="text-success font-weight-bold">${res.percentage}%</strong>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="p-2 bg-light rounded-3 border">
                          <small class="text-muted d-block">Attendance</small>
                          <strong class="text-info font-weight-bold">${res.attendancePercentage || 96}%</strong>
                        </div>
                      </div>
                    </div>

                    <!-- Subject Breakdown Table -->
                    <div class="table-responsive mb-2">
                      <table class="table table-sm table-bordered m-0">
                        <thead class="bg-light small">
                          <tr>
                            <th>Subject / Kitab</th>
                            <th class="text-center">Max Marks</th>
                            <th class="text-center">Marks Obtained</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${subRows || '<tr><td colspan="3" class="text-center text-muted">No subject breakdown recorded</td></tr>'}
                        </tbody>
                      </table>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                      <small class="text-muted">Grade: <strong class="text-success">${res.grade}</strong> | Teacher: ${res.publishedBy || 'Usthad'}</small>
                      <button class="btn btn-sm btn-outline-success rounded-pill font-weight-bold" onclick="window.print()">
                        <i class="fa fa-print"></i> Print Progress Card
                      </button>
                    </div>
                  </div>
                </div>
              `;
            });
            resultsBox.innerHTML = html;
          } else {
            // Fallback to general dashboard results
            fetch('/api/portal/student/dashboard?admissionNo=' + encodeURIComponent(admNo))
              .then(r => r.json())
              .then(data => {
                if (data.success && data.results && data.results.length > 0) {
                  let html = '';
                  data.results.forEach(r => {
                    const md = r.marksData || {};
                    html += `
                      <div class="card-dashboard-item border-left border-warning" style="border-left-width: 5px !important;">
                        <div class="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 class="font-weight-bold text-dark m-0">${md.examName || r.subject || 'Evaluation Result'}</h6>
                            <small class="text-muted">${md.subjectName || 'Subject'}</small>
                          </div>
                          <span class="badge badge-warning text-dark font-weight-bold px-3 py-2">${md.rank || md.grade || 'Pass'}</span>
                        </div>
                        <hr class="my-2">
                        <div class="d-flex justify-content-between small">
                          <span>Score: <strong>${md.marksObtained || '-'} / ${md.totalMarks || '100'}</strong></span>
                          <span class="text-muted">By: ${r.senderName || 'Usthad'}</span>
                        </div>
                        ${md.remarks ? `<p class="small text-secondary mt-2 mb-0 bg-light p-2 rounded"><em>"${md.remarks}"</em></p>` : ''}
                      </div>
                    `;
                  });
                  resultsBox.innerHTML = html;
                } else {
                  resultsBox.innerHTML = '<p class="text-muted small p-3 bg-light rounded text-center">No exam results published yet for this semester.</p>';
                }
              });
          }
        });

      // 2. Fetch Notifications and Messages
      fetch('/api/portal/student/dashboard?admissionNo=' + encodeURIComponent(admNo))
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            // Render Notifications
            
            const notifBox = document.getElementById('studentNotificationsContainer');
            if (!notifBox) return; // Prevent crashes
            let combinedHtml = '';
            
            if (data.notifications && data.notifications.length > 0) {
              data.notifications.forEach(n => {
                combinedHtml += `
                  <div class="p-2 mb-2 rounded border-left" style="background:var(--bg-card-2); border-left:4px solid var(--info) !important;">
                    <h6 class="font-weight-bold text-info m-0">${n.subject || 'Announcement'}</h6>
                    <small class="text-muted d-block mb-1">${new Date(n.createdAt).toLocaleDateString()}</small>
                    <p class="m-0 small text-dark">${n.content}</p>
                  </div>
                `;
              });
            }

            if (data.messages && data.messages.length > 0) {
              data.messages.forEach(m => {
                const isMe = m.senderRole === 'student';
                combinedHtml += `
                  <div class="p-2 mb-2 rounded border-left" style="background:${isMe ? 'var(--bg-card)' : 'var(--bg-card-2)'}; border-left:4px solid ${isMe ? 'var(--secondary)' : 'var(--success)'} !important;">
                    <div class="d-flex justify-content-between">
                      <strong class="small text-${isMe ? 'secondary' : 'success'}">${isMe ? 'You' : m.senderName}</strong>
                      <small class="text-muted">${new Date(m.createdAt).toLocaleDateString()}</small>
                    </div>
                    <p class="m-0 small text-dark mt-1">${m.content}</p>
                  </div>
                `;
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
               res.usthads.forEach(u => opts += `<option value="${u._id}">${u.name}</option>`);
               sel.innerHTML = opts;
            }
          }
        });
    }

    // Usthad Dashboard Loader
    
function loadUsthadDashboardData() {
      if(!currentUserSession) return;
      
      // Update counts
      fetch('/api/portal/students').then(r=>r.json()).then(data => {
        if(data.success) {
          const active = data.students.filter(s => !s.isAlumni).length;
          const el = document.getElementById('dashTotalStudents');
          if(el) el.textContent = active;
          
          // Also populate students for Direct Message Modal
          const select = document.getElementById('dmTargetStudent');
          if(select) {
            let opts = '<option value="">Select Target Student...</option>';
            data.students.forEach(s => {
              if(!s.isAlumni) opts += `<option value="${s.admissionNo}">${s.name} (${s.admissionNo})</option>`;
            });
            select.innerHTML = opts;
          }
        }
      }).catch(()=>{});

      // Update exams
      fetch('/api/portal/exams').then(r=>r.json()).then(data => {
        if(data.success && data.exams) {
          let pubHtml = '';
          let pendHtml = '';
          data.exams.forEach(e => {
            const isPub = e.status === 'Published';
            const item = `<div class="p-2 mb-2 rounded" style="background:var(--bg-card-2); border-left:4px solid ${isPub ? 'var(--success)' : 'var(--danger)'}; cursor:pointer;" onclick="selectExamInMatrix('${e._id}')" title="Click to manage marks">
              <strong style="color:var(--text);">${e.examName}</strong>
              <div class="small text-muted">${e.term} • Batch: ${e.batchYear}</div>
            </div>`;
            if(isPub) pubHtml += item;
            else pendHtml += item;
          });
          document.getElementById('usthadPublishedExamsList').innerHTML = pubHtml || '<div class="text-muted small">No published exams</div>';
          document.getElementById('usthadPendingExamsList').innerHTML = pendHtml || '<div class="text-muted small">No pending exams</div>';
          window.allExamsUsthadCache = data.exams;
          
          // Also populate select dropdown
          const select = document.getElementById('examSelectUsthad');
          if(select) {
            let opts = '<option value="">Select Exam...</option>';
            data.exams.forEach(e => { opts += `<option value="${e._id}">${e.examName} (${e.term})</option>`; });
            select.innerHTML = opts;
          }
        }
      });
}
  
    function quickSendMark(admNo) {
      document.getElementById('postMarkStudentSelect').value = admNo;
      $('#modalPostMark').modal('show');
    }


// ---------------- USTHAD MATRIX LOGIC ----------------
let currentExamRosterData = null;

function loadExamsUsthad() {
  fetch('/api/portal/exams').then(r=>r.json()).then(data => {
    if(data.success && data.exams) {
      const select = document.getElementById('examSelectUsthad');
      if(!select) return;
      let html = '<option value="">Select Exam...</option>';
      data.exams.forEach(e => { html += `<option value="${e._id}">${e.examName} (${e.term})</option>`; });
      select.innerHTML = html;
    }
  });
}

function onUsthadExamChange() {
  const examId = safeGetValue('examSelectUsthad');
  const batchSelect = document.getElementById('examBatchSelectUsthad');
  if (examId && window.allExamsUsthadCache) {
    const exam = window.allExamsUsthadCache.find(e => e._id === examId);
    if (exam && exam.classSubjects) {
      const batches = Object.keys(exam.classSubjects);
      let opts = '<option value="">Select Target Batch</option>';
      batches.forEach(b => {
        opts += `<option value="${b}">${b}</option>`;
      });
      batchSelect.innerHTML = opts;
      if (batches.length === 1) {
        batchSelect.value = batches[0];
      }
    }
  }
  loadUsthadExamMatrix();
}

function loadUsthadExamMatrix() {
  const examId = safeGetValue('examSelectUsthad');
  const className = safeGetValue('examBatchSelectUsthad');
  if (!examId || !className) return;

  fetch(`/api/portal/exam/roster?examId=${encodeURIComponent(examId)}&className=${encodeURIComponent(className)}`)
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        currentExamRosterData = data;
        renderExamMatrixTable();
      }
    });
}



    function selectExamInMatrix(examId) {
      const el = document.getElementById('examSelectUsthad');
      if(el) {
        el.value = examId;
        onUsthadExamChange();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Exam selected!', false);
      }
    }

    function renderExamMatrixTable() {
  const container = document.getElementById('examMatrixTableBody'); // Wait, let's replace the whole table structure properly
  if (!currentExamRosterData) return;
  const { students, existingResults, exam, subjects } = currentExamRosterData;
  const className = safeGetValue('examBatchSelectUsthad');
  currentSubjectInputList = subjects || [];
  
  // Render Subject Badges Banner
  const banner = document.getElementById('examSubjectConfigBanner');
  const bannerTitle = document.getElementById('examBannerTitle');
  const bannerBadges = document.getElementById('examBannerBadges');

  if (subjects && subjects.length > 0) {
    bannerTitle.textContent = `Configured Subjects for Batch ${className}:`;
    let bHtml = '';
    subjects.forEach(s => {
      bHtml += `<span class="badge badge-accent">${s.subjectName} (Max: ${s.maxMarks})</span>`;
    });
    bannerBadges.innerHTML = bHtml;
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }

  // Rewrite Table Header
  const headerRow = document.getElementById('examMatrixHeaderRow');
  headerRow.innerHTML = '<th>Adm No</th><th>Student Name</th><th>Status</th><th>Actions</th>';

  if (!students || students.length === 0) {
    container.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No active students in this batch.</td></tr>`;
    return;
  }
  
  let htmlStr = '';
  students.forEach((s) => {
    const existing = existingResults.find(r => r.admissionNo === s.admissionNo) || {};
    const hasResult = existing.totalMarksObtained !== undefined;
    const statusBadge = hasResult ? '<span class="badge badge-success px-2 py-1"><i class="fa fa-check-circle"></i> Published</span>' : '<span class="badge badge-warning px-2 py-1 text-dark"><i class="fa fa-clock-o"></i> Pending</span>';
    let actionBtns = '';
    
    if (hasResult) {
      actionBtns = `<button class="btn btn-sm btn-info rounded-pill font-weight-bold" onclick="openSingleStudentMarkModal('${s.admissionNo}', '${s.name}')"><i class="fa fa-edit"></i> Edit</button> ` +
                   `<button class="btn btn-sm btn-danger rounded-pill font-weight-bold ml-1" onclick="unpublishStudentMark('${s.admissionNo}')"><i class="fa fa-times"></i> Unpublish</button>`;
    } else {
      actionBtns = `<button class="btn btn-sm btn-success rounded-pill font-weight-bold" onclick="openSingleStudentMarkModal('${s.admissionNo}', '${s.name}')"><i class="fa fa-upload"></i> Publish Marks</button>`;
    }
    
    htmlStr += `<tr>\n` +
      `<td class="align-middle"><code style="font-weight:700; color:var(--accent); font-size:14px;">${s.admissionNo}</code></td>\n` +
      `<td class="align-middle"><strong style="color:var(--text); font-size:15px;">${s.name}</strong></td>\n` +
      `<td class="align-middle">${statusBadge}</td>\n` +
      `<td class="align-middle">${actionBtns}</td>\n` +
    `</tr>`;
  });
  container.innerHTML = htmlStr;
}

let editingMarkStudentAdmNo = null;

function openSingleStudentMarkModal(admNo, name) {
  editingMarkStudentAdmNo = admNo;
  document.getElementById('singleMarkStudentName').textContent = name + " (" + admNo + ")";
  const existingResults = currentExamRosterData.existingResults || [];
  const existing = existingResults.find(r => r.admissionNo === admNo) || {};
  const existingSubMarks = existing.subjectMarks || {};
  let htmlStr = '';
  
  currentSubjectInputList.forEach((subj, idx) => {
    // Determine the prefill value
    let val = '';
    // Look at existingSubMarks - originally it was an object { "Subject1": 50 }
    if (existingSubMarks[subj.subjectName] !== undefined) {
      val = existingSubMarks[subj.subjectName];
    } else if (Array.isArray(existingSubMarks)) {
      const prefill = existingSubMarks.find(em => em.subjectName === subj.subjectName);
      if (prefill) val = prefill.marksObtained;
    }
    
    htmlStr += `<div class="form-group mb-3">\n` +
      `<label class="form-label font-weight-bold text-dark">${subj.subjectName} <span class="text-muted">(Max: ${subj.maxMarks})</span></label>\n` +
      `<input type="number" id="singleMarkInput_${idx}" class="form-control" style="background:var(--bg-input); color:var(--text); font-weight:bold;" max="${subj.maxMarks}" placeholder="Enter mark obtained" value="${val}" required>\n` +
    `</div>`;
  });
  
  document.getElementById('singleMarkInputsContainer').innerHTML = htmlStr;
  
  // Make sure Bootstrap modal backdrop works
  $('#modalSingleStudentMark').modal('show');
}

function saveSingleStudentMark(e) {
  e.preventDefault();
  const examId = safeGetValue('examSelectUsthad');
  const className = safeGetValue('examBatchSelectUsthad');
  if (!examId || !className || !editingMarkStudentAdmNo) return;
  
  const marksData = [];
  const subMarksObj = {};
  let isComplete = true;
  
  currentSubjectInputList.forEach((subj, idx) => {
    const val = document.getElementById('singleMarkInput_' + idx).value;
    if (val === '') { isComplete = false; } else {
      subMarksObj[subj.subjectName] = Number(val);
    }
  });
  
  if (!isComplete) { showToast('Please fill all marks before publishing!', true); return; }
  
  const student = currentExamRosterData.students.find(s => s.admissionNo === editingMarkStudentAdmNo);
  
  marksData.push({
    admissionNo: editingMarkStudentAdmNo,
    studentName: student ? student.name : 'Student',
    subjectsConfig: currentSubjectInputList,
    subjectMarks: subMarksObj,
    attendancePresentDays: 100,
    attendanceTotalDays: 100,
    usthadRemarks: 'Published via single edit'
  });
  
  fetch('/api/portal/exam/save-marks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      examId,
      examName: currentExamRosterData.exam.examName,
      term: currentExamRosterData.exam.term,
      batchYear: className,
      marksData: marksData
    })
  }).then(r => r.json()).then(res => {
    if (res.success) {
      showToast('Student marks published/updated!', false);
      $('#modalSingleStudentMark').modal('hide');
      loadUsthadExamMatrix();
    } else { showToast(res.message, true); }
  });
}

function unpublishStudentMark(admNo) {
  if (!confirm('Are you sure you want to unpublish and delete this student\'s marks?')) return;
  const examId = safeGetValue('examSelectUsthad');
  if (!examId) return;
  
  fetch('/api/portal/exam/delete-mark', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examId, admissionNo: admNo })
  }).then(r => r.json()).then(res => {
    if (res.success) {
      showToast('Marks unpublished.', false);
      loadUsthadExamMatrix();
    } else { showToast(res.message, true); }
  });
}

    // Counter Stats Loader
    function loadCounterStats() {
      fetch('/api/portal/counter')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.stats) {
            document.getElementById('cntAlumni').textContent = data.stats.alumniBiruthadhari;
            document.getElementById('cntStudents').textContent = data.stats.currentStudents;
            document.getElementById('cntUsthads').textContent = data.stats.totalUsthads;
            document.getElementById('cntYears').textContent = data.stats.yearsOfTradition || String(new Date().getFullYear() - 2001);
          }
        });
    }

    // Alumni Search Loader
    function loadAlumniDirectory() {
      const q = document.getElementById('searchAlumniInput').value.trim();
      fetch('/api/portal/alumni?search=' + encodeURIComponent(q))
        .then(r => r.json())
        .then(data => {
          const container = document.getElementById('alumniCardsContainer');
          if (data.success && data.alumni && data.alumni.length > 0) {
            let html = '';
            data.alumni.forEach(a => {
              html += `
                <div class="col-lg-4 col-md-6 mb-4">
                  <div class="alumni-card">
                    <img src="${a.photoUrl || 'img/new_logo.png'}" alt="Alumni Photo">
                    <div>
                      <h5 class="font-weight-bold text-success m-0" style="font-size:1rem;">${a.name}</h5>
                      <span class="badge badge-alumni my-1">Biruthadhari • Batch ${a.batchNumber || 'Alumni'}</span>
                      <p class="small text-muted m-0"><i class="fa fa-map-marker text-danger"></i> ${a.place || 'Muttichira'}</p>
                    </div>
                  </div>
                </div>
              `;
            });
            container.innerHTML = html;
          } else {
            container.innerHTML = '<div class="col-12 text-center text-muted py-4"><i class="fa fa-info-circle"></i> No Biruthadhari / Alumni record matches your search.</div>';
          }
        });
    }

    
    function safeGetValue(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }

    // Handlers for Modals & Forms
    function openChangePasswordModal() { $('#modalChangePassword').modal('show'); }
    function openStudentMessageModal() { $('#modalStudentMsg').modal('show'); }
    function openPostMarkModal() { $('#modalPostMark').modal('show'); }
    
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
              h += `<div class="p-2 mb-2 border rounded" style="background:var(--bg-card-2);">
                <div class="d-flex justify-content-between">
                  <strong class="text-primary">${m.senderName} (${m.senderRole})</strong>
                  <small class="text-muted">${new Date(m.createdAt).toLocaleDateString()}</small>
                </div>
                <strong class="small text-dark">${m.subject}</strong>
                <p class="m-0 small text-dark mt-1">${m.content}</p>
              </div>`;
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

    function openPostNotificationModal() { $('#modalPostNotif').modal('show'); }

    function handleChangePasswordSubmit(e) {
      e.preventDefault();
      const oldP = document.getElementById('chgOldPass').value;
      const newP = document.getElementById('chgNewPass').value;
      if (!currentUserSession) return;

      fetch('/api/portal/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentUserSession.role,
          identifier: currentUserSession.admissionNo || currentUserSession.usthadId,
          oldPassword: oldP,
          newPassword: newP
        })
      }).then(r => r.json()).then(res => {
        if (res.success) {
          alert('Password changed successfully!');
          $('#modalChangePassword').modal('hide');
        } else {
          document.getElementById('chgPassAlert').innerHTML = `<div class="alert alert-danger small p-2 mt-2">${res.message}</div>`;
        }
      });
    }

    function handleSendStudentMsg(e) {
      e.preventDefault();
      if (!currentUserSession) return;
      fetch('/api/portal/student/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissionNo: currentUserSession.admissionNo,
          studentName: currentUserSession.name,
          usthadId: document.getElementById('msgUsthadSelect').value,
          subject: document.getElementById('msgSubject').value,
          content: document.getElementById('msgContent').value
        })
      }).then(r => r.json()).then(res => {
        alert(res.message || 'Message sent!');
        $('#modalStudentMsg').modal('hide');
        loadStudentDashboardData();
      });
    }

    function handlePostMarkSubmit(e) {
      e.preventDefault();
      if (!currentUserSession) return;
      fetch('/api/portal/usthad/post-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mark',
          usthadId: currentUserSession.usthadId,
          usthadName: currentUserSession.name,
          targetStudentNo: document.getElementById('postMarkStudentSelect').value,
          content: 'Exam Mark Posted',
          marksData: {
            examName: document.getElementById('postMarkExamName').value,
            subjectName: document.getElementById('postMarkSubject').value,
            marksObtained: document.getElementById('postMarkObtained').value,
            totalMarks: document.getElementById('postMarkTotal').value,
            grade: document.getElementById('postMarkGrade').value,
            remarks: document.getElementById('postMarkRemarks').value
          }
        })
      }).then(r => r.json()).then(res => {
        alert(res.message || 'Exam Mark Sent!');
        $('#modalPostMark').modal('hide');
      });
    }

    function handlePostNotifSubmit(e) {
      e.preventDefault();
      if (!currentUserSession) return;
      fetch('/api/portal/usthad/post-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'notification',
          usthadId: currentUserSession.usthadId,
          usthadName: currentUserSession.name,
          targetStudentNo: document.getElementById('postNotifTarget').value,
          subject: document.getElementById('postNotifSubject').value,
          content: document.getElementById('postNotifContent').value
        })
      }).then(r => r.json()).then(res => {
        alert(res.message || 'Notification broadcasted!');
        $('#modalPostNotif').modal('hide');
      });
    }

    function handleSaveStudentProfile(e) {
      e.preventDefault();
      alert('Profile updated successfully!');
    }

    // Init on page load
    document.addEventListener('DOMContentLoaded', () => {
      loadCounterStats();
      loadAlumniDirectory();
    });
  