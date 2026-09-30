const fs = require('fs');

function updateBatches(file) {
  let html = fs.readFileSync(file, 'utf8');
  let newOptions = '<option value="">Select Batch</option>\n';
  for(let i=1; i<=30; i++) {
    newOptions += '<option value="' + i + '">Batch ' + i + '</option>';
  }
  
  html = html.replace(/<select id="examBatchSelectUsthad"[^>]*>[\s\S]*?<\/select>/, '<select id="examBatchSelectUsthad" class="form-control" onchange="onUsthadExamChange()" style="background:var(--bg-input); border-color:var(--border-soft); color:var(--text);">\n' + newOptions + '</select>');
                
  if (file === 'public/admin.html') {
    html = html.replace(/<select id="examClassSelect"[^>]*>[\s\S]*?<\/select>/, '<select id="examClassSelect" class="form-control" onchange="loadExamMarkMatrix()">\n' + newOptions + '</select>');
  }
  
  fs.writeFileSync(file, html);
}

updateBatches('public/login.html');
updateBatches('public/admin.html');
console.log('Updated batch options to 30 in login and admin.');
