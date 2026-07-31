const express = require('express');
const router = express.Router();
const homeSettingsController = require('../controllers/homeSettingsController');
const { getUploader } = require('../config/cloudinary');

router.get('/', homeSettingsController.getHomeSettings);
router.post('/', homeSettingsController.updateHomeSettings);

router.post('/principal-image', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('image')(req, res, next);
}, homeSettingsController.uploadPrincipalImage);

router.post('/assistant', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('image')(req, res, next);
}, homeSettingsController.addAssistantMudarris);

router.delete('/assistant/:id', homeSettingsController.deleteAssistantMudarris);

router.post('/branch', homeSettingsController.addBranch);
router.delete('/branch/:id', homeSettingsController.deleteBranch);

module.exports = router;
