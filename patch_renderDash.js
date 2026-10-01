const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const additionalRenderLogic = `
      // Inject to ID Cards
      if (user.role === 'usthad') {
        if(document.getElementById('uIdName')) {
          document.getElementById('uIdName').textContent = user.name;
          document.getElementById('uIdRole').textContent = user.designation || 'Usthad';
          document.getElementById('uIdNo').innerHTML = 'ID: ' + (user.usthadId || 'N/A');
          document.getElementById('uIdPhone').innerHTML = '<i class="fa fa-phone"></i> ' + (user.phone || 'N/A');
          if(user.photoUrl) document.getElementById('uIdPhoto').src = user.photoUrl;
        }
      } else {
        if(document.getElementById('sIdName')) {
          document.getElementById('sIdName').textContent = user.name;
          document.getElementById('sIdFather').textContent = 'S/O ' + (user.fatherName || '-');
          document.getElementById('sIdBatch').textContent = 'Batch ' + (user.batchNumber || user.batchYear || '-');
          document.getElementById('sIdNo').textContent = 'Adm No: ' + user.admissionNo;
          document.getElementById('sIdBlood').innerHTML = '<i class="fa fa-tint"></i> Blood: ' + (user.bloodGroup || 'Unknown');
          document.getElementById('sIdPhone').innerHTML = '<i class="fa fa-phone"></i> ' + (user.phone || '-');
          if(user.photoUrl) document.getElementById('sIdPhoto').src = user.photoUrl;
          
          // Populate Edit Form
          document.getElementById('selfName').value = user.name || '';
          document.getElementById('selfFather').value = user.fatherName || '';
          document.getElementById('selfPhone').value = user.phone || '';
          document.getElementById('selfBlood').value = user.bloodGroup || '';
          document.getElementById('selfDob').value = user.dob ? user.dob.split('T')[0] : '';
          document.getElementById('selfEmergency').value = user.emergencyContact || '';
          document.getElementById('selfAddress').value = user.address || '';
          document.getElementById('selfPassword').value = user.password || '';
        }
      }
`;

html = html.replace("renderQRCodeForUser(user);", "renderQRCodeForUser(user);\n" + additionalRenderLogic);

// Add API for student update in portalController.js and portalRoutes.js
fs.writeFileSync('public/login.html', html);
console.log('Patched renderDashboard in login.html');
