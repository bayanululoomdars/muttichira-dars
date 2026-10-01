const fs = require('fs');
let code = fs.readFileSync('controllers/portalController.js', 'utf8');

// Fix updateStudentAdmin
const oldStudentUpdate = `    let student = null;
    try { student = await Student.findById(id); } catch(e) {}
    const isMemory = !student;
    if (!student) student = memoryStudents.find(s => s._id === id || s.admissionNo === id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });`;

const newStudentUpdate = `    let student = null;
    try { student = await Student.findById(id); } catch(e) {}
    if (!student) {
      try { 
        let sList = await Student.find({ admissionNo: id });
        if(sList && sList.length > 0) student = sList[0];
      } catch(e) {}
    }
    const isMemory = !student;
    if (!student) student = memoryStudents.find(s => String(s._id) === String(id) || String(s.admissionNo) === String(id));
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });`;

code = code.replace(oldStudentUpdate, newStudentUpdate);

// Fix updateUsthadAdmin
const oldUsthadUpdate = `    let usthad = null;
    try { usthad = await Usthad.findById(id); } catch(e) {}
    const isMemory = !usthad;
    if (!usthad) usthad = memoryUsthads.find(u => u._id === id || u.usthadId === id);
    if (!usthad) return res.status(404).json({ success: false, message: 'Usthad not found' });`;

const newUsthadUpdate = `    let usthad = null;
    try { usthad = await Usthad.findById(id); } catch(e) {}
    if (!usthad) {
      try {
        let uList = await Usthad.find({ usthadId: id });
        if(uList && uList.length > 0) usthad = uList[0];
      } catch(e) {}
    }
    const isMemory = !usthad;
    if (!usthad) usthad = memoryUsthads.find(u => String(u._id) === String(id) || String(u.usthadId) === String(id));
    if (!usthad) return res.status(404).json({ success: false, message: 'Usthad not found' });`;

code = code.replace(oldUsthadUpdate, newUsthadUpdate);

fs.writeFileSync('controllers/portalController.js', code);
console.log("Fixed DB lookup fallbacks for PUT handlers");
