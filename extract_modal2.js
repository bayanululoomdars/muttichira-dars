const fs = require('fs');
const execSync = require('child_process').execSync;
const html = execSync('git show dddaee83a3f0245b5bb053bc64a26c44f615996e:public/admin.html').toString('utf8');

const startTag = '<!-- Unified Add User Modal -->';
const startIdx = html.indexOf(startTag);
const endIdx = html.indexOf('<!-- Create Exam Modal -->', startIdx);
const snippet = html.substring(startIdx, endIdx);

fs.writeFileSync('snippet.html', snippet);
console.log('Snippet saved. Length:', snippet.length);
