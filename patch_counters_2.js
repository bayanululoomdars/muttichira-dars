const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

const oldFunc = `exports.getCounterStats = async (req, res) => {
  try {
    let studentCount = memoryStudents.filter(s => !s.isAlumni).length;
    let alumniCount = memoryStudents.filter(s => s.isAlumni).length;
    let usthadCount = memoryUsthads.length;

    try {
      const dbStudents = await Student.countDocuments({ isAlumni: false });
      const dbAlumni = await Student.countDocuments({ isAlumni: true });
      const dbUsthads = await Usthad.countDocuments();
      if (dbStudents > 0 || dbAlumni > 0 || dbUsthads > 0) {
        studentCount = dbStudents;
        alumniCount = dbAlumni;
        usthadCount = dbUsthads;
      }
    } catch (e) {}

    const yearsOfTradition = String(new Date().getFullYear() - 2001);

    res.json({
      success: true,
      stats: {
        currentStudents: studentCount,
        alumniBiruthadhari: alumniCount,
        totalUsthads: usthadCount,
        yearsOfTradition: yearsOfTradition,
        academicBatches: 6
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};`;

const newFunc = `exports.getCounterStats = async (req, res) => {
  try {
    let studentCount = 0;
    let alumniCount = 0;
    let usthadCount = 0;

    try {
      const allS = await Student.find();
      const allU = await Usthad.find();
      studentCount = allS.filter(x => !x.isAlumni).length;
      alumniCount = allS.filter(x => x.isAlumni).length;
      usthadCount = allU.length;
    } catch(e) {}

    if (studentCount === 0 && alumniCount === 0 && usthadCount === 0) {
      studentCount = memoryStudents.filter(s => !s.isAlumni).length;
      alumniCount = memoryStudents.filter(s => s.isAlumni).length;
      usthadCount = memoryUsthads.length;
    }

    const yearsOfTradition = String(new Date().getFullYear() - 1999); // Estd 1999 as per ID card

    res.json({
      success: true,
      stats: {
        currentStudents: studentCount,
        alumniBiruthadhari: alumniCount,
        totalUsthads: usthadCount,
        yearsOfTradition: yearsOfTradition,
        academicBatches: 18
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};`;

js = js.replace(oldFunc, newFunc);
fs.writeFileSync('controllers/portalController.js', js);
console.log('Fixed getCounterStats');
