const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const originalFields = `                <div class="form-group">
                  <label class="form-label">Class / Course</label>
                  <input type="text" id="adminStudentClass" class="form-control" placeholder="e.g. Dars 3rd Year">
                </div>
                <div class="form-group">
                  <label class="form-label">Batch Year</label>
                  <input type="text" id="adminStudentBatch" class="form-control" placeholder="e.g. 2025">
                </div>`;

const newFields = `                <div class="form-group">
                  <label class="form-label">Batch Number *</label>
                  <input type="text" id="adminStudentBatchNo" class="form-control" placeholder="e.g. 1, 2, 3..." required>
                </div>`;

html = html.replace(originalFields, newFields);

// Also need to update the save function in JS inside admin.html
const oldJS1 = `    safeSetVal('adminStudentClass', user.className);
    safeSetVal('adminStudentBatch', user.batchYear);`;

const newJS1 = `    safeSetVal('adminStudentBatchNo', user.batchNumber || user.batchYear);`;

html = html.replace(oldJS1, newJS1);

const oldJS2 = `  fd.append('className', safeGetValue('adminStudentClass'));
  fd.append('batchYear', safeGetValue('adminStudentBatch'));`;

const newJS2 = `  fd.append('batchNumber', safeGetValue('adminStudentBatchNo'));`;

html = html.replace(oldJS2, newJS2);

fs.writeFileSync('public/admin.html', html);
console.log('Replaced Class/BatchYear with BatchNumber in admin.html');
