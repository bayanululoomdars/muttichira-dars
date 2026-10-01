
function renderQRCodeForUser(user) {
  const qrContainerDash = document.getElementById('dashQRCode');
  const qrContainerID = document.getElementById('idCardQR');
  if (!qrContainerDash || !qrContainerID) return;
  qrContainerDash.innerHTML = '';
  qrContainerID.innerHTML = '';
  
  if (!user || user.role !== 'student') return;
  
  const scanUrl = window.location.origin + '/login.html?user=' + (user.admissionNo || user._id);
  
  try {
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
  } catch (e) {
    console.error('QRCode generation failed', e);
  }
  
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
