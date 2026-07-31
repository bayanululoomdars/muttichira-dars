const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { verifyGoogleToken } = require('../middleware/googleAuth');
const { getUploader } = require('../config/cloudinary');

router.get('/', galleryController.getAllGalleryItems);

router.post('/', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('image')(req, res, next);
}, galleryController.createGalleryItem);

router.delete('/:id', galleryController.deleteGalleryItem);

router.put('/:id', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('image')(req, res, next);
}, galleryController.updateGalleryItem);

router.post('/:id/like', verifyGoogleToken, galleryController.likeGalleryItem);
router.post('/:id/comment', verifyGoogleToken, galleryController.addComment);
router.delete('/:id/comment/:commentId', verifyGoogleToken, galleryController.deleteComment);
router.post('/:id/pin', galleryController.togglePin);

module.exports = router;
