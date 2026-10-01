const fs = require('fs');
let code = fs.readFileSync('controllers/portalController.js', 'utf8');

const sOld = `    let student = null;
    try { student = await Student.findById(id); } catch(e) {}
    const isMemory = !student;
    if (!student) student = memoryStudents.find(s => s._id === id || s.admissionNo === id);`;

const sNew = `    let student = null;
    try { student = await Student.findById(id); } catch(e) {}
    if (!student) {
      try { 
        let sList = await Student.find({ admissionNo: id });
        if(sList && sList.data && sList.data.length > 0) student = sList.data[0];
        else if(sList && sList.length > 0) student = sList[0];
      } catch(e) {}
    }
    const isMemory = !student;
    if (!student) student = memoryStudents.find(s => String(s._id) === String(id) || String(s.admissionNo) === String(id));`;

code = code.replace(sOld, sNew);

const uOld = `    let usthad = null;
    try { usthad = await Usthad.findById(id); } catch(e) {}
    const isMemory = !usthad;
    if (!usthad) usthad = memoryUsthads.find(u => u._id === id || u.usthadId === id);`;

const uNew = `    let usthad = null;
    try { usthad = await Usthad.findById(id); } catch(e) {}
    if (!usthad) {
      try { 
        let uList = await Usthad.find({ usthadId: id });
        if(uList && uList.data && uList.data.length > 0) usthad = uList.data[0];
        else if(uList && uList.length > 0) usthad = uList[0];
      } catch(e) {}
    }
    const isMemory = !usthad;
    if (!usthad) usthad = memoryUsthads.find(u => String(u._id) === String(id) || String(u.usthadId) === String(id));`;

code = code.replace(uOld, uNew);

fs.writeFileSync('controllers/portalController.js', code);
console.log("Replaced using exact strings");
