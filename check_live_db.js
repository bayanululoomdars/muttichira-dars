require('dotenv').config();
const { loadDbFromTelegram } = require('./config/telegramDB');
async function run() {
  await loadDbFromTelegram();
  const tdb = require('./config/telegramDB');
  console.log('Live Students in RAM:', tdb.Student.find().length);
  console.log('Live Usthads in RAM:', tdb.Usthad.find().length);
}
run();
