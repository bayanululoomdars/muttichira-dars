const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

c = c.replace(/<!-- Instagram Embed Container -->[\s\S]*?<\/div>\s*<\/div>/, 
`<!-- Instagram Embed Container -->
        <div id="igEmbedContainerHome" style="width:100%; text-align:center; display:block; margin-bottom: 30px; position: relative; border-radius: 15px;">
          <!-- Elfsight Instagram Feed | Untitled Instagram Feed -->
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div class="elfsight-app-79b0e8f2-3c43-4f68-bffe-80effbf72d9c" data-elfsight-app-lazy></div>
        </div>`);

fs.writeFileSync('public/index.html', c);
console.log('done');
