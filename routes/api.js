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

// Admin reset route
router.post('/admin/reset', settingsController.adminReset);

module.exports = router;
