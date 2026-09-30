const fs = require('fs');
const html = fs.readFileSync('public/admin.html','utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes('unifiedAddUserModal') || l.includes('modalCreateExam')) {
        console.log(`\n--- Line ${i} ---`);
        console.log(lines.slice(Math.max(0, i-5), i+3).join('\n'));
    }
});
