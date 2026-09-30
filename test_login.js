const fetch = require('node-fetch'); // node-fetch might not be here, I'll use http
const http = require('http');

const postData = JSON.stringify({
  role: 'student',
  identifier: '1',
  password: '1'
});

const options = {
  hostname: 'localhost',
  port: 10000,
  path: '/api/portal/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Data:', data));
});
req.write(postData);
req.end();
