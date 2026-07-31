const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

router.get('/', sectionController.getAllSections);
router.put('/:id', sectionController.updateSection);
router.delete('/:id', sectionController.deleteSection);

module.exports = router;
