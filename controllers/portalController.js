const Student = require('../models/Student');
const Usthad = require('../models/Usthad');
const PortalMessage = require('../models/PortalMessage');

// In-Memory Fallback Stores for when DB is offline or for rapid demo
const memoryStudents = [
  {
    _id: 'mem_s1',
    admissionNo: 'ADM101',
    name: 'Muhammad Rashid',
    phone: '9876543210',
    password: '9876543210',
    role: 'student',
    isAlumni: false,
    status: 'Current Student',
    batchYear: '2025',
    className: 'Dars 3rd Year',
    photoUrl: 'https://randomuser.me/api/portraits/boys/11.jpg',
    place: 'Muttichira',
    district: 'Malappuram',
    dob: '2008-03-15',
    guardianName: 'Abdul Kareem',
    bio: 'Dedicated Dars student focusing on Fiqh and Hadith sciences.'
  },
  {
    _id: 'mem_s2',
    admissionNo: 'ADM102',
    name: 'Ibrahim Siddiq',
    phone: '8765432109',
    password: '8765432109',
    role: 'student',
    isAlumni: false,
    status: 'Current Student',
    batchYear: '2025',
    className: 'Dars 2nd Year',
    photoUrl: 'https://randomuser.me/api/portraits/boys/12.jpg',
    place: 'Wandoor',
    district: 'Malappuram',
    dob: '2009-08-22',
    guardianName: 'Noushad Ali',
    bio: 'Student at Bayanul Uloom Dars.'
  },
  {
    _id: 'mem_s3',
    admissionNo: 'ADM103',
    name: 'Yusuf Fahad',
    phone: '7654321098',
    password: '7654321098',
    role: 'student',
    isAlumni: false,
    status: 'Current Student',
    batchYear: '2025',
    className: 'Dars 1st Year',
    photoUrl: 'https://randomuser.me/api/portraits/boys/13.jpg',
    place: 'Perinthalmanna',
    district: 'Malappuram',
    dob: '2010-01-10',
    guardianName: 'Muhammed Shafi',
    bio: '1st year kitabi student.'
  },
  {
    _id: 'mem_s4',
    admissionNo: 'ADM104',
    name: 'Khadim Hussain Al Baqavi',
    phone: '9447123456',
    password: '9447123456',
    role: 'student',
    isAlumni: true,
    status: 'Biruthadhari / Alumni',
    batchYear: '2022',
    className: 'Graduate Batch 2022',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    place: 'Malappuram',
    district: 'Malappuram',
    dob: '2000-05-12',
    guardianName: 'Hussain Musliyar',
    bio: 'Biruthadhari Graduate of Bayanul Uloom Dars. Currently serving as Khatheeb.'
  },
  {
    _id: 'mem_s5',
    admissionNo: 'ADM105',
    name: 'Ahmad Thangal Faizi',
    phone: '9447654321',
    password: '9447654321',
    role: 'student',
    isAlumni: true,
    status: 'Biruthadhari / Alumni',
    batchYear: '2023',
    className: 'Graduate Batch 2023',
    photoUrl: 'https://randomuser.me/api/portraits/men/44.jpg',
    place: 'Calicut',
    district: 'Kozhikode',
    dob: '2001-09-18',
    guardianName: 'Sayyid Thangal',
    bio: 'Bayanul Uloom Dars Alumni. Active in community services.'
  },
  {
    _id: 'mem_s6',
    admissionNo: 'ADM106',
    name: 'Shamsuddin Al Qasimi',
    phone: '9847001122',
    password: '9847001122',
    role: 'student',
    isAlumni: true,
    status: 'Biruthadhari / Alumni',
    batchYear: '2021',
    className: 'Graduate Batch 2021',
    photoUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
    place: 'Kondotty',
    district: 'Malappuram',
    dob: '1999-12-04',
    guardianName: 'Abdu Rahiman',
    bio: 'Senior Biruthadhari Graduate.'
  }
];

const memoryUsthads = [
  {
    _id: 'mem_u1',
    usthadId: 'UST101',
    name: 'Sheikhuna Ibrahim Baqavi',
    phone: '9526919218',
    password: '9526919218',
    role: 'usthad',
    designation: 'Head Mudarris / Principal',
    subject: 'Tafseer & Fiqh',
    photoUrl: 'https://images.unsplash.com/photo-1567604099997-fb7cefb30f1b?w=400&q=80',
    place: 'Muttichira',
    bio: 'Chief Instructor and Head of Bayanul Uloom Dars.'
  },
  {
    _id: 'mem_u2',
    usthadId: 'UST102',
    name: 'Usthad Abdul Rahiman Faizi',
    phone: '9846123456',
    password: '9846123456',
    role: 'usthad',
    designation: 'Senior Usthad',
    subject: 'Hadith & Nahw',
    photoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    place: 'Tirur',
    bio: 'Instructor of Arabic Grammar and Hadith literature.'
  },
  {
    _id: 'mem_u3',
    usthadId: 'UST103',
    name: 'Usthad Muhammed Musthafa Saqafi',
    phone: '9745987654',
    password: '9745987654',
    role: 'usthad',
    designation: 'Hifz & Tajweed Usthad',
    subject: 'Quran Memorization',
    photoUrl: 'https://randomuser.me/api/portraits/men/82.jpg',
    place: 'Manjeri',
    bio: 'Head of Quran Hifz Department.'
  }
];

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
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) {
    try {
      const student = await Student.findOne({
        $or: [{ admissionNo: query }, { phone: query }]
      }).maxTimeMS(2000);
      if (student) return student;
    } catch (e) {
      // DB offline or timeout
    }
  }
  const qUpper = String(query).trim().toUpperCase();
  return memoryStudents.find(s => 
    s.admissionNo.toUpperCase() === qUpper || s.phone === String(query).trim()
  );
}

// Helper: Find Usthad (DB or Memory)
async function findUsthadByIdentifier(query) {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) {
    try {
      const usthad = await Usthad.findOne({
        $or: [{ usthadId: query }, { phone: query }]
      }).maxTimeMS(2000);
      if (usthad) return usthad;
    } catch (e) {
      // DB offline
    }
  }
  const qUpper = String(query).trim().toUpperCase();
  return memoryUsthads.find(u => 
    u.usthadId.toUpperCase() === qUpper || u.phone === String(query).trim()
  );
}

// ── 1. Live Lookup Preview (Name, Admission No, Photo, Role, Class) ──
exports.lookup = async (req, res) => {
  try {
    const q = (req.query.q || req.query.admissionNo || '').trim();
    if (!q) {
      return res.json({ success: false, message: 'Please enter Admission Number or Phone' });
    }

    // Try Student
    let student = await findStudentByIdentifier(q);
    if (student) {
      return res.json({
        success: true,
        type: 'student',
        user: {
          admissionNo: student.admissionNo,
          name: student.name,
          role: 'student',
          className: student.className,
          status: student.status || (student.isAlumni ? 'Biruthadhari / Alumni' : 'Current Student'),
          isAlumni: student.isAlumni,
          batchYear: student.batchYear,
          photoUrl: student.photoUrl || 'img/new_logo.png',
          place: student.place
        }
      });
    }

    // Try Usthad
    let usthad = await findUsthadByIdentifier(q);
    if (usthad) {
      return res.json({
        success: true,
        type: 'usthad',
        user: {
          admissionNo: usthad.usthadId,
          usthadId: usthad.usthadId,
          name: usthad.name,
          role: 'usthad',
          designation: usthad.designation,
          subject: usthad.subject,
          photoUrl: usthad.photoUrl || 'img/new_logo.png',
          place: usthad.place
        }
      });
    }

    return res.json({ success: false, message: 'No Student or Usthad record found with this ID/Phone' });
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
      return res.status(400).json({ success: false, message: 'ID/Phone and Password required' });
    }

    const cleanId = String(identifier).trim();
    const cleanPass = String(password).trim();

    if (role === 'usthad') {
      let usthad = await findUsthadByIdentifier(cleanId);
      if (!usthad) {
        return res.status(404).json({ success: false, message: 'Usthad record not found' });
      }
      if (usthad.password !== cleanPass) {
        return res.status(401).json({ success: false, message: 'Incorrect Password. (Default is Phone Number)' });
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
        place: usthad.place
      };
      return res.json({ success: true, message: 'Usthad Login successful', user: req.session.portalUser });
    } else {
      // Default to student
      let student = await findStudentByIdentifier(cleanId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student record not found' });
      }
      if (student.password !== cleanPass) {
        return res.status(401).json({ success: false, message: 'Incorrect Password. (Default is Phone Number)' });
      }
      req.session.portalUser = {
        role: 'student',
        id: student._id,
        admissionNo: student.admissionNo,
        name: student.name,
        phone: student.phone,
        className: student.className,
        status: student.status,
        isAlumni: student.isAlumni,
        batchYear: student.batchYear,
        photoUrl: student.photoUrl,
        place: student.place,
        guardianName: student.guardianName,
        bio: student.bio
      };
      return res.json({ success: true, message: 'Student Login successful', user: req.session.portalUser });
    }
  } catch (err) {
    console.error('Portal Login error:', err);
    res.status(500).json({ success: false, message: 'Login processing error' });
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

    res.json({
      success: true,
      stats: {
        currentStudents: studentCount || 45,
        alumniBiruthadhari: alumniCount || 120,
        totalUsthads: usthadCount || 12,
        academicCourses: 6
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

exports.addStudentAdmin = async (req, res) => {
  try {
    const { admissionNo, name, phone, password, className, isAlumni, status, batchYear, place, photoUrl, guardianName } = req.body;
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
      batchYear: batchYear || '2025',
      className: className || 'Dars 1st Year',
      photoUrl: photoUrl || '',
      place: place || '',
      guardianName: guardianName || ''
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
    try { student = await Student.findById(id); } catch(e) {}
    const isMemory = !student;
    if (!student) student = memoryStudents.find(s => s._id === id || s.admissionNo === id);
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
    try { usthad = await Usthad.findById(id); } catch(e) {}
    const isMemory = !usthad;
    if (!usthad) usthad = memoryUsthads.find(u => u._id === id || u.usthadId === id);
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
