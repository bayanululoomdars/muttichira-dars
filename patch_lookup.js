const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

const oldLogic = `    // Filter students
    allStudents.forEach(s => {`;
const newLogic = `    const requestedRole = req.query.role;
    // Filter students
    if (!requestedRole || requestedRole === 'student') {
    allStudents.forEach(s => {`;

const oldUsthadLogic = `    // Filter usthads
    allUsthads.forEach(u => {`;
const newUsthadLogic = `    }
    // Filter usthads
    if (!requestedRole || requestedRole === 'usthad') {
    allUsthads.forEach(u => {`;

const oldEndLogic = `        });
      }
    });

    res.json({`;
const newEndLogic = `        });
      }
    });
    }

    res.json({`;

js = js.replace(oldLogic, newLogic);
js = js.replace(oldUsthadLogic, newUsthadLogic);
js = js.replace(oldEndLogic, newEndLogic);

fs.writeFileSync('controllers/portalController.js', js);
console.log('Fixed lookup endpoint in portalController.js');
