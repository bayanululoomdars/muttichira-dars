const fs = require('fs');
let js = fs.readFileSync('config/telegramDB.js', 'utf8');

if (!js.includes('uploadDbToTelegram,')) {
  js = js.replace('module.exports = {', 'module.exports = {\n  uploadDbToTelegram,');
  fs.writeFileSync('config/telegramDB.js', js);
  console.log('Exported uploadDbToTelegram');
}
