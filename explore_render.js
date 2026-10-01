const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const regexRender = /function renderDashboard\(user\) \{([\s\S]*?)\} \/\/ end renderDashboard/g;
// I will just replace `renderDashboard` content. Let's see what it has first.
