const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

const regex = /\/\/ Instagram Embed Code[\s\S]*?\/\/ Assistant Mudarris/;
c = c.replace(regex, '// Assistant Mudarris');

fs.writeFileSync('public/index.html', c);
console.log('done');
