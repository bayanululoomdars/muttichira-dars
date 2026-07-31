const Slider = require('../models/Slider');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

// GET /api/sliders — Get all sliders
exports.getAllSliders = async (req, res) => {
  try {
    const items = await Slider.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/sliders — Upload a slider
exports.createSlider = async (req, res) => {
  try {
    const { title, mediaType } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Media file is required' });
    }

    const sliderData = {
      title: title || '',
      mediaType: mediaType || 'image',
      mediaUrl: isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename,
      cloudinaryId: req.file.filename || '',
    };
    const slider = new Slider(sliderData);
    await slider.save();
    res.json({ success: true, message: 'Slider added!', data: slider });
  } catch (err) {
    console.error('Slider save error:', err);
    res.status(500).json({ success: false, message: 'Failed to add slider' });
  }
};

// DELETE /api/sliders/:id — Delete a slider
exports.deleteSlider = async (req, res) => {
  try {
    const item = await Slider.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Slider not found' });
    if (item.cloudinaryId && isCloudinaryConfigured()) {
      try { await cloudinary.uploader.destroy(item.cloudinaryId); } catch (e) { /* ignore */ }
    }
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Slider deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
