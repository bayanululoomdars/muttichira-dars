const fs = require('fs');

let css = fs.readFileSync('public/css/style.css', 'utf8');
css = css.replace(/\/\*\s*={10,}\s*POPUP \(MODAL\) STYLE\s*={10,}\s*\*\/[\s\S]*?(?=\/\*\s*={10,}\s*MOBILE RESPONSIVE\s*={10,}\s*\*\/)/, '/* Custom Modal CSS Removed */\n');
fs.writeFileSync('public/css/style.css', css);
console.log('Removed from style.css');

let html = fs.readFileSync('public/login.html', 'utf8');
html = html.replace(/<style>\s*\.modal-backdrop \{ z-index: 1040 !important; \}\s*\.modal \{ z-index: 1050 !important; \}\s*<\/style>/, '');
html = html.replace(/<div class="modal fade" id="([^"]+)" tabindex="-1">/g, '<div class="modal fade" id="$1">');
fs.writeFileSync('public/login.html', html);
console.log('Cleaned login.html');
