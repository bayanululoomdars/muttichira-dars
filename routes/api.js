const express = require('express');
const router = express.Router();

// Import sub-routers
const authRoutes = require('./authRoutes');
const newsRoutes = require('./newsRoutes');
const galleryRoutes = require('./galleryRoutes');
const admissionRoutes = require('./admissionRoutes');
const contactRoutes = require('./contactRoutes');
const subscriberRoutes = require('./subscriberRoutes');
const sliderRoutes = require('./sliderRoutes');
const sectionRoutes = require('./sectionRoutes');
const storyRoutes = require('./storyRoutes');
const homeSettingsRoutes = require('./homeSettingsRoutes');
const settingsRoutes = require('./settingsRoutes');
const portalRoutes = require('./portalRoutes');
const settingsController = require('../controllers/settingsController');

// Mount sub-routers
router.use('/', authRoutes); // Auth and Admin login
router.use('/news', newsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/admissions', admissionRoutes);
router.use('/admission', admissionRoutes); // For submit endpoint
router.use('/contact', contactRoutes);
router.use('/contacts', contactRoutes);
router.use('/subscribe', subscriberRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/sliders', sliderRoutes);
router.use('/sections', sectionRoutes);
router.use('/stories', storyRoutes);
router.use('/home-settings', homeSettingsRoutes);
router.use('/settings', settingsRoutes);
router.use('/portal', portalRoutes);

// Admin reset route
router.post('/admin/reset', settingsController.adminReset);

// User management routes (admin)
const authController = require('../controllers/authController');
router.get('/users', authController.getAllUsers);
router.delete('/users/:id', authController.deleteUser);

// Telegram Media Streaming Proxy with in-memory Cache (TTL: 45 minutes)
const { Readable } = require('stream');
const tgPathCache = new Map();

router.get('/media/tg/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    if (!token) {
      return res.status(500).send('Telegram Bot Token not configured in .env');
    }

    let filePath = null;
    const cached = tgPathCache.get(fileId);
    
    if (cached && cached.expiry > Date.now()) {
      filePath = cached.filePath;
    } else {
      const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;
      const fileRes = await fetch(getFileUrl);
      if (!fileRes.ok) {
        return res.status(fileRes.status).send(`Failed to fetch file info from Telegram. Status: ${fileRes.status}`);
      }
      
      const fileData = await fileRes.json();
      if (!fileData.ok) {
        return res.status(400).send(`Telegram API Error: ${fileData.description}`);
      }
      
      filePath = fileData.result.file_path;
      // Cache the file path for 45 minutes (Telegram link lasts 1 hour)
      tgPathCache.set(fileId, {
        filePath,
        expiry: Date.now() + 45 * 60 * 1000
      });
    }

    const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
    const mediaRes = await fetch(downloadUrl);
    if (!mediaRes.ok) {
      return res.status(mediaRes.status).send(`Failed to stream media from Telegram. Status: ${mediaRes.status}`);
    }

    // Set response headers
    const contentType = mediaRes.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);

    const contentLength = mediaRes.headers.get('content-length');
    if (contentLength) res.setHeader('Content-Length', contentLength);

    // Cache static assets on client/CDN for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Stream back to client
    Readable.fromWeb(mediaRes.body).pipe(res);
  } catch (err) {
    console.error('Error in Telegram media proxy:', err);
    res.status(500).send('Server error streaming media');
  }
});

module.exports = router;
