const fs = require('fs');
let js = fs.readFileSync('config/telegramDB.js', 'utf8');

// Disable telegram fetch temporarily
js = js.replace('if (token && chatId) {', 'if (false && token && chatId) {');

fs.writeFileSync('config/telegramDB.js', js);
console.log('Disabled Telegram fetch temporarily');
