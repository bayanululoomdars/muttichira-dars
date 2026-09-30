const fs = require('fs');

let js = fs.readFileSync('controllers/portalController.js', 'utf8');

const base64Handler = `
function processBase64ImageSync(base64Str, userId) {
  if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;
  try {
    const matches = base64Str.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Str;
    const ext = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = userId + '_' + Date.now() + '.' + ext;
    const uploadDir = require('path').join(__dirname, '../public/uploads');
    if (!require('fs').existsSync(uploadDir)) {
      require('fs').mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = require('path').join(uploadDir, fileName);
    require('fs').writeFileSync(filePath, buffer);
    return 'uploads/' + fileName;
  } catch(e) {
    console.error('Base64 processing error:', e);
    return '';
  }
}
`;

if (!js.includes('processBase64ImageSync')) {
  js = js.replace('exports.addStudentAdmin = async (req, res) => {', base64Handler + '\nexports.addStudentAdmin = async (req, res) => {');
  
  // Patch addStudentAdmin
  js = js.replace(/const newStudent = new Student\(\{[\s\S]*?\}\);/, (match) => {
    return `
    let processedPhoto = photoUrl;
    if (processedPhoto && processedPhoto.startsWith('data:image')) {
      processedPhoto = processBase64ImageSync(processedPhoto, autoAdmNo);
    }
    ` + match.replace('photoUrl: photoUrl ||', 'photoUrl: processedPhoto ||');
  });
  
  // Patch addUsthadAdmin
  js = js.replace(/const newUsthad = new Usthad\(\{[\s\S]*?\}\);/, (match) => {
    return `
    let processedPhoto = photoUrl;
    if (processedPhoto && processedPhoto.startsWith('data:image')) {
      processedPhoto = processBase64ImageSync(processedPhoto, autoUstId);
    }
    ` + match.replace('photoUrl: photoUrl ||', 'photoUrl: processedPhoto ||');
  });

  fs.writeFileSync('controllers/portalController.js', js);
  console.log('Patched base64 handling for new users');
} else {
  console.log('Already patched base64 handling');
}
