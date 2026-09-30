const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Remove defaults
html = html.replace('<div id="counterStudents" class="counter-number">111</div>', '<div id="counterStudents" class="counter-number">0</div>');
html = html.replace('<div id="counterUstads" class="counter-number">8</div>', '<div id="counterUstads" class="counter-number">0</div>');
html = html.replace('<div id="counterYears" class="counter-number">25</div>', '<div id="counterYears" class="counter-number">0</div>');

fs.writeFileSync('public/index.html', html);
console.log('Fixed default values in index.html');
