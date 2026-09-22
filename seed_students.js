require('dotenv').config();
const { Student, HomeSettings, loadDbFromTelegram } = require('./config/telegramDB');

const studentList = [
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

async function seed() {
  await loadDbFromTelegram();
  console.log('Seeding 87 students...');
  for (const sData of studentList) {
    let s = await Student.findOne({ admissionNo: sData.admissionNo });
    if (!s) {
      s = new Student(sData);
      await s.save();
    } else {
      Object.assign(s, sData);
      await s.save();
    }
  }

  // Update HomeSettings student count
  let hs = await HomeSettings.findOne();
  if (hs) {
    hs.statsStudents = 87;
    await hs.save();
  }

  console.log('✅ Successfully seeded 87 students!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
