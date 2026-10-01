const fs = require('fs');
const html = fs.readFileSync('public/login.html', 'utf8');
console.log('modalPostNotif exists:', html.includes('id="modalPostNotif"'));
console.log('modalUsthadMessages exists:', html.includes('id="modalUsthadMessages"'));
console.log('modalUsthadDirectMsg exists:', html.includes('id="modalUsthadDirectMsg"'));
console.log('modalStudentMsg exists:', html.includes('id="modalStudentMsg"'));
