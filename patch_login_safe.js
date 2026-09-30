const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

if (!html.includes('function safeGetValue(')) {
    const helperFn = `
    function safeGetValue(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }
`;
    html = html.replace('// Handlers for Modals & Forms', helperFn + '\n    // Handlers for Modals & Forms');
    fs.writeFileSync('public/login.html', html);
    console.log('Added safeGetValue to login.html');
} else {
    console.log('safeGetValue already present');
}
