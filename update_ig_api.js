const http = require('http');

const data = JSON.stringify({
  igEmbedCode: '<script src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer></script><div class="elfsight-app-79b0e8f2-3c43-4f68-bffe-80effbf72d9c" data-elfsight-app-lazy></div>'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/home-settings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
