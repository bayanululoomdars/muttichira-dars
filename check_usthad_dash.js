const fs = require('fs');
const html = fs.readFileSync('public/login.html','utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes('id="usthadDashContent"')) {
        console.log(lines.slice(i, i+50).join('\n'));
    }
});
