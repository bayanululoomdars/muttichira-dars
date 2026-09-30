const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

const regex = /const validPass = student\.password \|\| student\.phone \|\| student\.admissionNo;\s*if \(cleanPass !== validPass\) \{/;

js = js.replace(regex, `const validPass = student.password || student.phone || student.admissionNo;
      console.log('Login student:', student);
      console.log('Login validPass:', validPass, 'cleanPass:', cleanPass);
      if (cleanPass !== validPass) {`);

fs.writeFileSync('controllers/portalController.js', js);
console.log('Added debug logs to login');
