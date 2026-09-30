const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const regexLoad = /allPortalUsersCache = users;\s*safeSetText\('badge-portal-users', users\.length\);/;
const newLoadLogic = `allPortalUsersCache = users;
    
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

html = html.replace(regexLoad, newLoadLogic);
fs.writeFileSync('public/admin.html', html);
console.log('Fixed loadPortalUsersAdmin batch filter dropdown populator');
