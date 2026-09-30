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

let db = JSON.parse(fs.readFileSync('local_db.json', 'utf8'));

db.Usthad = realUsthads.map((name, i) => {
  const phone = '900000000' + (i + 1);
  return {
    _id: 'mem_u' + (i + 1),
    usthadId: 'UST' + (100 + i + 1),
    name: name,
    phone: (i === 0) ? '9526919218' : phone,
    password: (i === 0) ? '9526919218' : phone,
    role: 'usthad',
    designation: (i === 0) ? 'Head Mudarris / Principal' : 'Faculty',
    subject: 'All Subjects',
    photoUrl: 'img/new_logo.png',
    place: 'Muttichira',
    bio: ''
  };
});

fs.writeFileSync('local_db.json', JSON.stringify(db, null, 2));
console.log('Updated local_db.json with real Usthads');
