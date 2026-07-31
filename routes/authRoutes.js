const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication Routes
router.get('/auth/google/client-id', authController.getClientId);
router.post('/auth/google', authController.googleAuth);

// Admin Routes (Can be moved to a separate admin router if it grows)
router.post('/login', authController.adminLogin);

module.exports = router;
