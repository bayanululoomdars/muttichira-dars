const fs = require('fs');
const html = fs.readFileSync('public/index.html','utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes("fetch('/api/home-settings')")) {
        console.log(lines.slice(i, i+15).join('\n'));
    }
});
