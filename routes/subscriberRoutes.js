const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');

router.post('/', subscriberController.subscribe);
router.get('/', subscriberController.getAllSubscribers);

module.exports = router;
