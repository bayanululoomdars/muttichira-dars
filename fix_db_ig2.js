const tdb = require('./config/telegramDB');
const fs = require('fs');

async function fixDB() {
  await tdb.loadDbFromTelegram();
  const state = require('./config/telegramDB').dbState;
  
  if (state.HomeSettings && state.HomeSettings.length > 0) {
    state.HomeSettings[0].igEmbedCode = '<script src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer></script><div class="elfsight-app-79b0e8f2-3c43-4f68-bffe-80effbf72d9c" data-elfsight-app-lazy></div>';
    
    fs.writeFileSync('local_db.json', JSON.stringify(state, null, 2));
    await tdb.uploadDbToTelegram();
    console.log('Fixed DB igEmbedCode');
  } else {
    console.log('No HomeSettings found');
  }
}
fixDB();
