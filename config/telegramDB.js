const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// Disable TLS check for Telegram API in custom networks
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const chatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

let dbState = {
  Admission: [],
  Contact: [],
  Exam: [],
  ExamResult: [],
  GalleryItem: [],
  HomeSettings: [],
  News: [],
  PortalMessage: [],
  SectionContent: [],
  Settings: [],
  Slider: [],
  Story: [],
  Student: [],
  Subscriber: [],
  User: [],
  Usthad: []
};

// We will fetch from Telegram on startup
let isInitialized = false;
const LOCAL_DB_PATH = path.join(__dirname, '../local_db.json');

const defaultStudents = [
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

const defaultUsthads = [
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

function saveLocalDb() {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local_db.json:', err.message);
  }
}

// Helpers to sync to/from Telegram
async function uploadDbToTelegram() {
  saveLocalDb();
  if (!token || !chatId) return;
  try {
    const buf = Buffer.from(JSON.stringify(dbState, null, 2));
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('disable_notification', 'true');
    const blob = new Blob([buf], { type: 'application/json' });
    formData.append('document', blob, 'db.json');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.ok) {
      const msgId = data.result.message_id;
      await fetch(`https://api.telegram.org/bot${token}/pinChatMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, message_id: msgId })
      });
      console.log('✅ DB State backed up to Telegram (Pinned Msg ID:', msgId, ')');
    }
  } catch (err) {
    console.error('Failed to backup DB to Telegram:', err.message);
  }
}

// Debounced save
let saveTimeout = null;
function scheduleSave() {
  saveLocalDb();
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    uploadDbToTelegram();
  }, 5000); // Wait 5 seconds after last write before uploading
}

async function loadDbFromTelegram() {
  // 1. Try reading local_db.json first
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const localContent = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      const localJson = JSON.parse(localContent);
      dbState = { ...dbState, ...localJson };
      console.log('✅ Loaded state from local_db.json');
    } catch (e) {
      console.error('Failed to parse local_db.json:', e.message);
    }
  }

  // 2. Try fetching latest from Telegram if token available
  if (token && chatId) {
    try {
      console.log('Fetching latest DB from Telegram...');
      const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
      const chatData = await chatRes.json();
      
      const pinnedMsg = chatData.result?.pinned_message;
      if (pinnedMsg && pinnedMsg.document) {
        const fileId = pinnedMsg.document.file_id;
        const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();
        if (fileData.ok) {
          const filePath = fileData.result.file_path;
          const dlRes = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
          const dbJson = await dlRes.json();
          dbState = { ...dbState, ...dbJson };
          console.log('✅ DB State loaded from Telegram.');
        }
      }
    } catch (err) {
      console.error('Failed to load DB from Telegram:', err.message);
    }
  }

  // 3. Auto-seed defaults if collections are empty
  let needsSave = false;
  if (!dbState.Student || dbState.Student.length === 0) {
    dbState.Student = [...defaultStudents];
    needsSave = true;
  }
  if (!dbState.Usthad || dbState.Usthad.length === 0) {
    dbState.Usthad = [...defaultUsthads];
    needsSave = true;
  }
  if (!dbState.HomeSettings || dbState.HomeSettings.length === 0) {
    dbState.HomeSettings = [{
      _id: 'default_home',
      principalName: 'Sheikhuna Ibrahim Baqavi Al Haithami',
      statsStudents: 87,
      statsUstads: 8,
      statsYears: 50,
      statsAlumni: 50
    }];
    needsSave = true;
  }

  if (needsSave) {
    saveLocalDb();
  }
}

// Mock Mongoose Query Object
class MockQuery {
  constructor(data) {
    this.data = data;
  }
  sort(sortObj) {
    if (!this.data || !Array.isArray(this.data)) return this;
    const key = Object.keys(sortObj)[0];
    const dir = sortObj[key] === -1 || sortObj[key] === 'desc' ? -1 : 1;
    this.data.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
    return this;
  }
  populate(field) {
    // Basic mock for populate
    return this; 
  }
  async then(resolve, reject) {
    try {
      resolve(this.data);
    } catch(e) {
      reject(e);
    }
  }
}

// Mongoose Mock Model Factory
function createMockModel(modelName) {
  return class MockModel {
    constructor(data) {
      Object.assign(this, data);
      if (!this._id) this._id = crypto.randomBytes(12).toString('hex');
      if (!this.createdAt) this.createdAt = new Date();
    }

    async save() {
      const collection = dbState[modelName];
      const index = collection.findIndex(item => item._id === this._id);
      if (index !== -1) {
        collection[index] = { ...this };
      } else {
        collection.push({ ...this });
      }
      scheduleSave();
      return this;
    }

    static find(query = {}) {
      let result = dbState[modelName].filter(item => {
        for (let key in query) {
          if (key === '$or') {
            const orQuery = query[key];
            const match = orQuery.some(q => {
              const k = Object.keys(q)[0];
              return item[k] === q[k];
            });
            if (!match) return false;
            continue;
          }
          if (key === '$in') continue; // Skip complex $in filters for mock
          if (typeof query[key] === 'object' && query[key] !== null) {
            if (query[key].$gt) {
              if (!(new Date(item[key]) > new Date(query[key].$gt))) return false;
            }
          }
          else if (item[key] !== query[key]) return false;
        }
        return true;
      });
      // Deep copy to prevent reference mutation
      result = JSON.parse(JSON.stringify(result));
      result.forEach(doc => {
        doc.save = async function() {
          const idx = dbState[modelName].findIndex(x => x._id === this._id);
          if (idx !== -1) dbState[modelName][idx] = { ...this };
          scheduleSave();
          return this;
        };
      });
      return new MockQuery(result);
    }

    static findOne(query = {}) {
      const result = this.find(query).data;
      if (result && result.length > 0) return new MockQuery(result[0]);
      return new MockQuery(null);
    }

    static findById(id) {
      const item = dbState[modelName].find(x => x._id === id);
      if (item) {
        const copy = JSON.parse(JSON.stringify(item));
        copy.save = async function() {
          const idx = dbState[modelName].findIndex(x => x._id === this._id);
          if (idx !== -1) dbState[modelName][idx] = { ...this };
          scheduleSave();
          return this;
        };
        return new MockQuery(copy);
      }
      return new MockQuery(null);
    }

    static async findByIdAndDelete(id) {
      const index = dbState[modelName].findIndex(x => x._id === id);
      if (index !== -1) {
        const doc = dbState[modelName].splice(index, 1)[0];
        scheduleSave();
        return doc;
      }
      return null;
    }

    static async findOneAndUpdate(query, update, options = {}) {
      let doc = this.findOne(query).data;
      if (doc) {
        const index = dbState[modelName].findIndex(x => x._id === doc._id);
        if (index !== -1) {
          dbState[modelName][index] = { ...dbState[modelName][index], ...update };
          scheduleSave();
          return dbState[modelName][index];
        }
      } else if (options.upsert) {
        const newDoc = new this({ ...query, ...update });
        await newDoc.save();
        return newDoc;
      }
      return null;
    }

    static async countDocuments(query = {}) {
      return this.find(query).data.length;
    }
  };
}

module.exports = {
  loadDbFromTelegram,
  Admission: createMockModel('Admission'),
  Contact: createMockModel('Contact'),
  Exam: createMockModel('Exam'),
  ExamResult: createMockModel('ExamResult'),
  GalleryItem: createMockModel('GalleryItem'),
  HomeSettings: createMockModel('HomeSettings'),
  News: createMockModel('News'),
  PortalMessage: createMockModel('PortalMessage'),
  SectionContent: createMockModel('SectionContent'),
  Settings: createMockModel('Settings'),
  Slider: createMockModel('Slider'),
  Story: createMockModel('Story'),
  Student: createMockModel('Student'),
  Subscriber: createMockModel('Subscriber'),
  User: createMockModel('User'),
  Usthad: createMockModel('Usthad')
};
