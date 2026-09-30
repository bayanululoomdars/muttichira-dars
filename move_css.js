const fs = require('fs');

let adminHtml = fs.readFileSync('public/admin.html', 'utf8');
const startCss = adminHtml.indexOf('.table-container {');
const endCss = adminHtml.indexOf('/* EXAMS & MARKS STYLES */', startCss) !== -1 ? adminHtml.indexOf('/* EXAMS & MARKS STYLES */', startCss) : adminHtml.indexOf('</style>', startCss);

if (startCss !== -1 && endCss !== -1) {
    const cssBlock = adminHtml.substring(startCss, endCss);
    
    let loginHtml = fs.readFileSync('public/login.html', 'utf8');
    loginHtml = loginHtml.replace('</style>', cssBlock + '\n</style>');
    fs.writeFileSync('public/login.html', loginHtml);
    console.log('Moved CSS successfully');
} else {
    console.log('CSS block not found');
}
