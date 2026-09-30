const Student = require('../models/Student');
const Usthad = require('../models/Usthad');
const PortalMessage = require('../models/PortalMessage');
const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');

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
const memoryStudents = [
  { _id: 'std_101', admissionNo: '101', name: 'Rasheeq', phone: '101', password: '101', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_102', admissionNo: '102', name: 'Faseeh', phone: '102', password: '102', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_103', admissionNo: '103', name: 'Shameem P', phone: '103', password: '103', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_104', admissionNo: '104', name: 'Nufaih', phone: '104', password: '104', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_105', admissionNo: '105', name: 'Shameem Ck', phone: '105', password: '105', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_106', admissionNo: '106', name: 'Shaduli Mp', phone: '106', password: '106', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_107', admissionNo: '107', name: 'Sayyid Mushab', phone: '107', password: '107', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_108', admissionNo: '108', name: 'Qamaruzzaman', phone: '108', password: '108', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_109', admissionNo: '109', name: 'Muheenudheen MP', phone: '109', password: '109', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_110', admissionNo: '110', name: 'Sayyid Mushab', phone: '110', password: '110', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_111', admissionNo: '111', name: 'Ajmal Nasim', phone: '111', password: '111', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_112', admissionNo: '112', name: 'Shahir', phone: '112', password: '112', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_113', admissionNo: '113', name: 'Shammaas', phone: '113', password: '113', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_114', admissionNo: '114', name: 'Irshad', phone: '114', password: '114', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_115', admissionNo: '115', name: 'Muhsin Pv', phone: '115', password: '115', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_116', admissionNo: '116', name: 'Swalahudheen Ayyoobi', phone: '116', password: '116', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_117', admissionNo: '117', name: 'Anshif', phone: '117', password: '117', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_118', admissionNo: '118', name: 'Naveed', phone: '118', password: '118', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_119', admissionNo: '119', name: 'Yaseen Ok', phone: '119', password: '119', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_120', admissionNo: '120', name: 'Salim', phone: '120', password: '120', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_121', admissionNo: '121', name: 'Hashir', phone: '121', password: '121', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_122', admissionNo: '122', name: 'Salman N', phone: '122', password: '122', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_123', admissionNo: '123', name: 'Ibrahim', phone: '123', password: '123', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_124', admissionNo: '124', name: 'Jamilshah', phone: '124', password: '124', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_125', admissionNo: '125', name: 'Rizvan', phone: '125', password: '125', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_126', admissionNo: '126', name: 'Fahad', phone: '126', password: '126', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_127', admissionNo: '127', name: 'Ameen', phone: '127', password: '127', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_128', admissionNo: '128', name: 'Abdulla Umar', phone: '128', password: '128', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_129', admissionNo: '129', name: 'Muhammed Aadil', phone: '129', password: '129', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_130', admissionNo: '130', name: 'Sinan Kt', phone: '130', password: '130', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_131', admissionNo: '131', name: 'Rishad Mp', phone: '131', password: '131', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_132', admissionNo: '132', name: 'Midhlaj K', phone: '132', password: '132', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_133', admissionNo: '133', name: 'Sahlan', phone: '133', password: '133', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_134', admissionNo: '134', name: 'Aftash', phone: '134', password: '134', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_135', admissionNo: '135', name: 'Muhyidheen Mc', phone: '135', password: '135', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_136', admissionNo: '136', name: 'Sinan VP', phone: '136', password: '136', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_137', admissionNo: '137', name: 'Junaid', phone: '137', password: '137', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_138', admissionNo: '138', name: 'Shahin Ali', phone: '138', password: '138', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_139', admissionNo: '139', name: 'Sayyid Dilshan', phone: '139', password: '139', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_140', admissionNo: '140', name: 'Rasheeq', phone: '140', password: '140', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_141', admissionNo: '141', name: 'Rashid T', phone: '141', password: '141', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_142', admissionNo: '142', name: 'Shabeeb P', phone: '142', password: '142', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_143', admissionNo: '143', name: 'Arshad', phone: '143', password: '143', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_144', admissionNo: '144', name: 'Rabeeh', phone: '144', password: '144', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_145', admissionNo: '145', name: 'Sinan KK', phone: '145', password: '145', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_146', admissionNo: '146', name: 'Bishr', phone: '146', password: '146', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_147', admissionNo: '147', name: 'Ajsal', phone: '147', password: '147', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_148', admissionNo: '148', name: 'Nishan', phone: '148', password: '148', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_149', admissionNo: '149', name: 'Sadiq Ali', phone: '149', password: '149', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_150', admissionNo: '150', name: 'Uvais', phone: '150', password: '150', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_151', admissionNo: '151', name: 'Shahid', phone: '151', password: '151', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_152', admissionNo: '152', name: 'Saeed K', phone: '152', password: '152', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_153', admissionNo: '153', name: 'Arshaq', phone: '153', password: '153', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_154', admissionNo: '154', name: 'Anas', phone: '154', password: '154', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_155', admissionNo: '155', name: 'Muhyidheen CT', phone: '155', password: '155', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_156', admissionNo: '156', name: 'Shadin', phone: '156', password: '156', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_157', admissionNo: '157', name: 'Fasmil', phone: '157', password: '157', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_158', admissionNo: '158', name: 'Nihal', phone: '158', password: '158', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_159', admissionNo: '159', name: 'Sinan U', phone: '159', password: '159', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_160', admissionNo: '160', name: 'Mahmood', phone: '160', password: '160', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 1st Year', place: 'Muttichira' },
  { _id: 'std_161', admissionNo: '161', name: 'Aslam', phone: '161', password: '161', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_162', admissionNo: '162', name: 'Danish Mahmood', phone: '162', password: '162', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_163', admissionNo: '163', name: 'Umar Mukhtar', phone: '163', password: '163', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_164', admissionNo: '164', name: 'Unais', phone: '164', password: '164', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_165', admissionNo: '165', name: 'Rasmil', phone: '165', password: '165', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_166', admissionNo: '166', name: 'Abdul Basith', phone: '166', password: '166', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_167', admissionNo: '167', name: 'Jamal', phone: '167', password: '167', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_168', admissionNo: '168', name: 'Sadeed', phone: '168', password: '168', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_169', admissionNo: '169', name: 'Nihad', phone: '169', password: '169', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_170', admissionNo: '170', name: 'Shuhaib', phone: '170', password: '170', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_171', admissionNo: '171', name: 'Farhan CH', phone: '171', password: '171', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_172', admissionNo: '172', name: 'Farhan PK', phone: '172', password: '172', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_173', admissionNo: '173', name: 'Shabeeb M', phone: '173', password: '173', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_174', admissionNo: '174', name: 'Abdul Basith NK', phone: '174', password: '174', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_175', admissionNo: '175', name: 'Midhlaj', phone: '175', password: '175', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_176', admissionNo: '176', name: 'Ahnaf', phone: '176', password: '176', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_177', admissionNo: '177', name: 'Suhail', phone: '177', password: '177', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_178', admissionNo: '178', name: 'Sahad P', phone: '178', password: '178', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_179', admissionNo: '179', name: 'Al Ameen', phone: '179', password: '179', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_180', admissionNo: '180', name: 'Tahseen', phone: '180', password: '180', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_181', admissionNo: '181', name: 'Abdulla Saeed', phone: '181', password: '181', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_182', admissionNo: '182', name: 'Razi', phone: '182', password: '182', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_183', admissionNo: '183', name: 'Mahmood', phone: '183', password: '183', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_184', admissionNo: '184', name: 'Nisham', phone: '184', password: '184', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_185', admissionNo: '185', name: 'Midhlaj CP', phone: '185', password: '185', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_186', admissionNo: '186', name: 'Adnan', phone: '186', password: '186', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_187', admissionNo: '187', name: 'Uvais PC', phone: '187', password: '187', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_188', admissionNo: '188', name: 'Shahin Mirshad', phone: '188', password: '188', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_189', admissionNo: '189', name: 'Sayyid Zainul Abid', phone: '189', password: '189', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_190', admissionNo: '190', name: 'Marvan', phone: '190', password: '190', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_191', admissionNo: '191', name: 'Amjad', phone: '191', password: '191', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_192', admissionNo: '192', name: 'Ashraf', phone: '192', password: '192', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_193', admissionNo: '193', name: 'Nashan', phone: '193', password: '193', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_194', admissionNo: '194', name: 'Rashid P', phone: '194', password: '194', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_195', admissionNo: '195', name: 'Sayyid Shafeeh', phone: '195', password: '195', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_196', admissionNo: '196', name: 'Aadil', phone: '196', password: '196', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_197', admissionNo: '197', name: 'Muheenudheen KM', phone: '197', password: '197', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_198', admissionNo: '198', name: 'Rishad P', phone: '198', password: '198', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_199', admissionNo: '199', name: 'Hisham', phone: '199', password: '199', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_200', admissionNo: '200', name: 'Jamshiyas', phone: '200', password: '200', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_201', admissionNo: '201', name: 'Shamveel', phone: '201', password: '201', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_202', admissionNo: '202', name: 'Abdul Muhaimin', phone: '202', password: '202', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_203', admissionNo: '203', name: 'Mishal', phone: '203', password: '203', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_204', admissionNo: '204', name: 'Fayas', phone: '204', password: '204', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_205', admissionNo: '205', name: 'Swalih', phone: '205', password: '205', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_206', admissionNo: '206', name: 'Shibili', phone: '206', password: '206', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_207', admissionNo: '207', name: 'Sahad', phone: '207', password: '207', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_208', admissionNo: '208', name: 'Ishan', phone: '208', password: '208', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_209', admissionNo: '209', name: 'Muhammed Ali', phone: '209', password: '209', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_210', admissionNo: '210', name: 'Yaseen', phone: '210', password: '210', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_211', admissionNo: '211', name: 'Shaheem', phone: '211', password: '211', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' }
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
          place: s.place
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
          place: u.place,
          phone: u.phone
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
        place: usthad.place
      };
      return res.json({ success: true, message: 'Usthad Login successful', user: req.session.portalUser });
    } else {
      // Default to student
      let student = await findStudentByIdentifier(cleanId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student record not found' });
      }
      const validPass = student.password || student.phone || student.admissionNo;
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
        place: student.place,
        guardianName: student.guardianName,
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

// ── 11. Exam & Mark Management Endpoints ──

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

    const subjects = (exam && exam.classSubjects && exam.classSubjects[className]) ? exam.classSubjects[className] : [];

    // Find Students of Class
    let allStudents = [];
    try { allStudents = await Student.find({}); } catch (e) {}
    if (!allStudents || allStudents.length === 0) allStudents = memoryStudents;

    let classStudents = allStudents.filter(s => 
      !s.isAlumni && (className === 'ALL' || (s.batchNumber || s.className || '').toString().toLowerCase() === className.toLowerCase())
    );

    // Find Existing Results for Exam & Class
    let existingResults = [];
    try {
      existingResults = await ExamResult.find({ examId, className });
    } catch (e) {}
    if (!existingResults || existingResults.length === 0) {
      existingResults = memoryExamResults.filter(r => r.examId === examId && r.className === className);
    }

    res.json({
      success: true,
      exam,
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
    const { examId, examName, className, marksData, usthadName } = req.body;
    if (!examId || !className || !Array.isArray(marksData) || marksData.length === 0) {
      return res.status(400).json({ success: false, message: 'Valid Exam, Class, and Student Marks required' });
    }

    // 1. Process each student's total marks, percentage, grade, and attendance
    let processedEntries = marksData.map(item => {
      const subMarks = item.subjectMarks || {}; // { "Fiqh": 90, "Nahw": 75 }
      const subjectsList = item.subjectsConfig || []; // [{ subjectName: "Fiqh", maxMarks: 100 }]

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
        createdAt: new Date()
      };
    });

    // 2. AUTOMATIC CLASS RANK CALCULATION
    // Sort descending by totalMarksObtained
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

    // 3. Save to DB/Memory & Broadcast Notifications to Students
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

      // Send automated notification in Student Dashboard
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

    res.json({
      success: true,
      message: `Exam results & Batch Ranks for ${className} published successfully!`,
      results: processedEntries
    });
  } catch (err) {
    console.error('saveExamClassMarks error:', err);
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
