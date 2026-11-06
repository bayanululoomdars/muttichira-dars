const GalleryItem = require('../models/GalleryItem');
const Settings = require('../models/Settings');
const User = require('../models/User');
const { deleteFile } = require('../config/storage');

const DEFAULT_GALLERY = [
  {
    _id: 'def_gal_1',
    title: 'Muttichira Bayanul Uloom Campus & Shuhada Masjid',
    category: 'Campus',
    mediaType: 'image',
    imageUrl: 'img/banner1.jpg',
    description: 'Bayanul Uloom Dars campus functioning under historic Shuhada Masjid, Muttichira.',
    pinned: true,
    likes: [],
    comments: [],
    createdAt: new Date('2025-01-01')
  },
  {
    _id: 'def_gal_2',
    title: 'Dars Burda Majlis Team',
    category: 'Programme',
    mediaType: 'image',
    imageUrl: 'img/burda team.png',
    description: 'Annual Burda recitation and spiritual Majlis team of Bayanul Uloom students.',
    pinned: true,
    likes: [],
    comments: [],
    createdAt: new Date('2025-01-02')
  },
  {
    _id: 'def_gal_3',
    title: 'Respected Chief Mudarris & Usthads',
    category: 'Faculty',
    mediaType: 'image',
    imageUrl: 'img/AL_USTHAD.jpg',
    description: 'Under the guidance and mentorship of our respected Usthadhs.',
    pinned: false,
    likes: [],
    comments: [],
    createdAt: new Date('2025-01-03')
  },
  {
    _id: 'def_gal_4',
    title: 'Annual Academic Brochure & Study Scheme',
    category: 'Publications',
    mediaType: 'image',
    imageUrl: 'img/dars brousher page 1.jpg',
    description: 'Comprehensive syllabus and activities schedule of Bayanul Uloom Dars.',
    pinned: false,
    likes: [],
    comments: [],
    createdAt: new Date('2025-01-04')
  },
  {
    _id: 'def_gal_5',
    title: 'Student Assembly & Study Circles',
    category: 'Campus',
    mediaType: 'image',
    imageUrl: 'img/banner2.jpg',
    description: 'Disciplined and spiritual study circles inside Shuhada Masjid.',
    pinned: false,
    likes: [],
    comments: [],
    createdAt: new Date('2025-01-05')
  },
  {
    _id: 'def_gal_6',
    title: 'Special Lectures & Friday Talks',
    category: 'Programme',
    mediaType: 'image',
    imageUrl: 'img/banner3.jpg',
    description: 'Friday talks, Isthifadah workshops, and contemporary enlightenment sessions.',
    pinned: false,
    likes: [],
    comments: [],
    createdAt: new Date('2025-01-06')
  }
];

// GET /api/gallery — Get all gallery items with populated likes & comments
exports.getAllGalleryItems = async (req, res) => {
  try {
    let items = await GalleryItem.find()
      .sort({ createdAt: -1 })
      .populate('likes', 'name email')
      .populate('comments.user', 'name picture');
    if (!items || items.length === 0) {
      items = DEFAULT_GALLERY;
    }
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
      itemData.imageUrl = req.file.path;
      itemData.telegramFileId = req.file.filename || '';
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
    if (item.telegramFileId) {
      try { await deleteFile(item.telegramFileId); } catch (e) { /* ignore */ }
    }
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/gallery/:id — Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { title, category, mediaType, mediaUrl, description, hashtags } = req.body;
    const item = await GalleryItem.findById(req.params.id);
    
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

    if (title) item.title = title;
    if (category) item.category = category;
    if (mediaType) item.mediaType = mediaType;
    if (description !== undefined) item.description = description;
    if (hashtags) item.hashtags = hashtags.split(',').map(h => h.trim()).filter(h => h);

    if (req.file) {
      // delete old image from Telegram if exists
      if (item.telegramFileId) {
        try { await deleteFile(item.telegramFileId); } catch (e) { /* ignore */ }
      }
      item.imageUrl = req.file.path;
      item.telegramFileId = req.file.filename || '';
    } else if (mediaUrl && mediaType === 'video') {
      item.imageUrl = mediaUrl;
    }

    await item.save();
    res.json({ success: true, message: 'Gallery item updated successfully!', data: item });
  } catch (err) {
    console.error('Gallery update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update gallery item' });
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
