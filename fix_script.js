const fs = require('fs');

function fixIgScript(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Replace the fragment logic
  const oldLogic1 = `var frag = document.createRange().createContextualFragment(s.igEmbedCode);
              igCont.appendChild(frag);`;
  const oldLogic2 = `var frag = document.createRange().createContextualFragment(s.igEmbedCode);\r\n              igCont.appendChild(frag);`;
  const oldLogic3 = `var frag = document.createRange().createContextualFragment(s.igEmbedCode);\n              igCont.appendChild(frag);`;
  
  const newLogic = `igCont.innerHTML = s.igEmbedCode;
              var scripts = igCont.getElementsByTagName('script');
              for (var i = 0; i < scripts.length; i++) {
                var sTag = document.createElement('script');
                if (scripts[i].src) sTag.src = scripts[i].src;
                else sTag.innerHTML = scripts[i].innerHTML;
                document.body.appendChild(sTag);
              }`;

  if (content.includes('createContextualFragment(s.igEmbedCode)')) {
    content = content.replace(/var frag = document\.createRange\(\)\.createContextualFragment\(s\.igEmbedCode\);\s*igCont\.appendChild\(frag\);/g, newLogic);
    fs.writeFileSync(filepath, content);
    console.log(`Fixed scripts in ${filepath}`);
  }
}

fixIgScript('public/index.html');
fixIgScript('public/gallery.html');
