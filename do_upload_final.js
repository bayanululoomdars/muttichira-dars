
require('dotenv').config();
const { loadDbFromTelegram, uploadDbToTelegram } = require('./config/telegramDB');
async function run() {
  await loadDbFromTelegram();
  await uploadDbToTelegram();
  console.log('Uploaded to Telegram Cloud!');
}
run();
