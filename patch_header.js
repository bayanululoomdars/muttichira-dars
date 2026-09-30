const fs = require('fs');
let content = fs.readFileSync('public/admin.html', 'utf8');

// The block to replace
const targetStr = `            <div class="admin-user-management">
              <div class="header-section" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
                  <div>
                    <h2 style="font-family: 'Segoe UI', sans-serif; color: #0a4d2e; margin:0;"><i class="fa fa-users"></i> Manage Portal Users</h2>
                    <small style="color: var(--text-soft);">Manage Students & Usthads credentials and records</small>
                  </div>
                  <button class="add-btn" onclick="openAddUserModal()">+ Add New User</button>
              </div>

              <!-- Search & Filter Bar -->
              <div style="display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; align-items:center; background:var(--bg-card); padding:14px; border-radius:12px; border:1px solid var(--border-soft);">
                <input type="text" id="portalSearchInput" oninput="filterPortalUsersAdmin()" placeholder="🔍 Search student/usthad name, ID, place..." class="form-control" style="flex:1; min-width:220px; background:var(--bg-input); border-color:var(--border-soft); color:var(--text);">
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  <button class="btn btn-outline-secondary btn-sm portal-filter-btn active" id="pfilter-all" onclick="setPortalFilter('all')">All</button>
                  <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-student" onclick="setPortalFilter('student')">Students</button>
                  <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-Alumni" onclick="setPortalFilter('Alumni')">Alumni / Biruthadhari</button>
                  <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-usthad" onclick="setPortalFilter('usthad')">Usthads</button>
                </div>
              </div>`;

const newStr = `            <div class="admin-user-management">
              <div class="header-section" style="display:flex; flex-direction:column; gap:15px; margin-bottom:20px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; width: 100%;">
                    <div>
                      <h2 style="font-family: 'Segoe UI', sans-serif; color: #0a4d2e; margin:0;"><i class="fa fa-users-cog"></i> Management Portal</h2>
                      <small style="color: var(--text-soft);">Manage Students, Alumni and Usthads</small>
                    </div>
                    <button class="add-btn" onclick="openAddUserModal()">+ Add New User</button>
                  </div>
                  
                  <!-- Tabs -->
                  <div style="display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; flex-wrap: wrap;">
                     <button class="btn btn-outline-secondary portal-filter-btn active" id="pfilter-student" onclick="setPortalFilter('student')" style="font-weight:bold; padding:8px 16px;">Manage Students & Alumni</button>
                     <button class="btn btn-outline-secondary portal-filter-btn" id="pfilter-usthad" onclick="setPortalFilter('usthad')" style="font-weight:bold; padding:8px 16px;">Manage Usthads</button>
                     <button class="btn btn-outline-secondary portal-filter-btn" id="pfilter-all" onclick="setPortalFilter('all')" style="display:none;">All</button>
                  </div>
              </div>

              <!-- Search Bar Only -->
              <div style="display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; align-items:center; background:var(--bg-card); padding:14px; border-radius:12px; border:1px solid var(--border-soft);">
                <input type="text" id="portalSearchInput" oninput="filterPortalUsersAdmin()" placeholder="🔍 Search by name, ID, place..." class="form-control" style="flex:1; min-width:220px; background:var(--bg-input); border-color:var(--border-soft); color:var(--text);">
              </div>`;

if (content.includes('Manage Portal Users')) {
  // We'll use a dynamic replace
  const blockRegex = /<div class="admin-user-management">[\s\S]*?<\/div>\s*<\/div>/; // Wait, this regex is risky. 
  
  // Let's replace line by line or using a very specific chunk.
  
  // Replace the first chunk
  const searchChunk = /<h2 style="font-family: 'Segoe UI', sans-serif; color: #0a4d2e; margin:0;"><i class="fa fa-users"><\/i> Manage Portal Users<\/h2>[\s\S]*?<small style="color: var\(--text-soft\);">Manage Students & Usthads credentials and records<\/small>/;
  const replaceChunk = `<h2 style="font-family: 'Segoe UI', sans-serif; color: #0a4d2e; margin:0;"><i class="fa fa-users-cog"></i> Management Portal</h2>
                    <small style="color: var(--text-soft);">Manage Students, Alumni and Usthads</small>`;
  content = content.replace(searchChunk, replaceChunk);
  
  // Replace the filter bar chunk
  const searchFilter = /<div style="display:flex; gap:6px; flex-wrap:wrap;">[\s\S]*?<button class="btn btn-outline-secondary btn-sm portal-filter-btn active" id="pfilter-all" onclick="setPortalFilter\('all'\)">All<\/button>[\s\S]*?<\/div>\s*<\/div>/;
  
  const replaceFilter = `<div style="display:flex; gap:6px; flex-wrap:wrap; width:100%;">
                  <button class="btn btn-outline-secondary btn-sm portal-filter-btn active" id="pfilter-student" onclick="setPortalFilter('student')" style="font-weight:bold; padding:8px 16px;">Manage Students & Alumni</button>
                  <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-usthad" onclick="setPortalFilter('usthad')" style="font-weight:bold; padding:8px 16px;">Manage Usthads</button>
                  <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-all" onclick="setPortalFilter('all')" style="display:none;">All</button>
                </div>
              </div>`;
              
  content = content.replace(searchFilter, replaceFilter);
  
  fs.writeFileSync('public/admin.html', content);
  console.log("Patched successfully.");
} else {
  console.log("Not found.");
}
