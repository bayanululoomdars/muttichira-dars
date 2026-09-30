const fs = require('fs');
let content = fs.readFileSync('public/gallery.html', 'utf8');

const replacementJS = `
          if (s.igEmbedCode) {
            var igCont = document.getElementById('igEmbedContainerGallery');
            if (igCont) {
              igCont.innerHTML = '';
              var frag = document.createRange().createContextualFragment(s.igEmbedCode);
              igCont.appendChild(frag);
              igCont.style.display = 'block';
              
              var gGrid = document.getElementById('galleryGrid');
              if (gGrid) gGrid.style.display = 'none';

              // OVERRIDE TABS FOR ELFSIGHT
              var igTabs = document.getElementById('igTabs');
              if (igTabs) {
                igTabs.innerHTML = \`
                  <button class="ig-tab-btn active" onclick="filterElfsight('all', this)"><i class="fa fa-th"></i> All</button>
                  <button class="ig-tab-btn" onclick="filterElfsight('posts', this)"><i class="fa fa-image"></i> Posts</button>
                  <button class="ig-tab-btn" onclick="filterElfsight('reels', this)"><i class="fa fa-video-camera"></i> Reels</button>
                \`;
                igTabs.style.display = 'flex';
              }
            }
          }
`;

// Replace the loadFooterSettings block inner logic
content = content.replace(/if \(s\.igEmbedCode\) {[\s\S]*?if \(cBar\) cBar\.style\.display = 'none';\s*}\s*}/, replacementJS.trim());

// Add filterElfsight function
const filterFunction = `
    function filterElfsight(type, btn) {
      document.querySelectorAll('.ig-tab-btn').forEach(b => b.classList.remove('active'));
      if(btn) btn.classList.add('active');

      var apps = document.querySelectorAll('[class*="elfsight-app"]');
      apps.forEach(app => {
        if (app.shadowRoot) {
          var items = app.shadowRoot.querySelectorAll('.eapps-instagram-feed-item');
          items.forEach(item => {
            if (type === 'all') {
              item.style.display = '';
            } else if (type === 'reels') {
              // Assume reels have video icon
              var isVideo = item.querySelector('.eapps-instagram-feed-item-type-video') || item.innerHTML.includes('video') || item.innerHTML.includes('play');
              item.style.display = isVideo ? '' : 'none';
            } else if (type === 'posts') {
              var isVideo = item.querySelector('.eapps-instagram-feed-item-type-video') || item.innerHTML.includes('video') || item.innerHTML.includes('play');
              item.style.display = isVideo ? 'none' : '';
            }
          });
          // Hide load more button when filtering to avoid messing up elfsight's internal state
          var loadMore = app.shadowRoot.querySelector('.eapps-instagram-feed-posts-view-more');
          if (loadMore) {
            loadMore.style.display = (type === 'all') ? '' : 'none';
          }
        }
      });
    }
</script>
</body>`;

content = content.replace('</script>\n</body>', filterFunction).replace('</script>\r\n</body>', filterFunction);

fs.writeFileSync('public/gallery.html', content);
