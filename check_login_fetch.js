const fs = require('fs');
const html = fs.readFileSync('public/login.html','utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes("fetch('/api/portal/login'")) {
        console.log(lines.slice(i-10, i+25).join('\n'));
    }
});
