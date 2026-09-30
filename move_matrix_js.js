const fs = require('fs');
let adminHtml = fs.readFileSync('public/admin.html', 'utf8');

const jsStart = 'let currentExamRosterData = null;';
const jsEnd = 'function showGlobalLoader(show) {';

const startIdx = adminHtml.indexOf(jsStart);
const endIdx = adminHtml.indexOf(jsEnd);

if (startIdx !== -1 && endIdx !== -1) {
    let jsBlock = adminHtml.substring(startIdx, endIdx);
    
    // Remove it from admin.html
    adminHtml = adminHtml.substring(0, startIdx) + adminHtml.substring(endIdx);
    fs.writeFileSync('public/admin.html', adminHtml);
    
    // Patch variables for Usthad Dashboard
    jsBlock = jsBlock.replace(/loadExamClassRosterMatrix/g, 'loadUsthadExamMatrix');
    jsBlock = jsBlock.replace(/examSelectAdmin/g, 'examSelectUsthad');
    jsBlock = jsBlock.replace(/examClassSelectAdmin/g, 'examBatchSelectUsthad');
    jsBlock = jsBlock.replace(/onExamOrClassChange/g, 'onUsthadExamChange');
    jsBlock = jsBlock.replace(/saveExamClassMarks/g, 'saveExamMarksUsthad');
    jsBlock = jsBlock.replace(/className=/g, 'batchNumber=');
    jsBlock = jsBlock.replace(/className: className/g, 'batchNumber: className'); // Keep variable name className for now but map to batchNumber in request
    
    // Inject into login.html
    let loginHtml = fs.readFileSync('public/login.html', 'utf8');
    const loginInject = '// Usthad Quick Send Mark';
    loginHtml = loginHtml.replace(loginInject, jsBlock + '\n\n    ' + loginInject);
    fs.writeFileSync('public/login.html', loginHtml);
    console.log('Moved Matrix JS successfully');
} else {
    console.error('JS block boundaries not found');
}
