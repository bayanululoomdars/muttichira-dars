const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

// Replace student filtering logic in getExamClassRoster
const rosterRegex = /let classStudents = allStudents\.filter\(s => \s*!s\.isAlumni && \(className === 'ALL' \|\| \(s\.className \|\| ''\)\.toLowerCase\(\) === className\.toLowerCase\(\) \|\| \(s\.status \|\| ''\)\.toLowerCase\(\) === className\.toLowerCase\(\)\)\s*\);/;

const rosterReplace = `let classStudents = allStudents.filter(s => 
      !s.isAlumni && (className === 'ALL' || (s.batchNumber || s.className || '').toString().toLowerCase() === className.toLowerCase())
    );`;

js = js.replace(rosterRegex, rosterReplace);

fs.writeFileSync('controllers/portalController.js', js);
console.log('Patched portalController.js getExamClassRoster filter');
