const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

// Replace memoryStudents array
const memS_regex = /const memoryStudents = \[[^]*?\];/;
js = js.replace(memS_regex, 'const memoryStudents = [];');

// Replace memoryUsthads array
const memU_regex = /const memoryUsthads = \[[^]*?\];/;
js = js.replace(memU_regex, 'const memoryUsthads = [];');

fs.writeFileSync('controllers/portalController.js', js);
console.log('Cleared memory fallback arrays');
