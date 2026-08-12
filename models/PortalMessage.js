const mongoose = require('mongoose');

const portalMessageSchema = new mongoose.Schema({
  type: { type: String, enum: ['message', 'notification', 'mark'], required: true },
  senderRole: { type: String, enum: ['usthad', 'student', 'admin'], required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  targetStudentNo: { type: String, default: 'ALL' },
  subject: { type: String, default: '' },
  content: { type: String, required: true },
  marksData: {
    examName: { type: String, default: '' },
    subjectName: { type: String, default: '' },
    marksObtained: { type: String, default: '' },
    totalMarks: { type: String, default: '' },
    grade: { type: String, default: '' },
    remarks: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PortalMessage', portalMessageSchema);
