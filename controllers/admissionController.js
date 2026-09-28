const Admission = require('../models/Admission');
const Settings = require('../models/Settings');
const { deleteFile } = require('../config/storage');
const { sendTelegramNotification } = require('../services/telegramService');

// GET /api/admissions — Get all admissions (admin)
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admission — Submit admission application form
exports.submitAdmission = async (req, res) => {
  try {
    const {
      name, dob, fatherName, motherName, phone, email,
      houseName, homePhone, place, postOffice, district, pincode,
      bloodGroup, educationReligious, educationSecular,
      guardianName, relationship, guardianPhone
    } = req.body;

    if (!name || !fatherName || !motherName || !phone) {
      return res.status(400).json({ success: false, message: 'Name, Father Name, Mother Name, and Phone are required' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const admission = new Admission({
      name, dob: dob || '', fatherName, motherName,
      phone: phone.trim(), email: (email || '').trim(),
      houseName: houseName || '', homePhone: homePhone || '',
      place: place || '', postOffice: postOffice || '',
      district: district || '', pincode: pincode || '',
      bloodGroup: bloodGroup || '',
      educationReligious: educationReligious || '',
      educationSecular: educationSecular || '',
      guardianName: guardianName || '',
      relationship: relationship || '',
      guardianPhone: guardianPhone || '',
      imageUrl
    });
    await admission.save();

    // Telegram Notification
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
    const tgMessage = [
      `🎓 <b>NEW ADMISSION APPLICATION RECEIVED</b>`,
      `<b>Bayanul Uloom Dars, Muttichira</b>`,
      ``,
      `A new admission application has been submitted.`,
      `For privacy and security reasons, applicant details are kept secret.`,
      ``,
      `🕒 Submitted: ${now}`,
      ``,
      `🔐 <i>Please log in to the admin panel to view the full details.</i>`
    ].join('\n');
    sendTelegramNotification(tgMessage, 'HTML');

    res.json({ success: true, message: 'Admission application submitted successfully!' });
  } catch (err) {
    console.error('Admission save error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit admission application' });
  }
};

// DELETE /api/admissions/:id — Delete admission application
exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission not found' });

    if (admission.imageUrl) {
      try {
        const fileId = admission.imageUrl.split('/').pop();
        await deleteFile(fileId);
      } catch (e) { /* ignore */ }
    }

    await Admission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/settings/admission — Get admission status (open/closed)
exports.getAdmissionStatus = async (req, res) => {
  try {
    let setting = await Settings.findOne({ key: 'isAdmissionOpen' });
    if (!setting) {
      setting = new Settings({ key: 'isAdmissionOpen', value: true });
      await setting.save();
    }
    res.json({ isOpen: setting.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/admission — Toggle admission status
exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { isOpen } = req.body;
    let setting = await Settings.findOne({ key: 'isAdmissionOpen' });
    if (!setting) {
      setting = new Settings({ key: 'isAdmissionOpen', value: isOpen });
    } else {
      setting.value = isOpen;
    }
    await setting.save();
    res.json({ success: true, isOpen: setting.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
