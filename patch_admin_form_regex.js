const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// 1. Fix editUserAdmin
const editRegex = /safeSetVal\('adminStudentName', user\.name\);\s*safeSetVal\('adminStudentPhone', user\.phone\);/;
html = html.replace(editRegex, `safeSetVal('adminStudentName', user.name);\n    safeSetVal('adminStudentFather', user.fatherName || '');\n    safeSetVal('adminStudentPhone', user.phone);`);

// 2. Fix submitAddStudentAdmin
const submitRegex = /fd\.append\('name', safeGetValue\('adminStudentName'\)\);\s*fd\.append\('phone', safeGetValue\('adminStudentPhone'\)\);/;
html = html.replace(submitRegex, `fd.append('name', safeGetValue('adminStudentName'));\n  fd.append('fatherName', safeGetValue('adminStudentFather'));\n  fd.append('phone', safeGetValue('adminStudentPhone'));`);

fs.writeFileSync('public/admin.html', html);
console.log('Fixed admin.html form mapping with regex');
