const fs = require('fs');
const html = fs.readFileSync('admin_old.html','utf8');
const lines = html.split('\n');
let startLine = -1;
let endLine = -1;

lines.forEach((l, i) => {
    if (l.includes('id="unifiedAddUserModal"')) {
        startLine = i;
    }
});

if (startLine !== -1) {
    let divCount = 0;
    for (let i = startLine; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('<div')) divCount += (line.match(/<div/g) || []).length;
        if (line.includes('</div')) divCount -= (line.match(/<\/div/g) || []).length;
        if (divCount === 0 && i > startLine) {
            endLine = i;
            break;
        }
    }
    
    console.log('Start:', startLine, 'End:', endLine);
    const snippet = lines.slice(startLine, endLine + 1).join('\n');
    fs.writeFileSync('snippet.html', snippet);
    console.log('Snippet length:', snippet.length);
} else {
    console.log('Not found');
}
