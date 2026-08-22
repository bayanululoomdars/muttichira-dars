const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { verifyGoogleToken, requireUser } = require('../middleware/googleAuth');
const { getUploader } = require('../config/storage');

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

router.post('/:id/like', requireUser, galleryController.likeGalleryItem);
router.post('/:id/comment', requireUser, galleryController.addComment);
router.delete('/:id/comment/:commentId', requireUser, galleryController.deleteComment);
router.post('/:id/pin', galleryController.togglePin);

module.exports = router;
