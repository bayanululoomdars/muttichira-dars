const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const filterLogicOld = `function renderPortalUsersAdmin() {
  var query = (safeGetValue('portalSearchInput') || '').toLowerCase().trim();
  var filtered = allPortalUsersCache.filter(u => {`;

const filterLogicNew = `function renderPortalUsersAdmin() {
  var query = (safeGetValue('portalSearchInput') || '').toLowerCase().trim();
  var batchFilter = safeGetValue('portalBatchFilter');
  var filtered = allPortalUsersCache.filter(u => {
    if (batchFilter && batchFilter !== 'all') {
      if (u.role === 'student' && String(u.batchNumber) !== String(batchFilter)) return false;
    }`;

html = html.replace(filterLogicOld, filterLogicNew);
fs.writeFileSync('public/admin.html', html);
console.log('Fixed renderPortalUsersAdmin batch filter');
