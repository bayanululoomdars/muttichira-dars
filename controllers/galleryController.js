const GalleryItem = require('../models/GalleryItem');
const Settings = require('../models/Settings');
const User = require('../models/User');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

// GET /api/gallery — Get all gallery items with populated likes & comments
exports.getAllGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find()
      .sort({ createdAt: -1 })
      .populate('likes', 'name email')
      .populate('comments.user', 'name picture');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gallery — Upload gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, category, mediaType, mediaUrl, description, hashtags } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    const itemData = {
      title,
      category,
      mediaType: mediaType || 'image',
      description: description || '',
      hashtags: hashtags ? hashtags.split(',').map(h => h.trim()).filter(h => h) : []
    };

    if (req.file) {
      itemData.imageUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;
      itemData.cloudinaryId = req.file.filename || '';
    } else if (mediaUrl) {
      itemData.imageUrl = mediaUrl;
    } else {
      return res.status(400).json({ success: false, message: 'Image/Video file or Media URL is required' });
    }

    // Auto-add new category to galleryCategories setting if not present
    try {
      let catSetting = await Settings.findOne({ key: 'galleryCategories' });
      if (!catSetting) {
        catSetting = new Settings({ key: 'galleryCategories', value: ['Programme', 'Collections', 'Design'] });
      }
      if (!catSetting.value.includes(category)) {
        catSetting.value.push(category);
        catSetting.markModified('value');
        await catSetting.save();
      }
    } catch (catErr) {
      console.warn('Category auto-save warning:', catErr);
    }

    const item = new GalleryItem(itemData);
    await item.save();
    res.json({ success: true, message: 'Gallery item added successfully!', data: item });
  } catch (err) {
    console.error('Gallery save error:', err);
    res.status(500).json({ success: false, message: 'Failed to add gallery item' });
  }
};

// DELETE /api/gallery/:id — Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    if (item.cloudinaryId && isCloudinaryConfigured()) {
      try { await cloudinary.uploader.destroy(item.cloudinaryId); } catch (e) { /* ignore */ }
    }
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gallery/:id/like — Toggle like on item (1 per account)
exports.likeGalleryItem = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const item = await GalleryItem.findById(req.params.id).populate('likes', 'email');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const alreadyLiked = item.likes.some(likeUser => {
      if (!likeUser) return false;
      if (typeof likeUser === 'object' && likeUser.email) {
        return likeUser.email === user.email || likeUser._id.toString() === userId.toString();
      }
      return likeUser.toString() === userId.toString();
    });

    if (alreadyLiked) {
      return res.json({ 
        success: true, 
        alreadyLiked: true, 
        message: 'You have already liked this item (1 like per account allowed).', 
        likes: item.likes.length 
      });
    }

    item.likes.push(userId);
    await item.save();
    res.json({ 
      success: true, 
      alreadyLiked: false, 
      message: 'Liked successfully!', 
      likes: item.likes.length 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/gallery/:id/comment — Add comment
exports.addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) return res.status(400).json({ success: false, message: 'User ID and text required' });

    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.comments.push({ user: userId, text });
    await item.save();

    const populatedItem = await GalleryItem.findById(req.params.id).populate('comments.user', 'name picture');
    res.json({ success: true, comments: populatedItem.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/gallery/:id/comment/:commentId — Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.comments = item.comments.filter(c => c._id.toString() !== req.params.commentId);
    await item.save();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/gallery/:id/pin — Toggle pin status
exports.togglePin = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    item.pinned = !item.pinned;
    await item.save();
    res.json({ success: true, pinned: item.pinned });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
