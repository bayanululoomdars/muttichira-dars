const fs = require('fs');

const examListHtml = `
          <!-- Existing Exams List -->
          <div class="card" style="background:var(--bg-card); border:1px solid var(--border-soft); border-radius:16px; padding:24px;">
            <h4 style="font-family:'Outfit',sans-serif; color:var(--text); margin-bottom:16px;">
              <i class="fa fa-list-alt"></i> Active Exam Configurations
            </h4>
            <div class="table-container">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Exam Name</th>
                    <th>Term</th>
                    <th>Batch</th>
                    <th>Configured Classes</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="examListTableBody">
                  <tr><td colspan="6" class="text-center text-muted py-3">Loading active exams...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
`;

let adminHtml = fs.readFileSync('public/admin.html', 'utf8');

// Insert it before <!-- Create Exam Modal -->
adminHtml = adminHtml.replace('<!-- Create Exam Modal -->', examListHtml + '\n        <!-- Create Exam Modal -->');

fs.writeFileSync('public/admin.html', adminHtml);
console.log('Restored Existing Exams List to admin.html');
