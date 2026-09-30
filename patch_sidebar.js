const fs = require('fs');
let content = fs.readFileSync('public/admin.html', 'utf8');

// 1. Update the sidebar navigation
content = content.replace(
  /<button class="nav-item" id="nav-students" onclick="showPage\('students'\)">[\s\S]*?<\/button>/,
  '<button class="nav-item" id="nav-portal-users" onclick="showPage(\'portal-users\')">\n          <i class="fa fa-users-cog"></i> Management Portal\n        </button>'
);

content = content.replace(
  /<button class="nav-item" id="nav-usthads" onclick="showPage\('usthads'\)">[\s\S]*?<\/button>/,
  ''
);

// 2. Update showPage mapping
// We need to change the showPage function so it doesn't remap students to portal-users anymore,
// as the user will click "portal-users" directly.
// And we should set the title to 'Management Portal'
const showPageOld = `    if (page === 'students' || page === 'usthads') {
      targetPage = 'portal-users';
    }`;
content = content.replace(showPageOld, "");

const titlesOld = `messages: 'Messages & Contact', portal: 'Portal Settings',
      users: 'Gallery Users', exams: 'Exam Management',
      reset: 'Database Maintenance'`;
const titlesNew = `messages: 'Messages & Contact', 'portal-users': 'Management Portal',
      users: 'Gallery Users', exams: 'Exam Management',
      reset: 'Database Maintenance'`;
content = content.replace(titlesOld, titlesNew);


// 3. Clean up page-portal-users header to use Tabs for Students and Usthads
const oldHeader = `<h2 style="font-family: 'Segoe UI', sans-serif; color: #0a4d2e; margin:0;"><i class="fa fa-users"></i> Manage Portal Users</h2>
                  <small style="color: var(--text-soft);">Manage Students & Usthads credentials and records</small>`;
const newHeader = `<h2 style="font-family: 'Segoe UI', sans-serif; color: #0a4d2e; margin:0;"><i class="fa fa-users-cog"></i> Management Portal</h2>
                  <small style="color: var(--text-soft);">Manage Students, Alumni and Usthads</small>
                  
                  <div style="margin-top: 15px; display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                     <button class="btn btn-outline-secondary btn-sm portal-filter-btn active" id="pfilter-student" onclick="setPortalFilter('student')">Manage Students & Alumni</button>
                     <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-usthad" onclick="setPortalFilter('usthad')">Manage Usthads</button>
                  </div>`;
content = content.replace(oldHeader, newHeader);

// Remove the old filter bar buttons since we moved them to tabs
const oldFilters = `<button class="btn btn-outline-secondary btn-sm portal-filter-btn active" id="pfilter-all" onclick="setPortalFilter('all')">All</button>
                <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-student" onclick="setPortalFilter('student')">Students</button>
                <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-Alumni" onclick="setPortalFilter('Alumni')">Alumni / Biruthadhari</button>
                <button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-usthad" onclick="setPortalFilter('usthad')">Usthads</button>`;

content = content.replace(oldFilters, '');

fs.writeFileSync('public/admin.html', content);
console.log("Patched admin.html UI for Management Portal");
