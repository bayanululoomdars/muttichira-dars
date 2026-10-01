const fs = require('fs');
let code = fs.readFileSync('controllers/portalController.js', 'utf8');

code = code.replace(/try \{ student = await Student.findById\(id\); \} catch\(e\) \{\}\s+const isMemory = !student;\s+if \(!student\) student = memoryStudents\.find\(s => s\._id === id \|\| s\.admissionNo === id\);/g, 
\`try { student = await Student.findById(id); } catch(e) {}
    if (!student) {
      try { 
        let sList = await Student.find({ admissionNo: id });
        if(sList && sList.data && sList.data.length > 0) student = sList.data[0];
        else if (sList && sList.length > 0) student = sList[0];
      } catch(e) {}
    }
    const isMemory = !student;
    if (!student) student = memoryStudents.find(s => String(s._id) === String(id) || String(s.admissionNo) === String(id));\`);

code = code.replace(/try \{ usthad = await Usthad.findById\(id\); \} catch\(e\) \{\}\s+const isMemory = !usthad;\s+if \(!usthad\) usthad = memoryUsthads\.find\(u => u\._id === id \|\| u\.usthadId === id\);/g, 
\`try { usthad = await Usthad.findById(id); } catch(e) {}
    if (!usthad) {
      try {
        let uList = await Usthad.find({ usthadId: id });
        if(uList && uList.data && uList.data.length > 0) usthad = uList.data[0];
        else if (uList && uList.length > 0) usthad = uList[0];
      } catch(e) {}
    }
    const isMemory = !usthad;
    if (!usthad) usthad = memoryUsthads.find(u => String(u._id) === String(id) || String(u.usthadId) === String(id));\`);

fs.writeFileSync('controllers/portalController.js', code);
console.log("Replaced using Regex");
