const fs = require('fs');
let pc = fs.readFileSync('controllers/portalController.js', 'utf-8');

// For student
pc = pc.replace(
  'const { admissionNo, name, phone, password, className, isAlumni, status, batchYear, place, photoUrl, guardianName } = req.body;',
  'const { admissionNo, name, phone, password, className, isAlumni, status, batchYear, place, guardianName } = req.body;\n    let photoUrl = req.body.photoUrl || "";\n    if(req.file) { photoUrl = req.file.path; }'
);

// For usthad
pc = pc.replace(
  'const { usthadId, name, phone, password, designation, subject, place, photoUrl, bio } = req.body;',
  'const { usthadId, name, phone, password, designation, subject, place, bio } = req.body;\n    let photoUrl = req.body.photoUrl || "";\n    if(req.file) { photoUrl = req.file.path; }'
);

fs.writeFileSync('controllers/portalController.js', pc);
console.log('portalController patched!');
