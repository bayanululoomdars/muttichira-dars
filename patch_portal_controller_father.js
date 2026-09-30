const fs = require('fs');
let html = fs.readFileSync('controllers/portalController.js', 'utf8');

html = html.replace(
  'const { admissionNo, name, phone, password, batchNumber, isAlumni, status, place, photoUrl, guardianName } = req.body;',
  'const { admissionNo, name, phone, password, batchNumber, isAlumni, status, place, photoUrl, fatherName } = req.body;'
);
html = html.replace(
  "place: place || 'Muttichira',",
  "place: place || 'Muttichira',\n      fatherName: fatherName || '',"
);

// updateStudentAdmin
html = html.replace(
  'const { name, phone, password, batchNumber, isAlumni, status, place, photoUrl } = req.body;',
  'const { name, phone, password, batchNumber, isAlumni, status, place, photoUrl, fatherName } = req.body;'
);

const updateLogic = `    if (photoUrl) updateData.photoUrl = photoUrl;`;
const newUpdateLogic = `    if (photoUrl) updateData.photoUrl = photoUrl;\n    if (fatherName !== undefined) updateData.fatherName = fatherName;`;
html = html.replace(updateLogic, newUpdateLogic);

fs.writeFileSync('controllers/portalController.js', html);
console.log('Added fatherName to portalController');
