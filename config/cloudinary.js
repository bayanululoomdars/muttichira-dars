const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'albayan',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm'],
    resource_type: 'auto',
    transformation: [{ width: 1200, quality: 'auto' }],
  },
});

const upload = multer({ storage: storage });

// Ensure local upload directory exists
const uploadDir = path.join(__dirname, '../public/img/uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local fallback storage (when Cloudinary is not configured)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadLocal = multer({ storage: localStorage });

// Check if Cloudinary is fully configured
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

// Dynamic uploader selector
const getUploader = () => {
  return isCloudinaryConfigured() ? upload : uploadLocal;
};

module.exports = { 
  cloudinary, 
  upload, 
  uploadLocal, 
  isCloudinaryConfigured,
  getUploader
};
