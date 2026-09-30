const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

const oldBlock = `        <!-- Instagram Embed Container -->
        <div id="igEmbedContainerHome" style="width:100%; text-align:center; display:none; margin-bottom: 30px; max-height: 600px; overflow: hidden; position: relative; border-radius: 15px;">
    <div style="position:absolute; bottom:0; left:0; right:0; height:100px; background:linear-gradient(transparent, #f4f8f5); z-index:99; pointer-events:none;"></div>
  </div>`;

const newBlock = `        <!-- Instagram Embed Container -->
        <div id="igEmbedContainerHome" style="width:100%; text-align:center; display:block; margin-bottom: 30px; position: relative; border-radius: 15px;">
          <div class="sk-instagram-feed" data-embed-id="25717938"></div><script src="https://widgets.sociablekit.com/instagram-feed/widget.js" defer></script>
        </div>`;

c = c.replace(oldBlock, newBlock);

fs.writeFileSync('public/index.html', c);
console.log('done');
