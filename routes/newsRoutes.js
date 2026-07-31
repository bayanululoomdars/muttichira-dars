const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { getUploader } = require('../config/cloudinary');

router.get('/', newsController.getAllNews);

// Use a wrapper to dynamically get the uploader middleware
router.post('/', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('image')(req, res, next);
}, newsController.createNews);

router.delete('/:id', newsController.deleteNews);

module.exports = router;
