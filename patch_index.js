const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');
content = content.replace(
  '<div id="igEmbedContainerHome" style="width:100%; text-align:center; display:none; margin-bottom: 30px;"></div>',
  `<div id="igEmbedContainerHome" style="width:100%; text-align:center; display:none; margin-bottom: 30px; max-height: 600px; overflow: hidden; position: relative; border-radius: 15px;">
    <div style="position:absolute; bottom:0; left:0; right:0; height:100px; background:linear-gradient(transparent, #f4f8f5); z-index:99; pointer-events:none;"></div>
  </div>`
);
fs.writeFileSync('public/index.html', content);
