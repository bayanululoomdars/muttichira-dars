const http = require('https');

const data = JSON.stringify({
  igEmbedCode: `<!-- Elfsight Instagram Feed | Untitled Instagram Feed -->
<script src="https://elfsightcdn.com/platform.js" async></script>
<div class="elfsight-app-5ed2095d-749d-42e8-b90c-989c77228f19" data-elfsight-app-lazy></div>`
});

const options = {
  hostname: 'muttichira-dars.onrender.com',
  port: 443,
  path: '/api/home-settings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  },
  rejectUnauthorized: false
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(data);
req.end();
