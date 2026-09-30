const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

html = html.replace('<th>Class / Details</th>', '<th>Batch / Details</th>');
html = html.replace("var statusMatch = (u.status || u.className || u.designation || '').toLowerCase().includes(query);", "var statusMatch = (u.status || ('Batch ' + u.batchNumber) || u.designation || '').toLowerCase().includes(query);");
html = html.replace("var details = u.role === 'usthad' ? (u.subject || '—') : (u.className || '—');", "var details = u.role === 'usthad' ? (u.subject || '—') : ('Batch ' + (u.batchNumber || '—'));");

fs.writeFileSync('public/admin.html', html);
console.log('Fixed admin.html');
