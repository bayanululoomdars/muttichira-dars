const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

js = js.replace(/place: u.place\r?\n\s*}\);/, "place: u.place,\n          phone: u.phone\n        });");

fs.writeFileSync('controllers/portalController.js', js);
console.log('Patched portalController.js correctly');
