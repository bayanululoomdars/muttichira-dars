const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

// Update addStudentAdmin
const addRegex = /const \{ admissionNo, name, phone, password, className, isAlumni, status, batchYear, place, photoUrl, guardianName \} = req\.body;/;
const addReplace = `const { admissionNo, name, phone, password, batchNumber, isAlumni, status, place, photoUrl, guardianName } = req.body;`;
js = js.replace(addRegex, addReplace);

const saveRegex = /batchYear: batchYear \|\| '2025',\s*className: className \|\| 'Dars 1st Year',/;
const saveReplace = `batchNumber: batchNumber || '1',`;
js = js.replace(saveRegex, saveReplace);

// We need to also patch the lookup endpoint to return batchNumber
const lookupRegex = /className: s\.className,\s*status: s\.status \|\| \(s\.isAlumni \? 'Biruthadhari \/ Alumni' : 'Current Student'\),\s*isAlumni: s\.isAlumni,\s*batchYear: s\.batchYear,/g;
const lookupReplace = `batchNumber: s.batchNumber,\n            status: s.status || (s.isAlumni ? 'Biruthadhari / Alumni' : 'Current Student'),\n            isAlumni: s.isAlumni,`;
js = js.replace(lookupRegex, lookupReplace);

const lookup2Regex = /className: student\.className,\s*status: student\.status,\s*isAlumni: student\.isAlumni,\s*batchYear: student\.batchYear,/g;
const lookup2Replace = `batchNumber: student.batchNumber,\n          status: student.status,\n          isAlumni: student.isAlumni,`;
js = js.replace(lookup2Regex, lookup2Replace);

// Let's also patch the Exams part if needed?
// Exams currently group students by className. If className is removed, we should group by batchNumber!
// Let's check exams in portalController.
fs.writeFileSync('controllers/portalController.js', js);
console.log('Patched backend for batchNumber');
