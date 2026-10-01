const fs = require('fs');
const html = fs.readFileSync('public/login.html', 'utf8');
const btns = html.match(/<button[^>]*>/g) || [];
btns.forEach(b => {
  const m = b.match(/onclick="([^"]+)"/);
  if (m) console.log(m[1]);
  else console.log('NO ONCLICK:', b);
});
