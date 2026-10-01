const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Unify ID Card Styles
const oldUsthadIdCard = html.match(/<div id="usthadIdCard"[\s\S]*?<\/button>/)[0];
const newUsthadIdCard = `
          <div id="usthadIdCard" style="border:2px solid var(--accent); border-radius:10px; padding:15px; background: #fff; max-width:280px; margin:0 auto; position:relative; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <img src="img/new_logo.png" style="width:40px; margin-bottom:5px;">
            <h6 style="color:var(--accent); font-weight:800; font-size:11px; margin-bottom:10px;">BAYANUL ULOOM DARS<br>MUTTICHIRA</h6>
            <img id="uIdPhoto" src="img/new_logo.png" style="width:75px; height:75px; object-fit:cover; border-radius:50%; border:3px solid var(--border-soft); margin-bottom:5px;">
            <h5 id="uIdName" style="font-weight:700; margin-bottom:3px; color:#1e293b; font-size:15px; line-height:1.2;">Name</h5>
            <p id="uIdRole" style="font-size:11px; color:#64748b; margin-bottom:8px; font-weight:600;">Mudarris</p>
            <div style="background:var(--bg-card-2); border-radius:6px; padding:6px; margin-top:5px;">
              <p id="uIdNo" style="font-weight:800; color:var(--accent); margin-bottom:1px; font-size:13px;">ID: -</p>
              <p id="uIdPhone" style="font-size:10px; color:#475569; margin-bottom:0; font-weight:600;"><i class="fa fa-phone"></i> -</p>
            </div>
          </div>
          <div class="d-flex justify-content-center gap-2 mt-3" style="gap:10px;">
            <button class="btn btn-outline-info btn-sm font-weight-bold" onclick="viewIdCard('usthadIdCard')">
              <i class="fa fa-eye"></i> View
            </button>
            <button class="btn btn-outline-accent btn-sm font-weight-bold" onclick="downloadIdCard('usthadIdCard', 'Usthad_ID')">
              <i class="fa fa-download"></i> Download
            </button>
          </div>
`;
html = html.replace(oldUsthadIdCard, newUsthadIdCard);

const oldStudentIdBtn = `<button class="btn btn-outline-accent btn-sm mt-3 font-weight-bold" onclick="downloadIdCard('studentIdCard', 'Student_ID')">
            <i class="fa fa-download"></i> Download ID
          </button>`;
const newStudentIdBtn = `<div class="d-flex justify-content-center gap-2 mt-3" style="gap:10px;">
            <button class="btn btn-outline-info btn-sm font-weight-bold" onclick="viewIdCard('studentIdCard')">
              <i class="fa fa-eye"></i> View
            </button>
            <button class="btn btn-outline-accent btn-sm font-weight-bold" onclick="downloadIdCard('studentIdCard', 'Student_ID')">
              <i class="fa fa-download"></i> Download
            </button>
          </div>`;
html = html.replace(oldStudentIdBtn, newStudentIdBtn);

// 2. Add Modal for Viewing ID Card
const idCardModal = `
  <!-- Modal: View ID Card -->
  <div class="modal fade" id="modalViewIdCard" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg" style="background:var(--bg-card); color:var(--text); text-align:center;">
        <div class="modal-header border-0">
          <h5 class="modal-title font-weight-bold text-primary"><i class="fa fa-id-badge"></i> ID Card Preview</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body p-4 d-flex justify-content-center" id="idCardPreviewContainer">
          <!-- Copied ID card goes here -->
        </div>
        <div class="modal-footer border-0 justify-content-center">
          <button type="button" class="btn btn-secondary rounded-pill font-weight-bold px-4" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
`;
if (!html.includes('id="modalViewIdCard"')) {
  html = html.replace('</body>', idCardModal + '\n</body>');
}

// 3. Add JS function for viewIdCard
const viewIdJs = `
    function viewIdCard(elemId) {
      const source = document.getElementById(elemId);
      const container = document.getElementById('idCardPreviewContainer');
      container.innerHTML = '';
      const clone = source.cloneNode(true);
      clone.style.margin = '0 auto'; // Ensure centered
      // We can scale it up for better viewing if desired
      clone.style.transform = 'scale(1.2)';
      clone.style.transformOrigin = 'top center';
      clone.style.marginBottom = '60px'; // Account for scale
      container.appendChild(clone);
      $('#modalViewIdCard').modal('show');
    }
`;
if (!html.includes('function viewIdCard')) {
  html = html.replace('function downloadIdCard', viewIdJs + '\n    function downloadIdCard');
}

// 4. Update the Exam Mark Matrix to include a Clear/Delete button for each student
const oldTh = `<th>Student Name</th>
                  <th>Loading...</th>`;
const newTh = `<th>Student Name</th>
                  <th>Loading...</th>
                  <th>Action</th>`;
html = html.replace(oldTh, newTh);

fs.writeFileSync('public/login.html', html);
console.log('Patched UI for ID cards');
