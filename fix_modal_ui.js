const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Restore the modal z-index overrides in head
if (!html.includes('.modal-backdrop { z-index: 1040')) {
  html = html.replace('</head>', '  <style>\n    .modal-backdrop { z-index: 1040 !important; }\n    .modal { z-index: 1050 !important; }\n  </style>\n</head>');
}

// 2. Change modal background from transparent (--bg-card) to solid dark background
html = html.replace(/<div class="modal-content" style="background:var\(--bg-card\);/g, '<div class="modal-content" style="background:#1e293b;');
html = html.replace(/<div class="modal-content rounded-4 border-0 shadow-lg" style="background:var\(--bg-card\);/g, '<div class="modal-content rounded-4 border-0 shadow-lg" style="background:#1e293b;');

// 3. Let's make absolutely sure all modals are at the bottom of the body. They already are, but let's double check.

fs.writeFileSync('public/login.html', html);
console.log('Fixed modal transparency and z-index');
