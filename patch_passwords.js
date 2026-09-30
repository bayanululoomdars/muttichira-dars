const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const oldStudentPhone = `<div class="form-group">
                  <label class="form-label">Phone Number (Password) *</label>
                  <input type="text" id="adminStudentPhone" class="form-control" placeholder="e.g. 9876543210" required>
                </div>`;
const newStudentPhone = `<div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input type="text" id="adminStudentPhone" class="form-control" placeholder="e.g. 9876543210" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Login Password</label>
                  <input type="text" id="adminStudentPassword" class="form-control" placeholder="Auto-generated if empty">
                </div>`;
html = html.replace(oldStudentPhone, newStudentPhone);

const oldUsthadPhone = `<div class="form-group">
                  <label class="form-label">Phone Number (Password) *</label>
                  <input type="text" id="adminUsthadPhone" class="form-control" placeholder="e.g. 9526919218" required>
                </div>`;
const newUsthadPhone = `<div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input type="text" id="adminUsthadPhone" class="form-control" placeholder="e.g. 9526919218" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Login Password</label>
                  <input type="text" id="adminUsthadPassword" class="form-control" placeholder="Auto-generated if empty">
                </div>`;
html = html.replace(oldUsthadPhone, newUsthadPhone);

// Update table header in renderPortalUsersAdmin
html = html.replace('<th>Phone / Login Password</th>', '<th>Phone</th>\n                            <th>Password</th>');

// Update JS for renderPortalUsersAdmin to add the password column
const oldRowRenderer = `      '<td><code style="color:var(--text-soft);">' + phoneVal + '</code></td>' +
      '<td><div class="action-buttons">' +`;
const newRowRenderer = `      '<td><code style="color:var(--text-soft);">' + phoneVal + '</code></td>' +
      '<td><code style="color:var(--accent);">' + (u.password || phoneVal) + '</code></td>' +
      '<td><div class="action-buttons">' +`;
html = html.replace(oldRowRenderer, newRowRenderer);

fs.writeFileSync('public/admin.html', html);
console.log('Fixed Phone/Password separation in admin.html');
