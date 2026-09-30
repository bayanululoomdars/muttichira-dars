const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// The replacement was probably failing due to \r\n vs \n
html = html.replace(/safeSetVal\('adminStudentClass',\s*user\.className\);\s*safeSetVal\('adminStudentBatch',\s*user\.batchYear\);/g, 
  "safeSetVal('adminStudentBatchNo', user.batchNumber || user.batchYear);");

html = html.replace(/fd\.append\('className',\s*safeGetValue\('adminStudentClass'\)\);\s*fd\.append\('batchYear',\s*safeGetValue\('adminStudentBatch'\)\);/g,
  "fd.append('batchNumber', safeGetValue('adminStudentBatchNo'));");

fs.writeFileSync('public/admin.html', html);
console.log('Fixed JS lines using Regex');
