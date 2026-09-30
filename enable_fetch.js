const fs = require('fs');
let js = fs.readFileSync('config/telegramDB.js', 'utf8');

js = js.replace('if (false && token && chatId) {', 'if (token && chatId) {');

fs.writeFileSync('config/telegramDB.js', js);
console.log('Re-enabled Telegram fetch');
