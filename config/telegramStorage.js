const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const chatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

/**
 * Uploads a file buffer to the configured Telegram Chat/Channel.
 * @param {Buffer} buffer - File content buffer
 * @param {string} filename - Original name of the file
 * @param {string} mimetype - MIME type of the file
 * @returns {Promise<string>} - Returns the Telegram file_id
 */
async function uploadToTelegram(buffer, filename, mimetype) {
  if (!token || !chatId) {
    throw new Error('Telegram bot credentials not configured in .env');
  }

  let method = 'sendDocument';
  let field = 'document';
  
  // Choose correct Telegram API method
  if (mimetype.startsWith('image/')) {
    method = 'sendPhoto';
    field = 'photo';
  } else if (mimetype.startsWith('video/')) {
    method = 'sendVideo';
    field = 'video';
  }

  const formData = new FormData();
  formData.append('chat_id', chatId);
  
  const blob = new Blob([buffer], { type: mimetype });
  formData.append(field, blob, filename);

  const url = `https://api.telegram.org/bot${token}/${method}`;
  
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Telegram upload failed with status ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API returned error: ${data.description}`);
  }

  let fileId = '';
  if (method === 'sendPhoto') {
    const photos = data.result.photo;
    fileId = photos[photos.length - 1].file_id;
  } else if (method === 'sendVideo') {
    fileId = data.result.video.file_id;
  } else {
    fileId = data.result.document.file_id;
  }

  return fileId;
}

module.exports = {
  uploadToTelegram,
  token,
  chatId
};
