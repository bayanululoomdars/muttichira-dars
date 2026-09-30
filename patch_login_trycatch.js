const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const oldQrScript = `  new QRCode(qrContainerDash, {
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
  });`;

const newQrScript = `  try {
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
  }`;

html = html.replace(oldQrScript, newQrScript);
fs.writeFileSync('public/login.html', html);
console.log('Wrapped QRCode in try-catch in login.html');
