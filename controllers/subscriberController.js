const Subscriber = require('../models/Subscriber');

// POST /api/subscribe — Subscribe email
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed!' });
    }
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.json({ success: true, message: 'Successfully subscribed!' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again.' });
  }
};

// GET /api/subscribers — Get all subscribers (admin)
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
