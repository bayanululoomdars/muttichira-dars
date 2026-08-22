const multer = require('multer');
const { uploadToTelegram } = require('./telegramStorage');

// Mock Cloudinary object so controllers calling cloudinary.uploader.destroy don't throw errors
const cloudinary = {
  uploader: {
    destroy: async (publicId) => {
      console.log(`[Telegram Storage Mock] Request to delete fileId: ${publicId} (No-op on Telegram)`);
      return { result: 'ok' };
    }
  }
};

// Memory storage for multer to accept the file upload and store in buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// We return true so that the controllers always evaluate:
// `imageUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename`
// and write `req.file.path` (which we populate with the Telegram proxy URL) into the database.
const isCloudinaryConfigured = () => true;

// Custom uploader middleware that intercepts multer, uploads to Telegram, and mutates req.file
const getUploader = () => {
  return {
    single: (fieldName) => {
      const multerSingle = upload.single(fieldName);
      return (req, res, next) => {
        multerSingle(req, res, async (err) => {
          if (err) return next(err);
          if (!req.file) return next();

          try {
            // Upload to Telegram
            const fileId = await uploadToTelegram(req.file.buffer, req.file.originalname, req.file.mimetype);
            
            // Set properties expected by the controller to route to the proxy
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

module.exports = {
  cloudinary,
  upload,
  uploadLocal: upload, // Fallback mapping
  isCloudinaryConfigured,
  getUploader
};
