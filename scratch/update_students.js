const fs = require('fs');
const path = require('path');

const newStudentNames = [
  "Rasheeq", "Faseeh", "Shameem P", "Nufaih", "Shameem Ck", "Shaduli Mp",
  "Sayyid Mushab", "Qamaruzzaman", "Muheenudheen MP", "Sayyid Mushab", "Ajmal Nasim", "Shahir",
  "Shammaas", "Irshad", "Muhsin Pv", "Swalahudheen Ayyoobi", "Anshif", "Naveed",
  "Yaseen Ok", "Salim", "Hashir", "Salman N", "Ibrahim", "Jamilshah",
  "Rizvan", "Fahad", "Ameen", "Abdulla Umar", "Muhammed Aadil", "Sinan Kt",
  "Rishad Mp", "Midhlaj K", "Sahlan", "Aftash", "Muhyidheen Mc", "Sinan VP",
  "Junaid", "Shahin Ali", "Sayyid Dilshan", "Rasheeq", "Rashid T", "Shabeeb P",
  "Arshad", "Rabeeh", "Sinan KK", "Bishr", "Ajsal", "Nishan",
  "Sadiq Ali", "Uvais", "Shahid", "Saeed K", "Arshaq", "Anas",
  "Muhyidheen CT", "Shadin", "Fasmil", "Nihal", "Sinan U", "Mahmood",
  "Aslam", "Danish Mahmood", "Umar Mukhtar", "Unais", "Rasmil", "Abdul Basith",
  "Jamal", "Sadeed", "Nihad", "Shuhaib", "Farhan CH", "Farhan PK",
  "Shabeeb M", "Abdul Basith NK", "Midhlaj", "Ahnaf", "Suhail", "Sahad P",
  "Al Ameen", "Tahseen", "Abdulla Saeed", "Razi", "Mahmood", "Nisham",
  "Midhlaj CP", "Adnan", "Uvais PC", "Shahin Mirshad", "Sayyid Zainul Abid", "Marvan",
  "Amjad", "Ashraf", "Nashan", "Rashid P", "Sayyid Shafeeh", "Aadil",
  "Muheenudheen KM", "Rishad P", "Hisham", "Jamshiyas", "Shamveel", "Abdul Muhaimin",
  "Mishal", "Fayas", "Swalih", "Shibili", "Sahad", "Ishan",
  "Muhammed Ali", "Yaseen", "Shaheem"
];

console.log('Total students count:', newStudentNames.length);

const updatedStudents = newStudentNames.map((name, index) => {
  const rollNo = String(101 + index); // 101 to 211
  let className = 'Dars 3rd Year';
  if (index >= 20 && index < 40) className = 'Dars 2nd Year';
  else if (index >= 40 && index < 60) className = 'Dars 1st Year';
  else if (index >= 60 && index < 75) className = 'Dars Senior';
  else if (index >= 75 && index < 90) className = 'Dars Junior';
  else if (index >= 90) className = 'Dars Sub Junior';

  return {
    _id: 'std_' + rollNo,
    admissionNo: rollNo,
    name: name,
    phone: rollNo,
    password: rollNo,
    role: 'student',
    isAlumni: false,
    status: 'Current Student',
    batchYear: '2025',
    className: className,
    place: 'Muttichira'
  };
});

// 1. Update local_db.json
const localDbPath = path.join(__dirname, '../local_db.json');
if (fs.existsSync(localDbPath)) {
  const localDb = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
  localDb.Student = updatedStudents;
  fs.writeFileSync(localDbPath, JSON.stringify(localDb, null, 2), 'utf8');
  console.log('✅ Updated local_db.json with 111 students');
}

// 2. Update config/telegramDB.js defaultStudents array
const telegramDbPath = path.join(__dirname, '../config/telegramDB.js');
let telegramDbContent = fs.readFileSync(telegramDbPath, 'utf8');

const defaultStudentsJs = 'const defaultStudents = ' + JSON.stringify(updatedStudents, null, 2) + ';';
telegramDbContent = telegramDbContent.replace(/const defaultStudents = \[\s*[\s\S]*?\n\];/m, defaultStudentsJs);
fs.writeFileSync(telegramDbPath, telegramDbContent, 'utf8');
console.log('✅ Updated config/telegramDB.js defaultStudents');

// 3. Update controllers/portalController.js memoryStudents array
const portalControllerPath = path.join(__dirname, '../controllers/portalController.js');
let portalContent = fs.readFileSync(portalControllerPath, 'utf8');

const memoryStudentsJs = 'const memoryStudents = ' + JSON.stringify(updatedStudents, null, 2) + ';';
portalContent = portalContent.replace(/const memoryStudents = \[\s*[\s\S]*?\n\];/m, memoryStudentsJs);
fs.writeFileSync(portalControllerPath, portalContent, 'utf8');
console.log('✅ Updated controllers/portalController.js memoryStudents');

console.log('🎉 Done updating student roster!');
