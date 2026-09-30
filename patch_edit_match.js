const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const regex = /const user = allPortalUsersCache\.find\(u => \(String\(u\._id\) === String\(id\) \|\| String\(u\.admissionNo\) === String\(id\) \|\| String\(u\.usthadId\) === String\(id\)\)\);/;
html = html.replace(regex, `const cleanId = String(id).trim();
  const user = allPortalUsersCache.find(u => {
    return (u._id && String(u._id).trim() === cleanId) || 
           (u.admissionNo && String(u.admissionNo).trim() === cleanId) || 
           (u.usthadId && String(u.usthadId).trim() === cleanId);
  });`);

fs.writeFileSync('public/admin.html', html);
console.log('Fixed editUserAdmin ID match');
