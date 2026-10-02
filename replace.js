const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const oldHtml = `  <!-- DIGITAL BROCHURE LAUNCHER BAR -->
  <div class="brochure-launcher-bar">
    <div class="bar-logo"><i class="fa fa-book" style="color:#d4af37; margin-right:8px;"></i>Bayanul Uloom Dars Brochure</div>
    <button class="launch-btn" onclick="toggleBook(true)"><i class="fa fa-book-open" style="margin-right:6px;"></i>Open Brochure</button>
  </div>`;

const newHtml = `  <!-- DIGITAL BROCHURE LAUNCHER BAR -->
  <div style="background:#fff; padding:30px 0;">
    <div class="container">
      <div class="brochure-launcher-bar">
        <div class="bar-logo"><i class="fa fa-book" style="color:#fff; margin-right:8px;"></i>Bayanul Uloom Dars Brochure</div>
        <button class="launch-btn" onclick="toggleBook(true)"><i class="fa fa-book-open" style="margin-right:6px;"></i>Open Brochure</button>
      </div>
    </div>
  </div>`;

if(html.includes('<!-- DIGITAL BROCHURE LAUNCHER BAR -->')) {
  html = html.replace(oldHtml, newHtml);
  fs.writeFileSync('public/index.html', html);
  console.log('Replaced HTML successfully');
}
