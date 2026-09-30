const fs = require('fs');

const oldHtml = fs.readFileSync('admin_old.html', 'utf8');
const startTag = '<!-- Unified Add User Modal -->';
const endTag = '<!-- Exam Mark Entry Panel -->'; // This might be what came next in dddaee8

let startIdx = oldHtml.indexOf(startTag);
let endIdx = oldHtml.indexOf('<!-- Create Exam Modal -->', startIdx);
if (endIdx === -1) endIdx = oldHtml.indexOf('<!-- Exam Management Section -->', startIdx);
if (endIdx === -1) endIdx = oldHtml.indexOf('<div id="usersPanel"', startIdx);

// Actually, let's just find it by finding the start tag and parsing until its closing div
let snippet = '';
if (startIdx !== -1) {
    const endSearch = oldHtml.indexOf('<!--', startIdx + 10);
    snippet = oldHtml.substring(startIdx, endSearch);
}
console.log('Snippet extracted length:', snippet.length);
fs.writeFileSync('snippet.html', snippet);
