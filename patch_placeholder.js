const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

html = html.replace(
  "sub.textContent = 'Enter your Usthad ID (e.g. UST101) or Phone Number';",
  "sub.textContent = 'Enter your Name to look up your profile';"
);
html = html.replace(
  "input.placeholder = 'e.g. UST101 or 9526919218';",
  "input.placeholder = 'Enter your Name...';"
);

fs.writeFileSync('public/login.html', html);
console.log('Fixed usthad placeholder');
