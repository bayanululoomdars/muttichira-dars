const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldProfileTabRegex = /<div class="card-body p-4">\s*<h5 class="font-weight-bold mb-3 text-primary"><i class="fa fa-user-edit"><\/i> Complete Your Profile<\/h5>[\s\S]*?<\/form>\s*<\/div>/;

const newProfileTabHtml = "<div class=\"card-body p-4\">\n" +
"          <h5 class=\"font-weight-bold mb-3 text-primary\"><i class=\"fa fa-user\"></i> My Profile</h5>\n" +
"          <p class=\"small text-muted mb-4\">Official records matching your admission profile.</p>\n" +
"          <div class=\"row\" id=\"studentProfileReadonly\">\n" +
"            <div class=\"col-md-6 mb-3\">\n" +
"              <label class=\"small text-muted mb-0\">Full Name</label>\n" +
"              <div class=\"font-weight-bold\" id=\"roName\">Loading...</div>\n" +
"            </div>\n" +
"            <div class=\"col-md-6 mb-3\">\n" +
"              <label class=\"small text-muted mb-0\">Father's Name</label>\n" +
"              <div class=\"font-weight-bold\" id=\"roFather\">Loading...</div>\n" +
"            </div>\n" +
"            <div class=\"col-md-6 mb-3\">\n" +
"              <label class=\"small text-muted mb-0\">Phone Number</label>\n" +
"              <div class=\"font-weight-bold\" id=\"roPhone\">Loading...</div>\n" +
"            </div>\n" +
"            <div class=\"col-md-6 mb-3\">\n" +
"              <label class=\"small text-muted mb-0\">Blood Group</label>\n" +
"              <div class=\"font-weight-bold\" id=\"roBlood\">Loading...</div>\n" +
"            </div>\n" +
"            <div class=\"col-12 mb-3\">\n" +
"              <label class=\"small text-muted mb-0\">Full Address</label>\n" +
"              <div class=\"font-weight-bold\" id=\"roAddress\">Loading...</div>\n" +
"            </div>\n" +
"          </div>\n" +
"          <hr>\n" +
"          <button class=\"btn btn-warning btn-block font-weight-bold rounded-pill shadow-sm py-2\" onclick=\"openStudentFullProfileModal()\">\n" +
"            <i class=\"fa fa-edit\"></i> Edit Your Profile\n" +
"          </button>\n" +
"        </div>";

html = html.replace(oldProfileTabRegex, newProfileTabHtml);

const profileModalHtml = "<!-- FULL STUDENT PROFILE MODAL -->\n" +
"  <div class=\"modal fade\" id=\"modalStudentFullProfile\" tabindex=\"-1\">\n" +
"    <div class=\"modal-dialog modal-lg modal-dialog-centered\">\n" +
"      <div class=\"modal-content\" style=\"background:var(--bg-card); color:var(--text); border:1px solid var(--border-soft); border-radius:16px;\">\n" +
"        <div class=\"modal-header border-bottom-0\">\n" +
"          <h5 class=\"modal-title font-weight-bold text-primary\"><i class=\"fa fa-user-edit\"></i> Complete Your Profile (Official Data)</h5>\n" +
"          <button type=\"button\" class=\"close text-white\" data-dismiss=\"modal\">&times;</button>\n" +
"        </div>\n" +
"        <form onsubmit=\"handleStudentSelfUpdate(event)\">\n" +
"          <div class=\"modal-body\">\n" +
"            <div class=\"row\">\n" +
"              <div class=\"col-md-6 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Full Name <span class=\"text-danger\">*</span></label>\n" +
"                <input type=\"text\" id=\"selfName\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text);\" required>\n" +
"              </div>\n" +
"              <div class=\"col-md-6 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Father / Guardian Name <span class=\"text-danger\">*</span></label>\n" +
"                <input type=\"text\" id=\"selfFather\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text);\" required>\n" +
"              </div>\n" +
"              <div class=\"col-md-6 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Phone Number <span class=\"text-danger\">*</span></label>\n" +
"                <input type=\"text\" id=\"selfPhone\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text);\" required>\n" +
"              </div>\n" +
"              <div class=\"col-md-6 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Blood Group</label>\n" +
"                <select id=\"selfBlood\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text);\">\n" +
"                  <option value=\"\">Unknown</option>\n" +
"                  <option>O+</option><option>O-</option>\n" +
"                  <option>A+</option><option>A-</option>\n" +
"                  <option>B+</option><option>B-</option>\n" +
"                  <option>AB+</option><option>AB-</option>\n" +
"                </select>\n" +
"              </div>\n" +
"              <div class=\"col-md-6 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Date of Birth</label>\n" +
"                <input type=\"date\" id=\"selfDob\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text);\">\n" +
"              </div>\n" +
"              <div class=\"col-md-6 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Emergency Contact</label>\n" +
"                <input type=\"text\" id=\"selfEmergency\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text);\">\n" +
"              </div>\n" +
"              <div class=\"col-12 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Full Address</label>\n" +
"                <textarea id=\"selfAddress\" class=\"form-control\" rows=\"2\" style=\"background:var(--bg-input); color:var(--text);\"></textarea>\n" +
"              </div>\n" +
"              <div class=\"col-md-6 mb-3\">\n" +
"                <label class=\"small font-weight-bold text-muted\">Login Password</label>\n" +
"                <input type=\"text\" id=\"selfPassword\" class=\"form-control\" style=\"background:var(--bg-input); color:var(--text);\">\n" +
"                <small class=\"text-danger\">Updates immediately.</small>\n" +
"              </div>\n" +
"            </div>\n" +
"            <hr>\n" +
"            <div class=\"form-check p-3 bg-dark rounded border border-warning text-warning mb-3\">\n" +
"              <input class=\"form-check-input ml-1 mt-2\" type=\"checkbox\" id=\"selfDeclaration\" required>\n" +
"              <label class=\"form-check-label ml-4\" for=\"selfDeclaration\" style=\"font-size:0.95rem; font-weight:bold;\">\n" +
"                I hereby declare that the information provided above is true and accurate. I understand that my official details like Name, Phone, and Password will be updated in the Admin records upon submission.\n" +
"              </label>\n" +
"            </div>\n" +
"          </div>\n" +
"          <div class=\"modal-footer border-top-0\">\n" +
"            <button type=\"button\" class=\"btn btn-secondary rounded-pill font-weight-bold\" data-dismiss=\"modal\">Cancel</button>\n" +
"            <button type=\"submit\" class=\"btn btn-primary rounded-pill font-weight-bold px-4\"><i class=\"fa fa-save\"></i> Submit Profile</button>\n" +
"          </div>\n" +
"        </form>\n" +
"      </div>\n" +
"    </div>\n" +
"  </div>\n";

if (!html.includes('id="modalStudentFullProfile"')) {
  html = html.replace('<!-- MODALS -->', '<!-- MODALS -->\n' + profileModalHtml);
}

const handleSelfUpdateOld = /function handleStudentSelfUpdate\(e\) \{[\s\S]*?populateStudentDash\(currentUserSession\);\n\s*\} else \{/m;
const handleSelfUpdateNew = "function handleStudentSelfUpdate(e) {\n" +
"      e.preventDefault();\n" +
"      if (!currentUserSession || currentUserSession.role !== 'student') return;\n" +
"      const payload = {\n" +
"        name: document.getElementById('selfName').value,\n" +
"        fatherName: document.getElementById('selfFather').value,\n" +
"        phone: document.getElementById('selfPhone').value,\n" +
"        bloodGroup: document.getElementById('selfBlood').value,\n" +
"        dob: document.getElementById('selfDob').value,\n" +
"        emergencyContact: document.getElementById('selfEmergency').value,\n" +
"        address: document.getElementById('selfAddress').value,\n" +
"        password: document.getElementById('selfPassword').value\n" +
"      };\n" +
"      fetch('/api/portal/student/' + currentUserSession._id, {\n" +
"        method: 'PUT',\n" +
"        headers: {'Content-Type': 'application/json'},\n" +
"        body: JSON.stringify(payload)\n" +
"      })\n" +
"      .then(r => r.json())\n" +
"      .then(res => {\n" +
"        if(res.success) {\n" +
"          showToast('Profile updated successfully!', false);\n" +
"          $('#modalStudentFullProfile').modal('hide');\n" +
"          Object.assign(currentUserSession, payload);\n" +
"          renderDashboard(currentUserSession);\n" +
"        } else {";
html = html.replace(handleSelfUpdateOld, handleSelfUpdateNew);

const extraJs = "    function openStudentFullProfileModal() {\n" +
"      if(!currentUserSession) return;\n" +
"      document.getElementById('selfName').value = currentUserSession.name || '';\n" +
"      document.getElementById('selfFather').value = currentUserSession.fatherName || '';\n" +
"      document.getElementById('selfPhone').value = currentUserSession.phone || '';\n" +
"      document.getElementById('selfBlood').value = currentUserSession.bloodGroup || '';\n" +
"      document.getElementById('selfDob').value = currentUserSession.dob || '';\n" +
"      document.getElementById('selfEmergency').value = currentUserSession.emergencyContact || '';\n" +
"      document.getElementById('selfAddress').value = currentUserSession.address || '';\n" +
"      document.getElementById('selfPassword').value = currentUserSession.password || '';\n" +
"      document.getElementById('selfDeclaration').checked = false;\n" +
"      $('#modalStudentFullProfile').modal('show');\n" +
"    }\n";

if (!html.includes('function openStudentFullProfileModal()')) {
  html = html.replace('function renderDashboard(user) {', extraJs + '\n    function renderDashboard(user) {');
}

const populateReadOnlyOld = /document\.getElementById\('selfName'\)\.value = user\.name \|\| '';[\s\S]*?document\.getElementById\('selfPassword'\)\.value = user\.password \|\| '';/m;
const populateReadOnlyNew = "if (document.getElementById('roName')) {\n" +
"            document.getElementById('roName').textContent = user.name || 'Not Provided';\n" +
"            document.getElementById('roFather').textContent = user.fatherName || 'Not Provided';\n" +
"            document.getElementById('roPhone').textContent = user.phone || 'Not Provided';\n" +
"            document.getElementById('roBlood').textContent = user.bloodGroup || 'Not Provided';\n" +
"            document.getElementById('roAddress').textContent = user.address || 'Not Provided';\n" +
"          }";
html = html.replace(populateReadOnlyOld, populateReadOnlyNew);

fs.writeFileSync('public/login.html', html);
console.log('Done student profile.');
