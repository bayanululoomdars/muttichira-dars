const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { getUploader } = require('../config/cloudinary');

router.get('/', storyController.getActiveStories);
router.get('/all', storyController.getAllStories);

router.post('/', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('image')(req, res, next);
}, storyController.createStory);

router.delete('/:id', storyController.deleteStory);

module.exports = router;
