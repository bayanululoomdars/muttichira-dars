const tg = require('./config/telegramDB');
const fs = require('fs');

async function sync() {
  await tg.loadDbFromTelegram();
  const localDb = JSON.parse(fs.readFileSync('local_db.json', 'utf8'));
  
  // Replace the data in the models
  tg.HomeSettings.find().data.splice(0, tg.HomeSettings.find().data.length, ...localDb.HomeSettings);
  
  console.log('Uploading to Telegram...');
  await tg.uploadDbToTelegram();
  console.log('Done!');
}

sync();
