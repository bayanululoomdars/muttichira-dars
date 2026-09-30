const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

html = html.replace("const identifier = document.getElementById('inputIdentifier').value.trim();", 
                    "const identifier = document.getElementById('searchIdentifier').value.trim();");

fs.writeFileSync('public/login.html', html);
console.log('Fixed identifier error in submitLogin');
