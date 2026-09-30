const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const searchBarHtml = `<input type="text" id="portalSearchInput" oninput="filterPortalUsersAdmin()" placeholder="🔍 Search student/usthad name, ID, place..." class="form-control" style="flex:1; min-width:220px; background:var(--bg-input); border-color:var(--border-soft); color:var(--text);">`;

const newSearchBarHtml = `<input type="text" id="portalSearchInput" oninput="filterPortalUsersAdmin()" placeholder="🔍 Search by Name, ID, Place..." class="form-control" style="flex:1; min-width:220px; background:var(--bg-input); border-color:var(--border-soft); color:var(--text);">
              <select id="portalBatchFilter" onchange="filterPortalUsersAdmin()" class="form-control" style="width: 150px; background:var(--bg-input); border-color:var(--border-soft); color:var(--text);">
                <option value="all">All Batches</option>
              </select>`;

html = html.replace(searchBarHtml, newSearchBarHtml);
fs.writeFileSync('public/admin.html', html);
console.log('Added batch filter dropdown to admin.html');
