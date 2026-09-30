const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const oldSelect = `<select id="newExamBatchNo" class="form-control" onchange="renderSubjectInputRows()">
                    <option value="Dars 3rd Year">Dars 3rd Year</option>
                    <option value="Dars 2nd Year">Dars 2nd Year</option>
                    <option value="Dars 1st Year">Dars 1st Year</option>
                    <option value="Dars Senior">Dars Senior</option>
                    <option value="Dars Junior">Dars Junior</option>
                    <option value="Dars Sub Junior">Dars Sub Junior</option>
                  </select>`;

const newSelect = `<select id="newExamBatchNo" class="form-control" onchange="renderSubjectInputRows()">
                    <!-- Options populated dynamically from batch list -->
                    <option value="1">Batch 1</option>
                    <option value="2">Batch 2</option>
                    <option value="3">Batch 3</option>
                    <option value="4">Batch 4</option>
                    <option value="5">Batch 5</option>
                    <option value="6">Batch 6</option>
                    <option value="7">Batch 7</option>
                    <option value="8">Batch 8</option>
                    <option value="9">Batch 9</option>
                    <option value="10">Batch 10</option>
                  </select>`;

html = html.replace(oldSelect, newSelect);
fs.writeFileSync('public/admin.html', html);
console.log('Fixed newExamBatchNo options');
