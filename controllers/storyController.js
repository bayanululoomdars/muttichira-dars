const Story = require('../models/Story');
const { deleteFile } = require('../config/storage');

// GET /api/stories — Get active stories
exports.getActiveStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/stories/all — Get ALL stories (admin)
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/stories — Upload a story
exports.createStory = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    const imageUrl = req.file.path;
    const daysActive = parseInt(req.body.daysActive) || 1;
    const story = new Story({
      title: req.body.title || '',
      imageUrl,
      telegramFileId: req.file.filename || '',
      daysActive
    });
    await story.save();
    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/stories/:id — Delete story
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.telegramFileId) {
      try { await deleteFile(story.telegramFileId); } catch (e) {}
    }
    await Story.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
