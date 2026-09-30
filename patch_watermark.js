const fs = require('fs');

function patchFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const hackCode = `
  // Hide Elfsight Watermark Hack
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
  }, 1000);
</script>
</body>`;

  if (!content.includes('Hide Elfsight Watermark Hack')) {
    content = content.replace('</script>\r\n\r\n</body>', hackCode).replace('</script>\n\n</body>', hackCode).replace('</script>\n</body>', hackCode);
    fs.writeFileSync(filepath, content);
    console.log(`Patched ${filepath}`);
  }
}

patchFile('public/gallery.html');
patchFile('public/index.html');
