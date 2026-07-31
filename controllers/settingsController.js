const Settings = require('../models/Settings');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

// GET /api/settings/poster — Get admission poster URL
exports.getPoster = async (req, res) => {
  try {
    let setting = await Settings.findOne({ key: 'admissionPosterUrl' });
    res.json({ posterUrl: setting ? setting.value : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/poster — Upload admission poster or save URL
exports.savePoster = async (req, res) => {
  try {
    let posterUrl = req.body.posterUrl;
    if (req.file) {
      posterUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;
    }
    if (!posterUrl) {
      return res.status(400).json({ success: false, message: 'No file or URL provided' });
    }
    let setting = await Settings.findOne({ key: 'admissionPosterUrl' });
    if (!setting) {
      setting = new Settings({ key: 'admissionPosterUrl', value: posterUrl });
    } else {
      setting.value = posterUrl;
    }
    await setting.save();
    res.json({ success: true, posterUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/settings/poster — Remove admission poster
exports.deletePoster = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'admissionPosterUrl' });
    if (setting) {
      if (isCloudinaryConfigured() && setting.value) {
        try {
          const publicId = setting.value.split('/').slice(-1)[0].split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (e) { /* ignore */ }
      }
      setting.value = null;
      await setting.save();
    }
    res.json({ success: true, message: 'Poster removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/settings/why-us — Get Why Us section settings
exports.getWhyUs = async (req, res) => {
  try {
    const keys = ['whyUsMediaUrl', 'whyUsEligibility', 'whyUsCurriculum', 'whyUsFacilities', 'whyUsEnquiry'];
    const settings = await Settings.find({ key: { $in: keys } });
    const result = {
      whyUsMediaUrl: '/img/usthad.jpg',
      whyUsEligibility: 'Students who completed basic Islamic education are welcome to apply for advanced religious studies.',
      whyUsCurriculum: 'Quran, Hadith, Fiqh, Arabic language, and modern subjects guided by experienced Usthads.',
      whyUsFacilities: 'Library, Computer Lab, Smart Class, Medical Wing & Store for holistic student development.',
      whyUsEnquiry: '+91 9526 919 218\ndarsbayanululoom@gmail.com'
    };
    settings.forEach(s => {
      if (s.value !== undefined && s.value !== null) {
        result[s.key] = s.value;
      }
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/why-us — Update Why Us section settings
exports.updateWhyUs = async (req, res) => {
  try {
    const fields = ['whyUsMediaUrl', 'whyUsEligibility', 'whyUsCurriculum', 'whyUsFacilities', 'whyUsEnquiry'];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        let setting = await Settings.findOne({ key: f });
        if (!setting) {
          setting = new Settings({ key: f, value: req.body[f] });
        } else {
          setting.value = req.body[f];
        }
        await setting.save();
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/settings/why-us/media — Upload Why Us section media
exports.uploadWhyUsMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const mediaUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;

    let setting = await Settings.findOne({ key: 'whyUsMediaUrl' });
    if (!setting) {
      setting = new Settings({ key: 'whyUsMediaUrl', value: mediaUrl });
    } else {
      setting.value = mediaUrl;
    }
    await setting.save();
    res.json({ success: true, mediaUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/settings/admission-banner — Get banner text settings
exports.getAdmissionBanner = async (req, res) => {
  try {
    let titleSetting = await Settings.findOne({ key: 'admissionBannerTitle' });
    let contentSetting = await Settings.findOne({ key: 'admissionBannerContent' });
    res.json({
      title: titleSetting ? titleSetting.value : '',
      content: contentSetting ? contentSetting.value : ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/admission-banner — Update banner text settings
exports.saveAdmissionBanner = async (req, res) => {
  try {
    const { title, content } = req.body;
    let titleSetting = await Settings.findOne({ key: 'admissionBannerTitle' });
    if (!titleSetting) {
      titleSetting = new Settings({ key: 'admissionBannerTitle', value: title || '' });
    } else {
      titleSetting.value = title || '';
    }
    await titleSetting.save();

    let contentSetting = await Settings.findOne({ key: 'admissionBannerContent' });
    if (!contentSetting) {
      contentSetting = new Settings({ key: 'admissionBannerContent', value: content || '' });
    } else {
      contentSetting.value = content || '';
    }
    await contentSetting.save();

    res.json({ success: true, title: titleSetting.value, content: contentSetting.value });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/settings/committee — Get committee settings
exports.getCommittee = async (req, res) => {
  try {
    let posterSetting = await Settings.findOne({ key: 'committeePosterUrl' });
    let titleSetting = await Settings.findOne({ key: 'committeeTitle' });
    let detailsSetting = await Settings.findOne({ key: 'committeeDetails' });
    res.json({
      posterUrl: posterSetting ? posterSetting.value : null,
      title: titleSetting ? titleSetting.value : 'THE NEW COMMITTEE 2026-27',
      details: detailsSetting ? detailsSetting.value : ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/committee — Update committee title & details
exports.saveCommittee = async (req, res) => {
  try {
    const { title, details } = req.body;
    let titleSetting = await Settings.findOne({ key: 'committeeTitle' });
    if (!titleSetting) {
      titleSetting = new Settings({ key: 'committeeTitle', value: title || 'THE NEW COMMITTEE 2026-27' });
    } else {
      titleSetting.value = title || 'THE NEW COMMITTEE 2026-27';
    }
    await titleSetting.save();

    let detailsSetting = await Settings.findOne({ key: 'committeeDetails' });
    if (!detailsSetting) {
      detailsSetting = new Settings({ key: 'committeeDetails', value: details || '' });
    } else {
      detailsSetting.value = details || '';
    }
    await detailsSetting.save();

    res.json({ success: true, title: titleSetting.value, details: detailsSetting.value });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/settings/committee/poster — Upload committee poster
exports.uploadCommitteePoster = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const posterUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;
    let setting = await Settings.findOne({ key: 'committeePosterUrl' });
    if (!setting) {
      setting = new Settings({ key: 'committeePosterUrl', value: posterUrl });
    } else {
      setting.value = posterUrl;
    }
    await setting.save();
    res.json({ success: true, posterUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/settings/committee/poster — Remove committee poster
exports.deleteCommitteePoster = async (req, res) => {
  try {
    const posterSetting = await Settings.findOne({ key: 'committeePosterUrl' });
    if (posterSetting) {
      if (isCloudinaryConfigured() && posterSetting.value) {
        try {
          const publicId = posterSetting.value.split('/').slice(-1)[0].split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (e) { /* ignore */ }
      }
      posterSetting.value = null;
      await posterSetting.save();
    }
    res.json({ success: true, message: 'Committee poster removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/settings/gallery-categories — Get custom categories
exports.getGalleryCategories = async (req, res) => {
  try {
    let setting = await Settings.findOne({ key: 'galleryCategories' });
    if (!setting) {
      setting = new Settings({ key: 'galleryCategories', value: ['Programme', 'Collections', 'Design'] });
      await setting.save();
    }
    res.json({ categories: setting.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/gallery-categories — Add category
exports.addGalleryCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ success: false, message: 'Category name required' });
    let setting = await Settings.findOne({ key: 'galleryCategories' });
    if (!setting) {
      setting = new Settings({ key: 'galleryCategories', value: ['Programme', 'Collections', 'Design'] });
    }
    if (!setting.value.includes(category)) setting.value.push(category);
    setting.markModified('value');
    await setting.save();
    res.json({ success: true, categories: setting.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/settings/gallery-categories/:name — Remove category
exports.deleteGalleryCategory = async (req, res) => {
  try {
    let setting = await Settings.findOne({ key: 'galleryCategories' });
    if (!setting) return res.status(404).json({ message: 'Not found' });
    setting.value = setting.value.filter(c => c !== req.params.name);
    setting.markModified('value');
    await setting.save();
    res.json({ success: true, categories: setting.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/settings/home-gallery — Get homepage gallery settings
exports.getHomeGallerySettings = async (req, res) => {
  try {
    let limitSetting = await Settings.findOne({ key: 'homeGalleryLimit' });
    let categorySetting = await Settings.findOne({ key: 'homeGalleryCategory' });
    let modeSetting = await Settings.findOne({ key: 'homeGalleryMode' });
    res.json({
      limit: limitSetting ? parseInt(limitSetting.value) || 3 : 3,
      category: categorySetting ? categorySetting.value : 'all',
      mode: modeSetting ? modeSetting.value : 'all'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/home-gallery — Save homepage gallery settings
exports.saveHomeGallerySettings = async (req, res) => {
  try {
    const { limit, category, mode } = req.body;

    let limitSetting = await Settings.findOne({ key: 'homeGalleryLimit' });
    if (!limitSetting) limitSetting = new Settings({ key: 'homeGalleryLimit', value: limit || 3 });
    else limitSetting.value = limit !== undefined ? limit : 3;
    await limitSetting.save();

    let categorySetting = await Settings.findOne({ key: 'homeGalleryCategory' });
    if (!categorySetting) categorySetting = new Settings({ key: 'homeGalleryCategory', value: category || 'all' });
    else categorySetting.value = category || 'all';
    await categorySetting.save();

    let modeSetting = await Settings.findOne({ key: 'homeGalleryMode' });
    if (!modeSetting) modeSetting = new Settings({ key: 'homeGalleryMode', value: mode || 'all' });
    else modeSetting.value = mode || 'all';
    await modeSetting.save();

    res.json({ success: true, limit: limitSetting.value, category: categorySetting.value, mode: modeSetting.value });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/settings/burda — Get Burda Team image
exports.getBurda = async (req, res) => {
  try {
    let setting = await Settings.findOne({ key: 'burdaTeamImageUrl' });
    res.json({ imageUrl: setting ? setting.value : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/settings/burda — Upload Burda Team image
exports.uploadBurda = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const imageUrl = isCloudinaryConfigured() ? req.file.path : '/img/uploads/' + req.file.filename;
    let setting = await Settings.findOne({ key: 'burdaTeamImageUrl' });
    if (!setting) {
      setting = new Settings({ key: 'burdaTeamImageUrl', value: imageUrl });
    } else {
      setting.value = imageUrl;
    }
    await setting.save();
    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/reset — Reset database
exports.adminReset = async (req, res) => {
  const { token } = req.body;
  const RESET_TOKEN = process.env.ADMIN_PASSWORD || 'admin123';
  if (!token || token !== RESET_TOKEN) {
    return res.status(401).json({ success: false, message: 'Invalid reset token' });
  }
  try {
    await Promise.all([
      require('../models/News').deleteMany({}),
      require('../models/GalleryItem').deleteMany({}),
      require('../models/Admission').deleteMany({}),
      require('../models/Settings').deleteMany({}),
      require('../models/HomeSettings').deleteMany({}),
      require('../models/Slider').deleteMany({}),
      require('../models/SectionContent').deleteMany({}),
      require('../models/Story').deleteMany({}),
      require('../models/Contact').deleteMany({}),
      require('../models/Subscriber').deleteMany({}),
    ]);
    res.json({ success: true, message: 'All data has been reset successfully.' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ success: false, message: 'Reset failed: ' + err.message });
  }
};
