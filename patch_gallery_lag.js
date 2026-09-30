const fs = require('fs');

// Patch gallery.html lag
let html = fs.readFileSync('public/gallery.html', 'utf8');

// Remove duplicate setIntervals for Elfsight
const elfsightHack = `  // Hide Elfsight Watermark Hack
  setInterval(function() {
    var elfsightApps = document.querySelectorAll('[class*="elfsight-app"]');
    elfsightApps.forEach(function(app) {
      var links = app.querySelectorAll('a[href*="elfsight.com"]');
      links.forEach(function(l) { l.style.display = 'none'; });
      if (app.shadowRoot) {
        var shadowLinks = app.shadowRoot.querySelectorAll('a[href*="elfsight.com"], .eapps-link');
        shadowLinks.forEach(function(l) { l.style.display = 'none'; });
        if (!app.shadowRoot.querySelector('#hide-elfsight')) {
          var style = document.createElement('style');
          style.id = 'hide-elfsight';
          style.innerHTML = 'a[href*="elfsight.com"], .eapps-link, .eapps-instagram-feed-title { display: none !important; opacity:0 !important; visibility:hidden !important; pointer-events:none !important; }';
          app.shadowRoot.appendChild(style);
        }
      }
    });
  }, 1000);`;

// Find first instance
let idx1 = html.indexOf(elfsightHack);
if (idx1 !== -1) {
  let idx2 = html.indexOf(elfsightHack, idx1 + 10);
  if (idx2 !== -1) {
    // Replace second instance with empty string
    html = html.substring(0, idx2) + html.substring(idx2 + elfsightHack.length);
  }
}
// Change setInterval to 2500ms to reduce lag
html = html.replace(/1000\);/g, '2500);');

fs.writeFileSync('public/gallery.html', html);
console.log('Patched gallery lag');
