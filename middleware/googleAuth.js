const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1014169622543-placeholder.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// Middleware to verify Google ID token sent in Authorization header as Bearer token
async function verifyGoogleToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1]; // Expect 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required: No token provided' });
  }
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
    const payload = ticket.getPayload();
    // Attach payload to request for downstream handlers
    req.user = payload;
    // Ensure a User document exists for this Google account
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({ googleId: payload.sub, name: payload.name, email: payload.email, picture: payload.picture });
      await user.save();
    }
    req.userRecord = user; // mongoose document for convenience
    next();
  } catch (err) {
    console.error('Google token verification error:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired Google token' });
  }
}

module.exports = { verifyGoogleToken };
