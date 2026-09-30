const fs = require('fs');

const studentsCSV = \`1,SAYYID ZAINUL ABID ,current student,101,14,MUTTI,1234567890,1234
2,MAHMOOD P,current student,102,14,MUTTI,1234567890,1234
3,NIHAL C,current student,103,14,MUTTI,1234567890,1234
4,DANISH MAHMOOD,current student,104,14,MUTTI,1234567890,1234
5,RASHIQ,current student,105,14,MUTTI,1234567890,1234
6,MIDLAJ K,current student,106,14,MUTTI,1234567890,1234
7,MIDLAJ CP,current student,107,14,MUTTI,1234567890,1234
8,NUFAIH,current student,108,14,MUTTI,1234567890,1234
9,SHADULI,current student,109,14,MUTTI,1234567890,1234
10,SAHLAN,current student,110,14,MUTTI,1234567890,1234
11,SHAMEEM CK,current student,111,14,MUTTI,1234567890,1234
12,MUHIYUDHEEN MC,current student,112,14,MUTTI,1234567890,1234
13,UVAIS PC,current student,113,14,MUTTI,1234567890,1234
14,SINAN KT,current student,114,14,MUTTI,1234567890,1234
15,ASLAM,current student,115,14,MUTTI,1234567890,1234
16,ASHRAF,current student,116,15,MUTTI,1234567890,1234
17,RASMIL,current student,117,15,MUTTI,1234567890,1234
18,MARVAN,current student,118,15,MUTTI,1234567890,1234
19,NASHAN,current student,119,15,MUTTI,1234567890,1234
20,UMAR MUKTHAR,current student,120,15,MUTTI,1234567890,1234
21,AMJAD,current student,121,15,MUTTI,1234567890,1234
22,SINAN VP,current student,122,15,MUTTI,1234567890,1234
23,AJMAL NASIM,current student,123,15,MUTTI,1234567890,1234
24,RISHAD MP,current student,124,15,MUTTI,1234567890,1234
25,RASHEEQ ,current student,125,15,MUTTI,1234567890,1234
26,ADNAN,current student,126,15,MUTTI,1234567890,1234
27,MUEENUDHEEN MP,current student,127,15,MUTTI,1234567890,1234
28,SAYYID MUSHAB,current student,128,15,MUTTI,1234567890,1234
29,SAYYID DILSHAN,current student,129,15,MUTTI,1234567890,1234
30,UNAIS,current student,130,15,MUTTI,1234567890,1234
31,ABDUL BASITH,current student,131,15,MUTTI,1234567890,1234
32,JUNAID V,current student,132,15,MUTTI,1234567890,1234
33,SHAHEEN ALI,current student,133,15,MUTTI,1234567890,1234
34,ADIL,current student,134,15,MUTTI,1234567890,1234
35,JAMAL,current student,135,15,MUTTI,1234567890,1234
36,SADEED,current student,136,15,MUTTI,1234567890,1234
37,SHABEEB P,current student,137,15,MUTTI,1234567890,1234
38,SAYYID SHAFEEH,current student,138,15,MUTTI,1234567890,1234
39,RASHID P,current student,139,15,MUTTI,1234567890,1234
40,NIHAD,current student,140,15,MUTTI,1234567890,1234
41,RISHAD P,current student,141,16,MUTTI,1234567890,1234
42,MUEENUDHEEN KM,current student,142,16,MUTTI,1234567890,1234
43,SINAN KK,current student,143,16,MUTTI,1234567890,1234
44,MUHSIN PV,current student,144,16,MUTTI,1234567890,1234
45,MUHAMMED HISHAM VP,current student,145,16,MUTTI,1234567890,1234
46,SWALAHUDHEEN AYYOOBI ET,current student,146,16,MUTTI,1234567890,1234
47,ANSHIF P,current student,147,16,MUTTI,1234567890,1234
48,FARHAN PK,current student,148,16,MUTTI,1234567890,1234
49,SHABEEB M,current student,149,16,MUTTI,1234567890,1234
50,RABEEH M,current student,150,16,MUTTI,1234567890,1234
51,ARSHAD CP,current student,151,16,MUTTI,1234567890,1234
52,IRSHAD VP,current student,152,16,MUTTI,1234567890,1234
53,JAMSHIYAS M,current student,153,16,MUTTI,1234567890,1234
54,SHHUHAIB P,current student,154,16,MUTTI,1234567890,1234
55,FARHAN CH,current student,155,16,MUTTI,1234567890,1234
56,HASHIR,current student,156,17,MUTTI,1234567890,1234
57,SUHAIL NK,current student,157,17,MUTTI,1234567890,1234
58,ABDUL BASITH NK,current student,158,17,MUTTI,1234567890,1234
59,NAVEED,current student,159,17,MUTTI,1234567890,1234
60,SWALIH ABDURAHMAN,current student,160,17,MUTTI,1234567890,1234
61,SHAMVEEL,current student,161,17,MUTTI,1234567890,1234
62,BISHR,current student,162,17,MUTTI,1234567890,1234
63,SALMAN N,current student,163,17,MUTTI,1234567890,1234
64,SALIM KK,current student,164,17,MUTTI,1234567890,1234
65,YASEEN OK,current student,165,17,MUTTI,1234567890,1234
66,AJSAL,current student,166,17,MUTTI,1234567890,1234
67,UVAIS C,current student,167,17,MUTTI,1234567890,1234
68,SWADIQ ALI,current student,168,17,MUTTI,1234567890,1234
69,AHNAF,current student,169,17,MUTTI,1234567890,1234
70,AL AMEEN,current student,170,17,MUTTI,1234567890,1234
71,MIDLAJ K,current student,171,17,MUTTI,1234567890,1234
72,NISHAN,current student,172,17,MUTTI,1234567890,1234
73,SAH'D,current student,173,17,MUTTI,1234567890,1234
74,FAYAS,current student,174,17,MUTTI,1234567890,1234
75,MISHAL,current student,175,17,MUTTI,1234567890,1234
76,ABDUL MUHAIMIN,current student,176,17,MUTTI,1234567890,1234
77,ABDURAHMAN,current student,177,17,MUTTI,1234567890,1234
78,ANAS,current student,178,18,MUTTI,1234567890,1234
79,FAHAD,current student,179,18,MUTTI,1234567890,1234
80,MAHMOOD ,current student,180,18,MUTTI,1234567890,1234
81,ARSHAQ,current student,181,18,MUTTI,1234567890,1234
82,UMAR,current student,182,18,MUTTI,1234567890,1234
83,AMEEN,current student,183,18,MUTTI,1234567890,1234
84,ABDULLAH SAEED,current student,184,18,MUTTI,1234567890,1234
85,SHIBLI P,current student,185,18,MUTTI,1234567890,1234
86,YASEEN ,current student,186,18,MUTTI,1234567890,1234
87,SAEED,current student,187,18,MUTTI,1234567890,1234
88,SA'D,current student,188,18,MUTTI,1234567890,1234
89,SHAHEEM,current student,189,18,MUTTI,1234567890,1234
90,SHAHID,current student,190,18,MUTTI,1234567890,1234
91,RASI,current student,191,18,MUTTI,1234567890,1234
92,ISHAN,current student,192,18,MUTTI,1234567890,1234
93,MUHYUDHEEN CT,current student,193,18,MUTTI,1234567890,1234
94,FASMIL M,current student,194,18,MUTTI,1234567890,1234
95,MUHAMMEDALI,current student,195,18,MUTTI,1234567890,1234
96,RISWAN,current student,196,18,MUTTI,1234567890,1234
97,RAHMAN,current student,197,18,MUTTI,1234567890,1234
98,THAHSEEN,current student,198,18,MUTTI,1234567890,1234
99,SHADIN,current student,199,18,MUTTI,1234567890,1234
100,ADIL,current student,200,18,MUTTI,1234567890,1234
101,MUHAMMED SHAFAS,current student,201,18,MUTTI,1234567890,1234
102,ABDUL HADI,current student,202,18,MUTTI,1234567890,1234
103,IBRAHEEM,current student,203,18,MUTTI,1234567890,1234\`;

const alumniCSV = \`1,ABOOBAKKAR BAQAVI,Biruthadhari,1,1,MUTTI,1234567890,1234
2,ABDURASHEED BAQAVI,Biruthadhari,2,1,MUTTI,1234567890,1234
3,ABDUNASAR BADRI,Biruthadhari,3,1,MUTTI,1234567890,1234
4,SULAIMAN BAQAVI,Biruthadhari,4,1,MUTTI,1234567890,1234
5,HABEEB BAQAVI,Biruthadhari,5,1,MUTTI,1234567890,1234
6,SAEED DARIMI,Biruthadhari,6,1,MUTTI,1234567890,1234
7,ABDURAHMAN BAQAVI,Biruthadhari,7,1,MUTTI,1234567890,1234
8,SHAREEF BAQAVI,Biruthadhari,8,1,MUTTI,1234567890,1234
9,BUJAIR HAITHAMI,Biruthadhari,9,1,MUTTI,1234567890,1234
10,MANSOOR FAIZY,Biruthadhari,10,2,MUTTI,1234567890,1234
11,SHAMSUDHEEN FAIZY,Biruthadhari,11,2,MUTTI,1234567890,1234
12,MUSTHAFA BAQAVI,Biruthadhari,12,2,MUTTI,1234567890,1234
13,SAITHALAVI BAQAVI,Biruthadhari,13,2,MUTTI,1234567890,1234
14,RAFI BAQAVI,Biruthadhari,14,2,MUTTI,1234567890,1234
15,SALAM MUSLIYAR,Biruthadhari,15,2,MUTTI,1234567890,1234
16,SAYYID FARIS ,Biruthadhari,16,3,MUTTI,1234567890,1234
17,SAYYID FALIL FAIZY,Biruthadhari,17,3,MUTTI,1234567890,1234
18,MUBASHIR FAIZY,Biruthadhari,18,3,MUTTI,1234567890,1234
19,ABDUL BASITH BAQAVI,Biruthadhari,19,3,MUTTI,1234567890,1234
20,JABIR MUSLIYAR,Biruthadhari,20,3,MUTTI,1234567890,1234
21,NAJMUDHEEN BAQAVI,Biruthadhari,21,4,MUTTI,1234567890,1234
22,JAHFAR JALALY,Biruthadhari,22,5,MUTTI,1234567890,1234
23,FAYIS ALAVI BAQAVI,Biruthadhari,23,5,MUTTI,1234567890,1234
24,NOORUDHEEN JALALY,Biruthadhari,24,5,MUTTI,1234567890,1234
25,SABIQ JALALY,Biruthadhari,25,5,MUTTI,1234567890,1234
26,SAEED BAQAVI,Biruthadhari,26,5,MUTTI,1234567890,1234
27,MUHSIN MAHIRI,Biruthadhari,27,6,MUTTI,1234567890,1234
28,AMEEN JALALY,Biruthadhari,28,6,MUTTI,1234567890,1234
29,SHAMEEM JALALY,Biruthadhari,29,6,MUTTI,1234567890,1234
30,SHAFEEQ JALALY,Biruthadhari,30,6,MUTTI,1234567890,1234
31,SAYYID SWALAHUDHEEN ,Biruthadhari,31,7,MUTTI,1234567890,1234
32,SAYYID SWABEEH,Biruthadhari,32,7,MUTTI,1234567890,1234
33,RAFI JALALY,Biruthadhari,33,7,MUTTI,1234567890,1234
34,ANAS JALALY,Biruthadhari,34,7,MUTTI,1234567890,1234
35,UVAIS JALALY,Biruthadhari,35,8,MUTTI,1234567890,1234
36,SWAFUVAN JALALY,Biruthadhari,36,8,MUTTI,1234567890,1234
37,SALMAN JALALY,Biruthadhari,37,8,MUTTI,1234567890,1234
38,SAJID MAHIRI,Biruthadhari,38,9,MUTTI,1234567890,1234
39,RAMEES BAQAVI,Biruthadhari,39,9,MUTTI,1234567890,1234
40,RASHID BAQAVI,Biruthadhari,40,10,MUTTI,1234567890,1234
41,MUAHAMMED SHAN BAQAVI,Biruthadhari,41,11,MUTTI,1234567890,1234
42,RASHID BAQAVI,Biruthadhari,42,12,MUTTI,1234567890,1234
43,RILVAN BAQAVI,Biruthadhari,43,12,MUTTI,1234567890,1234
44,ABID BAQAVI,Biruthadhari,44,12,MUTTI,1234567890,1234
45,JABIR BAQAVI,Biruthadhari,45,12,MUTTI,1234567890,1234
46,HASHIM SHAN BAQAVI,Biruthadhari,46,12,MUTTI,1234567890,1234
47,AJMAL MUSLIYAR,Biruthadhari,47,13,MUTTI,1234567890,1234
48,SHANAVAS MUSLIYAR,Biruthadhari,48,13,MUTTI,1234567890,1234
49,ANSHIB SHAN MUSLIYAR,Biruthadhari,49,13,MUTTI,1234567890,1234
50,SAYYID SINAN MUSLIYAR,Biruthadhari,50,13,MUTTI,1234567890,1234
51,SAYYID SWAFUVAN MUSLIYAR,Biruthadhari,51,13,MUTTI,1234567890,1234
52,SAYYID SABITH MUSLIYAR,Biruthadhari,52,13,MUTTI,1234567890,1234
53,NISHAD MUSLIYAR,Biruthadhari,53,13,MUTTI,1234567890,1234
54,UVAIS MUSLIYAR,Biruthadhari,54,13,MUTTI,1234567890,1234
55,NABEEL MUSLIYAR,Biruthadhari,55,13,MUTTI,1234567890,1234
56,SHIBLI MUSLIYAR,Biruthadhari,56,13,MUTTI,1234567890,1234
57,KHALID MUSLIYAR,Biruthadhari,57,13,MUTTI,1234567890,1234
58,SAYYID SWALIH MUSLIYAR,Biruthadhari,58,13,MUTTI,1234567890,1234
59,ABDUL MAJID MUSLIYAR,Biruthadhari,59,13,MUTTI,1234567890,1234\`;

const usthadsCSV = \`1,Sheikhuna Ibrahim Baqavi Al Haithami,PRINCIPAL MUDARRIS,mutti,1234567890,1234
2,Usthad Mansoor Faizy,ASSISTANT MUDARRIS,mutti,1234567890,1234
3,Usthad Musthafa Baqavi,ASSISTANT MUDARRIS,mutti,1234567890,1234
4,Usthad Jahfar Jalali,ASSISTANT MUDARRIS,mutti,1234567890,1234
5,Usthad Abdulla Faizy,ASSISTANT MUDARRIS,mutti,1234567890,1234
6,Usthad Shameem Jalali,ASSISTANT MUDARRIS,mutti,1234567890,1234
7,Usthad Rashid Baqavi,ASSISTANT MUDARRIS,mutti,1234567890,1234
8,Usthad Shan Baqavi,ASSISTANT MUDARRIS,mutti,1234567890,1234
9,Usthad Shafeeq Jalali,ASSISTANT MUDARRIS,mutti,1234567890,1234\`;

const newStudents = [];
const newUsthads = [];

studentsCSV.split('\\n').forEach((line) => {
  const parts = line.split(',');
  if(parts.length >= 8 && parts[0].trim() !== 'No:') {
    newStudents.push({
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
  }
});

alumniCSV.split('\\n').forEach((line) => {
  const parts = line.split(',');
  if(parts.length >= 8 && parts[0].trim() !== 'No:') {
    newStudents.push({
      _id: 'alu_' + parts[3].trim(),
      admissionNo: 'ALU' + parts[3].trim(),
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
  }
});

usthadsCSV.split('\\n').forEach((line) => {
  const parts = line.split(',');
  if(parts.length >= 6 && parts[0].trim() !== 'No:') {
    const id = parts[0].trim();
    newUsthads.push({
      _id: 'ust_' + id,
      usthadId: 'UST' + id,
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
});

// Update local_db.json
let localDb = { Student: newStudents, Usthad: newUsthads, Exam: [], Score: [], News: [], Gallery: [], Admission: [] };
try {
  const existingDb = JSON.parse(fs.readFileSync('local_db.json', 'utf8'));
  localDb.Exam = existingDb.Exam || [];
  localDb.Score = existingDb.Score || [];
  localDb.News = existingDb.News || [];
  localDb.Gallery = existingDb.Gallery || [];
  localDb.Admission = existingDb.Admission || [];
} catch (e) {}

fs.writeFileSync('local_db.json', JSON.stringify(localDb, null, 2));

// Update telegramDB.js
let js = fs.readFileSync('config/telegramDB.js', 'utf8');

const regexStudents = /const defaultStudents = \[[\\s\\S]*?\];/;
if(regexStudents.test(js)) {
  js = js.replace(regexStudents, 'const defaultStudents = ' + JSON.stringify(newStudents, null, 2) + ';');
}

const regexUsthads = /const defaultUsthads = \[[\\s\\S]*?\];/;
if(regexUsthads.test(js)) {
  js = js.replace(regexUsthads, 'const defaultUsthads = ' + JSON.stringify(newUsthads, null, 2) + ';');
}

fs.writeFileSync('config/telegramDB.js', js);
console.log('Successfully imported CSV data into local_db.json and telegramDB.js');
