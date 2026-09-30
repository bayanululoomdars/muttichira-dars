const fs = require('fs');

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
let localDb = JSON.parse(fs.readFileSync('local_db.json', 'utf8'));
localDb.Usthad = usthadData.map((u, i) => ({_id: 'mem_u' + (i + 1), ...u}));
fs.writeFileSync('local_db.json', JSON.stringify(localDb, null, 2));

let js = fs.readFileSync('config/telegramDB.js', 'utf8');
const regex = /const defaultUsthads = \[\s\S]*?\];/;
js = js.replace(regex, 'const defaultUsthads = ' + JSON.stringify(localDb.Usthad, null, 2) + ';');
fs.writeFileSync('config/telegramDB.js', js);

console.log('Updated local_db.json and telegramDB.js');
