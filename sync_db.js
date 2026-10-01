const tdb = require('./config/telegramDB');

async function sync() {
  await tdb.loadDbFromTelegram();
  const state = tdb.getDbState(); // Wait, earlier this threw an error. Let's require the state directly.
}
