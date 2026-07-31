const SectionContent = require('../models/SectionContent');

// GET /api/sections — Get all section contents
exports.getAllSections = async (req, res) => {
  try {
    const sections = await SectionContent.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/sections/:id — Update section content
exports.updateSection = async (req, res) => {
  try {
    const { title, description, readMoreLink } = req.body;
    const section = await SectionContent.findOneAndUpdate(
      { sectionId: req.params.id },
      { title, description, readMoreLink, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: section });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/sections/:id — Delete section content
exports.deleteSection = async (req, res) => {
  try {
    await SectionContent.findOneAndDelete({ sectionId: req.params.id });
    res.json({ success: true, message: 'Section hidden successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
