const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1014169622543-placeholder.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// GET /api/auth/google/client-id
exports.getClientId = (req, res) => {
  res.json({ clientId: CLIENT_ID });
};

// POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'ID Token required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({ googleId: sub, name, email, picture });
      await user.save();
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Google Auth error:', err);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// POST /api/admin/login
exports.adminLogin = (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === adminPassword) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
};
