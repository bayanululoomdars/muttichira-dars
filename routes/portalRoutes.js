const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController');

// Public & Student/Usthad Login / Lookup
router.get('/lookup', portalController.lookup);
router.post('/login', portalController.login);
router.post('/change-password', portalController.changePassword);
router.get('/counter', portalController.getCounterStats);
router.get('/alumni', portalController.getAlumniList);

// Admin Management for Students & Usthads
router.get('/students', portalController.getStudentsAdmin);
router.post('/student', portalController.addStudentAdmin);
router.delete('/student/:id', portalController.deleteStudentAdmin);

router.get('/usthads', portalController.getUsthadsAdmin);
router.post('/usthad', portalController.addUsthadAdmin);
router.delete('/usthad/:id', portalController.deleteUsthadAdmin);

// Student & Usthad Dashboards
router.get('/student/dashboard', portalController.getStudentDashboard);
router.post('/student/message', portalController.postStudentMessage);

router.post('/usthad/post-data', portalController.postUsthadData);

module.exports = router;
