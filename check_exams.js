const fs = require('fs');
const html = fs.readFileSync('public/admin.html','utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes('id="page-exams"')) {
        console.log(lines.slice(i, i+60).join('\n'));
    }
});
