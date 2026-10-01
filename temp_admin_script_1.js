
function openEditNewsModal(id, title, desc) {
  safeSetValue('editNewsId', id);
  safeSetValue('editNewsTitle', title);
  safeSetValue('editNewsDesc', desc);
  var imgInput = document.getElementById('editNewsImage');
  if (imgInput) imgInput.value = ''; // clear file input
  safeSetHtml('editNewsStatus', '');
  openModal('editNewsModal');
}

function submitEditNews(e) {
  e.preventDefault();
  var id = safeGetValue('editNewsId');
  var fd = new FormData();
  fd.append('title', safeGetValue('editNewsTitle'));
  fd.append('description', safeGetValue('editNewsDesc'));
  
  var imgInput = document.getElementById('editNewsImage');
  var img = imgInput && imgInput.files ? imgInput.files[0] : null;
  if (img) fd.append('image', img);
  
  var btn = document.getElementById('editNewsBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...'; }
  
  fetch('/api/news/' + id, { method: 'PUT', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.innerHTML = 'Save Changes'; }
      if (data.success) {
        showToast('News updated successfully', false);
        closeModal('editNewsModal');
        loadNewsAdmin();
      } else {
        safeSetHtml('editNewsStatus', '<span style="color:var(--danger);">' + (data.message || 'Error updating news') + '</span>');
      }
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.innerHTML = 'Save Changes'; }
      safeSetHtml('editNewsStatus', '<span style="color:var(--danger);">Network error</span>');
    });
}
/* ===========================================
   EXAM & RANK MANAGEMENT JS
=========================================== */
let allExamsCache = [];
let currentExamRosterData = null;
let currentSubjectInputList = [];

function loadExamsAdmin() {
  fetch('/api/portal/exams')
    .then(r => r.json())
    .then(data => {
      if (data.success && data.exams) {
        allExamsCache = data.exams;
        renderExamSelectList();
        renderExamTableList();
      }
    });
}

function renderExamSelectList() {
  const select = document.getElementById('examSelectAdmin');
  if (!select) return;
  if (!allExamsCache || allExamsCache.length === 0) {
    select.innerHTML = '<option value="">No active exams found</option>';
    return;
  }
  let html = '';
  allExamsCache.forEach(e => {
    html += `<option value="${e._id}">${e.examName} (${e.term || 'Semester'})</option>`;
  });
  select.innerHTML = html;
  onExamOrClassChange();
}

function renderExamTableList() {
  const tbody = document.getElementById('examListTableBody');
  if (!tbody) return;
  if (!allExamsCache || allExamsCache.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No active exams configured yet.</td></tr>';
    return;
  }
  let html = '';
  allExamsCache.forEach(e => {
    const classCount = e.classSubjects ? Object.keys(e.classSubjects).length : 0;
    html += `<tr>
      <td><strong style="color:var(--text);">${e.examName}</strong></td>
      <td><span class="badge badge-info">${e.term || 'Semester'}</span></td>
      <td><code>${e.batchYear || '2025'}</code></td>
      <td>${classCount} Batches configured</td>
      <td><small style="color:var(--text-soft);">${new Date(e.createdAt || Date.now()).toLocaleDateString()}</small></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteExamAdmin('${e._id}')"><i class="fa fa-trash"></i> Delete</button>
      </td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

function openCreateExamModal() {
  document.getElementById('newExamName').value = '';
  document.getElementById('modalCreateExam').classList.add('show');
  renderSubjectInputRows();
}

function closeCreateExamModal() {
  document.getElementById('modalCreateExam').classList.remove('show');
}

function renderSubjectInputRows() {
  const targetClass = safeGetValue('newExamBatchNo') || '1';
  const container = document.getElementById('subjectInputRowsContainer');
  if (!container) return;

  if (!currentSubjectInputList || currentSubjectInputList.length === 0) {
    if (targetClass === '3') {
      currentSubjectInputList = [
        { subjectName: 'Fiqh (Fathul Mueen)', maxMarks: 100 },
        { subjectName: 'Nahw (Alfiyya)', maxMarks: 80 },
        { subjectName: 'Tafseer (Jalalain)', maxMarks: 50 },
        { subjectName: 'Balagha (Mukhtasar)', maxMarks: 40 }
      ];
    } else {
      currentSubjectInputList = [
        { subjectName: 'Fiqh', maxMarks: 100 },
        { subjectName: 'Nahw', maxMarks: 80 },
        { subjectName: 'Hadith', maxMarks: 50 }
      ];
    }
  }

  let html = '';
  currentSubjectInputList.forEach((s, idx) => {
    html += `<div style="display:flex; gap:10px; margin-bottom:8px; align-items:center;">
      <input type="text" class="form-control" style="flex:2; background:var(--bg-input); color:var(--text);" placeholder="Subject Name" value="${s.subjectName}" onchange="currentSubjectInputList[${idx}].subjectName = this.value">
      <input type="number" class="form-control" style="flex:1; background:var(--bg-input); color:var(--text);" placeholder="Max Marks" value="${s.maxMarks}" onchange="currentSubjectInputList[${idx}].maxMarks = Number(this.value)">
      <button type="button" class="btn btn-danger btn-sm" onclick="removeSubjectInputRow(${idx})">&times;</button>
    </div>`;
  });
  container.innerHTML = html;
}

function addSubjectInputRow() {
  currentSubjectInputList.push({ subjectName: 'New Subject', maxMarks: 100 });
  renderSubjectInputRows();
}

function removeSubjectInputRow(idx) {
  currentSubjectInputList.splice(idx, 1);
  renderSubjectInputRows();
}

function submitCreateExamForm(e) {
  e.preventDefault();
  const examName = safeGetValue('newExamName');
  const term = safeGetValue('newExamTerm');
  const batchYear = safeGetValue('newExamBatch');
  const targetClass = safeGetValue('newExamBatchNo');

  if (!examName) { showToast('Exam Name required', true); return; }

  const classSubjects = {};
  classSubjects[targetClass] = currentSubjectInputList.filter(s => s.subjectName.trim() !== '');

  fetch('/api/portal/exam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      examName,
      term,
      batchYear,
      classSubjects
    })
  }).then(r => r.json()).then(res => {
    showToast(res.message || 'Exam Created!', !res.success);
    if (res.success) {
      closeCreateExamModal();
      loadExamsAdmin();
    }
  });
}

function deleteExamAdmin(id) {
  if (!confirm('Delete this exam configuration?')) return;
  fetch('/api/portal/exam/' + id, { method: 'DELETE' })
    .then(r => r.json())
    .then(res => {
      showToast(res.message || 'Exam deleted', !res.success);
      loadExamsAdmin();
    });
}

function onExamOrClassChange() {
  loadExamClassRosterMatrix();
}

