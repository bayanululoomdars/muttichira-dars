const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

c = c.replace(/<!-- Instagram Embed Container -->[\s\S]*?<\/div>\s*<\/div>/, 
`<!-- Instagram Embed Container -->
        <div id="igEmbedContainerHome" style="width:100%; text-align:center; display:block; margin-bottom: 30px; position: relative; border-radius: 15px;">
          <div class="sk-instagram-feed" data-embed-id="25717938"></div><script src="https://widgets.sociablekit.com/instagram-feed/widget.js" defer></script>
        </div>`);

fs.writeFileSync('public/index.html', c);
console.log('done');
