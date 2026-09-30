const fs = require('fs');
const lines = fs.readFileSync('public/admin.html', 'utf8').split('\n');

const searchIds = ['formAddStudentAdmin', 'submitCreateExamForm'];

lines.forEach((l, i) => {
    if (l.includes('formAddStudentAdmin') || l.includes('submitCreateExamForm')) {
        console.log(`\n--- Line ${i} Context ---`);
        console.log(lines.slice(Math.max(0, i-10), i+2).join('\n'));
    }
});
