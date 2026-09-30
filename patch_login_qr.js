const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldRender = `document.getElementById('dashUserName').textContent = user.name;`;
const newRender = `document.getElementById('dashUserName').textContent = user.name;\n      renderQRCodeForUser(user);`;

html = html.replace(oldRender, newRender);

fs.writeFileSync('public/login.html', html);
console.log('Added renderQRCodeForUser to renderDashboard');
