const https = require('https');

/**
 * Send a notification message via Telegram Bot API
 * @param {string} text - Message text or HTML string
 * @param {string} [parseMode='HTML'] - 'HTML' or 'Markdown'
 */
function sendTelegramNotification(text, parseMode = 'HTML') {
  const token  = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID   || '').trim();
  
  if (!token || !chatId) return;

  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: parseMode,
    disable_web_page_preview: true
  };

  const data = JSON.stringify(payload);

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (!parsed.ok) {
          console.error('Telegram API Error:', parsed.description);
        }
      } catch (e) {
        /* ignore JSON parse error */
      }
    });
  });

  req.on('error', (e) => {
    console.error('Telegram Request Exception:', e.message);
  });

  req.write(data);
  req.end();
}

module.exports = { sendTelegramNotification };
