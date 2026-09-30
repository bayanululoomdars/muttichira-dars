const fs = require('fs');
require('dotenv').config();
const tdb = require('./config/telegramDB');

async function doIt() {
  const raw = fs.readFileSync('raw_users.txt', 'utf8').split('\n');

  const db = {
    Student: [],
    Usthad: []
  };

  let section = 0; // 0=none, 1=student, 2=alumni, 3=usthad

  for (const line of raw) {
    const t = line.trim();
    if (!t) continue;
    if (t.includes('No:,Name,Role,ID,Batch No:,Place,Phone No:,Password')) {
      section = 1; continue;
    }
    if (t.includes('No:,Name,Role,id,Batch No:,Place,Phone No:,Password')) {
      section = 2; continue;
    }
    if (t.includes('No:,Name,Role,Place,Phone No:,Password')) {
      section = 3; continue;
    }

    const parts = t.split(',');
    if (section === 1) {
      if (parts.length < 8) continue;
      db.Student.push({
        _id: 'std_' + parts[3].trim(),
        admissionNo: parts[3].trim(),
        name: parts[1].trim(),
        role: 'student',
        batchNumber: parts[4].trim(),
        place: parts[5].trim(),
        phone: parts[6].trim(),
        password: parts[7].trim(),
        isAlumni: false,
        status: 'Current Student',
        photoUrl: 'img/new_logo.png',
        fatherName: ''
      });
    } else if (section === 2) {
      if (parts.length < 8) continue;
      db.Student.push({
        _id: 'alumni_' + parts[3].trim(),
        admissionNo: 'A' + parts[3].trim(),
        name: parts[1].trim(),
        role: 'student',
        batchNumber: parts[4].trim(),
        place: parts[5].trim(),
        phone: parts[6].trim(),
        password: parts[7].trim(),
        isAlumni: true,
        status: 'Biruthadhari / Alumni',
        photoUrl: 'img/new_logo.png',
        fatherName: ''
      });
    } else if (section === 3) {
      if (parts.length < 6) continue;
      let uId = parts[0].trim();
      if (uId === '8' && parts[1].includes('Shafeeq')) uId = '9'; // Fix duplicate 8
      db.Usthad.push({
        _id: 'ust_' + uId,
        usthadId: 'UST' + uId,
        name: parts[1].trim(),
        role: 'usthad',
        designation: parts[2].trim(),
        place: parts[3].trim(),
        phone: parts[4].trim(),
        password: parts[5].trim(),
        photoUrl: 'img/new_logo.png',
        subject: 'All Subjects'
      });
    }
  }

  console.log('Parsed Students:', db.Student.length);
  console.log('Parsed Usthads:', db.Usthad.length);

  const localDb = JSON.parse(fs.readFileSync('local_db.json', 'utf8'));
  localDb.Student = db.Student;
  localDb.Usthad = db.Usthad;
  fs.writeFileSync('local_db.json', JSON.stringify(localDb, null, 2));

  // Now load it into memory using tdb (since telegram fetch is disabled, it only reads local_db.json)
  await tdb.loadDbFromTelegram();
  console.log('Memory loaded');
  await tdb.uploadDbToTelegram();
  console.log('Uploaded 162 users to Telegram!');
}
doIt();
