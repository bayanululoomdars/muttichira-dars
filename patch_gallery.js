const fs = require('fs');
let content = fs.readFileSync('public/gallery.html', 'utf8');

const oldCode = `    function loadFooterSettings() {
      fetch('/api/home-settings')
        .then(res => res.json())
        .then(s => {
          var fName = document.getElementById('footerMudarrisNameEl');
          var fTitle = document.getElementById('footerMudarrisTitleEl');
          var fDetail = document.getElementById('footerMudarrisDetailEl');
          if (fName && s.footerMudarrisName) fName.textContent = s.footerMudarrisName;
          if (fTitle && s.footerMudarrisTitle) fTitle.textContent = s.footerMudarrisTitle;
          if (fDetail && s.footerMudarrisDetail) fDetail.textContent = s.footerMudarrisDetail;
        });
    }`;

const newCode = `    function loadFooterSettings() {
      fetch('/api/home-settings')
        .then(res => res.json())
        .then(s => {
          var fName = document.getElementById('footerMudarrisNameEl');
          var fTitle = document.getElementById('footerMudarrisTitleEl');
          var fDetail = document.getElementById('footerMudarrisDetailEl');
          if (fName && s.footerMudarrisName) fName.textContent = s.footerMudarrisName;
          if (fTitle && s.footerMudarrisTitle) fTitle.textContent = s.footerMudarrisTitle;
          if (fDetail && s.footerMudarrisDetail) fDetail.textContent = s.footerMudarrisDetail;
          
          if (s.igEmbedCode) {
            var igCont = document.getElementById('igEmbedContainerGallery');
            if (igCont) {
              igCont.innerHTML = '';
              var frag = document.createRange().createContextualFragment(s.igEmbedCode);
              igCont.appendChild(frag);
              igCont.style.display = 'block';
              
              var gGrid = document.getElementById('galleryGrid');
              var cBar = document.querySelector('.ig-filters');
              if (gGrid) gGrid.style.display = 'none';
              if (cBar) cBar.style.display = 'none';
            }
          }
        });
    }`;

// Normalize line endings to help match
let normContent = content.replace(/\r\n/g, '\n');
let normOld = oldCode.replace(/\r\n/g, '\n');

if (normContent.includes(normOld)) {
  normContent = normContent.replace(normOld, newCode);
  fs.writeFileSync('public/gallery.html', normContent);
  console.log('Successfully replaced!');
} else {
  console.log('Not found!');
}
