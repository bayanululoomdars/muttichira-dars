const fs = require('fs');
const html = fs.readFileSync('public/login.html','utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes('modalPostMark')) {
        console.log(lines.slice(Math.max(0, i-5), i+30).join('\n'));
    }
});
