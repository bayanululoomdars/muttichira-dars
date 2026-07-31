const HomeSettings = require('../models/HomeSettings');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// GET /api/home-settings — Get homepage settings
exports.getHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSettings.findOne();
    if (!settings) {
      settings = new HomeSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/home-settings — Update home settings
exports.updateHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSettings.findOne();
    if (!settings) settings = new HomeSettings();

    const fields = [
      'statsStudents', 'statsUstads', 'statsYears', 'statsAlumni',
      'principalName', 'principalTitle', 'principalBio',
      'footerMudarrisName', 'footerMudarrisTitle', 'footerMudarrisDetail'
    ];

    fields.forEach(f => {
      if (req.body[f] !== undefined) settings[f] = req.body[f];
    });

    settings.updatedAt = Date.now();
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/home-settings/principal-image — Upload principal image
exports.uploadPrincipalImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const imageUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;

    let settings = await HomeSettings.findOne();
    if (!settings) settings = new HomeSettings();

    settings.principalImageUrl = imageUrl;
    await settings.save();
    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/home-settings/assistant — Add assistant mudarris
exports.addAssistantMudarris = async (req, res) => {
  try {
    const { name, role } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });

    let settings = await HomeSettings.findOne();
    if (!settings) settings = new HomeSettings();

    const assistant = { name, role: role || 'Assistant Mudarris' };
    if (req.file) {
      assistant.imageUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;
      assistant.cloudinaryId = req.file.filename || '';
    }

    settings.assistantMudarris.push(assistant);
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/home-settings/assistant/:id — Delete assistant mudarris
exports.deleteAssistantMudarris = async (req, res) => {
  try {
    let settings = await HomeSettings.findOne();
    if (!settings) return res.status(404).json({ message: 'Not found' });

    settings.assistantMudarris = settings.assistantMudarris.filter(
      a => a._id.toString() !== req.params.id
    );
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/home-settings/branch — Add branch
exports.addBranch = async (req, res) => {
  try {
    const { name, location, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });

    let settings = await HomeSettings.findOne();
    if (!settings) settings = new HomeSettings();

    settings.branches.push({ name, location: location || '', description: description || '' });
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/home-settings/branch/:id — Delete branch
exports.deleteBranch = async (req, res) => {
  try {
    let settings = await HomeSettings.findOne();
    if (!settings) return res.status(404).json({ message: 'Not found' });

    settings.branches = settings.branches.filter(
      b => b._id.toString() !== req.params.id
    );
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
