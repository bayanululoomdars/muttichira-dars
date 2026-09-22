const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf-8');

const targetOld = `if (Array.isArray(news) && news.length > 0) {
              allLoadedNewsItems = news;`;

const targetNew = `if (Array.isArray(news) && news.length > 0) {
              allLoadedNewsItems = news;
            } else {
              container.innerHTML = '<div class="col-12 text-center" style="color:#999; padding:40px;">No latest news available right now.</div>';
              return;
            }
            if (Array.isArray(news) && news.length > 0) {`;

html = html.replace(targetOld, targetNew);

fs.writeFileSync('public/index.html', html);
console.log('patched index');
