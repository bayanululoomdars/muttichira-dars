const fs = require('fs');
const html = fs.readFileSync('public/login.html','utf8');
console.log(html.includes('id="modalPostMark"'));
