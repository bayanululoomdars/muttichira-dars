const fs = require('fs');
const html = fs.readFileSync('public/login.html','utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (match) {
    const lines = match[1].split('\n');
    lines.forEach((l, i) => console.log(i + 1, l));
}
