const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

html = html.replace(/document\.getElementById\('editStudentBio'\)\.value = data\.student\.bio \|\| '';\s*}\s*}\);\s*}\s*document\.getElementById\('editStudentBio'\)\.value = data\.student\.bio \|\| '';\s*}\s*}\);\s*}/g, 
`document.getElementById('editStudentBio').value = data.student.bio || '';
          }
        });
    }`);

fs.writeFileSync('public/login.html', html);
console.log('Fixed duplication regex');
