const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Fix newsletter form
html = html.replace(
  "document.getElementById('newsletterForm').addEventListener",
  "var nlForm = document.getElementById('newsletterForm');\n    if (nlForm) nlForm.addEventListener"
);

// Fix contact form
html = html.replace(
  "document.getElementById('contactForm').addEventListener",
  "var cForm = document.getElementById('contactForm');\n    if (cForm) cForm.addEventListener"
);

// Fix admission modal form
html = html.replace(
  "document.getElementById('admissionModalForm').addEventListener",
  "var aForm = document.getElementById('admissionModalForm');\n    if (aForm) aForm.addEventListener"
);

fs.writeFileSync('public/index.html', html);
console.log('Fixed index.html');
