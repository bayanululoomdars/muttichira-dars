const fs = require('fs');
const html = fs.readFileSync('public/login.html','utf8');
const studentDashStart = html.indexOf('id="studentDashContent"');
const usthadDashStart = html.indexOf('id="usthadDashContent"');
console.log('Student Dash Length:', usthadDashStart - studentDashStart);

const usthadDashEnd = html.indexOf('<!-- COUNTER STATISTICS SECTION -->');
console.log('Usthad Dash Length:', usthadDashEnd - usthadDashStart);
