const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const targetHeader = `<div class="dash-header-user">
              <img id="dashUserPhoto" src="img/new_logo.png" alt="User Photo">
              <div>
                <h3 class="m-0 font-weight-bold" id="dashUserName">User Name</h3>
                <p class="m-0 text-white-50 small" id="dashUserRole">Student | Dars 3rd Year</p>
                <span class="badge badge-warning font-weight-bold" id="dashUserStatus">Current Student</span>
              </div>
            </div>`;

const newHeader = `<div class="dash-header-user" style="display:flex; align-items:center; gap:15px; flex-wrap:wrap;">
              <img id="dashUserPhoto" src="img/new_logo.png" alt="User Photo">
              <div style="flex:1;">
                <h3 class="m-0 font-weight-bold" id="dashUserName">User Name</h3>
                <p class="m-0 text-white-50 small" id="dashUserRole">Student | Dars 3rd Year</p>
                <span class="badge badge-warning font-weight-bold" id="dashUserStatus">Current Student</span>
                <button id="btnDownloadID" class="btn btn-sm btn-light rounded-pill mt-2" style="display:none; font-weight:bold; color:var(--primary);" onclick="downloadIDCard()"><i class="fa fa-id-card"></i> Download ID Card</button>
              </div>
              <div id="dashQRCode" style="background:#fff; padding:5px; border-radius:8px; display:none;"></div>
            </div>`;

html = html.replace(targetHeader, newHeader);

const targetBodyEnd = `</body>`;
const newBodyEnd = `
<!-- HIDDEN ID CARD TEMPLATE (Landscape) -->
<div id="idCardTemplate" style="display:none; width:600px; height:350px; position:absolute; top:-9999px; left:-9999px; background: url('img/hero_bg.jpg') center/cover; border-radius: 15px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.5); font-family: 'Outfit', sans-serif;">
  <div style="background: rgba(10, 77, 46, 0.85); width:100%; height:100%; display:flex; flex-direction:column; padding:20px; color:#fff;">
    
    <!-- Top Header -->
    <div style="display:flex; align-items:center; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom:10px; margin-bottom:15px;">
      <img src="img/new_logo.png" style="width:50px; height:50px; border-radius:50%; border:2px solid #fff;">
      <div style="margin-left:15px;">
        <h2 style="margin:0; font-weight:800; font-size:22px; letter-spacing:1px; text-transform:uppercase;">BAYANUL ULOOM DARS</h2>
        <p style="margin:0; font-size:12px; opacity:0.9;">Muttichira, Kerala • Estd. 1999</p>
      </div>
    </div>
    
    <!-- Body Content -->
    <div style="display:flex; justify-content:space-between; flex:1;">
      
      <!-- Left: Photo & QR -->
      <div style="display:flex; flex-direction:column; align-items:center; width: 130px;">
        <img id="idCardPhoto" src="img/new_logo.png" style="width:100px; height:120px; object-fit:cover; border-radius:10px; border:3px solid #fff; margin-bottom:10px;">
        <div id="idCardQR" style="background:#fff; padding:5px; border-radius:5px;"></div>
      </div>
      
      <!-- Right: Details -->
      <div style="flex:1; padding-left: 20px; display:flex; flex-direction:column; justify-content:center;">
        <h1 id="idCardName" style="margin:0 0 5px 0; font-size:28px; font-weight:800; color:#ffd700; text-transform:uppercase;">Student Name</h1>
        
        <table style="width:100%; font-size:15px; line-height:1.6; margin-top:10px;">
          <tr>
            <td style="width:100px; opacity:0.8; font-weight:600;">Son of:</td>
            <td id="idCardFather" style="font-weight:700;">Father Name</td>
          </tr>
          <tr>
            <td style="opacity:0.8; font-weight:600;">Batch:</td>
            <td id="idCardBatch" style="font-weight:700;">Batch 1</td>
          </tr>
          <tr>
            <td style="opacity:0.8; font-weight:600;">Adm No:</td>
            <td id="idCardAdmNo" style="font-weight:700;">ADM123</td>
          </tr>
          <tr>
            <td style="opacity:0.8; font-weight:600;">Phone:</td>
            <td id="idCardPhone" style="font-weight:700;">9876543210</td>
          </tr>
        </table>
        
        <div style="margin-top:auto; background:rgba(255,255,255,0.15); padding:8px 12px; border-radius:8px; font-size:11px; text-align:center; font-style:italic;">
          "Seeking knowledge is an obligation upon every Muslim."
        </div>
      </div>
      
    </div>
  </div>
</div>

<script>
function renderQRCodeForUser(user) {
  const qrContainerDash = document.getElementById('dashQRCode');
  const qrContainerID = document.getElementById('idCardQR');
  qrContainerDash.innerHTML = '';
  qrContainerID.innerHTML = '';
  
  if (!user || user.role !== 'student') return;
  
  const scanUrl = window.location.origin + '/login.html?user=' + (user.admissionNo || user._id);
  
  new QRCode(qrContainerDash, {
    text: scanUrl,
    width: 60,
    height: 60,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L
  });
  
  new QRCode(qrContainerID, {
    text: scanUrl,
    width: 80,
    height: 80,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L
  });
  
  qrContainerDash.style.display = 'block';
  document.getElementById('btnDownloadID').style.display = 'inline-block';
}

function downloadIDCard() {
  const user = currentUserSession;
  if (!user) return;
  
  document.getElementById('idCardPhoto').src = user.photoUrl || 'img/new_logo.png';
  document.getElementById('idCardName').textContent = user.name || '';
  document.getElementById('idCardFather').textContent = user.fatherName || 'N/A';
  document.getElementById('idCardBatch').textContent = 'Batch ' + (user.batchNumber || 'N/A');
  document.getElementById('idCardAdmNo').textContent = user.admissionNo || '';
  document.getElementById('idCardPhone').textContent = user.phone || '';
  
  const idCardEl = document.getElementById('idCardTemplate');
  idCardEl.style.display = 'block';
  
  // Give it a moment to render display:block before capturing
  setTimeout(() => {
    html2canvas(idCardEl, { scale: 3, backgroundColor: null, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = (user.name || 'Student') + '_ID_Card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      idCardEl.style.display = 'none';
    });
  }, 300);
}

// Check URL for ?user= to auto-lookup
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const autoUser = urlParams.get('user');
  if (autoUser) {
    const input = document.getElementById('inputIdentifier');
    if(input) {
      input.value = autoUser;
      setTimeout(() => {
        handleLiveLookup();
      }, 500);
    }
  }
});
</script>
</body>`;

html = html.replace(targetBodyEnd, newBodyEnd);
fs.writeFileSync('public/login.html', html);
console.log('Added ID Card UI and logic');
