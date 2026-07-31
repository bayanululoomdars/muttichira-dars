const Admission = require('../models/Admission');
const Settings = require('../models/Settings');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');
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
      imageUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;
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
      `🎓 <b>NEW ADMISSION APPLICATION</b>`,
      `<b>Bayanul Uloom Dars, Muttichira</b>`,
      ``,
      `👤 <b>Personal Details</b>`,
      `📛 Name: <b>${name}</b>`,
      `🎂 DOB: ${dob || '—'}`,
      `🩸 Blood Group: ${bloodGroup || '—'}`,
      ``,
      `👨‍👩‍👦 <b>Parents</b>`,
      `👨 Father: ${fatherName}`,
      `👩 Mother: ${motherName}`,
      ``,
      `📞 <b>Contact</b>`,
      `📱 Phone: <code>${phone.trim()}</code>`,
      `🏠 Home Phone: ${homePhone || '—'}`,
      `📧 Email: ${email && email.trim() ? email.trim() : '—'}`,
      ``,
      `🏡 <b>Address</b>`,
      `🏘 House: ${houseName || '—'}`,
      `📍 Place: ${place || '—'}`,
      `🏣 Post Office: ${postOffice || '—'}`,
      `🗺 District: ${district || '—'}`,
      `📮 Pincode: ${pincode || '—'}`,
      ``,
      `📚 <b>Education</b>`,
      `🕌 Religious (Madrasa): ${educationReligious || '—'}`,
      `🏫 Secular (School): ${educationSecular || '—'}`,
      ``,
      `🛡 <b>Guardian</b>`,
      `👤 Name: ${guardianName || '—'} (${relationship || '—'})`,
      `📞 Phone: <code>${guardianPhone || '—'}</code>`,
      ``,
      `🕐 Submitted: ${now}`,
      ``,
      `✅ <i>View in admin panel: /admin</i>`
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

    if (admission.imageUrl && isCloudinaryConfigured()) {
      try {
        const publicId = admission.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
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
