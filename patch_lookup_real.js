const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

const regexStudents = /\/\/ Filter students\s+allStudents\.forEach\(s => \{/;
js = js.replace(regexStudents, "const requestedRole = req.query.role;\n    // Filter students\n    if (!requestedRole || requestedRole === 'student') {\n    allStudents.forEach(s => {");

const regexUsthads = /\/\/ Filter usthads\s+allUsthads\.forEach\(u => \{/;
js = js.replace(regexUsthads, "}\n    // Filter usthads\n    if (!requestedRole || requestedRole === 'usthad') {\n    allUsthads.forEach(u => {");

const regexEnd = /if \(results\.length > 0\)/;
js = js.replace(regexEnd, "}\n\n    if (results.length > 0)");

fs.writeFileSync('controllers/portalController.js', js);
console.log('Successfully patched portalController lookup');
