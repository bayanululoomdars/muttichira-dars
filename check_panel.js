const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
const lines = html.split('\n');
let panel = '';
for(let i=1965; i>=0; i--){
  if(lines[i].includes('class="admin-panel"')) {
    panel = lines[i];
    break;
  }
}
console.log(panel);
