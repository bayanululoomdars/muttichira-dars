const fs = require('fs');

function fixLoginHtml() {
  let html = fs.readFileSync('public/login.html', 'utf8');
  
  // Fix missing closing divs before usthadDashContent
  html = html.replace('<div id="usthadDashContent"', '</div></div>\\n<div id="usthadDashContent"');
  
  // Move all modals to the end of body to prevent stacking context z-index issues
  const modals = [];
  let currentHtml = html;
  
  const modalRegex = /<div class="modal fade" id=".*?">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;
  // Actually, capturing exactly the modal boundaries using Regex is risky if divs are unbalanced inside them.
  // We can just rely on the fact that I already know modal placement is fine but the CSS was broken.
  // Wait, earlier I removed the conflicting CSS from style.css.
  
  fs.writeFileSync('public/login.html', html);
  console.log('Fixed missing divs.');
}

function fixAdminHtml() {
  let html = fs.readFileSync('public/admin.html', 'utf8');
  let o = (html.match(/<div/g)||[]).length;
  let c = (html.match(/<\/div>/g)||[]).length;
  console.log('Admin divs before:', o, c, o-c);
  
  if (o > c) {
    const diff = o - c;
    html = html.replace('</body>', '</div>'.repeat(diff) + '\\n</body>');
    fs.writeFileSync('public/admin.html', html);
    console.log('Fixed admin missing divs by appending at body end.');
  }
}

fixLoginHtml();
fixAdminHtml();

