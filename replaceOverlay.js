const fs = require('fs');
let css = fs.readFileSync('public/css/custom.css', 'utf8');

const oldOverlay = `.book-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(4, 37, 21, 0.92);`;

const newOverlay = `.book-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.92);`;

css = css.replace(oldOverlay, newOverlay);
fs.writeFileSync('public/css/custom.css', css);
console.log('Replaced book-overlay background');
