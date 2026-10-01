const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const startIdx = html.indexOf('// Also populate msgUsthadSelect');
const endIdx = html.indexOf('// Usthad Dashboard Loader');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = "// Also populate msgUsthadSelect\n" +
"        fetch('/api/portal/usthads').then(r=>r.json()).then(res => {\n" +
"          if(res.success) {\n" +
"            const sel = document.getElementById('msgUsthadSelect');\n" +
"            if(sel) {\n" +
"               let opts = '<option value=\"\">Select Usthad...</option>';\n" +
"               res.usthads.forEach(u => opts += `<option value=\"${u._id}\">${u.name}</option>`);\n" +
"               sel.innerHTML = opts;\n" +
"            }\n" +
"          }\n" +
"        });\n" +
"    }\n\n    ";
  html = html.substring(0, startIdx) + replacement + html.substring(endIdx);
  fs.writeFileSync('public/login.html', html);
  console.log('Fixed properly!');
} else {
  console.log('Could not find indices', startIdx, endIdx);
}
