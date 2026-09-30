const fetch = require('node-fetch'); // wait, I can just use http
const http = require('http');

http.get('http://localhost:10000/api/portal/students', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(data.substring(0, 1000));
    });
});
