const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  admissionNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  isAlumni: { type: Boolean, default: false },
  status: { type: String, default: 'Current Student' }, // 'Current Student' or 'Biruthadhari / Alumni'
  batchYear: { type: String, default: '2025' },
  className: { type: String, default: 'Dars 1st Year' },
  photoUrl: { type: String, default: '' },
  place: { type: String, default: '' },
  district: { type: String, default: '' },
  dob: { type: String, default: '' },
  guardianName: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
