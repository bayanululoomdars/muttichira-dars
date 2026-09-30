require('dotenv').config();
const { loadDbFromTelegram, uploadDbToTelegram } = require('./config/telegramDB');

async function forceUpload() {
  console.log('Loading local DB...');
  await loadDbFromTelegram(); // It won't fetch from telegram, so dbState = local_db.json
  console.log('Uploading local DB to Telegram...');
  await uploadDbToTelegram();
  console.log('Done!');
}
forceUpload();
