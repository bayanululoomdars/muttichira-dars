const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

js = js.replace('const updates = req.body;\n    if (req.file) updates.photoUrl = req.file.path;', 
`const updates = req.body;
    if (req.file) updates.photoUrl = req.file.path;
    if (updates.password === "") delete updates.password;`);

js = js.replace('const updates = req.body;\n    if (req.file) updates.photoUrl = req.file.path;\n    \n    Object.assign(usthad, updates);',
`const updates = req.body;
    if (req.file) updates.photoUrl = req.file.path;
    if (updates.password === "") delete updates.password;
    Object.assign(usthad, updates);`);

fs.writeFileSync('controllers/portalController.js', js);
console.log('Fixed password empty update bug');
