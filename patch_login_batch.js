const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

html = html.replace("const subText = item.role === 'usthad' ? (item.designation || 'Usthad') : (item.className || 'Student');", "const subText = item.role === 'usthad' ? (item.designation || 'Usthad') : ('Batch ' + (item.batchNumber || 'Student'));");
html = html.replace("data.exams.forEach(e => { html += \\`<option value=\\"\\${e._id}\\"\\>\\${e.examName} (\\${e.term} \\${e.batchYear})</option>\\`; });", "data.exams.forEach(e => { html += \\`<option value=\\"\\${e._id}\\"\\>\\${e.examName} (\\${e.term})</option>\\`; });");
html = html.replace("<span class=\\"badge badge-alumni my-1\\">Biruthadhari • Batch \\${a.batchYear || 'Graduated'}</span>", "<span class=\\"badge badge-alumni my-1\\">Biruthadhari • Batch \\${a.batchNumber || 'Alumni'}</span>");

fs.writeFileSync('public/login.html', html);
console.log('Fixed login.html');
