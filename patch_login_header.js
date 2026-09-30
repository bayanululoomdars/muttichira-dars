const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const regexHeader = /<div class="dash-header-user">[\s\S]*?<img id="dashUserPhoto"[\s\S]*?<div\b[^>]*>[\s\S]*?<h3[^>]*id="dashUserName"[^>]*>.*?<\/h3>[\s\S]*?<p[^>]*id="dashUserRole"[^>]*>.*?<\/p>[\s\S]*?<span[^>]*id="dashUserStatus"[^>]*>.*?<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newHeader = `<div class="dash-header-user" style="display:flex; align-items:center; gap:15px; flex-wrap:wrap;">
              <img id="dashUserPhoto" src="img/new_logo.png" alt="User Photo">
              <div style="flex:1;">
                <h3 class="m-0 font-weight-bold" id="dashUserName">User Name</h3>
                <p class="m-0 text-white-50 small" id="dashUserRole">Student | Dars 3rd Year</p>
                <span class="badge badge-warning font-weight-bold" id="dashUserStatus">Current Student</span>
                <br>
                <button id="btnDownloadID" class="btn btn-sm btn-light rounded-pill mt-2" style="display:none; font-weight:bold; color:var(--primary);" onclick="downloadIDCard()"><i class="fa fa-id-card"></i> Download ID Card</button>
              </div>
              <div id="dashQRCode" style="background:#fff; padding:5px; border-radius:8px; display:none;"></div>
            </div>`;

if(regexHeader.test(html)) {
  html = html.replace(regexHeader, newHeader);
  fs.writeFileSync('public/login.html', html);
  console.log('Fixed dash-header-user and added dashQRCode');
} else {
  console.log('Could not match dash-header-user');
}
