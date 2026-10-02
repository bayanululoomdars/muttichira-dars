const fs = require('fs');
let html = fs.readFileSync('public/book.html', 'utf8');

const oldCss1 = `    body {
      background: #0a1a10;`;
const newCss1 = `    body {
      background: #ffffff;`;

const oldCss2 = `    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: linear-gradient(135deg, #0d2818 0%, #061a0e 50%, #040e08 100%);
    }`;
const newCss2 = `    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
    }`;

const oldCss3 = `    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: rgba(0,0,0,0.5);`;
const newCss3 = `    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: #f4f8f5;`;

const oldCss4 = `    .header-text .subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.6); }`;
const newCss4 = `    .header-text .subtitle { font-size: 0.75rem; color: #555; }`;

html = html.replace(oldCss1, newCss1);
html = html.replace(oldCss2, newCss2);
html = html.replace(oldCss3, newCss3);
html = html.replace(oldCss4, newCss4);

fs.writeFileSync('public/book.html', html);
console.log('Replaced book.html backgrounds');
