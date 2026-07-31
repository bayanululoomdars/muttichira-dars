const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const admissionController = require('../controllers/admissionController');
const { getUploader } = require('../config/cloudinary');

// Admission Status (this was partially in admission logic, but fits settings well)
router.get('/admission', admissionController.getAdmissionStatus);
router.post('/admission', admissionController.updateAdmissionStatus);

// Admission Poster
router.get('/poster', settingsController.getPoster);
router.post('/poster', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('poster')(req, res, next);
}, settingsController.savePoster);
router.delete('/poster', settingsController.deletePoster);

// Why Us Section
router.get('/why-us', settingsController.getWhyUs);
router.post('/why-us', settingsController.updateWhyUs);
router.post('/why-us/media', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('media')(req, res, next);
}, settingsController.uploadWhyUsMedia);

// Admission Banner
router.get('/admission-banner', settingsController.getAdmissionBanner);
router.post('/admission-banner', settingsController.saveAdmissionBanner);

// Committee
router.get('/committee', settingsController.getCommittee);
router.post('/committee', settingsController.saveCommittee);
router.post('/committee/poster', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('poster')(req, res, next);
}, settingsController.uploadCommitteePoster);
router.delete('/committee/poster', settingsController.deleteCommitteePoster);

// Gallery Categories
router.get('/gallery-categories', settingsController.getGalleryCategories);
router.post('/gallery-categories', settingsController.addGalleryCategory);
router.delete('/gallery-categories/:name', settingsController.deleteGalleryCategory);

// Home Gallery Settings
router.get('/home-gallery', settingsController.getHomeGallerySettings);
router.post('/home-gallery', settingsController.saveHomeGallerySettings);

// Burda Team Settings
router.get('/burda', settingsController.getBurda);
router.post('/burda', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('burda')(req, res, next);
}, settingsController.uploadBurda);

module.exports = router;
