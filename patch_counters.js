const fs = require('fs');
let js = fs.readFileSync('controllers/portalController.js', 'utf8');

const regexCounter = /exports\.getCounterStats = async \(req, res\) => \{[\s\S]*?res\.json\(\{ success: true, stats: \{ currentStudents: studentCount, alumniBiruthadhari: alumniCount, usthads: usthadCount \} \}\);\s*\}/;

const newCounter = `exports.getCounterStats = async (req, res) => {
  try {
    let sCount = 0;
    let aCount = 0;
    let uCount = 0;

    try {
      const allS = await Student.find();
      const allU = await Usthad.find();
      sCount = allS.filter(x => !x.isAlumni).length;
      aCount = allS.filter(x => x.isAlumni).length;
      uCount = allU.length;
    } catch(e) {}

    // Fallback if DB empty
    if (sCount === 0 && aCount === 0 && uCount === 0) {
      sCount = memoryStudents.filter(s => !s.isAlumni).length;
      aCount = memoryStudents.filter(s => s.isAlumni).length;
      uCount = memoryUsthads.length;
    }

    res.json({ success: true, stats: { currentStudents: sCount, alumniBiruthadhari: aCount, usthads: uCount } });
  } catch (err) {
    res.json({ success: true, stats: { currentStudents: memoryStudents.filter(s => !s.isAlumni).length, alumniBiruthadhari: memoryStudents.filter(s => s.isAlumni).length, usthads: memoryUsthads.length } });
  }
}`;

if(regexCounter.test(js)) {
  js = js.replace(regexCounter, newCounter);
  fs.writeFileSync('controllers/portalController.js', js);
  console.log('Fixed getCounterStats');
} else {
  console.log('Could not match getCounterStats');
}
