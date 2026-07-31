const News = require('../models/News');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

// GET /api/news — Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/news — Create a news item with optional image upload
exports.createNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newsData = { title, description };
    if (req.file) {
      newsData.imageUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;
      newsData.cloudinaryId = req.file.filename || '';
    }

    const news = new News(newsData);
    await news.save();
    res.json({ success: true, message: 'News added successfully!', data: news });
  } catch (err) {
    console.error('News save error:', err);
    res.status(500).json({ success: false, message: 'Failed to add news' });
  }
};

// DELETE /api/news/:id — Delete a news item
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    if (news.cloudinaryId && isCloudinaryConfigured()) {
      try { await cloudinary.uploader.destroy(news.cloudinaryId); } catch (e) { /* ignore */ }
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
