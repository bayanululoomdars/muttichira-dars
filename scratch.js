
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
  function loadAll() {
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
    loadHomeGallerySettings();
  }

  window.addEventListener('DOMContentLoaded', function() {
    loadAll();
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
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      const particles = document.getElementById('loginParticles');
      if (particles) particles.style.display = 'none';
      showToast('Login successful', false);
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
  var pw = window.open('', '_blank');
  pw.document.write('<html><head><title>Print Admission</title><style>body{margin:0;padding:0;font-family:Arial,sans-serif;}</style></head><body>');
  pw.document.write(document.getElementById('pdfPrintTemplate').outerHTML);
  pw.document.write('</body></html>');
  pw.document.close();
  pw.focus();
  pw.onload = function() { pw.print(); setTimeout(function() { pw.close(); }, 500); };
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
      html += '<tr>' +
        '<td>' + (item.imageUrl ? '<img src="' + item.imageUrl + '">' : '<span style="color:var(--text-muted);">—</span>') + '</td>' +
        '<td><strong>' + item.title + '</strong></td>' +
        '<td style="color:var(--text-muted);">' + (item.description || '').substring(0, 60) + '...</td>' +
        '<td>' + d + '</td>' +
        '<td><button class="btn btn-danger btn-sm" onclick="deleteItem(\'news\',\'' + item._id + '\')"><i class="fa fa-trash"></i></button></td></tr>';
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

function loadGalleryAdmin() {
  fetch('/api/gallery').then(function(r) { return r.json(); }).then(function(data) {
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
        mediaTag = '<img src="' + item.imageUrl + '">';
      }
      var pinned = item.pinned;
      html += '<tr>' +
        '<td>' + mediaTag + '</td>' +
        '<td><strong>' + item.title + '</strong>' + (item.description ? '<br><small style="color:var(--text-muted);">' + item.description.substring(0,40) + '</small>' : '') + '</td>' +
        '<td><span class="badge badge-accent">' + item.category + '</span></td>' +
        '<td><button class="btn btn-sm ' + (pinned ? 'btn-accent' : 'btn-ghost') + '" onclick="togglePin(\'' + item._id + '\')">' +
          '<i class="fa fa-thumb-tack"></i> ' + (pinned ? 'Pinned' : 'Pin') + '</button></td>' +
        '<td>' + d + '</td>' +
        '<td><button class="btn btn-danger btn-sm" onclick="deleteItem(\'gallery\',\'' + item._id + '\')"><i class="fa fa-trash"></i></button></td></tr>';
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
    if (s.principalImageUrl) {
      var pi = document.getElementById('principalPreview');
      if (pi) { pi.src = s.principalImageUrl; pi.style.display = 'block'; }
    }
    renderAssistants(s.assistantMudarris || []);
    renderBranches(s.branches || []);
  }).catch(function() {});
}

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

