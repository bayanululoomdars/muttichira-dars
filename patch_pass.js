const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

html = html.replace(
  "safeSetVal('adminStudentPassword', user.password || user.phone);",
  "safeSetVal('adminStudentPassword', user.password);"
);

html = html.replace(
  "safeSetVal('adminUsthadPassword', user.password || user.phone);",
  "safeSetVal('adminUsthadPassword', user.password);"
);

fs.writeFileSync('public/admin.html', html);
console.log('Fixed password fallback in admin.html');
