const fs = require('fs');
const lines = fs.readFileSync('public/admin.html', 'utf8').split('\n');
let inPortal = false;
let divs = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes('id="page-portal-users"')) inPortal = true;
  if (inPortal) {
    divs += (l.match(/<div/g) || []).length;
    divs -= (l.match(/<\/div/g) || []).length;
    if (divs === 0) {
      console.log('Closes at line:', i);
      console.log('Next line:', lines[i+1]);
      inPortal = false;
    }
  }
}
