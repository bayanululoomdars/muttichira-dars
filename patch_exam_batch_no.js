const fs = require('fs');

let html = fs.readFileSync('public/admin.html', 'utf8');

let newOptions = '<option value="">Select Batch</option>\n';
for(let i=1; i<=30; i++) {
  newOptions += '<option value="' + i + '">Batch ' + i + '</option>\n';
}

const regex = /<select id="newExamBatchNo"[^>]*>[\s\S]*?<\/select>/;
const newSelect = `<select id="newExamBatchNo" class="form-control" onchange="renderSubjectInputRows()">\n${newOptions}</select>`;

html = html.replace(regex, newSelect);

fs.writeFileSync('public/admin.html', html);
console.log('Updated newExamBatchNo with Batch 1-30 in admin.html');
