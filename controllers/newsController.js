const News = require('../models/News');
const { deleteFile } = require('../config/storage');

// GET /api/news — Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/news — Create a news item with optional image upload or image URL
exports.createNews = async (req, res) => {
  try {
    const { title, description, category, date, link, imageUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newsData = { 
      title, 
      description,
      category: category || 'News',
      link: link || ''
    };
    if (date) {
      newsData.createdAt = new Date(date);
    }

    if (req.file) {
      newsData.imageUrl = req.file.path;
      newsData.telegramFileId = req.file.filename || '';
    } else if (imageUrl && imageUrl.trim()) {
      newsData.imageUrl = imageUrl.trim();
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

    if (news.telegramFileId) {
      try { await deleteFile(news.telegramFileId); } catch (e) { /* ignore */ }
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/news/:id — Update a news item
exports.updateNews = async (req, res) => {
  try {
    const { title, description, category, date, link, imageUrl, removeImage } = req.body;
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    if (title !== undefined) news.title = title;
    if (description !== undefined) news.description = description;
    if (category !== undefined) news.category = category;
    if (link !== undefined) news.link = link;
    if (date) news.createdAt = new Date(date);

    if (removeImage === 'true' || removeImage === true) {
      if (news.telegramFileId) {
        try { await deleteFile(news.telegramFileId); } catch (e) {}
      }
      news.imageUrl = '';
      news.telegramFileId = '';
    } else if (req.file) {
      if (news.telegramFileId) {
        try { await deleteFile(news.telegramFileId); } catch (e) {}
      }
      news.imageUrl = req.file.path;
      news.telegramFileId = req.file.filename || '';
    } else if (imageUrl !== undefined && imageUrl.trim()) {
      news.imageUrl = imageUrl.trim();
    }

    await news.save();
    res.json({ success: true, message: 'News updated successfully', data: news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
