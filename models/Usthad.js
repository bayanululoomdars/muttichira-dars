const mongoose = require('mongoose');

const usthadSchema = new mongoose.Schema({
  usthadId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'usthad' },
  designation: { type: String, default: 'Usthad' },
  subject: { type: String, default: 'Fiqh & Tafseer' },
  photoUrl: { type: String, default: '' },
  place: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usthad', usthadSchema);
