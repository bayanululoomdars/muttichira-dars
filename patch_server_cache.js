const fs = require('fs');
let js = fs.readFileSync('server.js', 'utf8');

const middleware = `
// Cache buster middleware
app.use((req, res, next) => {
  if (req.method === 'GET') {
    if (req.path === '/admin.html' || req.path === '/login.html' || req.path === '/index.html' || req.path === '/') {
      const v = '5';
      if (req.query.v !== v) {
        let newUrl = req.path === '/' ? '/index.html' : req.path;
        return res.redirect(302, newUrl + '?v=' + v);
      }
    }
  }
  next();
});
`;

if (!js.includes('Cache buster middleware')) {
  js = js.replace('const app = express();', 'const app = express();\n' + middleware);
  fs.writeFileSync('server.js', js);
  console.log('Added cache buster middleware to server.js');
} else {
  console.log('Already added cache buster');
}
