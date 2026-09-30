const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const targetHead = `  <link href="lib/font-awesome/css/font-awesome.min.css" rel="stylesheet">`;
const newHead = `  <link href="lib/font-awesome/css/font-awesome.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>`;

html = html.replace(targetHead, newHead);

fs.writeFileSync('public/login.html', html);
console.log('Added QR and html2canvas scripts');
