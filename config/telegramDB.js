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
  // 301 - 322
  { _id: 'std_301', admissionNo: '301', name: 'Sinan vp', phone: '301', password: '301', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_302', admissionNo: '302', name: 'Syd mushab', phone: '302', password: '302', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_303', admissionNo: '303', name: 'Muheenudheen', phone: '303', password: '303', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_304', admissionNo: '304', name: 'Ajmal nasim', phone: '304', password: '304', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_305', admissionNo: '305', name: 'Rasheq', phone: '305', password: '305', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_306', admissionNo: '306', name: 'Rashid p', phone: '306', password: '306', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_307', admissionNo: '307', name: 'Irshad vp', phone: '307', password: '307', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_308', admissionNo: '308', name: 'Muhsin pv', phone: '308', password: '308', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_309', admissionNo: '309', name: 'Swalahudheen ayyoobi', phone: '309', password: '309', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_310', admissionNo: '310', name: 'Anshif', phone: '310', password: '310', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_311', admissionNo: '311', name: 'Naveed', phone: '311', password: '311', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_312', admissionNo: '312', name: 'Yaseen', phone: '312', password: '312', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_313', admissionNo: '313', name: 'Salim', phone: '313', password: '313', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_314', admissionNo: '314', name: 'Hashir', phone: '314', password: '314', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_315', admissionNo: '315', name: 'Abdu rhman', phone: '315', password: '315', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_316', admissionNo: '316', name: 'Salman N', phone: '316', password: '316', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 3rd Year', place: 'Muttichira' },
  { _id: 'std_317', admissionNo: '317', name: 'Ibrahim', phone: '317', password: '317', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_318', admissionNo: '318', name: 'Rizvan', phone: '318', password: '318', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_319', admissionNo: '319', name: 'Fahad', phone: '319', password: '319', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_320', admissionNo: '320', name: 'Ameen', phone: '320', password: '320', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_321', admissionNo: '321', name: 'Abdulla umar', phone: '321', password: '321', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_322', admissionNo: '322', name: 'Aadil', phone: '322', password: '322', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },

  // 101 - 122
  { _id: 'std_101', admissionNo: '101', name: 'ഉനൈസ്', phone: '101', password: '101', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_102', admissionNo: '102', name: 'മുക്താർ', phone: '102', password: '102', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_103', admissionNo: '103', name: 'ഷാഹിൻ അലി', phone: '103', password: '103', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_104', admissionNo: '104', name: 'അഷറഫ്', phone: '104', password: '104', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_105', admissionNo: '105', name: 'സദീദ്', phone: '105', password: '105', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_106', admissionNo: '106', name: 'ആദിൽ', phone: '106', password: '106', role: 'student', isAlumni: false, status: 'Senior', batchYear: '2025', className: 'Dars Senior', place: 'Muttichira' },
  { _id: 'std_107', admissionNo: '107', name: 'ഷുഹൈബ്', phone: '107', password: '107', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_108', admissionNo: '108', name: 'ഫർഹാൻ ch', phone: '108', password: '108', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_109', admissionNo: '109', name: 'ഫർഹാൻ pk', phone: '109', password: '109', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_110', admissionNo: '110', name: 'ഷബീബ് m', phone: '110', password: '110', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_111', admissionNo: '111', name: 'അ : ബാസിത്ത്', phone: '111', password: '111', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_112', admissionNo: '112', name: 'സുഹൈൽ', phone: '112', password: '112', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_113', admissionNo: '113', name: 'സഹദ്', phone: '113', password: '113', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_114', admissionNo: '114', name: 'അഹ്നഫ്', phone: '114', password: '114', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_115', admissionNo: '115', name: 'അൽ ആമീൻ', phone: '115', password: '115', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_116', admissionNo: '116', name: 'മിദ്ലാജ് k', phone: '116', password: '116', role: 'student', isAlumni: false, status: 'Junior', batchYear: '2025', className: 'Dars Junior', place: 'Muttichira' },
  { _id: 'std_117', admissionNo: '117', name: 'തഹസീൻ', phone: '117', password: '117', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_118', admissionNo: '118', name: 'അ : സഈദ്', phone: '118', password: '118', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_119', admissionNo: '119', name: 'റാസി', phone: '119', password: '119', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_120', admissionNo: '120', name: 'മഹമൂദ്', phone: '120', password: '120', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_121', admissionNo: '121', name: 'ശഫാസ്', phone: '121', password: '121', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },
  { _id: 'std_122', admissionNo: '122', name: 'റഹ്മാൻ', phone: '122', password: '122', role: 'student', isAlumni: false, status: 'Sub Junior', batchYear: '2025', className: 'Dars Sub Junior', place: 'Muttichira' },

  // 201 - 222
  { _id: 'std_201', admissionNo: '201', name: 'Adnan', phone: '201', password: '201', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_202', admissionNo: '202', name: 'Rasmil', phone: '202', password: '202', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_203', admissionNo: '203', name: 'Basith', phone: '203', password: '203', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_204', admissionNo: '204', name: 'Marvan', phone: '204', password: '204', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_205', admissionNo: '205', name: 'Amjad', phone: '205', password: '205', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_206', admissionNo: '206', name: 'Nihad', phone: '206', password: '206', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_207', admissionNo: '207', name: 'Muheenudheen km', phone: '207', password: '207', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_209', admissionNo: '209', name: 'Hisham', phone: '209', password: '209', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_210', admissionNo: '210', name: 'Jamshiyas', phone: '210', password: '210', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_211', admissionNo: '211', name: 'Shamveel', phone: '211', password: '211', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_212', admissionNo: '212', name: 'Muhaimin', phone: '212', password: '212', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_213', admissionNo: '213', name: 'Mishal', phone: '213', password: '213', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_214', admissionNo: '214', name: 'Fayas', phone: '214', password: '214', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_215', admissionNo: '215', name: 'Swalih', phone: '215', password: '215', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_216', admissionNo: '216', name: 'Shibili .p.', phone: '216', password: '216', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_217', admissionNo: '217', name: 'Sahad . N', phone: '217', password: '217', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_218', admissionNo: '218', name: 'Ishan . Pn', phone: '218', password: '218', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_219', admissionNo: '219', name: 'Muhammadali', phone: '219', password: '219', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_220', admissionNo: '220', name: 'Yaseen', phone: '220', password: '220', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_221', admissionNo: '221', name: 'Shaheem', phone: '221', password: '221', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },
  { _id: 'std_222', admissionNo: '222', name: 'Abdul hadi', phone: '222', password: '222', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 2nd Year', place: 'Muttichira' },

  // 401 - 422
  { _id: 'std_401', admissionNo: '401', name: 'Rishad MP', phone: '401', password: '401', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_402', admissionNo: '402', name: 'Junaid', phone: '402', password: '402', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_403', admissionNo: '403', name: 'Nashan', phone: '403', password: '403', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_404', admissionNo: '404', name: 'sayyid Dilshan', phone: '404', password: '404', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_405', admissionNo: '405', name: 'Jamal', phone: '405', password: '405', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_406', admissionNo: '406', name: 'Sayyid Shafeeh', phone: '406', password: '406', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_407', admissionNo: '407', name: 'Shabeeb', phone: '407', password: '407', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_408', admissionNo: '408', name: 'Bishr', phone: '408', password: '408', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_409', admissionNo: '409', name: 'Ajsal', phone: '409', password: '409', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_410', admissionNo: '410', name: 'Sinan kk', phone: '410', password: '410', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_411', admissionNo: '411', name: 'Nishan', phone: '411', password: '411', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_412', admissionNo: '412', name: 'Sadiq ali', phone: '412', password: '412', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_413', admissionNo: '413', name: 'Rabeeh', phone: '413', password: '413', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_414', admissionNo: '414', name: 'Arshad', phone: '414', password: '414', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_415', admissionNo: '415', name: 'Uvais', phone: '415', password: '415', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_416', admissionNo: '416', name: 'Shadin', phone: '416', password: '416', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_417', admissionNo: '417', name: 'Fasmil', phone: '417', password: '417', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_418', admissionNo: '418', name: 'Muhyidheen ct', phone: '418', password: '418', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_419', admissionNo: '419', name: 'Shahid', phone: '419', password: '419', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_420', admissionNo: '420', name: 'Arshad', phone: '420', password: '420', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_421', admissionNo: '421', name: 'Saeed K', phone: '421', password: '421', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' },
  { _id: 'std_422', admissionNo: '422', name: 'Anas', phone: '422', password: '422', role: 'student', isAlumni: false, status: 'Current Student', batchYear: '2025', className: 'Dars 4th Year', place: 'Muttichira' }
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
