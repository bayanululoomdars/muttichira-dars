const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const regex = /<select id="newExamBatchNo" class="form-control" onchange="renderSubjectInputRows\(\)">[\s\S]*?<\/select>/;
const replacement = '<input type="text" id="newExamBatchNo" class="form-control" placeholder="Enter Batch Number (e.g. 1, 2, 18)" oninput="renderSubjectInputRows()">';

if (regex.test(html)) {
  html = html.replace(regex, replacement);
  fs.writeFileSync('public/admin.html', html);
  console.log('Replaced batch select with input in admin.html');
} else {
  console.log('Could not find select dropdown');
}
