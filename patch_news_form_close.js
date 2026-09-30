const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

html = html.replace(
    "document.getElementById('newsForm').reset();",
    "document.getElementById('newsForm').reset();\n          closeModal('addNewsModal');"
);

fs.writeFileSync('public/admin.html', html);
console.log('Added closeModal to newsForm submit');
