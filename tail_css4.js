const fs = require('fs');
const html = fs.readFileSync('public/admin.html','utf8');
const styles = html.match(/<style>[\s\S]*?<\/style>/g);
console.log(styles[0].slice(-3000, -2000));
