const fs = require('fs');
const execSync = require('child_process').execSync;
const html = execSync('git show dddaee83a3f0245b5bb053bc64a26c44f615996e:public/admin.html').toString('utf8');

const lines = html.split('\n');
let startLine = -1;
let endLine = -1;

lines.forEach((l, i) => {
    if (l.includes('id="unifiedAddUserModal"')) {
        startLine = i - 1; // Include the comment
    }
});

let divCount = 0;
let started = false;
for (let i = startLine + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<div')) {
        divCount += (line.match(/<div/g) || []).length;
        started = true;
    }
    if (line.includes('</div')) {
        divCount -= (line.match(/<\/div/g) || []).length;
    }
    
    if (started && divCount === 0) {
        endLine = i;
        break;
    }
}

const snippet = lines.slice(startLine, endLine + 1).join('\n');
fs.writeFileSync('snippet.html', snippet);
console.log('Snippet saved. Length:', snippet.length);
