const fs = require('fs');

let snippet = fs.readFileSync('snippet.html', 'utf8');

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

snippet = snippet.replace(originalFields, newFields);

let adminHtml = fs.readFileSync('public/admin.html', 'utf8');
// Insert it just before <!-- Create Exam Modal -->
adminHtml = adminHtml.replace('<!-- Create Exam Modal -->', snippet + '\n\n        <!-- Create Exam Modal -->');

fs.writeFileSync('public/admin.html', adminHtml);
console.log('Restored unifiedAddUserModal to admin.html');
