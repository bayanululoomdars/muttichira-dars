const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

html = html.replace(/const classCount = e\.classSubjects \? Object\.keys\(e\.classSubjects\)\.length : 0;/g, "const classCount = e.classSubjects ? Object.keys(e.classSubjects).length : 0;");
html = html.replace(/<td>\$\{classCount\} Classes configured<\/td>/g, "<td>${classCount} Batches configured</td>");
html = html.replace(/const targetClass = safeGetValue\('newExamBatchNo'\) \|\| 'Dars 3rd Year';/g, "const targetClass = safeGetValue('newExamBatchNo') || '1';");
html = html.replace(/if \(targetClass\.includes\('3rd'\)\) \{/g, "if (targetClass === '3') {");
html = html.replace(/const targetClass = safeGetValue\('newExamBatchNo'\);/g, "const targetClass = safeGetValue('newExamBatchNo');");

fs.writeFileSync('public/admin.html', html);
console.log('Fixed exam batch references in admin.html');
