const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const filterLogicOld = `function filterPortalUsersAdmin() {
  var query = (safeGetValue('portalSearchInput') || '').toLowerCase().trim();
  var filtered = allPortalUsersCache.filter(u => {`;

const filterLogicNew = `function filterPortalUsersAdmin() {
  var query = (safeGetValue('portalSearchInput') || '').toLowerCase().trim();
  var batchFilter = safeGetValue('portalBatchFilter');
  var filtered = allPortalUsersCache.filter(u => {
    if (batchFilter && batchFilter !== 'all') {
      if (u.role === 'student' && String(u.batchNumber) !== String(batchFilter)) return false;
    }
`;

html = html.replace(filterLogicOld, filterLogicNew);

const loadLogicOld = `    allPortalUsersCache = users;
    safeSetText('badge-portal-users', users.length);`;

const loadLogicNew = `    allPortalUsersCache = users;
    
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

    safeSetText('badge-portal-users', users.length);`;

html = html.replace(loadLogicOld, loadLogicNew);

fs.writeFileSync('public/admin.html', html);
console.log('Patched batch filter logic in admin.html');
