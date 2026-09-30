const fs = require('fs');

function addCacheBustAndVersion(file) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Add meta tags for no cache
  if (!html.includes('no-cache')) {
    html = html.replace('<head>', `<head>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">`);
  }
  
  // Add version badge to footer or bottom right
  if (!html.includes('Version 2.1')) {
    html = html.replace('</body>', `
  <div style="position:fixed; bottom:10px; right:10px; font-size:12px; color:rgba(255,255,255,0.3); z-index:9999; pointer-events:none;">
    Version 2.1
  </div>
</body>`);
  }
  
  fs.writeFileSync(file, html);
}

addCacheBustAndVersion('public/login.html');
addCacheBustAndVersion('public/admin.html');
addCacheBustAndVersion('public/index.html');
console.log('Added Cache-Control and Version 2.1 to HTML pages');
