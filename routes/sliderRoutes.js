const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const { getUploader } = require('../config/cloudinary');

router.get('/', sliderController.getAllSliders);

router.post('/', (req, res, next) => {
  const uploader = getUploader();
  uploader.single('media')(req, res, next);
}, sliderController.createSlider);

router.delete('/:id', sliderController.deleteSlider);

module.exports = router;
