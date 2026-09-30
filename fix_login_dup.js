const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const badBlock = `            document.getElementById('editStudentBio').value = data.student.bio || '';
          }
        });
    }
            document.getElementById('editStudentBio').value = data.student.bio || '';
          }
        });
    }`;

const goodBlock = `            document.getElementById('editStudentBio').value = data.student.bio || '';
          }
        });
    }`;

html = html.replace(badBlock, goodBlock);
fs.writeFileSync('public/login.html', html);
console.log('Fixed duplication in login.html');
