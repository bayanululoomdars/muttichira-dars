const fs = require('fs');
const { loadDbFromTelegram, Student, Usthad } = require('./config/telegramDB');

async function forceUpload() {
  // Read local_db.json
  const localDb = JSON.parse(fs.readFileSync('local_db.json', 'utf8'));
  
  // Patch telegramDB methods manually
  const tdb = require('./config/telegramDB');
  
  // Inject local_db into dbState BEFORE it uploads
  // Actually, there's a function uploadDbToTelegram but it's not exported.
  // Wait, I can just create a new Student and call save(), which triggers scheduleSave() -> uploadDbToTelegram()
}
forceUpload();
