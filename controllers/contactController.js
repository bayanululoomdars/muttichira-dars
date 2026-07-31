const Contact = require('../models/Contact');
const { sendTelegramNotification } = require('../services/telegramService');

// POST /api/contact — Save contact submission
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    // Send Telegram Notification
    const tgMessage = `📩 <b>NEW CONTACT MESSAGE</b>\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
    sendTelegramNotification(tgMessage);

    res.json({ success: true, message: 'Your message has been sent. Thank you!' });
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
};

// GET /api/contacts — Get all contacts (admin)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/contacts/:id — Delete contact message
exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
