const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// Find the broken CSS block
const brokenCSS = `.action-buttons button {
    border: none;
    padding: 6px 12px;
    .badge.student`;

const fixedCSS = `.action-buttons button {
    border: none;
    padding: 6px 12px;
}
    .badge.student`;

// Since line endings might vary, let's use a regex
html = html.replace(/\.action-buttons button\s*\{\s*border:\s*none;\s*padding:\s*6px 12px;\s*\.badge\.student/, ".action-buttons button {\n    border: none;\n    padding: 6px 12px;\n}\n    .badge.student");

fs.writeFileSync('public/admin.html', html);
console.log('Fixed CSS syntax regex');
