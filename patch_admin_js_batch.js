const fs = require('fs');

let adminHtml = fs.readFileSync('public/admin.html', 'utf8');

const oldJS1 = `    safeSetVal('adminStudentClass', user.className);
    safeSetVal('adminStudentBatch', user.batchYear);`;
const newJS1 = `    safeSetVal('adminStudentBatchNo', user.batchNumber || user.batchYear);`;

adminHtml = adminHtml.replace(oldJS1, newJS1);

const oldJS2 = `  fd.append('className', safeGetValue('adminStudentClass'));
  fd.append('batchYear', safeGetValue('adminStudentBatch'));`;
const newJS2 = `  fd.append('batchNumber', safeGetValue('adminStudentBatchNo'));`;

adminHtml = adminHtml.replace(oldJS2, newJS2);

fs.writeFileSync('public/admin.html', adminHtml);
console.log('Fixed JS for batchNumber in admin.html');
