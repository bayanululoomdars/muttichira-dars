const mongoose = require('mongoose');
require('dotenv').config();

const realUsthads = [
  "Sheikhuna Ibrahim Baqavi",
  "Usthad Mansoor Faizy",
  "Usthad Musthafa Baqavi",
  "Usthad Jahfar Jalali",
  "Usthad Abdulla Faizy",
  "Usthad Shameem Jalali",
  "Usthad Rashid Baqavi",
  "Usthad Shan Baqavi",
  "Usthad Shafeeq Jalali"
];

const usthadData = realUsthads.map((name, i) => {
  const phone = '900000000' + (i + 1);
  return {
    usthadId: 'UST' + (100 + i + 1),
    name: name,
    phone: (i === 0) ? '9526919218' : phone,
    password: (i === 0) ? '9526919218' : phone,
    role: 'usthad',
    designation: (i === 0) ? 'Head Mudarris / Principal' : 'Assistant Mudarris',
    subject: 'All Subjects',
    photoUrl: 'img/new_logo.png',
    place: 'Muttichira',
    bio: ''
  };
});

// Update local_db.json
const fs = require('fs');
let localDb = JSON.parse(fs.readFileSync('local_db.json', 'utf8'));
localDb.Usthad = usthadData.map((u, i) => ({_id: 'mem_u' + (i + 1), ...u}));
fs.writeFileSync('local_db.json', JSON.stringify(localDb, null, 2));

console.log('Updated local_db.json');
