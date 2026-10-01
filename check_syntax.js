const fs = require('fs');
const { Script } = require('vm');
const html = fs.readFileSync('public/login.html', 'utf8');

const regex = /<script>([\s\S]*?)<\/script>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  try {
    new Script(match[1]);
  } catch(e) {
    console.error("Syntax Error in script block starting near index", match.index);
    console.error(e);
  }
}
console.log('Syntax check complete.');
