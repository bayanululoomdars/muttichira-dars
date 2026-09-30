const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

js = js.replace(/guardianName: guardianName \|\| ''/g, "fatherName: fatherName || ''");
js = js.replace(/guardianName: guardianName/g, "fatherName: fatherName");
// Also make sure to check updateStudentAdmin for guardianName
js = js.replace(/if \(guardianName !== undefined\) updateData.guardianName = guardianName;/g, "if (fatherName !== undefined) updateData.fatherName = fatherName;");

fs.writeFileSync('controllers/portalController.js', js);
console.log('Fixed guardianName ReferenceError in portalController.js');
