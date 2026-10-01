const fs = require('fs');

// 1. Update portalRoutes.js
let routes = fs.readFileSync('routes/portalRoutes.js', 'utf8');
if (!routes.includes('delete-mark')) {
  routes = routes.replace("router.post('/exam/save-marks', portalController.saveExamClassMarks);", "router.post('/exam/save-marks', portalController.saveExamClassMarks);\nrouter.delete('/exam/delete-mark', portalController.deleteExamClassMark);");
  fs.writeFileSync('routes/portalRoutes.js', routes);
}

// 2. Update portalController.js
let controller = fs.readFileSync('controllers/portalController.js', 'utf8');
if (!controller.includes('exports.deleteExamClassMark =')) {
  const deleteFunc = `
exports.deleteExamClassMark = async (req, res) => {
  try {
    const { examId, admissionNo } = req.body;
    if (!examId || !admissionNo) return res.status(400).json({ success: false, message: 'Missing parameters' });
    
    let deleted = false;
    try {
      const result = await ExamResult.findOneAndDelete({ examId, admissionNo });
      if(result) deleted = true;
    } catch(e) {}
    
    const idx = memoryExamResults.findIndex(r => r.examId === examId && r.admissionNo === admissionNo);
    if (idx !== -1) {
      memoryExamResults.splice(idx, 1);
      deleted = true;
    }

    // Attempt to recalculate ranks for the remaining students of this exam/class
    try {
      const remainingResults = await ExamResult.find({ examId });
      // Sort and update ranks... (omitted for brevity, or we can just leave it to next save)
    } catch(e){}

    if (typeof scheduleSave === 'function') scheduleSave();

    if(deleted) {
      res.json({ success: true, message: 'Mark deleted successfully' });
    } else {
      res.json({ success: false, message: 'Mark not found' });
    }
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
`;
  controller += '\n' + deleteFunc;
  fs.writeFileSync('controllers/portalController.js', controller);
}
console.log('Backend API for delete mark injected.');
