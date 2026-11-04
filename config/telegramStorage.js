const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const chatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

/**
 * Uploads a file buffer to the configured Telegram Chat/Channel.
 * Automatically falls back to sendDocument if sendPhoto fails
 * (e.g. PHOTO_INVALID_DIMENSIONS for large or high-resolution images).
 * @param {Buffer} buffer - File content buffer
 * @param {string} filename - Original name of the file
 * @param {string} mimetype - MIME type of the file
 * @returns {Promise<string>} - Returns the Telegram file_id
 */
async function uploadToTelegram(buffer, filename, mimetype) {
  if (!token || !chatId) {
    throw new Error('Telegram bot credentials not configured in .env');
  }

  // Helper to attempt upload with a specific Telegram API method
  async function sendWith(method, field) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    const blob = new Blob([buffer], { type: mimetype || 'application/octet-stream' });
    formData.append(field, blob, filename || 'file');

    const url = `https://api.telegram.org/bot${token}/${method}`;
    return await fetch(url, {
      method: 'POST',
      body: formData
    });
  }

  let method = 'sendDocument';
  let field = 'document';
  
  // Choose correct Telegram API method
  if (mimetype && mimetype.startsWith('image/')) {
    method = 'sendPhoto';
    field = 'photo';
  } else if (mimetype && mimetype.startsWith('video/')) {
    method = 'sendVideo';
    field = 'video';
  }

  let res = await sendWith(method, field);

  // If sendPhoto or sendVideo fails (e.g. PHOTO_INVALID_DIMENSIONS or format issue),
  // automatically fall back to sendDocument which has no image dimension restrictions!
  if (!res.ok && method !== 'sendDocument') {
    const errText = await res.text();
    console.warn(`Telegram ${method} failed (${res.status}: ${errText}). Falling back to sendDocument...`);
    method = 'sendDocument';
    field = 'document';
    res = await sendWith(method, field);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Telegram upload failed with status ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API returned error: ${data.description}`);
  }

  let fileId = '';
  if (method === 'sendPhoto' && data.result.photo && data.result.photo.length > 0) {
    const photos = data.result.photo;
    fileId = photos[photos.length - 1].file_id;
  } else if (method === 'sendVideo' && data.result.video) {
    fileId = data.result.video.file_id;
  } else if (data.result.document) {
    fileId = data.result.document.file_id;
  } else if (data.result.photo && data.result.photo.length > 0) {
    const photos = data.result.photo;
    fileId = photos[photos.length - 1].file_id;
  }

  if (!fileId) {
    throw new Error('Could not extract file_id from Telegram response');
  }

  return fileId;
}

module.exports = {
  uploadToTelegram,
  token,
  chatId
};
