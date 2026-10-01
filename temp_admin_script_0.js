
  /* 
═══════════════════════════════════════
     SAFE DOM HELPERS
═══════════════════════════════════════ 
*/
  function safeSetText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function safeSetHtml(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function safeSetValue(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  }
  function safeGetValue(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function safeAddListener(id, event, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener(event, fn);
  }
  
  /* 
═══════════════════════════════════════
     LOAD ALL
═══════════════════════════════════════ 
*/
  
/* ===========================================
   UNIFIED PORTAL USERS MANAGEMENT
=========================================== */
let allPortalUsersCache = [];
let currentPortalFilter = 'all';

function loadPortalUsersAdmin() {
  Promise.all([
    fetch('/api/portal/students').then(r => r.json()).catch(() => ({ success: false })),
    fetch('/api/portal/usthads').then(r => r.json()).catch(() => ({ success: false }))
  ]).then(([studentsData, usthadsData]) => {
    let users = [];
    
    let stList = [];
    if (Array.isArray(studentsData)) stList = studentsData;
    else if (studentsData && Array.isArray(studentsData.students)) stList = studentsData.students;
    else if (studentsData && Array.isArray(studentsData.data)) stList = studentsData.data;

    let ustList = [];
    if (Array.isArray(usthadsData)) ustList = usthadsData;
    else if (usthadsData && Array.isArray(usthadsData.usthads)) ustList = usthadsData.usthads;
    else if (usthadsData && Array.isArray(usthadsData.data)) ustList = usthadsData.data;

    users = [
      ...stList.map(s => ({ ...s, role: 'student' })),
      ...ustList.map(u => ({ ...u, role: 'usthad' }))
    ];
    
    allPortalUsersCache = users;
    
    const batchSet = new Set();
    stList.forEach(s => {
      if (s.batchNumber) batchSet.add(String(s.batchNumber));
    });
    const batchSelect = document.getElementById('portalBatchFilter');
    if (batchSelect) {
      const currentVal = batchSelect.value;
      let opts = '<option value="all">All Batches</option>';
      [...batchSet].sort((a,b)=>Number(a)-Number(b)).forEach(b => {
        opts += '<option value="' + b + '">Batch ' + b + '</option>';
      });
      batchSelect.innerHTML = opts;
      if (batchSet.has(currentVal)) batchSelect.value = currentVal;
    }

    safeSetText('badge-portal-users', users.length);
    safeSetText('badge-students', stList.length);
    safeSetText('badge-usthads', ustList.length);
    renderPortalUsersAdmin();
  }).catch((err) => {
    console.error('Portal users load error:', err);
    safeSetHtml('userTableBody', '<tr><td colspan="6" class="text-center text-danger py-4">Failed to load portal users. Check connection.</td></tr>');
  });
}

function loadOverview() {
  loadPortalUsersAdmin();
  fetch('/api/admissions').then(r => r.json()).then(d => {
    safeSetText('statAdmissions', Array.isArray(d) ? d.length : (d.admissions ? d.admissions.length : 0));
  }).catch(() => {});
  fetch('/api/news').then(r => r.json()).then(d => {
    safeSetText('statNews', Array.isArray(d) ? d.length : 0);
  }).catch(() => {});
  fetch('/api/gallery').then(r => r.json()).then(d => {
    safeSetText('statGallery', Array.isArray(d) ? d.length : 0);
  }).catch(() => {});
  fetch('/api/contacts').then(r => r.json()).then(d => {
    safeSetText('statContacts', Array.isArray(d) ? d.length : 0);
  }).catch(() => {});
  fetch('/api/subscribers').then(r => r.json()).then(d => {
    safeSetText('statSubscribers', Array.isArray(d) ? d.length : 0);
  }).catch(() => {});
}

function setPortalFilter(cat) {
  currentPortalFilter = cat;
  document.querySelectorAll('.portal-filter-btn').forEach(b => b.classList.remove('active'));
  var btn = document.getElementById('pfilter-' + cat.replace(/\s+/g, '-'));
  if (!btn) btn = document.getElementById('pfilter-' + cat);
  if (btn) btn.classList.add('active');
  renderPortalUsersAdmin();
}

function filterPortalUsersAdmin() {
  renderPortalUsersAdmin();
}

function renderPortalUsersAdmin() {
  var query = (safeGetValue('portalSearchInput') || '').toLowerCase().trim();
  var filtered = allPortalUsersCache.filter(u => {
    if (currentPortalFilter !== 'all') {
      if (currentPortalFilter === 'student' && u.role !== 'student') return false;
      if (currentPortalFilter === 'usthad' && u.role !== 'usthad') return false;
      if (currentPortalFilter === 'Alumni' || currentPortalFilter === 'Biruthadhari') {
        var isAlum = u.isAlumni || (u.status || '').toLowerCase().includes('alumni') || (u.status || '').toLowerCase().includes('biruthadhari');
        if (!isAlum) return false;
      }
    }
    if (query) {
      var nameMatch = (u.name || '').toLowerCase().includes(query);
      var idMatch = String(u.admissionNo || u.usthadId || '').toLowerCase().includes(query);
      var placeMatch = (u.place || '').toLowerCase().includes(query);
      var statusMatch = (u.status || ('Batch ' + u.batchNumber) || u.designation || '').toLowerCase().includes(query);
      return nameMatch || idMatch || placeMatch || statusMatch;
    }
    return true;
  });

  let html = '';
  filtered.forEach(u => {
    var idVal = u.admissionNo || u.usthadId || '—';
    var statusText = u.role === 'usthad' ? (u.designation || 'Usthad') : (u.status || 'Student');
    var isAlumniUser = u.isAlumni || (u.status || '').toLowerCase().includes('alumni') || (u.status || '').toLowerCase().includes('biruthadhari');
    var badgeClass = u.role === 'usthad' ? 'badge-accent' : (isAlumniUser ? 'badge-info' : 'badge-success');
    var details = u.role === 'usthad' ? (u.subject || '—') : ('Batch ' + (u.batchNumber || '—'));
    var phoneVal = u.phone || '—';

    html += '<tr>' +
      '<td><strong style="color:var(--text); font-weight:600;">' + (u.name || '—') + '</strong></td>' +
      '<td><span class="badge ' + badgeClass + '">' + statusText + '</span></td>' +
      '<td><code style="font-weight:700;color:var(--accent);">' + idVal + '</code></td>' +
      '<td>' + details + (u.place ? ' <small style="color:var(--text-soft);">(' + u.place + ')</small>' : '') + '</td>' +
      '<td><code style="color:var(--text-soft);">' + phoneVal + '</code></td>' +
      '<td><code style="color:var(--accent);">' + (u.password || phoneVal) + '</code></td>' +
      '<td><div class="action-buttons">' +
        '<button class="btn btn-primary btn-sm" onclick="editUserAdmin(\'' + (u._id || idVal) + '\', \'' + u.role + '\')"><i class="fa fa-edit"></i> Edit</button>' +
        '<button class="btn btn-danger btn-sm" onclick="' + (u.role === 'usthad' ? 'deleteUsthadAdmin' : 'deleteStudentAdmin') + '(\'' + (u._id || idVal) + '\')"><i class="fa fa-trash"></i> Delete</button>' +
      '</div></td>' +
    '</tr>';
  });

  safeSetHtml('userTableBody', html || '<tr><td colspan="6" class="text-center text-muted py-4">No matching records found.</td></tr>');
}

let editingUserId = null;
let editingUserRole = null;

function openAddUserModal() {
  try {
    console.log('Opening Add User Modal...');
  editingUserId = null;
  editingUserRole = null;
  document.getElementById('formAddStudentAdmin').reset();
  document.getElementById('previewStudentPhoto').src = 'img/new_logo.png';
  document.getElementById('formAddUsthadAdmin').reset();
  document.getElementById('previewUsthadPhoto').src = 'img/new_logo.png';
  document.querySelector('#formAddStudentAdmin button[type="submit"]').innerHTML = 'Save Student Record';
  document.querySelector('#formAddUsthadAdmin button[type="submit"]').innerHTML = 'Save Usthad Record';
  document.getElementById('unifiedAddUserModal').classList.add('show');
  } catch(e) {
    alert('Error opening modal: ' + e.message);
  }
}

function editUserAdmin(id, role) {
  try {
    const cleanId = String(id).trim();
    const user = allPortalUsersCache.find(u => {
      return (u._id && String(u._id).trim() === cleanId) || 
             (u.admissionNo && String(u.admissionNo).trim() === cleanId) || 
             (u.usthadId && String(u.usthadId).trim() === cleanId);
    });
    if (!user) { alert("User not found! ID: " + id); return; }
    editingUserId = user._id || id;
    editingUserRole = role;

    document.getElementById('unifiedAddUserModal').classList.add('show');
    switchUnifiedRole(role);
    
    if (role === 'student') {
      safeSetVal('adminStudentName', user.name);
      safeSetVal('adminStudentFather', user.fatherName || '');
      safeSetVal('adminStudentPhone', user.phone);
      safeSetVal('adminStudentPassword', user.password);
      safeSetVal('adminStudentAdmNo', user.admissionNo);
      safeSetVal('adminStudentStatus', user.status);
      safeSetVal('adminStudentBatchNo', user.batchNumber || user.batchYear);
      if(user.photoUrl) document.getElementById('previewStudentPhoto').src = user.photoUrl;
      safeSetVal('adminStudentPlace', user.place);
      document.querySelector('#formAddStudentAdmin button[type="submit"]').innerHTML = '<i class="fa fa-save"></i> Update Student';
    } else {
      safeSetVal('adminUsthadName', user.name);
      safeSetVal('adminUsthadPhone', user.phone);
      safeSetVal('adminUsthadPassword', user.password);
      safeSetVal('adminUsthadStatus', user.status || 'Active');
      if(user.photoUrl) document.getElementById('previewUsthadPhoto').src = user.photoUrl;
      safeSetVal('adminUsthadDesignation', user.designation);
      safeSetVal('adminUsthadPlace', user.place);
      document.querySelector('#formAddUsthadAdmin button[type="submit"]').innerHTML = '<i class="fa fa-save"></i> Update Usthad';
    }
  } catch(e) {
    console.error(e);
    alert('Error editing user: ' + e.message);
  }
}

function closeAddUserModal() {
  document.getElementById('unifiedAddUserModal').classList.remove('show');
}

function switchUnifiedRole(role) {
  document.querySelectorAll('.unified-role-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.unified-form').forEach(f => f.style.display = 'none');
  
  if (role === 'student') {
    document.getElementById('btnUnifiedStudent').classList.add('active');
    document.getElementById('formAddStudentAdmin').style.display = 'block';
  } else {
    document.getElementById('btnUnifiedUsthad').classList.add('active');
    document.getElementById('formAddUsthadAdmin').style.display = 'block';
  }
}

function safeSetVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function submitAddStudentAdmin(e) {
  e.preventDefault();
  const photoInput = document.getElementById('adminStudentPhoto');
  const photoFile = photoInput && photoInput.files ? photoInput.files[0] : null;

  let fd = new FormData();
  fd.append('name', safeGetValue('adminStudentName'));
  fd.append('fatherName', safeGetValue('adminStudentFather'));
  fd.append('phone', safeGetValue('adminStudentPhone'));
  fd.append('password', safeGetValue('adminStudentPassword'));
  fd.append('admissionNo', safeGetValue('adminStudentAdmNo'));
  fd.append('status', safeGetValue('adminStudentStatus'));
  fd.append('batchNumber', safeGetValue('adminStudentBatchNo'));
  fd.append('place', safeGetValue('adminStudentPlace'));
  if (photoFile) fd.append('photo', photoFile);

  const url = editingUserId ? '/api/portal/student/' + editingUserId : '/api/portal/student';
  const method = editingUserId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    body: fd
  }).then(r => r.json()).then(res => {
    showToast(res.message || 'Student record saved!', !res.success);
    if (res.success) {
      document.getElementById('formAddStudentAdmin').reset();
      closeAddUserModal();
      loadPortalUsersAdmin();
    }
  }).catch(() => showToast('Error saving student record', true));
}

function deleteStudentAdmin(id) {
  try {
    if (!confirm('Delete this student record?')) return;
    fetch('/api/portal/student/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(res => {
        showToast(res.message || 'Deleted', !res.success);
        loadPortalUsersAdmin();
      });
  } catch(e) { 
    alert('Error deleting student: ' + e.message); 
  }
}

function submitAddUsthadAdmin(e) {
  e.preventDefault();
  const photoInput = document.getElementById('adminUsthadPhoto');
  const photoFile = photoInput && photoInput.files ? photoInput.files[0] : null;

  let fd = new FormData();
  fd.append('name', safeGetValue('adminUsthadName'));
  fd.append('phone', safeGetValue('adminUsthadPhone'));
  fd.append('password', safeGetValue('adminUsthadPassword'));
  
  fd.append('designation', safeGetValue('adminUsthadDesignation'));
  fd.append('place', safeGetValue('adminUsthadPlace'));
  if (photoFile) fd.append('photo', photoFile);

  const url = editingUserId ? '/api/portal/usthad/' + editingUserId : '/api/portal/usthad';
  const method = editingUserId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    body: fd
  }).then(r => r.json()).then(res => {
    showToast(res.message || 'Usthad record saved!', !res.success);
    if (res.success) {
      document.getElementById('formAddUsthadAdmin').reset();
      closeAddUserModal();
      loadPortalUsersAdmin();
    }
  }).catch(() => showToast('Error saving usthad record', true));
}

function deleteUsthadAdmin(id) {
  if (!confirm('Delete this usthad record?')) return;
  fetch('/api/portal/usthad/' + id, { method: 'DELETE' })
    .then(r => r.json())
    .then(res => {
      showToast(res.message || 'Deleted', !res.success);
      loadPortalUsersAdmin();
    });
}

/* ===========================================
   USER MANAGEMENT (Google Auth Users)
=========================================== */
function loadUsersAdmin() {
  fetch('/api/users')
    .then(r => r.json())
    .then(data => {
      if (data.success && data.users) {
        safeSetText('badge-users', data.users.length);
        let html = '';
        data.users.forEach((u, idx) => {
          var joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
          html += '<tr>' +
            '<td>' + (idx + 1) + '</td>' +
            '<td><img src="' + (u.picture || '') + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #e2e8f0;" onerror="this.style.display=\'none\'"></td>' +
            '<td><strong>' + (u.name || '—') + '</strong></td>' +
            '<td><code style="font-size:0.8rem;">' + (u.email || '—') + '</code></td>' +
            '<td>' + joinDate + '</td>' +
            '<td><span class="badge ' + (u.role === 'admin' ? 'badge-accent' : 'badge-success') + '">' + (u.role || 'user') + '</span></td>' +
            '<td><button class="btn btn-danger btn-sm" onclick="deleteUserAdmin(\'' + u._id + '\')"><i class="fa fa-trash"></i></button></td>' +
          '</tr>';
        });
        safeSetHtml('tableUsersAdmin', html || '<tr><td colspan="7" class="text-center text-muted">No users found. Users will appear here when they sign in via Google on the Gallery page.</td></tr>');
      }
    })
    .catch(() => {
      safeSetHtml('tableUsersAdmin', '<tr><td colspan="7" class="text-center text-muted">Could not load users. Database may be offline.</td></tr>');
    });
}

function deleteUserAdmin(id) {
  if (!confirm('Delete this user? They will need to sign in again via Google.')) return;
  fetch('/api/users/' + id, { method: 'DELETE' })
    .then(r => r.json())
    .then(res => {
      showToast(res.message || 'Deleted', !res.success);
      loadUsersAdmin();
    });
}

function loadAll() {
  loadPortalUsersAdmin();
  loadUsersAdmin();
    checkAdmissionStatus();
    loadAdmissions();
    loadNewsAdmin();
    loadGalleryAdmin();
    loadContacts();
    loadSubscribers();
    loadSectionEditor();
    loadHomeSettings();
    loadWhyUsSettings();
    loadPosterAndBanner();
    loadCommitteeSettings();
    loadAllComments();
    loadStoriesAdmin();
    loadHomeGallerySettings();
  }

  window.addEventListener('DOMContentLoaded', function() {
    // Generate login particles
    var pc = document.getElementById('loginParticles');
    if (pc) {
      for (var i = 0; i < 30; i++) {
        var s = document.createElement('span');
        s.style.left = Math.random()*100 + '%';
        s.style.animationDuration = (8 + Math.random()*12) + 's';
        s.style.animationDelay = (Math.random()*8) + 's';
        s.style.width = s.style.height = (2 + Math.random()*3) + 'px';
        pc.appendChild(s);
      }
    }

    // Auto-login if session exists
    if (sessionStorage.getItem('bud_admin_logged_in') === 'true') {
      var loginScreen = document.getElementById('loginScreen');
      var dashboard = document.getElementById('dashboard');
      if (loginScreen) loginScreen.style.display = 'none';
      if (dashboard) dashboard.style.display = 'block';
      if (pc) pc.style.display = 'none';
      loadAll();
      showPage('overview');
    }
  });

/* ===========================================
   NAVIGATION — showPage
=========================================== */
function showPage(page) {
  var targetPage = page;
  if (page === 'students' || page === 'usthads') {
    targetPage = 'portal-users';
  }

  // Hide all pages
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });

  var pageEl  = document.getElementById('page-' + targetPage);
  var navEl   = document.getElementById('nav-' + page) || document.getElementById('nav-' + targetPage);
  var titles  = {
    overview: 'Dashboard', homepage: 'Home Page Panel',
    admissions: 'Admission Panel', gallery: 'Gallery Panel',
    messages: 'Messages & Comments', 'portal-users': 'Manage Portal Users',
    students: 'Manage Students & Alumni', usthads: 'Manage Usthads & Faculty',
    users: 'User Management', exams: 'Exam & Rank Manager', reset: 'Full Reset'
  };

  if (pageEl) pageEl.classList.add('active');
  if (navEl)  navEl.classList.add('active');
  safeSetText('topbarTitle', titles[page] || titles[targetPage] || page);

  // Load data for specific pages
  if (targetPage === 'homepage') loadNews();
  if (targetPage === 'gallery') loadGallery();
  if (targetPage === 'admissions') loadAdmissions();
  if (targetPage === 'messages') { loadContacts(); loadSubscribers(); }
  if (targetPage === 'overview') loadOverview();
  if (targetPage === 'portal-users') {
    loadPortalUsersAdmin();
    if (page === 'students') setPortalFilter('student');
    else if (page === 'usthads') setPortalFilter('usthad');
    else setPortalFilter('all');
  }
  if (targetPage === 'users') loadUsersAdmin();
  if (targetPage === 'exams') loadExamsAdmin();

  // Close mobile sidebar
  closeSidebar();
}

/* ===========================================
   SIDEBAR TOGGLE (mobile)
=========================================== */
function toggleSidebar() {
  var sidebar  = document.getElementById('sidebar');
  var overlay  = document.getElementById('sidebarOverlay');
  if (sidebar)  sidebar.classList.toggle('open');
  if (overlay)  overlay.classList.toggle('open');
}
function closeSidebar() {
  var sidebar  = document.getElementById('sidebar');
  var overlay  = document.getElementById('sidebarOverlay');
  if (sidebar)  sidebar.classList.remove('open');
  if (overlay)  overlay.classList.remove('open');
}

/* ===========================================
   TOAST
=========================================== */
function showToast(msg, isError) {
  var container = document.getElementById('toastContainer');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast ' + (isError ? 'error' : 'success');
  toast.innerHTML = '<i class="fa ' + (isError ? 'fa-times-circle' : 'fa-check-circle') + '"></i> ' + msg;
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.transition = 'opacity 0.4s';
    toast.style.opacity = '0';
    setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
  }, 3500);
}

/* ===========================================
   MODAL HELPERS
=========================================== */
function openModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

/* ===========================================
   LOGOUT
=========================================== */
function doLogout() {
  sessionStorage.removeItem('bud_admin_logged_in');
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  var particles = document.getElementById('loginParticles');
  if (particles) particles.style.display = 'block';
  safeSetValue('loginPassword', '');
  var err = document.getElementById('loginError');
  if (err) err.textContent = '';
  showPage('overview');
}

/* ===========================================
   STORIES
=========================================== */
function loadStoriesAdmin() {
  fetch('/api/stories')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var html = '';
      data.forEach(function(item) {
        var exp = new Date(item.expiresAt);
        var now = new Date();
        var isActive = exp > now;
        var d = exp.toLocaleDateString('en-IN');
        html += '<tr>' +
          '<td><img src="' + item.imageUrl + '" style="width:50px;height:38px;object-fit:cover;border-radius:6px;"></td>' +
          '<td><strong>' + (item.title || '—') + '</strong></td>' +
          '<td>' + (item.durationDays || '—') + ' days</td>' +
          '<td>' + d + '</td>' +
          '<td><span class="badge ' + (isActive ? 'badge-success' : 'badge-danger') + '">' + (isActive ? 'Active' : 'Expired') + '</span></td>' +
          '<td><button class="btn btn-danger btn-sm" onclick="deleteItem(\'stories\',\'' + item._id + '\')"><i class="fa fa-trash"></i></button></td>' +
          '</tr>';
      });
      safeSetHtml('storiesTableBody', html || '<tr class="empty-row"><td colspan="6">No stories yet</td></tr>');
    }).catch(function() {});
}

safeAddListener('storyForm', 'submit', function(e) {
  e.preventDefault();
  var fd = new FormData();
  fd.append('title', safeGetValue('storyTitle'));
  fd.append('durationDays', safeGetValue('storyDays') || '7');
  var imgInput = document.getElementById('storyImage');
  var img = imgInput && imgInput.files ? imgInput.files[0] : null;
  if (!img) { showToast('Please select an image', true); return; }
  fd.append('image', img);
  var btn = this.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Uploading...'; }
  fetch('/api/stories', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload Active Story'; }
      showToast(data.success ? 'Story uploaded!' : (data.message || 'Failed'), !data.success);
      if (data.success) { e.target.reset(); loadStoriesAdmin(); }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload Active Story'; }
      showToast('Network error', true);
    });
});


/* ═══════════════════════════════════════
   LOGIN
═══════════════════════════════════════ */
async function doLogin() {
  const password = safeGetValue('loginPassword');
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginError');
  if (!password) {
    if (err) err.textContent = 'Please enter password';
    return;
  }
  
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Checking...'; }
  if (err) err.textContent = '';
  
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    
    if (data.success) {
      sessionStorage.setItem('bud_admin_logged_in', 'true');
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      const particles = document.getElementById('loginParticles');
      if (particles) particles.style.display = 'none';
      showToast('Login successful', false);
      loadAll();
      showPage('overview');
    } else {
      if (err) err.textContent = data.message || 'Invalid password';
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-lock"></i> Sign In'; }
    }
  } catch (error) {
    if (err) err.textContent = 'Network error. Please try again.';
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-lock"></i> Sign In'; }
  }
}


/* ═══════════════════════════════════════
   ADMISSION STATUS
═══════════════════════════════════════ */
function checkAdmissionStatus() {
  fetch('/api/settings/admission')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var toggle = document.getElementById('admissionToggle');
      if (toggle) toggle.checked = data.isOpen;
      safeSetText('admissionToggleLabel', data.isOpen ? 'Admissions Open' : 'Admissions Closed');
    })
    .catch(function() {});
}

function toggleAdmission(isOpen) {
  fetch('/api/settings/admission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isOpen: isOpen })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      safeSetText('admissionToggleLabel', data.isOpen ? 'Admissions Open' : 'Admissions Closed');
      showToast('Admission status updated: ' + (data.isOpen ? 'OPEN' : 'CLOSED'), false);
    }
  });
}

/* ═══════════════════════════════════════
   BANNER & POSTER
═══════════════════════════════════════ */
function loadPosterAndBanner() {
  fetch('/api/settings/poster')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var previewWrap = document.getElementById('adminPosterPreviewWrap');
      var noNotice    = document.getElementById('adminNoPosterNotice');
      var container   = document.getElementById('currentPosterPreviewContainer');
      if (d.posterUrl) {
        var isVideo = /\.(mp4|webm)$/i.test(d.posterUrl) || d.posterUrl.includes('youtube.com') || d.posterUrl.includes('youtu.be');
        if (container) {
          container.innerHTML = isVideo
            ? '<video src="' + d.posterUrl + '" controls class="poster-preview-img"></video>'
            : '<img src="' + d.posterUrl + '" class="poster-preview-img" alt="Poster">';
        }
        if (previewWrap) previewWrap.style.display = 'flex';
        if (noNotice) noNotice.style.display = 'none';
        var urlInput = document.getElementById('posterUrlInput');
        if (urlInput && d.posterUrl.startsWith('http')) urlInput.value = d.posterUrl;
      } else {
        if (previewWrap) previewWrap.style.display = 'none';
        if (noNotice) noNotice.style.display = 'flex';
      }
    }).catch(function() {});

  fetch('/api/settings/admission-banner')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.title)   safeSetValue('bannerTitle', d.title);
      if (d.content) safeSetValue('bannerContent', d.content);
    }).catch(function() {});
}

/* ═══════════════════════════════════════
   HOME STATS
═══════════════════════════════════════ */
window.saveHomeStats = function() {
  var data = {
    statsStudents: parseInt(safeGetValue('hpStudents')) || 103,
    statsUstads: parseInt(safeGetValue('hpUstads')) || 6,
    statsYears: parseInt(safeGetValue('hpYears')) || 52,
    statsAlumni: parseInt(safeGetValue('hpAlumni')) || 25
  };
  fetch('/api/home-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(r) { return r.json(); })
    .then(function(res) { showToast(res.success ? 'Counter stats saved!' : 'Failed', !res.success); });
};

/* ═══════════════════════════════════════
   HOME GALLERY DISPLAY SETTINGS
═══════════════════════════════════════ */
function loadHomeGallerySettings() {
  fetch('/api/settings/home-gallery')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.limit !== undefined) safeSetValue('homeGalleryLimit', d.limit);
      if (d.category) safeSetValue('homeGalleryCategory', d.category);
      if (d.mode) safeSetValue('homeGalleryMode', d.mode);
    }).catch(function() {});
  // Populate category dropdown
  fetch('/api/settings/gallery-categories')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var sel = document.getElementById('homeGalleryCategory');
      if (sel && d.categories) {
        var current = sel.value;
        sel.innerHTML = '<option value="all">All Categories</option>';
        d.categories.forEach(function(c) {
          sel.innerHTML += '<option value="' + c + '">' + c + '</option>';
        });
        sel.value = current || 'all';
      }
    }).catch(function() {});
}

window.saveHomeGallerySettings = function() {
  fetch('/api/settings/home-gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit: parseInt(safeGetValue('homeGalleryLimit')) || 6,
      category: safeGetValue('homeGalleryCategory') || 'all',
      mode: safeGetValue('homeGalleryMode') || 'popular'
    })
  }).then(function(r) { return r.json(); })
    .then(function(res) { showToast(res.success ? 'Gallery display settings saved!' : 'Failed', !res.success); });
};

window.saveBannerText = function() {
  fetch('/api/settings/admission-banner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:   safeGetValue('bannerTitle'),
      content: safeGetValue('bannerContent')
    })
  }).then(function(r) { return r.json(); })
    .then(function(res) { showToast(res.success ? 'Banner text saved!' : (res.message || 'Failed'), !res.success); });
};

window.removePoster = function() {
  if (!confirm('Remove the admission poster?')) return;
  fetch('/api/settings/poster', { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function(res) { showToast(res.success ? 'Poster removed!' : 'Failed', !res.success); loadPosterAndBanner(); });
};

safeAddListener('posterUploadForm', 'submit', function(e) {
  e.preventDefault();
  var fd = new FormData();
  var fileInput = document.getElementById('posterFile');
  var file = fileInput && fileInput.files ? fileInput.files[0] : null;
  var url  = safeGetValue('posterUrlInput');
  if (!file && !url) { showToast('Select a file or enter a URL', true); return; }
  if (file) fd.append('poster', file);
  if (url)  fd.append('posterUrl', url);
  var btn = this.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...'; }
  fetch('/api/settings/poster', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Save Poster'; }
      showToast(data.success ? 'Poster saved!' : (data.message || 'Failed'), !data.success);
      if (data.success) { e.target.reset(); loadPosterAndBanner(); }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Save Poster'; }
      showToast('Network error', true);
    });
});

/* ═══════════════════════════════════════
   ADMISSIONS
═══════════════════════════════════════ */
var currentAdmissions = [];

function loadAdmissions() {
  fetch('/api/admissions')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      currentAdmissions = data;
      safeSetText('statAdmissions', data.length);
      safeSetText('badge-admissions', data.length);

      var html = '';
      data.forEach(function(item) {
        var d = new Date(item.createdAt).toLocaleDateString('en-IN');
        html += '<tr><td><strong>' + item.name + '</strong></td>' +
          '<td>' + item.fatherName + '</td>' +
          '<td>' + item.motherName + '</td>' +
          '<td>' + item.phone + '</td>' +
          '<td>' + (item.dob || '-') + '</td>' +
          '<td>' + d + '</td>' +
          '<td style="white-space:nowrap;display:flex;gap:6px;">' +
          '<button class="btn btn-ghost btn-sm" onclick="viewAdmission(\'' + item._id + '\')"><i class="fa fa-eye"></i></button>' +
          '<button class="btn btn-success btn-sm" onclick="printAdmission(\'' + item._id + '\')"><i class="fa fa-print"></i></button>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteItem(\'admissions\',\'' + item._id + '\')"><i class="fa fa-trash"></i></button>' +
          '</td></tr>';
      });
      safeSetHtml('admissionsTableBody', html || '<tr class="empty-row"><td colspan="7">No admission applications yet</td></tr>');

      // Overview panel
      var ovHtml = data.slice(0,5).map(function(a) {
        return '<div style="padding:8px 0;border-bottom:1px solid var(--border-soft);font-size:0.84rem;display:flex;justify-content:space-between;">' +
          '<span>' + a.name + '</span><span style="color:var(--text-muted);">' + new Date(a.createdAt).toLocaleDateString('en-IN') + '</span></div>';
      }).join('');
      safeSetHtml('overviewAdmissions', ovHtml || '<span style="color:var(--text-muted);">No applications yet</span>');
    }).catch(function() {});
}

function viewAdmission(id) {
  var item = currentAdmissions.find(function(a) { return a._id === id; });
  if (!item) return;

  var avatarHtml = item.imageUrl
    ? '<img src="' + item.imageUrl + '" class="applicant-avatar">'
    : '<div class="applicant-avatar-placeholder">' + (item.name[0] || 'A') + '</div>';

  var html = '<div class="applicant-header">' + avatarHtml +
    '<div><h3 style="font-family:Outfit,sans-serif;color:var(--accent);margin-bottom:4px;">' + item.name + '</h3>' +
    '<div style="font-size:0.82rem;color:var(--text-muted);">DOB: ' + (item.dob || '-') + ' | Blood: ' + (item.bloodGroup || '-') + '</div></div></div>';

  html += '<div class="modal-detail-grid">';
  var fields = [
    ["Father's Name", item.fatherName], ["Mother's Name", item.motherName],
    ["Phone", item.phone], ["Home Phone", item.homePhone || '-'],
    ["House Name", item.houseName || '-'], ["Place", item.place || '-'],
    ["Post Office", item.postOffice || '-'], ["District", item.district || '-'],
    ["Pincode", item.pincode || '-'], ["Religious Ed.", item.educationReligious || '-'],
    ["Secular Ed.", item.educationSecular || '-'],
    ["Guardian", (item.guardianName || '-') + ' (' + (item.relationship || '-') + ')'],
    ["Guardian Phone", item.guardianPhone || '-'],
    ["Applied", new Date(item.createdAt).toLocaleString('en-IN')]
  ];
  fields.forEach(function(f) {
    html += '<div class="modal-detail-item"><label>' + f[0] + '</label><span>' + f[1] + '</span></div>';
  });
  html += '</div>';

  safeSetHtml('modalBody', html);
  openModal('admissionModal');
}

function closeAdmissionModal() { closeModal('admissionModal'); }

function fillPdfTemplate(item) {
  safeSetText('pdf_name', item.name || '');
  safeSetText('pdf_fatherName', item.fatherName || '');
  safeSetText('pdf_phone', item.phone || '');
  safeSetText('pdf_motherName', item.motherName || '');
  safeSetText('pdf_dob', item.dob || '');
  safeSetText('pdf_houseName', item.houseName || '______');
  safeSetText('pdf_homePhone', item.homePhone || '______');
  safeSetText('pdf_place', item.place || '______');
  safeSetText('pdf_postOffice', item.postOffice || '______');
  safeSetText('pdf_district', item.district || '______');
  safeSetText('pdf_pincode', item.pincode || '______');
  safeSetText('pdf_bloodGroup', item.bloodGroup || '______');
  safeSetText('pdf_eduRel', item.educationReligious || '______');
  safeSetText('pdf_eduSec', item.educationSecular || '______');
  safeSetText('pdf_guardianName', item.guardianName || '______');
  safeSetText('pdf_relationship', item.relationship || '______');
  safeSetText('pdf_guardianPhone', item.guardianPhone || '______');
  safeSetText('pdf_date', new Date(item.createdAt).toLocaleDateString('en-IN'));
  safeSetText('pdf_signature', (item.name || '').split(' ')[0] || '');

  var photoImg   = document.getElementById('pdfPhotoImg');
  var photoLabel = document.getElementById('pdfPhotoLabel');
  if (photoImg && photoLabel) {
    if (item.imageUrl) {
      photoImg.src = item.imageUrl; photoImg.style.display = 'block'; photoLabel.style.display = 'none';
    } else {
      photoImg.style.display = 'none'; photoLabel.style.display = 'block';
    }
  }
}

function printAdmission(id) {
  var item = currentAdmissions.find(function(a) { return a._id === id; });
  if (!item) return;
  fillPdfTemplate(item);

  // Wait a tick for fillPdfTemplate to apply, then open print window
  setTimeout(function() {
    var tmpl = document.getElementById('pdfPrintTemplate');
    if (!tmpl) return;
    var html = tmpl.innerHTML;

    var pw = window.open('', '_blank', 'width=900,height=700');
    pw.document.write(`<!DOCTYPE html>
<html lang="ml">
<head>
  <meta charset="UTF-8">
  <title>Student Biodata – ${item.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #fff;
      color: #111;
      padding: 32px 40px;
      max-width: 790px;
      margin: 0 auto;
    }
    @page {
      size: A4;
      margin: 18mm 15mm;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
    .print-btn {
      display: block;
      margin: 0 auto 22px auto;
      padding: 10px 32px;
      background: #1a6b3a;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.3px;
    }
    .print-btn:hover { background: #155c2f; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Download PDF</button>
  ${html}

  <div style="position:fixed; bottom:10px; right:10px; font-size:12px; color:rgba(255,255,255,0.3); z-index:9999; pointer-events:none;">
    Version 2.1
  </div>

<!-- Global Cropper Modal -->
<div class="unified-modal" id="cropperModal" style="z-index: 10005;">
  <div class="unified-modal-content" style="max-width: 500px; text-align:center;">
    <div class="unified-modal-header">
      <h3 style="color:var(--accent);"><i class="fa fa-crop"></i> Crop Profile Photo</h3>
      <button class="unified-modal-close" onclick="closeCropperModal()">&times;</button>
    </div>
    <div style="max-height: 400px; width: 100%; overflow: hidden; border-radius:8px; margin-bottom: 20px;">
      <img id="cropperImage" style="max-width: 100%; display: block;">
    </div>
    <div style="display:flex; justify-content:flex-end; gap:10px;">
      <button class="btn btn-secondary" onclick="closeCropperModal()">Cancel</button>
      <button class="btn btn-accent" id="btnCropSaveAdmin"><i class="fa fa-upload"></i> Upload & Save</button>
    </div>
  </div>
</div>

</body>
</html>`);
    pw.document.close();
  }, 60);
}

/* ═══════════════════════════════════════
   NEWS
═══════════════════════════════════════ */
function loadNewsAdmin() {
  fetch('/api/news').then(function(r) { return r.json(); }).then(function(data) {
    safeSetText('statNews', data.length);
    safeSetText('badge-news', data.length);
    var html = '';
    data.forEach(function(item) {
      var d = new Date(item.createdAt).toLocaleDateString('en-IN');
      var safeTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, "&quot;");
      var safeDesc = (item.description || '').replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "\\n");
      
      html += '<tr>' +
        '<td>' + (item.imageUrl ? '<img src="' + item.imageUrl + '">' : '<span style="color:var(--text-muted);">—</span>') + '</td>' +
        '<td><strong>' + item.title + '</strong></td>' +
        '<td style="color:var(--text-muted);">' + (item.description || '').substring(0, 60) + '...</td>' +
        '<td>' + d + '</td>' +
        '<td>' +
        '<button class="btn btn-sm" style="background:var(--accent); color:#1a0e00; margin-right:5px;" onclick="openEditNewsModal(\'' + item._id + '\', \'' + safeTitle + '\', \'' + safeDesc + '\')"><i class="fa fa-edit"></i></button>' +
        '<button class="btn btn-danger btn-sm" onclick="deleteItem(\'news\',\'' + item._id + '\')"><i class="fa fa-trash"></i></button>' +
        '</td></tr>';
    });
    safeSetHtml('newsTableBody', html || '<tr class="empty-row"><td colspan="5">No news yet</td></tr>');
  }).catch(function() {});
}

safeAddListener('newsForm', 'submit', function(e) {
  e.preventDefault();
  var fd = new FormData();
  fd.append('title', safeGetValue('newsTitle'));
  fd.append('description', safeGetValue('newsDesc'));
  var imgInput = document.getElementById('newsImage');
  var img = imgInput && imgInput.files ? imgInput.files[0] : null;
  if (img) fd.append('image', img);
  var btn = this.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Adding...'; }
  fetch('/api/news', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-plus"></i> Add News / Achievement'; }
      showToast(data.message, !data.success);
      if (data.success) { e.target.reset(); loadNewsAdmin(); }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-plus"></i> Add News / Achievement'; }
      showToast('Network error', true);
    });
});

/* ═══════════════════════════════════════
   GALLERY
═══════════════════════════════════════ */
var galleryMediaSource = 'file';

function setGallerySource(src) {
  galleryMediaSource = src;
  var btnFile = document.getElementById('srcBtnFile');
  var btnUrl  = document.getElementById('srcBtnUrl');
  var groupImg = document.getElementById('galleryImageInputGroup');
  var groupVid = document.getElementById('galleryVideoUrlGroup');
  if (btnFile) btnFile.classList.toggle('active', src === 'file');
  if (btnUrl)  btnUrl.classList.toggle('active', src === 'url');
  if (groupImg) groupImg.style.display = src === 'file' ? 'block' : 'none';
  if (groupVid) groupVid.style.display = src === 'url'  ? 'block' : 'none';
}

function toggleNewCategoryInput() {
  var val = safeGetValue('galleryCategory');
  var wrap = document.getElementById('galleryNewCategoryWrap');
  var newIn = document.getElementById('galleryNewCategoryInput');
  if (wrap) wrap.style.display = val === '__new__' ? 'block' : 'none';
  if (newIn) newIn.required = val === '__new__';
}

var currentGalleryItems = [];

function loadGalleryAdmin() {
  fetch('/api/gallery').then(function(r) { return r.json(); }).then(function(data) {
    currentGalleryItems = data;
    safeSetText('statGallery', data.length);
    safeSetText('badge-gallery', data.length);
    var html = '';
    data.forEach(function(item) {
      var d = new Date(item.createdAt).toLocaleDateString('en-IN');
      var mediaTag = '';
      if (item.mediaType === 'video') {
        if (item.imageUrl && (item.imageUrl.includes('youtube.com') || item.imageUrl.includes('youtu.be'))) {
          mediaTag = '<i class="fa fa-youtube-play" style="color:#ef4444;font-size:1.5rem;"></i>';
        } else {
          mediaTag = '<video src="' + item.imageUrl + '" style="width:50px;height:38px;object-fit:cover;border-radius:6px;" muted></video>';
        }
      } else {
        mediaTag = '<img src="' + item.imageUrl + '" style="width:50px;height:38px;object-fit:cover;border-radius:6px;">';
      }
      var pinned = item.pinned;
      html += '<tr>' +
        '<td>' + mediaTag + '</td>' +
        '<td><strong>' + item.title + '</strong>' + (item.description ? '<br><small style="color:var(--text-muted);">' + item.description.substring(0,40) + '</small>' : '') + '</td>' +
        '<td><span class="badge badge-accent">' + item.category + '</span></td>' +
        '<td><button class="btn btn-sm ' + (pinned ? 'btn-accent' : 'btn-ghost') + '" onclick="togglePin(\'' + item._id + '\')">' +
          '<i class="fa fa-thumb-tack"></i> ' + (pinned ? 'Pinned' : 'Pin') + '</button></td>' +
        '<td>' + d + '</td>' +
        '<td><button class="btn btn-warning btn-sm" onclick="editGalleryItem(\'' + item._id + '\')" style="margin-right:4px;"><i class="fa fa-edit"></i></button>' +
        '<button class="btn btn-danger btn-sm" onclick="deleteItem(\'gallery\',\'' + item._id + '\')"><i class="fa fa-trash"></i></button></td></tr>';
    });
    safeSetHtml('galleryTableBody', html || '<tr class="empty-row"><td colspan="6">No gallery items yet</td></tr>');
    loadGalleryCategoriesAdmin(loadHomeGallerySettingsAdmin);
  }).catch(function() {});
}

function togglePin(id) {
  fetch('/api/gallery/' + id + '/pin', { method: 'POST' })
    .then(function(r) { return r.json(); })
    .then(function(res) { if (res.success) loadGalleryAdmin(); });
}

function loadGalleryCategoriesAdmin(cb) {
  fetch('/api/settings/gallery-categories')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var categories = d.categories || ['Programme', 'Collections', 'Design'];
      var catSelect = document.getElementById('galleryCategory');
      if (catSelect) {
        var cv = catSelect.value;
        var html = '<option value="">Select Category...</option>';
        categories.forEach(function(c) { html += '<option value="' + c + '">' + c + '</option>'; });
        html += '<option value="__new__">+ Add New Category</option>';
        catSelect.innerHTML = html;
        if (cv && cv !== '__new__') catSelect.value = cv;
      }
      
      var editCatSelect = document.getElementById('editGalleryCategory');
      if (editCatSelect) {
        var ecv = editCatSelect.value;
        var eHtml = '';
        categories.forEach(function(c) { eHtml += '<option value="' + c + '">' + c + '</option>'; });
        editCatSelect.innerHTML = eHtml;
        if (ecv) editCatSelect.value = ecv;
      }

      var hCat = document.getElementById('homeGalleryCategory');
      if (hCat) {
        var hv = hCat.value;
        var hHtml = '<option value="all">All Categories</option>';
        categories.forEach(function(c) { hHtml += '<option value="' + c + '">' + c + '</option>'; });
        hCat.innerHTML = hHtml;
        if (hv) hCat.value = hv;
      }

      var badgesHtml = categories.map(function(c) {
        return '<div class="category-tag">' + c +
          '<button onclick="deleteCategoryAdmin(\'' + c + '\')">&times;</button></div>';
      }).join('');
      safeSetHtml('categoryBadgesList', badgesHtml || '<span style="color:var(--text-muted);">No categories yet</span>');
      if (typeof cb === 'function') cb();
    }).catch(function() {});
}

function addCategoryAdmin() {
  var name = safeGetValue('newCategoryInput');
  if (!name) { showToast('Enter a category name', true); return; }
  fetch('/api/settings/gallery-categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: name })
  }).then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Category added!' : (res.message || 'Error'), !res.success);
      if (res.success) { safeSetValue('newCategoryInput', ''); loadGalleryCategoriesAdmin(); }
    });
}

function deleteCategoryAdmin(name) {
  if (!confirm('Delete category "' + name + '"?')) return;
  fetch('/api/settings/gallery-categories/' + encodeURIComponent(name), { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Category deleted!' : 'Failed', !res.success);
      if (res.success) loadGalleryCategoriesAdmin();
    });
}

function loadHomeGallerySettingsAdmin() {
  fetch('/api/settings/home-gallery')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.limit !== undefined) safeSetValue('homeGalleryLimit', d.limit);
      if (d.category) safeSetValue('homeGalleryCategory', d.category);
      if (d.mode) safeSetValue('homeGalleryMode', d.mode);
    }).catch(function() {});
}

window.saveHomeGallerySettings = function() {
  fetch('/api/settings/home-gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit:    parseInt(safeGetValue('homeGalleryLimit')) || 0,
      category: safeGetValue('homeGalleryCategory'),
      mode:     safeGetValue('homeGalleryMode')
    })
  }).then(function(r) { return r.json(); })
    .then(function(res) { showToast(res.success ? 'Display settings saved!' : (res.message || 'Failed'), !res.success); });
};

safeAddListener('galleryForm', 'submit', function(e) {
  e.preventDefault();
  var fd = new FormData();
  fd.append('title', safeGetValue('galleryTitle'));
  var catVal = safeGetValue('galleryCategory');
  if (catVal === '__new__') catVal = safeGetValue('galleryNewCategoryInput');
  if (!catVal) { showToast('Please select or enter a category', true); return; }
  fd.append('category', catVal);
  fd.append('mediaType', safeGetValue('galleryMediaType'));
  fd.append('description', safeGetValue('galleryDesc'));
  fd.append('hashtags', safeGetValue('galleryHashtags'));
  var fileInput = document.getElementById('galleryImage');
  var file = fileInput && fileInput.files ? fileInput.files[0] : null;
  if (file) fd.append('image', file);
  var url = safeGetValue('galleryVideoUrl');
  if (url) fd.append('mediaUrl', url);
  var btn = this.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Uploading...'; }
  fetch('/api/gallery', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload to Gallery'; }
      showToast(data.message, !data.success);
      if (data.success) {
        e.target.reset();
        var wrap = document.getElementById('galleryNewCategoryWrap');
        if (wrap) wrap.style.display = 'none';
        loadGalleryAdmin();
      }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload to Gallery'; }
      showToast('Network error', true);
    });
});

function editGalleryItem(id) {
  var item = currentGalleryItems.find(function(i) { return i._id === id; });
  if (!item) return;

  safeSetValue('editGalleryId', item._id);
  safeSetValue('editGalleryTitle', item.title);
  
  // load gallery categories dynamically to the edit form if not already loaded
  var editCatSelect = document.getElementById('editGalleryCategory');
  var options = Array.from(document.getElementById('galleryCategory').options);
  if (editCatSelect && options.length > 0) {
    var eHtml = '';
    options.forEach(function(opt) {
      if(opt.value && opt.value !== '__new__') {
        eHtml += '<option value="' + opt.value + '">' + opt.text + '</option>';
      }
    });
    editCatSelect.innerHTML = eHtml;
  }
  
  safeSetValue('editGalleryCategory', item.category);
  safeSetValue('editGalleryMediaType', item.mediaType || 'image');
  
  if (item.mediaType === 'video') {
    safeSetValue('editGalleryVideoUrl', item.imageUrl || '');
  } else {
    safeSetValue('editGalleryVideoUrl', '');
  }
  
  safeSetValue('editGalleryDesc', item.description || '');
  safeSetValue('editGalleryHashtags', item.hashtags ? item.hashtags.join(', ') : '');

  setEditGallerySource(item.mediaType || 'image');

  var currentImg = document.getElementById('editGalleryCurrentImg');
  if (item.mediaType !== 'video' && item.imageUrl) {
    currentImg.src = item.imageUrl;
    currentImg.style.display = 'block';
  } else {
    currentImg.style.display = 'none';
  }

  openModal('editGalleryModal');
}

function setEditGallerySource(type) {
  var imgGroup = document.getElementById('editGalleryImageGroup');
  var vidGroup = document.getElementById('editGalleryVideoGroup');
  var urlIn = document.getElementById('editGalleryVideoUrl');
  if (imgGroup) imgGroup.style.display = type === 'image' ? 'block' : 'none';
  if (vidGroup) vidGroup.style.display = type === 'video' ? 'block' : 'none';
  if (urlIn) urlIn.required = type === 'video';
}

safeAddListener('editGalleryForm', 'submit', function(e) {
  e.preventDefault();
  var id = safeGetValue('editGalleryId');
  if (!id) return;

  var fd = new FormData();
  fd.append('title', safeGetValue('editGalleryTitle'));
  fd.append('category', safeGetValue('editGalleryCategory'));
  fd.append('mediaType', safeGetValue('editGalleryMediaType'));
  fd.append('description', safeGetValue('editGalleryDesc'));
  fd.append('hashtags', safeGetValue('editGalleryHashtags'));
  
  var fileInput = document.getElementById('editGalleryImage');
  var file = fileInput && fileInput.files ? fileInput.files[0] : null;
  if (file) fd.append('image', file);
  
  var url = safeGetValue('editGalleryVideoUrl');
  if (url && safeGetValue('editGalleryMediaType') === 'video') fd.append('mediaUrl', url);

  var btn = this.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...'; }

  fetch('/api/gallery/' + id, { method: 'PUT', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> Save Changes'; }
      showToast(data.message, !data.success);
      if (data.success) {
        closeModal('editGalleryModal');
        loadGalleryAdmin();
      }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> Save Changes'; }
      showToast('Network error', true);
    });
});


/* ═══════════════════════════════════════
   CONTACTS
═══════════════════════════════════════ */
function loadContacts() {
  fetch('/api/contacts').then(function(r) { return r.json(); }).then(function(data) {
    safeSetText('statContacts', data.length);
    safeSetText('badge-contacts', data.length);
    var html = '';
    data.forEach(function(item) {
      var d = new Date(item.createdAt).toLocaleDateString('en-IN');
      html += '<tr>' +
        '<td><strong>' + item.name + '</strong></td>' +
        '<td style="color:var(--text-muted);">' + item.email + '</td>' +
        '<td>' + item.subject + '</td>' +
        '<td style="color:var(--text-muted);">' + (item.message || '').substring(0, 50) + '...</td>' +
        '<td>' + d + '</td>' +
        '<td><button class="btn btn-danger btn-sm" onclick="deleteItem(\'contacts\',\'' + item._id + '\')"><i class="fa fa-trash"></i></button></td></tr>';
    });
    safeSetHtml('contactsTableBody', html || '<tr class="empty-row"><td colspan="6">No messages yet</td></tr>');

    var ovHtml = data.slice(0,5).map(function(c) {
      return '<div style="padding:8px 0;border-bottom:1px solid var(--border-soft);font-size:0.84rem;display:flex;justify-content:space-between;">' +
        '<span>' + c.name + ': ' + (c.subject || '') + '</span><span style="color:var(--text-muted);">' + new Date(c.createdAt).toLocaleDateString('en-IN') + '</span></div>';
    }).join('');
    safeSetHtml('overviewContacts', ovHtml || '<span style="color:var(--text-muted);">No messages yet</span>');
  }).catch(function() {});
}

/* ═══════════════════════════════════════
   SUBSCRIBERS
═══════════════════════════════════════ */
function loadSubscribers() {
  fetch('/api/subscribers').then(function(r) { return r.json(); }).then(function(data) {
    safeSetText('statSubscribers', data.length);
    safeSetText('badge-subscribers', data.length);
    var html = '';
    data.forEach(function(item, i) {
      var d = new Date(item.subscribedAt).toLocaleDateString('en-IN');
      html += '<tr><td>' + (i + 1) + '</td><td>' + item.email + '</td><td>' + d + '</td></tr>';
    });
    safeSetHtml('subscribersTableBody', html || '<tr class="empty-row"><td colspan="3">No subscribers yet</td></tr>');
  }).catch(function() {});
}

/* ═══════════════════════════════════════
   DELETE ITEM
═══════════════════════════════════════ */
function deleteItem(type, id) {
  if (!confirm('Are you sure you want to delete this?')) return;
  fetch('/api/' + type + '/' + id, { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      showToast(data.message, !data.success);
      loadAll();
    }).catch(function() { showToast('Network error', true); });
}

/* ═══════════════════════════════════════
   SECTIONS
═══════════════════════════════════════ */
var currentSections = [];

function selectSection(id, btn) {
  document.querySelectorAll('.section-tab-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  safeSetValue('sectionSelector', id);
  loadSectionEditor();
}

function fetchAllSections() {
  return fetch('/api/sections').then(function(r) { return r.json(); }).then(function(data) {
    currentSections = data; return data;
  });
}

function loadSectionEditor() {
  fetchAllSections().then(function() {
    var selectedId = safeGetValue('sectionSelector');
    var section = currentSections.find(function(s) { return s.sectionId === selectedId; });
    safeSetValue('sectionTitle', section ? (section.title || '') : '');
    safeSetValue('sectionDesc', section ? (section.description || '') : '');
    safeSetValue('sectionLink', section ? (section.readMoreLink || '#') : '#');
  });
}

safeAddListener('sectionForm', 'submit', function(e) {
  e.preventDefault();
  var selectedId = safeGetValue('sectionSelector');
  fetch('/api/sections/' + selectedId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: safeGetValue('sectionTitle'),
      description: safeGetValue('sectionDesc'),
      readMoreLink: safeGetValue('sectionLink')
    })
  }).then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Section saved!' : (res.message || 'Failed'), !res.success);
      if (res.success) loadSectionEditor();
    });
});

function deleteHomepageSection() {
  var selectedId = safeGetValue('sectionSelector');
  if (!confirm('Hide/delete this section from the homepage?')) return;
  fetch('/api/sections/' + selectedId, { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Section hidden!' : (res.message || 'Failed'), !res.success);
      if (res.success) loadSectionEditor();
    });
}

/* ═══════════════════════════════════════
   HOME SETTINGS
═══════════════════════════════════════ */
function loadHomeSettings() {
  fetch('/api/home-settings').then(function(r) { return r.json(); }).then(function(s) {
    if (s.principalName)  safeSetValue('hpPrincipalName', s.principalName);
    if (s.principalTitle) safeSetValue('hpPrincipalTitle', s.principalTitle);
    if (s.principalBio)   safeSetValue('hpPrincipalBio', s.principalBio);
    if (s.igEmbedCode)    safeSetValue('igEmbedCode', s.igEmbedCode);
    if (s.principalImageUrl) {
      var pi = document.getElementById('principalPreview');
      if (pi) { pi.src = s.principalImageUrl; pi.style.display = 'block'; }
    }
    renderAssistants(s.assistantMudarris || []);
    renderBranches(s.branches || []);
  }).catch(function() {});
}

window.saveIgEmbedCode = function() {
  fetch('/api/home-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ igEmbedCode: safeGetValue('igEmbedCode') })
  }).then(function(r) { return r.json(); })
    .then(function(res) { showToast(res.success ? 'Instagram settings saved!' : 'Failed to save', !res.success); });
};

window.savePrincipal = function() {
  var fileInput = document.getElementById('principalImageFile');
  var imgFile = fileInput && fileInput.files ? fileInput.files[0] : null;
  fetch('/api/home-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      principalName:  safeGetValue('hpPrincipalName'),
      principalTitle: safeGetValue('hpPrincipalTitle'),
      principalBio:   safeGetValue('hpPrincipalBio')
    })
  }).then(function(r) { return r.json(); }).then(function() {
    if (imgFile) {
      var fd = new FormData();
      fd.append('image', imgFile);
      fetch('/api/home-settings/principal-image', { method: 'POST', body: fd })
        .then(function(r) { return r.json(); })
        .then(function(imgRes) {
          if (imgRes.success) {
            var pi = document.getElementById('principalPreview');
            if (pi) { pi.src = imgRes.imageUrl; pi.style.display = 'block'; }
          }
          showToast('Principal info saved!', false);
        });
    } else {
      showToast('Principal info saved!', false);
    }
  });
};

// Assistants
safeAddListener('assistantForm', 'submit', function(e) {
  e.preventDefault();
  var fd = new FormData();
  fd.append('name', safeGetValue('assistantName'));
  fd.append('role', safeGetValue('assistantRole') || 'Assistant Mudarris');
  var imgInput = document.getElementById('assistantImage');
  var img = imgInput && imgInput.files ? imgInput.files[0] : null;
  if (img) fd.append('image', img);
  fetch('/api/home-settings/assistant', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Assistant added!' : (res.message || 'Failed'), !res.success);
      if (res.success) { loadHomeSettings(); e.target.reset(); }
    });
});

window.deleteAssistant = function(id) {
  if (!confirm('Delete this assistant?')) return;
  fetch('/api/home-settings/assistant/' + id, { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function() { loadHomeSettings(); });
};

function renderAssistants(list) {
  var html = list.map(function(a) {
    return '<div class="person-row">' +
      '<img src="' + (a.imageUrl || 'img/new_logo.png') + '" class="person-avatar">' +
      '<div style="flex:1;"><strong>' + a.name + '</strong><br><small style="color:var(--text-muted);">' + a.role + '</small></div>' +
      '<button class="btn btn-danger btn-sm" onclick="deleteAssistant(\'' + a._id + '\')"><i class="fa fa-trash"></i></button></div>';
  }).join('');
  safeSetHtml('assistantListAdmin', html || '<p style="color:var(--text-muted);">No assistants added yet</p>');
}

// Branches
safeAddListener('branchForm', 'submit', function(e) {
  e.preventDefault();
  fetch('/api/home-settings/branch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: safeGetValue('branchName'),
      location: safeGetValue('branchLocation'),
      description: safeGetValue('branchDesc')
    })
  }).then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Branch added!' : 'Failed', !res.success);
      if (res.success) { loadHomeSettings(); e.target.reset(); }
    });
});

window.deleteBranch = function(id) {
  if (!confirm('Delete this branch?')) return;
  fetch('/api/home-settings/branch/' + id, { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function() { loadHomeSettings(); });
};

function renderBranches(list) {
  var html = list.map(function(b) {
    return '<div class="person-row">' +
      '<i class="fa fa-map-marker" style="color:var(--accent);font-size:1.2rem;width:20px;text-align:center;"></i>' +
      '<div style="flex:1;"><strong>' + b.name + '</strong>' + (b.location ? '<br><small style="color:var(--text-muted);">' + b.location + '</small>' : '') + '</div>' +
      '<button class="btn btn-danger btn-sm" onclick="deleteBranch(\'' + b._id + '\')"><i class="fa fa-trash"></i></button></div>';
  }).join('');
  safeSetHtml('branchListAdmin', html || '<p style="color:var(--text-muted);">No branches added yet</p>');
}

/* ═══════════════════════════════════════
   WHY US
═══════════════════════════════════════ */
function loadWhyUsSettings() {
  fetch('/api/settings/why-us').then(function(r) { return r.json(); }).then(function(d) {
    if (d.whyUsEligibility) safeSetValue('whyUsEligibility', d.whyUsEligibility);
    if (d.whyUsCurriculum)  safeSetValue('whyUsCurriculum', d.whyUsCurriculum);
    if (d.whyUsFacilities)  safeSetValue('whyUsFacilities', d.whyUsFacilities);
    if (d.whyUsEnquiry)     safeSetValue('whyUsEnquiry', d.whyUsEnquiry);
    if (d.whyUsMediaUrl) {
      var urlInput = document.getElementById('whyUsMediaUrlInput');
      if (urlInput && d.whyUsMediaUrl.startsWith('http')) urlInput.value = d.whyUsMediaUrl;
      var pw = document.getElementById('whyUsMediaPreviewWrap');
      var pc = document.getElementById('whyUsAdminMediaPreview');
      if (pc) {
        var isVideo = /\.(mp4|webm)$/i.test(d.whyUsMediaUrl) || d.whyUsMediaUrl.includes('youtube.com');
        pc.innerHTML = isVideo
          ? '<video src="' + d.whyUsMediaUrl + '" controls style="max-width:150px;border-radius:8px;border:2px solid var(--accent);"></video>'
          : '<img src="' + d.whyUsMediaUrl + '" style="max-width:150px;border-radius:8px;border:2px solid var(--accent);">';
        if (pw) pw.style.display = 'block';
      }
    }
  }).catch(function() {});
}

window.saveWhyUsSettings = function() {
  var data = {
    whyUsEligibility: safeGetValue('whyUsEligibility'),
    whyUsCurriculum:  safeGetValue('whyUsCurriculum'),
    whyUsFacilities:  safeGetValue('whyUsFacilities'),
    whyUsEnquiry:     safeGetValue('whyUsEnquiry')
  };
  var mediaUrl = safeGetValue('whyUsMediaUrlInput');
  if (mediaUrl) data.whyUsMediaUrl = mediaUrl;
  fetch('/api/settings/why-us', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Why Us settings saved!' : (res.message || 'Failed'), !res.success);
      if (res.success) loadWhyUsSettings();
    });
};

safeAddListener('whyUsMediaForm', 'submit', function(e) {
  e.preventDefault();
  var fileInput = document.getElementById('whyUsFile');
  var file = fileInput && fileInput.files ? fileInput.files[0] : null;
  if (!file) { showToast('Please choose a file', true); return; }
  var fd = new FormData();
  fd.append('media', file);
  var btn = this.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Uploading...'; }
  fetch('/api/settings/why-us/media', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload File'; }
      showToast(res.success ? 'Media uploaded!' : (res.message || 'Failed'), !res.success);
      if (res.success) { e.target.reset(); loadWhyUsSettings(); }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload File'; }
      showToast('Network error', true);
    });
});

/* ═══════════════════════════════════════
   COMMITTEE
═══════════════════════════════════════ */
function loadCommitteeSettings() {
  fetch('/api/settings/committee').then(function(r) { return r.json(); }).then(function(d) {
    if (d.title)   safeSetValue('committeeTitle', d.title);
    if (d.details) safeSetValue('committeeDetails', d.details);
    var pw = document.getElementById('committeePosterPreviewWrap');
    var pi = document.getElementById('currentCommitteePosterPreview');
    var nn = document.getElementById('committeeNoPosterNotice');
    if (d.posterUrl) {
      if (pi) pi.src = d.posterUrl;
      if (pw) pw.style.display = 'block';
      if (nn) nn.style.display = 'none';
    } else {
      if (pw) pw.style.display = 'none';
      if (nn) nn.style.display = 'flex';
    }
  }).catch(function() {});
}

window.saveCommitteeText = function() {
  fetch('/api/settings/committee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:   safeGetValue('committeeTitle'),
      details: safeGetValue('committeeDetails')
    })
  }).then(function(r) { return r.json(); })
    .then(function(res) { showToast(res.success ? 'Committee settings saved!' : 'Failed', !res.success); });
};

window.removeCommitteePoster = function() {
  if (!confirm('Remove the committee poster?')) return;
  fetch('/api/settings/committee/poster', { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      showToast(res.success ? 'Poster removed!' : 'Failed', !res.success);
      loadCommitteeSettings();
    });
};

safeAddListener('committeePosterUploadForm', 'submit', function(e) {
  e.preventDefault();
  var fileInput = document.getElementById('committeePosterFile');
  var file = fileInput && fileInput.files ? fileInput.files[0] : null;
  if (!file) { showToast('Please select an image', true); return; }
  var fd = new FormData();
  fd.append('poster', file);
  var btn = this.querySelector('button[type=submit]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Uploading...'; }
  fetch('/api/settings/committee/poster', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload Poster'; }
      showToast(data.success ? 'Poster uploaded!' : (data.message || 'Failed'), !data.success);
      if (data.success) { e.target.reset(); loadCommitteeSettings(); }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa fa-upload"></i> Upload Poster'; }
      showToast('Network error', true);
    });
});

/* ═══════════════════════════════════════
   COMMENTS
═══════════════════════════════════════ */
function loadAllComments() {
  safeSetHtml('commentsAdminList', '<p style="color:var(--text-muted);padding:20px 0;"><i class="fa fa-spinner fa-spin"></i> Loading...</p>');
  fetch('/api/gallery').then(function(r) { return r.json(); }).then(function(items) {
    var html = '';
    items.forEach(function(item) {
      if (item.comments && item.comments.length > 0) {
        item.comments.forEach(function(c) {
          var user = c.user ? (c.user.name || 'Unknown') : 'Unknown';
          var date = new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN');
          html += '<div style="display:flex;align-items:flex-start;gap:12px;padding:14px;border-bottom:1px solid var(--border-soft);">' +
            '<i class="fa fa-user-circle" style="color:var(--accent);font-size:1.4rem;margin-top:2px;"></i>' +
            '<div style="flex:1;">' +
              '<strong>' + user + '</strong> <small style="color:var(--text-muted);margin-left:6px;">' + date + '</small>' +
              '<div style="margin:4px 0;">' + c.text + '</div>' +
              '<small style="color:var(--text-muted);">Post: ' + (item.title || item._id) + '</small>' +
            '</div>' +
            '<button class="btn btn-danger btn-sm" onclick="deleteComment(\'' + item._id + '\',\'' + c._id + '\')"><i class="fa fa-trash"></i></button>' +
          '</div>';
        });
      }
    });
    safeSetHtml('commentsAdminList', html || '<p style="color:var(--text-muted);text-align:center;padding:30px;">No comments found.</p>');
  }).catch(function() {
    safeSetHtml('commentsAdminList', '<p style="color:var(--danger);padding:20px;">Failed to load comments.</p>');
  });
}

function deleteComment(gId, cId) {
  if (!confirm('Delete this comment?')) return;
  fetch('/api/gallery/' + gId + '/comment/' + cId, { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      showToast(d.success ? 'Comment deleted.' : (d.message || 'Failed'), !d.success);
      if (d.success) loadAllComments();
    });
}

/* ═══════════════════════════════════════
   RESET
═══════════════════════════════════════ */
function openResetModal() {
  safeSetValue('resetConfirmTextInput', '');
  safeSetValue('resetPasswordInput', '');
  safeSetText('resetStatus', '');
  validateResetTyping();
  openModal('resetModal');
}

function validateResetTyping() {
  var target = "I CONFIRM PERMANENT RESET OF ALL BAYANUL ULOOM DARS DATA";
  var typed = safeGetValue('resetConfirmTextInput');
  var btn = document.getElementById('executeResetBtn');
  if (btn) {
    if (typed === target) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    } else {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    }
  }
}

function executeReset() {
  var target = "I CONFIRM PERMANENT RESET OF ALL BAYANUL ULOOM DARS DATA";
  var typed = safeGetValue('resetConfirmTextInput');
  var token = safeGetValue('resetPasswordInput');

  if (typed !== target) {
    safeSetHtml('resetStatus', '<span style="color:var(--danger);">Please type the exact confirmation sentence manually (pasting is disabled).</span>');
    return;
  }

  if (!token) {
    safeSetHtml('resetStatus', '<span style="color:var(--danger);">Please enter your admin password.</span>');
    return;
  }

  safeSetHtml('resetStatus', '<i class="fa fa-spinner fa-spin"></i> Resetting all data...');
  fetch('/api/admin/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: token })
  }).then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.success) {
        safeSetHtml('resetStatus', '<span style="color:var(--success);"><i class="fa fa-check-circle"></i> ' + d.message + '</span>');
        setTimeout(function() { closeModal('resetModal'); loadAll(); }, 2500);
      } else {
        safeSetHtml('resetStatus', '<span style="color:var(--danger);"><i class="fa fa-times-circle"></i> ' + d.message + '</span>');
      }
    }).catch(function() {
      safeSetHtml('resetStatus', '<span style="color:var(--danger);">Server error. Try again.</span>');
    });
}
