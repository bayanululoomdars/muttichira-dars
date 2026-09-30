const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
const vm = require('vm');
const match = html.match(/<script>([\s\S]*?)<\/script>/g);
if (match) {
  match.forEach((m, i) => {
    try {
      new vm.Script(m.replace(/<\/?script>/g, ''));
      console.log('Script ' + i + ' OK');
    } catch (e) {
      console.log('Error in Script ' + i + ':', e);
    }
  });
} else {
  console.log("No scripts found");
}
