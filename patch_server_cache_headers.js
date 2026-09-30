const fs = require('fs');

let js = fs.readFileSync('server.js', 'utf8');

// Replace the old cache buster with a robust header setter
const robustCacheMiddleware = `
// Robust Cache Prevention for HTML pages
app.use((req, res, next) => {
  if (req.method === 'GET') {
    const isHtml = req.path.endsWith('.html') || ['/', '/admin', '/login', '/home', '/gallery', '/admission', '/about', '/contact'].includes(req.path.toLowerCase());
    if (isHtml) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }
  }
  next();
});
`;

js = js.replace(/\/\/ Cache buster middleware[\s\S]*?next\(\);\n\}\);\n/, robustCacheMiddleware);

// Make sure to remove the old manual redirects if I missed them
fs.writeFileSync('server.js', js);
console.log('Patched server.js with robust cache headers');
