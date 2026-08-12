
    let currentRole = 'student';
    let selectedUserObject = null;
    let currentUserSession = null;
    let debounceTimer = null;

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
        sub.textContent = 'Enter your Usthad ID (e.g. UST101) or Phone Number';
        input.placeholder = 'e.g. UST101 or 9526919218';
      } else {
        title.textContent = 'Student Portal Access';
        sub.textContent = 'Enter your Admission Number (e.g. ADM101) or Phone Number';
        input.placeholder = 'e.g. ADM101 or 9876543210';
      }

      // Reset step
      backToLookup();
      handleLiveLookup();
    }

    // Live Lookup preview on typing
    function handleLiveLookup() {
      clearTimeout(debounceTimer);
      const val = document.getElementById('inputIdentifier').value.trim();
      const previewBox = document.getElementById('livePreviewBox');

      if (!val || val.length < 3) {
        previewBox.style.display = 'none';
        selectedUserObject = null;
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch('/api/portal/lookup?q=' + encodeURIComponent(val))
          .then(r => r.json())
          .then(data => {
            if (data.success && data.user) {
              selectedUserObject = data.user;
              document.getElementById('previewPhoto').src = data.user.photoUrl || 'img/new_logo.png';
              document.getElementById('previewName').textContent = data.user.name;
              document.getElementById('previewSub').textContent = (data.user.role === 'usthad' ? 'ID: ' : 'Adm No: ') + (data.user.admissionNo || data.user.usthadId);
              
              const badge = document.getElementById('previewRoleBadge');
              if (data.user.role === 'usthad') {
                badge.className = 'badge-role badge-usthad';
                badge.textContent = 'Usthad • ' + (data.user.designation || 'Faculty');
              } else if (data.user.isAlumni) {
                badge.className = 'badge-role badge-alumni';
                badge.textContent = 'Biruthadhari / Alumni';
              } else {
                badge.className = 'badge-role badge-student';
                badge.textContent = 'Student • ' + (data.user.className || 'Dars');
              }
              previewBox.style.display = 'flex';
            } else {
              previewBox.style.display = 'none';
              selectedUserObject = null;
            }
          }).catch(e => { previewBox.style.display = 'none'; });
      }, 300);
    }

    function handleManualLookup() {
      const val = document.getElementById('inputIdentifier').value.trim();
      if (!val) {
        showAlert('Please enter your Admission Number or Phone Number', 'danger');
        return;
      }
      if (selectedUserObject) {
        proceedToPassword();
      } else {
        showAlert('Looking up record...', 'info');
        fetch('/api/portal/lookup?q=' + encodeURIComponent(val))
          .then(r => r.json())
          .then(data => {
            if (data.success && data.user) {
              selectedUserObject = data.user;
              proceedToPassword();
            } else {
              showAlert(data.message || 'No record found with this ID/Phone. Default password is your phone number.', 'danger');
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
      document.getElementById('selectedSub').textContent = (selectedUserObject.role === 'usthad' ? 'ID: ' : 'Adm No: ') + (selectedUserObject.admissionNo || selectedUserObject.usthadId);
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
      const identifier = document.getElementById('inputIdentifier').value.trim();
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
    function renderDashboard(user) {
      document.getElementById('loginCard').style.display = 'none';
      document.getElementById('dashboardCard').style.display = 'block';

      document.getElementById('dashUserPhoto').src = user.photoUrl || 'img/new_logo.png';
      document.getElementById('dashUserName').textContent = user.name;

      if (user.role === 'usthad') {
        document.getElementById('dashUserRole').textContent = 'Usthad • ' + (user.designation || 'Faculty') + ' (' + (user.subject || 'Dars') + ')';
        document.getElementById('dashUserStatus').textContent = 'Respected Usthad';
        document.getElementById('studentDashContent').style.display = 'none';
        document.getElementById('usthadDashContent').style.display = 'block';
        loadUsthadDashboardData();
      } else {
        document.getElementById('dashUserRole').textContent = 'Student • ' + (user.className || 'Dars') + ' (' + (user.admissionNo) + ')';
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

    // Student Dashboard Loader
    function loadStudentDashboardData() {
      if (!currentUserSession) return;
      const admNo = currentUserSession.admissionNo;

      fetch('/api/portal/student/dashboard?admissionNo=' + encodeURIComponent(admNo))
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            // Render Marks
            const resultsBox = document.getElementById('studentResultsList');
            if (data.results && data.results.length > 0) {
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
                      <span class="badge badge-warning text-dark font-weight-bold px-3 py-2">Grade: ${md.grade || 'Pass'}</span>
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
              resultsBox.innerHTML = '<p class="text-muted small">No exam marks published yet.</p>';
            }

            // Render Notifications
            const notifBox = document.getElementById('studentNotificationsList');
            if (data.notifications && data.notifications.length > 0) {
              let html = '';
              data.notifications.forEach(n => {
                html += `
                  <div class="card-dashboard-item border-left border-info" style="border-left-width: 5px !important;">
                    <h6 class="font-weight-bold text-info m-0">${n.subject || 'Announcement'}</h6>
                    <small class="text-muted d-block mb-2">${new Date(n.createdAt).toLocaleDateString()}</small>
                    <p class="m-0 small text-dark">${n.content}</p>
                  </div>
                `;
              });
              notifBox.innerHTML = html;
            } else {
              notifBox.innerHTML = '<p class="text-muted small">No notifications posted yet.</p>';
            }

            // Render Messages
            const msgBox = document.getElementById('studentMessagesList');
            if (data.messages && data.messages.length > 0) {
              let html = '';
              data.messages.forEach(m => {
                const isMe = m.senderRole === 'student';
                html += `
                  <div class="card-dashboard-item ${isMe ? 'bg-light' : 'border-success'} mb-2">
                    <div class="d-flex justify-content-between">
                      <strong class="small text-${isMe ? 'secondary' : 'success'}">${isMe ? 'You' : m.senderName}</strong>
                      <small class="text-muted">${new Date(m.createdAt).toLocaleDateString()}</small>
                    </div>
                    <p class="m-0 small text-dark mt-1">${m.content}</p>
                  </div>
                `;
              });
              msgBox.innerHTML = html;
            } else {
              msgBox.innerHTML = '<p class="text-muted small">No message history with Usthads.</p>';
            }

            // Fill Edit Profile Form
            document.getElementById('editStudentPhone').value = data.student.phone || '';
            document.getElementById('editStudentPlace').value = data.student.place || '';
            document.getElementById('editStudentPhoto').value = data.student.photoUrl || '';
            document.getElementById('editStudentBio').value = data.student.bio || '';
          }
        });
    }

    // Usthad Dashboard Loader
    function loadUsthadDashboardData() {
      fetch('/api/portal/students')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.students) {
            const table = document.getElementById('usthadStudentRosterTable');
            const select = document.getElementById('postMarkStudentSelect');
            let html = '';
            let selectOptions = '<option value="">Select Student...</option>';

            data.students.forEach(s => {
              selectOptions += `<option value="${s.admissionNo}">${s.name} (${s.admissionNo}) - ${s.className || 'Dars'}</option>`;
              html += `
                <tr>
                  <td><strong>${s.admissionNo}</strong></td>
                  <td>${s.name}</td>
                  <td>${s.className || 'Dars'}</td>
                  <td><span class="badge ${s.isAlumni ? 'badge-primary' : 'badge-success'}">${s.status || 'Student'}</span></td>
                  <td>
                    <button class="btn btn-xs btn-outline-warning text-dark font-weight-bold" onclick="quickSendMark('${s.admissionNo}')">
                      Send Mark
                    </button>
                  </td>
                </tr>
              `;
            });
            table.innerHTML = html;
            select.innerHTML = selectOptions;
          }
        });
    }

    // Usthad Quick Send Mark
    function quickSendMark(admNo) {
      document.getElementById('postMarkStudentSelect').value = admNo;
      $('#modalPostMark').modal('show');
    }

    // Counter Stats Loader
    function loadCounterStats() {
      fetch('/api/portal/counter')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.stats) {
            document.getElementById('cntAlumni').textContent = data.stats.alumniBiruthadhari + '+';
            document.getElementById('cntStudents').textContent = data.stats.currentStudents + '+';
            document.getElementById('cntUsthads').textContent = data.stats.totalUsthads;
            document.getElementById('cntCourses').textContent = data.stats.academicCourses;
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
                      <span class="badge badge-alumni my-1">Biruthadhari • Batch ${a.batchYear || 'Graduated'}</span>
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

    // Handlers for Modals & Forms
    function openChangePasswordModal() { $('#modalChangePassword').modal('show'); }
    function openStudentMessageModal() { $('#modalStudentMsg').modal('show'); }
    function openPostMarkModal() { $('#modalPostMark').modal('show'); }
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
  