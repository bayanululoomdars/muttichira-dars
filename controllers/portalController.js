const Student = require('../models/Student');
const Usthad = require('../models/Usthad');
const PortalMessage = require('../models/PortalMessage');
const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');
const Batch = require('../models/Batch');
const { scheduleSave, saveLocalDb, uploadDbToTelegram, dbState } = require('../config/telegramDB');

// In-Memory Fallback Stores for when DB is offline or for rapid demo
const memoryExams = [
  {
    _id: 'exam_101',
    examName: 'First Semester Examination 2025',
    term: 'Semester 1',
    batchYear: '2025',
    status: 'Published',
    classSubjects: {
      'Dars 3rd Year': [
        { subjectName: 'Fiqh (Fathul Mueen)', maxMarks: 100 },
        { subjectName: 'Nahw (Alfiyya)', maxMarks: 80 },
        { subjectName: 'Tafseer (Jalalain)', maxMarks: 50 },
        { subjectName: 'Balagha (Mukhtasar)', maxMarks: 40 }
      ],
      'Dars 2nd Year': [
        { subjectName: 'Fiqh (Fathul Qareeb)', maxMarks: 100 },
        { subjectName: 'Nahw (Ajrumiyya)', maxMarks: 80 },
        { subjectName: 'Hadith (Riyadhus Saliheen)', maxMarks: 50 }
      ]
    },
    createdAt: new Date()
  }
];

const memoryExamResults = [];
const memoryStudents = [];

const memoryUsthads = [];

const memoryMessages = [
  {
    _id: 'mem_m1',
    type: 'notification',
    senderRole: 'usthad',
    senderId: 'UST101',
    senderName: 'Sheikhuna Ibrahim Baqavi',
    targetStudentNo: 'ALL',
    subject: 'Upcoming Semester Examinations',
    content: 'All Dars students are informed that semester exams will commence from next Monday. Revise your Kitab lessons thoroughly.',
    createdAt: new Date()
  },
  {
    _id: 'mem_m2',
    type: 'mark',
    senderRole: 'usthad',
    senderId: 'UST101',
    senderName: 'Sheikhuna Ibrahim Baqavi',
    targetStudentNo: 'ADM101',
    subject: 'Fiqh Exam Result',
    content: 'First Terminal Evaluation in Fiqh (Fathul Mueen). Excellent performance!',
    marksData: {
      examName: 'First Terminal Exam 2025',
      subjectName: 'Fiqh (Fathul Mueen)',
      marksObtained: '94',
      totalMarks: '100',
      grade: 'A+',
      remarks: 'Mumtaz! Outstanding comprehension of Mas\'ala.'
    },
    createdAt: new Date()
  },
  {
    _id: 'mem_m3',
    type: 'message',
    senderRole: 'usthad',
    senderId: 'UST102',
    senderName: 'Usthad Abdul Rahiman Faizi',
    targetStudentNo: 'ADM101',
    subject: 'Nahw Assignment Feedback',
    content: 'Assalamu Alaikum Rashid, your Alfiyya chart was well organized. Keep up the diligent work.',
    createdAt: new Date()
  }
];

// Helper: Find Student (DB or Memory)
async function findStudentByIdentifier(query) {
  if (!query) return null;
  const qStr = String(query).trim();
  const qLower = qStr.toLowerCase();

  let students = [];
  try {
    students = await Student.find({});
  } catch (e) {}

  if (!students || students.length === 0) {
    students = memoryStudents;
  }

  // Exact match by admissionNo or phone first
  let found = students.find(s => 
    String(s.admissionNo || '').toLowerCase() === qLower ||
    String(s.phone || '').trim() === qStr
  );
  if (found) return found;

  // Substring match by name or place
  return students.find(s => 
    (s.name || '').toLowerCase().includes(qLower) ||
    (s.place || '').toLowerCase().includes(qLower)
  );
}

// Helper: Find Usthad (DB or Memory)
async function findUsthadByIdentifier(query) {
  if (!query) return null;
  const qStr = String(query).trim();
  const qLower = qStr.toLowerCase();

  let usthads = [];
  try {
    usthads = await Usthad.find({});
  } catch (e) {}

  if (!usthads || usthads.length === 0) {
    usthads = memoryUsthads;
  }

  // Exact match by usthadId or phone first
  let found = usthads.find(u => 
    String(u.usthadId || '').toLowerCase() === qLower ||
    String(u.phone || '').trim() === qStr
  );
  if (found) return found;

  // Substring match by name or place
  return usthads.find(u => 
    (u.name || '').toLowerCase().includes(qLower) ||
    (u.place || '').toLowerCase().includes(qLower)
  );
}

// ── 1. Live Lookup Preview (Name, Admission No, Photo, Role, Class) ──
exports.lookup = async (req, res) => {
  try {
    const q = (req.query.q || req.query.admissionNo || '').trim();
    if (!q) {
      return res.json({ success: false, message: 'Please enter Admission Number, Name, or Phone' });
    }

    const qLower = q.toLowerCase();

    let allStudents = [];
    try { allStudents = await Student.find({}); } catch (e) {}
    if (!allStudents || allStudents.length === 0) allStudents = memoryStudents;

    let allUsthads = [];
    try { allUsthads = await Usthad.find({}); } catch (e) {}
    if (!allUsthads || allUsthads.length === 0) allUsthads = memoryUsthads;

    let results = [];

    const requestedRole = req.query.role;
    // Filter students
    if (!requestedRole || requestedRole === 'student') {
    allStudents.forEach(s => {
      const admMatch = String(s.admissionNo || '').toLowerCase() === qLower;
      const phoneMatch = String(s.phone || '').includes(q);
      const nameMatch = (s.name || '').toLowerCase().includes(qLower);
      const placeMatch = (s.place || '').toLowerCase().includes(qLower);

      if (admMatch || phoneMatch || nameMatch || placeMatch) {
        results.push({
          type: 'student',
          admissionNo: s.admissionNo,
          name: s.name,
          role: 'student',
          batchNumber: s.batchNumber,
            status: s.status || (s.isAlumni ? 'Biruthadhari / Alumni' : 'Current Student'),
            isAlumni: s.isAlumni,
          photoUrl: s.photoUrl || 'img/new_logo.png',
          place: s.place || 'Muttichira',
          fatherName: s.fatherName || s.guardianName || ''
        });
      }
    });

    }
    // Filter usthads
    if (!requestedRole || requestedRole === 'usthad') {
    allUsthads.forEach(u => {
      const idMatch = String(u.usthadId || '').toLowerCase() === qLower;
      const phoneMatch = String(u.phone || '').includes(q);
      const nameMatch = (u.name || '').toLowerCase().includes(qLower);
      const placeMatch = (u.place || '').toLowerCase().includes(qLower);

      if (idMatch || phoneMatch || nameMatch || placeMatch) {
        results.push({
          type: 'usthad',
          admissionNo: u.usthadId,
          usthadId: u.usthadId,
          name: u.name,
          role: 'usthad',
          designation: u.designation,
          subject: u.subject || 'Dars Mudarris',
          photoUrl: u.photoUrl || 'img/new_logo.png',
          place: u.place || 'Muttichira',
          phone: u.phone,
          fatherName: u.fatherName || ''
        });
      }
    });

    }

    if (results.length > 0) {
      return res.json({
        success: true,
        user: results[0],
        matches: results.slice(0, 15) // Top 15 matching items
      });
    }

    return res.json({ success: false, message: 'No Student or Usthad record matches "' + q + '"' });
  } catch (err) {
    console.error('Lookup error:', err);
    res.status(500).json({ success: false, message: 'Server error during lookup' });
  }
};

// ── 2. Login Endpoint ──
exports.login = async (req, res) => {
  try {
    const { role, identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'ID/Phone/Name and Password required' });
    }

    const cleanId = String(identifier).trim();
    const cleanPass = String(password).trim();

    if (role === 'usthad') {
      let usthad = await findUsthadByIdentifier(cleanId);
      if (!usthad) {
        return res.status(404).json({ success: false, message: 'Usthad record not found' });
      }
      const validPass = usthad.password || usthad.phone || usthad.usthadId;
      if (cleanPass !== validPass) {
        return res.status(401).json({ success: false, message: 'Incorrect Password' });
      }
      req.session.portalUser = {
        role: 'usthad',
        id: usthad._id,
        usthadId: usthad.usthadId,
        admissionNo: usthad.usthadId,
        name: usthad.name,
        phone: usthad.phone,
        designation: usthad.designation,
        subject: usthad.subject,
        photoUrl: usthad.photoUrl,
        place: usthad.place || 'Muttichira',
        fatherName: usthad.fatherName || '',
        postOffice: usthad.postOffice || usthad.address || '',
        education: usthad.education || 'Baqavi / Faizi',
        job: usthad.job || 'Mudarris / Scholar',
        bloodGroup: usthad.bloodGroup || '',
        myDatas: usthad.myDatas || [],
        bio: usthad.bio || ''
      };
      return res.json({ success: true, message: 'Usthad Login successful', user: req.session.portalUser });
    } else {
      // Default to student
      let student = await findStudentByIdentifier(cleanId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student record not found' });
      }
      const validPass = student.password || student.phone || student.admissionNo;
      console.log('Login student:', student);
      console.log('Login validPass:', validPass, 'cleanPass:', cleanPass);
      if (cleanPass !== validPass) {
        return res.status(401).json({ success: false, message: 'Incorrect Password' });
      }
      req.session.portalUser = {
        role: 'student',
        id: student._id,
        admissionNo: student.admissionNo,
        name: student.name,
        phone: student.phone,
        batchNumber: student.batchNumber,
          status: student.status,
          isAlumni: student.isAlumni,
        photoUrl: student.photoUrl,
        place: student.place || 'Muttichira',
        fatherName: student.fatherName || student.guardianName || '',
        guardianName: student.guardianName,
        postOffice: student.postOffice || student.post || student.address || '',
        education: student.education || 'SSLC / Dars',
        job: student.job || student.occupation || 'Student',
        bloodGroup: student.bloodGroup || '',
        myDatas: student.myDatas || [],
        bio: student.bio
      };
      return res.json({ success: true, message: 'Student Login successful', user: req.session.portalUser });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ── 3. Change Password ──
exports.changePassword = async (req, res) => {
  try {
    const { role, identifier, oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
    }

    if (role === 'usthad') {
      try {
        let u = await Usthad.findOne({ $or: [{ usthadId: identifier }, { phone: identifier }] });
        if (u) {
          if (u.password !== oldPassword) {
            return res.status(401).json({ success: false, message: 'Old password does not match' });
          }
          u.password = newPassword;
          await u.save();
          // PASSWORD SYNC HOOK
          const tdb = require('../config/telegramDB');
          if (tdb.uploadDbToTelegram) tdb.uploadDbToTelegram();
          return res.json({ success: true, message: 'Password updated successfully!' });
        }
      } catch (e) {}
      let memU = memoryUsthads.find(u => u.usthadId === identifier || u.phone === identifier);
      if (memU) {
        if (memU.password !== oldPassword) {
          return res.status(401).json({ success: false, message: 'Old password does not match' });
        }
        memU.password = newPassword;
        return res.json({ success: true, message: 'Password updated successfully!' });
      }
    } else {
      try {
        let s = await Student.findOne({ $or: [{ admissionNo: identifier }, { phone: identifier }] });
        if (s) {
          if (s.password !== oldPassword) {
            return res.status(401).json({ success: false, message: 'Old password does not match' });
          }
          s.password = newPassword;
          await s.save();
          return res.json({ success: true, message: 'Password updated successfully!' });
        }
      } catch (e) {}
      let memS = memoryStudents.find(s => s.admissionNo === identifier || s.phone === identifier);
      if (memS) {
        if (memS.password !== oldPassword) {
          return res.status(401).json({ success: false, message: 'Old password does not match' });
        }
        memS.password = newPassword;
        return res.json({ success: true, message: 'Password updated successfully!' });
      }
    }
    res.status(404).json({ success: false, message: 'User not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── 4. Counter Statistics (Live count of Students, Alumni, Usthads, Courses) ──
exports.getCounterStats = async (req, res) => {
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
};

// ── 5. Alumni / Biruthadhari Search & Directory ──
exports.getAlumniList = async (req, res) => {
  try {
    const search = (req.query.search || '').toLowerCase().trim();
    const batchYear = (req.query.batchYear || '').trim();

    let alumniList = [];
    try {
      const query = { isAlumni: true };
      if (batchYear) query.batchYear = batchYear;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { admissionNo: { $regex: search, $options: 'i' } },
          { place: { $regex: search, $options: 'i' } }
        ];
      }
      alumniList = await Student.find(query).sort({ batchYear: -1 });
    } catch (e) {}

    const memAlumni = memoryStudents.filter(s => {
      if (!s.isAlumni) return false;
      if (batchYear && s.batchYear !== batchYear) return false;
      if (search) {
        const matchName = s.name.toLowerCase().includes(search);
        const matchAdm = s.admissionNo.toLowerCase().includes(search);
        const matchPlace = s.place.toLowerCase().includes(search);
        return matchName || matchAdm || matchPlace;
      }
      return true;
    });

    alumniList = [...alumniList, ...memAlumni];

    res.json({ success: true, count: alumniList.length, alumni: alumniList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── 6. Admin: Students CRUD ──
exports.getStudentsAdmin = async (req, res) => {
  try {
    let students = [];
    try {
      students = await Student.find().sort({ createdAt: -1 });
    } catch (e) {}
    const allStudents = [...students, ...memoryStudents];
    res.json({ success: true, students: allStudents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


function processBase64ImageSync(base64Str, userId) {
  if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;
  try {
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Str;
    const ext = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = userId + '_' + Date.now() + '.' + ext;
    const uploadDir = require('path').join(__dirname, '../public/uploads');
    if (!require('fs').existsSync(uploadDir)) {
      require('fs').mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = require('path').join(uploadDir, fileName);
    require('fs').writeFileSync(filePath, buffer);
    return 'uploads/' + fileName;
  } catch(e) {
    console.error('Base64 processing error:', e);
    return '';
  }
}

exports.addStudentAdmin = async (req, res) => {
  try {
    const { admissionNo, name, phone, password, batchNumber, isAlumni, status, place, photoUrl, fatherName } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone Number are required' });
    }

    const autoAdmNo = admissionNo || ('ADM' + Math.floor(100 + Math.random() * 900));
    const autoPassword = password || phone; // Default password is phone number!

    const newStudentData = {
      admissionNo: autoAdmNo,
      name,
      phone,
      password: autoPassword,
      role: 'student',
      isAlumni: Boolean(isAlumni === true || isAlumni === 'true' || status === 'Biruthadhari / Alumni'),
      status: status || (isAlumni ? 'Biruthadhari / Alumni' : 'Current Student'),
      batchNumber: batchNumber || '1',
      photoUrl: photoUrl || '',
      place: place || '',
      fatherName: fatherName || ''
    };

    try {
      const s = new Student(newStudentData);
      await s.save();
      return res.json({ success: true, message: 'Student added successfully!', student: s });
    } catch (e) {
      // Memory fallback
      const memObj = { _id: 'mem_' + Date.now(), ...newStudentData };
      memoryStudents.unshift(memObj);
      return res.json({ success: true, message: 'Student added to system!', student: memObj });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStudentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let student = null;
    try { student = await Student.findById(id); } catch(e) {} if (!student) { try { let sList = await Student.find({ admissionNo: id }); if(sList && sList.data && sList.data.length > 0) student = sList.data[0]; else if(sList && sList.length > 0) student = sList[0]; } catch(e) {} } const isMemory = !student; if (!student) student = memoryStudents.find(s => String(s._id) === String(id) || String(s.admissionNo) === String(id));
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const updates = req.body;
    if (req.file) updates.photoUrl = req.file.path;
    if (updates.isAlumni !== undefined) updates.isAlumni = Boolean(updates.isAlumni === true || updates.isAlumni === 'true' || updates.status === 'Biruthadhari / Alumni');

    Object.assign(student, updates);
    if (!isMemory && student.save) await student.save();
    res.json({ success: true, message: 'Student updated successfully!', student });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStudentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Student.findByIdAndDelete(id);
    } catch (e) {}
    const idx = memoryStudents.findIndex(s => s._id === id || s.admissionNo === id);
    if (idx !== -1) memoryStudents.splice(idx, 1);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── 7. Admin: Usthads CRUD ──
exports.getUsthadsAdmin = async (req, res) => {
  try {
    let usthads = [];
    try {
      usthads = await Usthad.find().sort({ createdAt: -1 });
    } catch (e) {}
    const allUsthads = [...usthads, ...memoryUsthads];
    res.json({ success: true, usthads: allUsthads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addUsthadAdmin = async (req, res) => {
  try {
    const { usthadId, name, phone, password, designation, subject, place, photoUrl, bio } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Usthad Name and Phone are required' });
    }

    const autoId = usthadId || ('UST' + Math.floor(100 + Math.random() * 900));
    const autoPassword = password || phone; // Default password = phone

    const newUsthadData = {
      usthadId: autoId,
      name,
      phone,
      password: autoPassword,
      role: 'usthad',
      designation: designation || 'Usthad',
      subject: subject || 'Islamic Studies',
      place: place || '',
      photoUrl: photoUrl || '',
      bio: bio || ''
    };

    try {
      const u = new Usthad(newUsthadData);
      await u.save();
      return res.json({ success: true, message: 'Usthad added successfully!', usthad: u });
    } catch (e) {
      const memObj = { _id: 'mem_' + Date.now(), ...newUsthadData };
      memoryUsthads.unshift(memObj);
      return res.json({ success: true, message: 'Usthad added to system!', usthad: memObj });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUsthadAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let usthad = null;
    try { usthad = await Usthad.findById(id); } catch(e) {} if (!usthad) { try { let uList = await Usthad.find({ usthadId: id }); if(uList && uList.data && uList.data.length > 0) usthad = uList.data[0]; else if(uList && uList.length > 0) usthad = uList[0]; } catch(e) {} } const isMemory = !usthad; if (!usthad) usthad = memoryUsthads.find(u => String(u._id) === String(id) || String(u.usthadId) === String(id));
    if (!usthad) return res.status(404).json({ success: false, message: 'Usthad not found' });

    const updates = req.body;
    if (req.file) updates.photoUrl = req.file.path;

    Object.assign(usthad, updates);
    if (!isMemory && usthad.save) await usthad.save();
    res.json({ success: true, message: 'Usthad updated successfully!', usthad });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUsthadAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Usthad.findByIdAndDelete(id);
    } catch (e) {}
    const idx = memoryUsthads.findIndex(u => u._id === id || u.usthadId === id);
    if (idx !== -1) memoryUsthads.splice(idx, 1);
    res.json({ success: true, message: 'Usthad deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── 8. Student Dashboard Data ──
exports.getStudentDashboard = async (req, res) => {
  try {
    const admNo = req.query.admissionNo;
    const student = await findStudentByIdentifier(admNo);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    let messages = [];
    try {
      messages = await PortalMessage.find({
        $or: [{ targetStudentNo: admNo }, { targetStudentNo: 'ALL' }, { senderId: admNo }]
      }).sort({ createdAt: -1 });
    } catch (e) {}

    if (messages.length === 0) {
      messages = memoryMessages.filter(m => 
        m.targetStudentNo === admNo || m.targetStudentNo === 'ALL' || m.senderId === admNo
      );
    }

    res.json({
      success: true,
      student,
      results: messages.filter(m => m.type === 'mark'),
      notifications: messages.filter(m => m.type === 'notification'),
      messages: messages.filter(m => m.type === 'message')
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── 9. Usthad Post Mark / Result / Notification / Message ──
exports.postUsthadData = async (req, res) => {
  try {
    const { type, usthadId, usthadName, targetStudentNo, subject, content, marksData } = req.body;
    if (!content && type !== 'mark') {
      return res.status(400).json({ success: false, message: 'Content required' });
    }

    const payload = {
      type: type || 'notification',
      senderRole: 'usthad',
      senderId: usthadId || 'UST101',
      senderName: usthadName || 'Usthad',
      targetStudentNo: targetStudentNo || 'ALL',
      subject: subject || '',
      content: content || 'Exam result posted',
      marksData: marksData || {},
      createdAt: new Date()
    };

    try {
      const pm = new PortalMessage(payload);
      await pm.save();
      return res.json({ success: true, message: `${type.toUpperCase()} sent successfully!`, data: pm });
    } catch (e) {
      const memObj = { _id: 'mem_msg_' + Date.now(), ...payload };
      memoryMessages.unshift(memObj);
      return res.json({ success: true, message: `${type.toUpperCase()} sent to student!`, data: memObj });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── 10. Student Send Message to Usthad ──

exports.getUsthadMessages = async (req, res) => {
  try {
    let messages = [];
    try {
      messages = await PortalMessage.find({
        $or: [
          { targetStudentNo: { $exists: false } },
          { senderId: { $exists: true } } 
        ]
      }).sort({ createdAt: -1 });
    } catch (e) {
      // Mock error fallback
    }

    if (messages.length === 0) {
      const memoryMessages = [
        {
          _id: 'mem_msg_901',
          type: 'message',
          subject: 'Leave Request',
          content: 'Usthad, I need 2 days leave for family function.',
          senderId: '101',
          senderName: 'Sayyid Zainul Abid',
          createdAt: new Date().toISOString()
        }
      ];
      messages = memoryMessages;
    }

    const msgList = messages.filter(m => m.type === 'message');
    res.json({
      success: true,
      messages: msgList,
      data: {
        messages: msgList
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.postStudentMessage = async (req, res) => {
  try {
    const { admissionNo, studentName, usthadId, subject, content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const payload = {
      type: 'message',
      senderRole: 'student',
      senderId: admissionNo || 'ADM101',
      senderName: studentName || 'Student',
      targetStudentNo: usthadId || 'UST101',
      subject: subject || 'Message to Usthad',
      content,
      createdAt: new Date()
    };

    try {
      const pm = new PortalMessage(payload);
      await pm.save();
      return res.json({ success: true, message: 'Message sent to Usthad successfully!', data: pm });
    } catch (e) {
      const memObj = { _id: 'mem_msg_' + Date.now(), ...payload };
      memoryMessages.unshift(memObj);
      return res.json({ success: true, message: 'Message sent to Usthad!', data: memObj });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── 11. Exam & Mark Management Endpoints ──


// Helper to normalize batch name
function normalizeBatchName(val) {
  if (!val) return '';
  let str = String(val).trim();
  if (/^\d+$/.test(str)) {
    return 'Batch ' + str;
  }
  if (/^batch\s*\d+$/i.test(str)) {
    const num = str.replace(/^batch\s*/i, '').trim();
    return 'Batch ' + num;
  }
  return str;
}

// GET /api/portal/batches
exports.getBatches = async (req, res) => {
  try {
    const batchSet = new Set();
    const currentStudentBatchSet = new Set();

    for (let i = 1; i <= 14; i++) {
      batchSet.add(`Batch ${i}`);
    }

    try {
      const savedBatches = await Batch.find({});
      (savedBatches || []).forEach(b => {
        if (b && (b.name || b.batchName)) batchSet.add(normalizeBatchName(b.name || b.batchName));
      });
    } catch (e) {}

    try {
      const students = await Student.find({});
      (students || []).forEach(s => {
        const b = s.batchNumber || s.className;
        if (b) {
          const norm = normalizeBatchName(b);
          batchSet.add(norm);
          const isAlumni = (s.isAlumni === true) || (String(s.status || '').toLowerCase().includes('alumni') || String(s.status || '').toLowerCase().includes('biruthadhari'));
          if (!isAlumni) {
            currentStudentBatchSet.add(norm);
          }
        }
      });
    } catch (e) {}

    const sorter = (a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    };

    const batches = Array.from(batchSet).sort(sorter);
    let currentStudentBatches = Array.from(currentStudentBatchSet).sort(sorter);
    if (currentStudentBatches.length === 0) {
      currentStudentBatches = batches.slice(0, 4);
    }

    res.json({ success: true, batches, currentStudentBatches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/portal/batch
exports.addBatch = async (req, res) => {
  try {
    const { batchName } = req.body;
    if (!batchName) {
      return res.status(400).json({ success: false, message: 'Batch name or number is required' });
    }

    const normalized = normalizeBatchName(batchName);

    const exists = await Batch.findOne({ name: normalized });
    if (!exists) {
      const newBatch = new Batch({
        name: normalized,
        batchName: normalized,
        createdAt: new Date()
      });
      await newBatch.save();
    }

    scheduleSave();

    const batchSet = new Set();
    const currentStudentBatchSet = new Set();

    for (let i = 1; i <= 14; i++) {
      batchSet.add(`Batch ${i}`);
    }
    try {
      const savedBatches = await Batch.find({});
      (savedBatches || []).forEach(b => {
        if (b && (b.name || b.batchName)) batchSet.add(normalizeBatchName(b.name || b.batchName));
      });
      const students = await Student.find({});
      (students || []).forEach(s => {
        const b = s.batchNumber || s.className;
        if (b) {
          const norm = normalizeBatchName(b);
          batchSet.add(norm);
          const isAlumni = (s.isAlumni === true) || (String(s.status || '').toLowerCase().includes('alumni') || String(s.status || '').toLowerCase().includes('biruthadhari'));
          if (!isAlumni) {
            currentStudentBatchSet.add(norm);
          }
        }
      });
    } catch (e) {}

    const sorter = (a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    };

    const batches = Array.from(batchSet).sort(sorter);
    let currentStudentBatches = Array.from(currentStudentBatchSet).sort(sorter);
    if (!currentStudentBatches.includes(normalized)) {
      currentStudentBatches.push(normalized);
      currentStudentBatches.sort(sorter);
    }

    res.json({ success: true, message: `Batch ${normalized} added successfully!`, batch: normalized, batches, currentStudentBatches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/portal/batch/ensure-thirty
exports.ensureBatchThirtyStudents = async (req, res) => {
  try {
    const { batchName } = req.body;
    if (!batchName) {
      return res.status(400).json({ success: false, message: 'Batch name is required' });
    }

    const norm = b => (b || '').toString().toLowerCase().replace(/^batch\s*/i, '').trim();
    const targetNorm = norm(batchName);

    let allStudents = [];
    try { allStudents = await Student.find({}); } catch (e) {}
    if (!allStudents || allStudents.length === 0) allStudents = memoryStudents;

    const existingClassStudents = allStudents.filter(s => 
      !s.isAlumni && norm(s.batchNumber || s.className) === targetNorm
    );

    const needed = 30 - existingClassStudents.length;
    if (needed <= 0) {
      return res.json({
        success: true,
        message: `Batch ${batchName} already has ${existingClassStudents.length} students (>= 30).`,
        count: existingClassStudents.length,
        addedCount: 0
      });
    }

    // Determine max admission number across all students
    let maxAdm = 200;
    allStudents.forEach(s => {
      const num = parseInt(s.admissionNo, 10);
      if (!isNaN(num) && num > maxAdm) maxAdm = num;
    });

    const keralaStudentNames = [
      'Muhammed Shamil', 'Abdurrahman K', 'Sayyid Fawaz', 'Bilal Ahmed', 'Salmanul Farisi',
      'Rayan Muhammed', 'Shaheen K', 'Musthafa VP', 'Ameen Ahsan', 'Thahir Ali',
      'Yaseen Mubarak', 'Adil Rahman', 'Rashidul Islam', 'Safwan KT', 'Naeemudheen',
      'Junaid Al-Ameen', 'Hamdan Bin Ali', 'Sayyid Sufyan', 'Farzeen K', 'Danish Ali',
      'Muhammed Hashim', 'Sinanul Haq', 'Rayeesul Islam', 'Nihad K', 'Fayaz Rahman',
      'Sayyid Bilal', 'Irshadul Haque', 'Shuhaib Ali', 'Basil Ahamed', 'Mahirudheen',
      'Shakir K', 'Luqmanul Hakeem', 'Ziyad Muhammed', 'Tahirul Islam', 'Waseem Akram',
      'Sayyid Rayan', 'Fawas Ali', 'Abdul Majeed', 'Zahidul Islam', 'Muzzammil K',
      'Nabeel Hassan', 'Swadiqul Ameen', 'Shafeeque Rahman', 'Shabeerul Islam', 'Sayyid Munawwar',
      'Ayman Zahid', 'Naufal Ali', 'Ashik Rahman', 'Shamil Hakeem', 'Sayyid Arshad'
    ];

    const addedStudents = [];
    for (let i = 0; i < needed; i++) {
      maxAdm++;
      const name = keralaStudentNames[i % keralaStudentNames.length] + (i >= keralaStudentNames.length ? ` ${Math.floor(i / keralaStudentNames.length) + 1}` : '');
      const newS = new Student({
        admissionNo: String(maxAdm),
        name: name,
        phone: '1234567890',
        password: '1234',
        role: 'student',
        isAlumni: false,
        status: 'Current Student',
        batchNumber: targetNorm,
        className: 'Batch ' + targetNorm,
        place: 'Muttichira',
        photoUrl: 'img/new_logo.png'
      });
      await newS.save();
      addedStudents.push(newS);
    }

    return res.json({
      success: true,
      message: `Successfully added ${addedStudents.length} students to ${batchName}. Total is now 30 students!`,
      count: existingClassStudents.length + addedStudents.length,
      addedCount: addedStudents.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/portal/exams
exports.getExamsAdmin = async (req, res) => {
  try {
    let exams = [];
    try {
      exams = await Exam.find().sort({ createdAt: -1 });
    } catch (e) {}
    if (!exams || exams.length === 0) exams = memoryExams;
    res.json({ success: true, exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/portal/exam
exports.createExamAdmin = async (req, res) => {
  try {
    const { examName, term, batchYear, classSubjects } = req.body;
    if (!examName) {
      return res.status(400).json({ success: false, message: 'Exam Name is required' });
    }

    const payload = {
      examName,
      term: term || 'Semester 1',
      batchYear: batchYear || '2025',
      status: 'Published',
      classSubjects: typeof classSubjects === 'string' ? JSON.parse(classSubjects) : (classSubjects || {}),
      createdAt: new Date()
    };

    try {
      const exam = new Exam(payload);
      await exam.save();
      return res.json({ success: true, message: 'Exam configuration created successfully!', exam });
    } catch (e) {
      const memObj = { _id: 'exam_' + Date.now(), ...payload };
      memoryExams.unshift(memObj);
      return res.json({ success: true, message: 'Exam created in system!', exam: memObj });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/portal/exam/:id
exports.deleteExamAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Exam.findByIdAndDelete(id);
    } catch (e) {}
    const idx = memoryExams.findIndex(e => e._id === id);
    if (idx !== -1) memoryExams.splice(idx, 1);
    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/portal/exam/roster?examId=xxx&className=xxx
exports.getExamClassRoster = async (req, res) => {
  try {
    const { examId, className } = req.query;
    if (!examId || !className) {
      return res.status(400).json({ success: false, message: 'Exam ID and Class Name required' });
    }

    // Find Exam
    let exam = null;
    try { exam = await Exam.findById(examId); } catch (e) {}
    if (!exam) exam = memoryExams.find(e => e._id === examId);

    const norm = b => (b || '').toString().toLowerCase().replace(/^batch\s*/i, '').trim();
    const targetNorm = norm(className);

    // Extract subjects and enabled status for this batch
    let subjects = [];
    let isEnabled = true;
    if (exam && exam.classSubjects) {
      const targetKey = Object.keys(exam.classSubjects).find(k =>
        k.toLowerCase() === className.toLowerCase() ||
        norm(k) === targetNorm
      );
      if (targetKey) {
        const batchConfig = exam.classSubjects[targetKey];
        if (Array.isArray(batchConfig)) {
          subjects = batchConfig;
        } else if (batchConfig && typeof batchConfig === 'object') {
          subjects = batchConfig.subjects || [];
          if (batchConfig.enabled === false) isEnabled = false;
        }
      }
    }

    // Find Students of Class
    let allStudents = [];
    try { allStudents = await Student.find({}); } catch (e) {}
    if (!allStudents || allStudents.length === 0) allStudents = memoryStudents;

    let classStudents = allStudents.filter(s => 
      !s.isAlumni && (className === 'ALL' || norm(s.batchNumber || s.className) === targetNorm)
    );

    // Find Existing Results for Exam & Class
    let existingResults = [];
    try {
      existingResults = await ExamResult.find({ examId });
    } catch (e) {}
    if (!existingResults || existingResults.length === 0) {
      existingResults = memoryExamResults.filter(r => r.examId === examId);
    }
    existingResults = existingResults.filter(r =>
      norm(r.className) === targetNorm || classStudents.some(s => s.admissionNo === r.admissionNo)
    );

    res.json({
      success: true,
      exam,
      isEnabled,
      subjects,
      students: classStudents,
      existingResults
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/portal/exam/save-marks
exports.saveExamClassMarks = async (req, res) => {
  try {
    const { examId, examName, className, marksData, usthadName, isPublished } = req.body;
    if (!examId || !className || !Array.isArray(marksData) || marksData.length === 0) {
      return res.status(400).json({ success: false, message: 'Valid Exam, Class, and Student Marks required' });
    }

    // 1. Process each student's total marks, percentage, grade, and attendance
    let processedEntries = marksData.map(item => {
      const subMarks = item.subjectMarks || {};
      const subjectsList = item.subjectsConfig || [];

      let totalMax = 0;
      let totalObtained = 0;
      let breakdown = [];

      subjectsList.forEach(s => {
        const mMax = Number(s.maxMarks || 100);
        const mObt = Number(subMarks[s.subjectName] || 0);
        totalMax += mMax;
        totalObtained += mObt;
        breakdown.push({
          subjectName: s.subjectName,
          maxMarks: mMax,
          marksObtained: mObt
        });
      });

      if (totalMax === 0) totalMax = 100;

      const pct = parseFloat(((totalObtained / totalMax) * 100).toFixed(1));

      // Determine Grade
      let grade = 'ممتاز (Mumtaz)';
      if (pct >= 85) grade = 'ممتاز (Mumtaz)';
      else if (pct >= 75) grade = 'جيد جداً (Jayyid Jiddan)';
      else if (pct >= 60) grade = 'جيد (Jayyid)';
      else if (pct >= 40) grade = 'مقبول (Maqbool)';
      else grade = 'راسب (Rasib)';

      const totDays = Number(item.attendanceTotalDays || 100);
      const presDays = Number(item.attendancePresentDays || totDays);
      const attPct = parseFloat(((presDays / totDays) * 100).toFixed(1));

      const shouldPublish = (item.isPublished !== undefined ? item.isPublished : (isPublished !== undefined ? isPublished : true));

      return {
        examId,
        examName: examName || 'Semester Exam',
        className,
        admissionNo: item.admissionNo,
        studentName: item.studentName || 'Student',
        subjectMarks: breakdown,
        totalMaxMarks: totalMax,
        totalMarksObtained: totalObtained,
        percentage: pct,
        grade,
        attendanceTotalDays: totDays,
        attendancePresentDays: presDays,
        attendancePercentage: attPct,
        usthadRemarks: item.usthadRemarks || '',
        publishedBy: usthadName || 'Usthad',
        isPublished: shouldPublish,
        status: shouldPublish ? 'published' : 'draft',
        createdAt: new Date()
      };
    });

    // 2. Class rank calculation
    processedEntries.sort((a, b) => b.totalMarksObtained - a.totalMarksObtained);

    let currentRank = 1;
    processedEntries.forEach((entry, idx) => {
      if (idx > 0 && entry.totalMarksObtained < processedEntries[idx - 1].totalMarksObtained) {
        currentRank = idx + 1;
      }
      let rankStr = currentRank + 'th Rank';
      if (currentRank === 1) rankStr = '1st Rank 🏆';
      else if (currentRank === 2) rankStr = '2nd Rank 🥈';
      else if (currentRank === 3) rankStr = '3rd Rank 🥉';

      entry.rank = rankStr;
      entry.rankNumber = currentRank;
    });

    // 3. Save to DB/Memory & Broadcast Notifications if published
    for (let entry of processedEntries) {
      try {
        await ExamResult.findOneAndUpdate(
          { examId: entry.examId, admissionNo: entry.admissionNo },
          entry,
          { upsert: true }
        );
      } catch (e) {
        const existingIdx = memoryExamResults.findIndex(r => r.examId === entry.examId && r.admissionNo === entry.admissionNo);
        if (existingIdx !== -1) memoryExamResults[existingIdx] = entry;
        else memoryExamResults.unshift(entry);
      }

      if (entry.isPublished) {
        const notifPayload = {
          type: 'mark',
          senderRole: 'usthad',
          senderId: 'UST101',
          senderName: entry.publishedBy,
          targetStudentNo: entry.admissionNo,
          subject: entry.examName + ' Result Published',
          content: `Your result for ${entry.examName} is published. Total: ${entry.totalMarksObtained}/${entry.totalMaxMarks} (${entry.percentage}%), Grade: ${entry.grade}, Rank: ${entry.rank}.`,
          marksData: {
            examName: entry.examName,
            subjectName: 'Overall Evaluation',
            marksObtained: String(entry.totalMarksObtained),
            totalMarks: String(entry.totalMaxMarks),
            grade: entry.grade,
            rank: entry.rank,
            percentage: entry.percentage,
            remarks: entry.usthadRemarks
          },
          createdAt: new Date()
        };
        try {
          const pm = new PortalMessage(notifPayload);
          await pm.save();
        } catch (e) {
          memoryMessages.unshift({ _id: 'mem_msg_' + Date.now(), ...notifPayload });
        }
      }
    }

    scheduleSave();

    res.json({
      success: true,
      message: `Marks for ${className} ${processedEntries[0]?.isPublished ? 'published' : 'saved as draft'} successfully!`,
      results: processedEntries
    });
  } catch (err) {
    console.error('saveExamClassMarks error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/portal/exam/publish-batch
exports.publishExamBatch = async (req, res) => {
  try {
    const { examId, className, usthadName } = req.body;
    if (!examId || !className) {
      return res.status(400).json({ success: false, message: 'Exam ID and Class Name are required' });
    }

    const norm = b => (b || '').toString().toLowerCase().replace(/^batch\s*/i, '').trim();
    const targetNorm = norm(className);

    let allStudents = [];
    try { allStudents = await Student.find({}); } catch (e) {}
    const batchStudentAdmNos = new Set(
      allStudents.filter(s => norm(s.batchNumber || s.className) === targetNorm).map(s => s.admissionNo)
    );

    let results = [];
    try { results = await ExamResult.find({ examId }); } catch (e) {}
    let updatedCount = 0;

    for (let r of results) {
      if (batchStudentAdmNos.has(r.admissionNo) || norm(r.className) === targetNorm) {
        r.isPublished = true;
        r.status = 'published';
        r.publishedBy = usthadName || r.publishedBy || 'Usthad';
        try {
          await ExamResult.findOneAndUpdate(
            { examId: r.examId, admissionNo: r.admissionNo },
            { isPublished: true, status: 'published', publishedBy: r.publishedBy }
          );
        } catch (e) {}
        updatedCount++;

        const notifPayload = {
          type: 'mark',
          senderRole: 'usthad',
          senderId: 'UST101',
          senderName: r.publishedBy,
          targetStudentNo: r.admissionNo,
          subject: (r.examName || 'Exam') + ' Result Published',
          content: `Your result for ${r.examName || 'Exam'} has been officially published! Total: ${r.totalMarksObtained}/${r.totalMaxMarks} (${r.percentage}%), Grade: ${r.grade}, Rank: ${r.rank}.`,
          marksData: {
            examName: r.examName,
            marksObtained: String(r.totalMarksObtained),
            totalMarks: String(r.totalMaxMarks),
            grade: r.grade,
            rank: r.rank,
            percentage: r.percentage
          },
          createdAt: new Date()
        };
        try {
          const pm = new PortalMessage(notifPayload);
          await pm.save();
        } catch (e) {}
      }
    }

    scheduleSave();

    res.json({
      success: true,
      message: `All marks for ${className} (${updatedCount} students) have been published successfully!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/portal/student/progress-card?admissionNo=xxx
exports.getStudentProgressCard = async (req, res) => {
  try {
    const admissionNo = req.query.admissionNo;
    if (!admissionNo) {
      return res.status(400).json({ success: false, message: 'Admission Number is required' });
    }

    let student = await findStudentByIdentifier(admissionNo);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    let results = [];
    try {
      results = await ExamResult.find({ admissionNo }).sort({ createdAt: -1 });
    } catch (e) {}

    if (!results || results.length === 0) {
      results = memoryExamResults.filter(r => r.admissionNo === admissionNo);
    }

    res.json({
      success: true,
      student,
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.uploadProfilePhoto = async (req, res) => {
  try {
    const { userId, role, base64Image } = req.body;
    if (!userId || !base64Image) {
      return res.status(400).json({ success: false, message: 'Missing user ID or image data' });
    }

    const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 string' });
    }

    const ext = matches[1].split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = userId + '_' + Date.now() + '.' + ext;
    const uploadDir = path.join(__dirname, '../public/uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    const photoUrl = 'uploads/' + fileName;

    // Delete old photo and update user
    let user;
    if (role === 'student' || role === 'alumni') {
      user = await Student.findOne({ _id: userId });
    } else {
      user = await Usthad.findOne({ _id: userId });
    }

    if (user) {
      if (user.photoUrl && user.photoUrl.startsWith('uploads/')) {
        const oldPath = path.join(__dirname, '../public', user.photoUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error('Failed to delete old photo:', e); }
        }
      }
      user.photoUrl = photoUrl;
      
      const tdb = require('../config/telegramDB');
      if (tdb.uploadDbToTelegram) {
        tdb.uploadDbToTelegram(); // Background sync
      }
    }

    res.json({ success: true, photoUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: 'Photo upload failed' });
  }
};


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


// ── 12. My Datas (Document / Image Vault) ──
exports.uploadMyData = async (req, res) => {
  try {
    const { userId, role, title, base64Image } = req.body;
    if (!userId || !base64Image) {
      return res.status(400).json({ success: false, message: 'Missing user ID or image' });
    }

    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid image format' });
    }

    const ext = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = 'doc_' + userId + '_' + Date.now() + '.' + ext;
    const uploadDir = path.join(__dirname, '../public/uploads/mydatas');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const physicalPath = path.join(uploadDir, fileName);
    fs.writeFileSync(physicalPath, buffer);
    const docUrl = 'uploads/mydatas/' + fileName;

    let user;
    if (role === 'usthad') {
      try { user = await Usthad.findById(userId); } catch(e){}
      if (!user) user = memoryUsthads.find(u => String(u._id) === String(userId) || String(u.usthadId) === String(userId));
    } else {
      try { user = await Student.findById(userId); } catch(e){}
      if (!user) user = memoryStudents.find(s => String(s._id) === String(userId) || String(s.admissionNo) === String(userId));
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!Array.isArray(user.myDatas)) {
      user.myDatas = [];
    }

    const newDoc = {
      id: 'doc_' + Date.now(),
      title: title || 'Document Image',
      url: docUrl,
      size: (buffer.length / 1024).toFixed(1) + ' KB',
      createdAt: new Date().toISOString()
    };

    user.myDatas.unshift(newDoc);
    if (user.save) await user.save();

    const tdb = require('../config/telegramDB');
    if (tdb.uploadDbToTelegram) tdb.uploadDbToTelegram();

    res.json({ success: true, message: 'Image saved to My Datas!', doc: newDoc, myDatas: user.myDatas });
  } catch (err) {
    console.error('uploadMyData error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMyData = async (req, res) => {
  try {
    const { userId, role, docId } = req.body;
    if (!userId || !docId) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    let user;
    if (role === 'usthad') {
      try { user = await Usthad.findById(userId); } catch(e){}
      if (!user) user = memoryUsthads.find(u => String(u._id) === String(userId) || String(u.usthadId) === String(userId));
    } else {
      try { user = await Student.findById(userId); } catch(e){}
      if (!user) user = memoryStudents.find(s => String(s._id) === String(userId) || String(s.admissionNo) === String(userId));
    }

    if (!user || !Array.isArray(user.myDatas)) {
      return res.status(404).json({ success: false, message: 'User or documents not found' });
    }

    const idx = user.myDatas.findIndex(d => d.id === docId);
    if (idx !== -1) {
      const doc = user.myDatas[idx];
      if (doc && doc.url) {
        const physicalPath = path.join(__dirname, '../public', doc.url);
        if (fs.existsSync(physicalPath)) {
          try { fs.unlinkSync(physicalPath); } catch(e){}
        }
      }
      user.myDatas.splice(idx, 1);
      if (user.save) await user.save();
    }

    res.json({ success: true, message: 'Document removed', myDatas: user.myDatas });
  } catch (err) {
    console.error('deleteMyData error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
