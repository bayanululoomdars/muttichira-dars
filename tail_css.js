const fs = require('fs');
const html = fs.readFileSync('public/admin.html','utf8');
const styles = html.match(/<style>[\s\S]*?<\/style>/g);
console.log(styles[styles.length-1].slice(-1000));
