const multer = require('multer');
const { uploadToTelegram } = require('./telegramStorage');

// Memory storage for multer to accept file uploads in-memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Custom uploader middleware that intercepts Multer, 
 * uploads the buffer directly to Telegram, and routes files via the proxy URL.
 */
const getUploader = () => {
  return {
    single: (fieldName) => {
      const multerSingle = upload.single(fieldName);
      return (req, res, next) => {
        multerSingle(req, res, async (err) => {
          if (err) return next(err);
          if (!req.file) return next();

          try {
            // Upload buffer directly to Telegram chat
            const fileId = await uploadToTelegram(req.file.buffer, req.file.originalname, req.file.mimetype);
            
            // Set properties expected by controllers to route through local proxy
            req.file.path = `/api/media/tg/${fileId}`;
            req.file.filename = fileId;
            next();
          } catch (uploadErr) {
            console.error('Error uploading file to Telegram via middleware:', uploadErr);
            return next(uploadErr);
          }
        });
      };
    }
  };
};

/**
 * Requests file deletion. Since Telegram does not support deletion 
 * easily via API without message_id, this is a clean no-op.
 * @param {string} fileId - The Telegram file_id
 */
const deleteFile = async (fileId) => {
  console.log(`[Telegram Storage] Deletion requested for fileId: ${fileId} (No-op on Telegram)`);
  return true;
};

module.exports = {
  getUploader,
  deleteFile
};
