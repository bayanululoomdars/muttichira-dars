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

// Lightweight middleware: accepts session user OR userId in body (for like/comment from gallery)
async function requireUser(req, res, next) {
  try {
    // Option 1: session-based (set after Google Sign-In)
    if (req.session && req.session.user && req.session.user._id) {
      req.userRecord = { _id: req.session.user._id };
      return next();
    }
    // Option 2: userId sent in request body (fallback)
    const userId = req.body && req.body.userId;
    if (userId) {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        try {
          const user = await User.findById(userId).maxTimeMS(2000);
          if (user) {
            req.userRecord = user;
            return next();
          }
        } catch (e) {
          // DB timeout/offline — still allow if userId looks valid
        }
      }
      // Fallback: accept userId as-is when DB is offline (trust client session)
      if (userId.match(/^[a-f\d]{24}$/i)) {
        req.userRecord = { _id: userId };
        return next();
      }
    }
    return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
  } catch (err) {
    console.error('requireUser error:', err);
    return res.status(401).json({ success: false, message: 'Authentication error' });
  }
}

module.exports = { verifyGoogleToken, requireUser };
