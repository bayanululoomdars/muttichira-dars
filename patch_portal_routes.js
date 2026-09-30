const fs = require('fs');
let js = fs.readFileSync('routes/portalRoutes.js', 'utf8');

if (!js.includes('uploadProfilePhoto')) {
  js = js.replace('module.exports = router;', `
router.post('/upload-photo', portalController.uploadProfilePhoto);
router.get('/usthad/messages', portalController.getStudentMessages); // Usthad messages use the same DB method
module.exports = router;
`);
  fs.writeFileSync('routes/portalRoutes.js', js);
  console.log('Patched portalRoutes.js');
} else {
  console.log('portalRoutes.js already patched');
}
