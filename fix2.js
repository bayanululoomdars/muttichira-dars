const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

const oldCatBar = `<div id="homeGalleryCategoriesBar" style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:30px;">`;
const newCatBar = `<div id="homeGalleryCategoriesBar" style="display:none; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:30px;">`;

const oldRow = `<div class="row" id="homeGalleryRow" style="justify-content:center;"></div>`;
const newRow = `<div class="row" id="homeGalleryRow" style="display:none; justify-content:center;"></div>`;

c = c.replace(oldCatBar, newCatBar);
c = c.replace(oldRow, newRow);

fs.writeFileSync('public/index.html', c);
console.log('done2');
