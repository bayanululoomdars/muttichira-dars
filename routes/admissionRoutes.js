const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');
const { getUploader } = require('../config/storage');

router.get('/', admissionController.getAllAdmissions);

router.post('/', (req, res, next) => {
  const uploader = getUploader();
  if (uploader) {
    uploader.single('photo')(req, res, next);
  } else {
    next();
  }
}, admissionController.submitAdmission);

router.delete('/:id', admissionController.deleteAdmission);

module.exports = router;
