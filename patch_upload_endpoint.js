const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let js = fs.readFileSync('controllers/portalController.js', 'utf8');

const uploadLogic = `
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const { userId, role, base64Image } = req.body;
    if (!userId || !base64Image) {
      return res.status(400).json({ success: false, message: 'Missing user ID or image data' });
    }

    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 string' });
    }

    const ext = matches[1].split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = userId + '_' + Date.now() + '.' + ext;
    const uploadDir = path.join(__dirname, '../public/uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    const photoUrl = 'uploads/' + fileName;

    // Delete old photo and update user
    let user;
    if (role === 'student' || role === 'alumni') {
      user = await Student.findOne({ _id: userId });
    } else {
      user = await Usthad.findOne({ _id: userId });
    }

    if (user) {
      if (user.photoUrl && user.photoUrl.startsWith('uploads/')) {
        const oldPath = path.join(__dirname, '../public', user.photoUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error('Failed to delete old photo:', e); }
        }
      }
      user.photoUrl = photoUrl;
      
      const tdb = require('../config/telegramDB');
      if (tdb.uploadDbToTelegram) {
        tdb.uploadDbToTelegram(); // Background sync
      }
    }

    res.json({ success: true, photoUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: 'Photo upload failed' });
  }
};
`;

if (!js.includes('exports.uploadProfilePhoto')) {
  js += '\n' + uploadLogic;
  fs.writeFileSync('controllers/portalController.js', js);
  
  // Register route in server.js
  let sjs = fs.readFileSync('server.js', 'utf8');
  if (!sjs.includes('/api/portal/upload-photo')) {
    sjs = sjs.replace("app.put('/api/portal/student/:id', portalController.updateStudentAdmin);", "app.put('/api/portal/student/:id', portalController.updateStudentAdmin);\napp.post('/api/portal/upload-photo', portalController.uploadProfilePhoto);");
    fs.writeFileSync('server.js', sjs);
  }
  console.log('Added uploadProfilePhoto endpoint.');
} else {
  console.log('Upload endpoint already exists.');
}
