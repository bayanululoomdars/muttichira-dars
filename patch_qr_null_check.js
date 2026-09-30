const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const regexRenderQR = /function renderQRCodeForUser\(user\) \{[\s\S]*?qrContainerID\.innerHTML = '';/;

const newRenderQR = `function renderQRCodeForUser(user) {
  const qrContainerDash = document.getElementById('dashQRCode');
  const qrContainerID = document.getElementById('idCardQR');
  if (!qrContainerDash || !qrContainerID) return;
  qrContainerDash.innerHTML = '';
  qrContainerID.innerHTML = '';`;

if(regexRenderQR.test(html)) {
  html = html.replace(regexRenderQR, newRenderQR);
  fs.writeFileSync('public/login.html', html);
  console.log('Fixed renderQRCodeForUser with null checks');
} else {
  console.log('Could not match renderQRCodeForUser');
}
