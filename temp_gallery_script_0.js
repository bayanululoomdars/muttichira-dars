
    let currentUser = null;
    let googleClientId = '';
    let allGalleryItems = [];
    let currentFilter = 'all';
    let activeDetailPost = null;

    // Load google authentication client id
    fetch('/api/auth/google/client-id')
      .then(res => res.json())
      .then(data => {
        googleClientId = data.clientId;
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse
        });
        
        google.accounts.id.renderButton(
          document.getElementById('googleBtnContainer'),
          { theme: 'outline', size: 'large', text: 'signin_with' }
        );

        var savedUser = sessionStorage.getItem('bud_user');
        if (savedUser) {
           currentUser = JSON.parse(savedUser);
           showUserInNavbar();
        }
      });

    function showUserInNavbar() {
      var authLi = document.getElementById('authContainer');
      authLi.innerHTML = '<span style="color:#fff; font-size:0.9rem; display:flex; align-items:center; gap:6px;"><img src="' + currentUser.picture + '" style="width:24px; border-radius:50%;">' + currentUser.name.split(' ')[0] + ' <button onclick="logout()" style="background:none;border:none;color:var(--accent);font-size:0.8rem;cursor:pointer;padding:0;">Logout</button></span>';
    }

    function handleCredentialResponse(response) {
      fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          currentUser = data.user;
          sessionStorage.setItem('bud_user', JSON.stringify(data.user));
          showUserInNavbar();
          document.getElementById('loginPopupModal').style.display = 'none';
          if (activeDetailPost) {
            // refresh active detail modal content
            openPostDetail(activeDetailPost._id);
          }
        }
      })
      .catch(err => console.error('Auth error', err));
    }

    function logout() {
      currentUser = null;
      sessionStorage.removeItem('bud_user');
      location.reload();
    }

    function triggerLoginPopup() {
      document.getElementById('loginPopupModal').style.display = 'flex';
      google.accounts.id.prompt();
    }

    // Load active stories
    function loadStories() {
      fetch('/api/stories')
        .then(res => res.json())
        .then(stories => {
          if (stories && stories.length > 0) {
            var container = document.getElementById('storyBar');
            var html = '';
            stories.forEach(s => {
              html += '<div class="story-circle-wrapper" onclick="viewStory(\'' + s.imageUrl + '\', \'' + (s.title || '') + '\')">';
              html += '  <div class="story-ring"><img src="' + s.imageUrl + '"></div>';
              html += '  <div class="story-title">' + (s.title || 'Story') + '</div>';
              html += '</div>';
            });
            container.innerHTML = html;
            container.style.display = 'flex';
          }
        });
    }

    // View Story Fullscreen
    function viewStory(url, title) {
      document.getElementById('storyViewerImg').src = url;
      document.getElementById('storyViewerTitle').textContent = title || 'Bayanul Uloom Dars Story';
      document.getElementById('storyViewer').style.display = 'flex';
    }
    function closeStory() {
      document.getElementById('storyViewer').style.display = 'none';
    }

    // Load Gallery Grid
    function loadGallery() {
      fetch('/api/settings/gallery-categories')
        .then(res => res.json())
        .then(data => {
          if(data.categories) {
             var tabsHtml = '<button class="ig-tab-btn active" id="tab-all" onclick="filterGallery(\'all\')"><i class="fa fa-th"></i> All Posts</button>';
             data.categories.forEach(cat => {
                tabsHtml += '<button class="ig-tab-btn" id="tab-' + cat + '" onclick="filterGallery(\'' + cat + '\')">' + cat + '</button>';
             });
             var igTabs = document.getElementById('igTabs');
             if(igTabs) igTabs.innerHTML = tabsHtml;
          }
        })
        .finally(() => {
          fetch('/api/gallery')
            .then(res => res.json())
            .then(items => {
              allGalleryItems = items || [];
              renderGrid();
            });
        });
    }

    // Render 3-Column Square Grid based on filter
    function renderGrid() {
      var grid = document.getElementById('galleryGrid');
      var filtered = allGalleryItems;

      if (currentFilter !== 'all') {
        filtered = allGalleryItems.filter(item => item.category === currentFilter);
      }

      // Sort: Pinned items first for "all" tab, then by date
      if (currentFilter === 'all') {
        filtered.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }

      var html = '';
      filtered.forEach(item => {
        html += '<div class="ig-grid-item" onclick="openPostDetail(\'' + item._id + '\')">';
        
        // Pin/Reels Badge overlays
        if (item.pinned) {
          html += '  <div class="ig-badge-overlay"><i class="fa fa-thumb-tack"></i></div>';
        } else if (item.mediaType === 'video') {
          html += '  <div class="ig-badge-overlay"><i class="fa fa-play"></i></div>';
        }

        // Media Element
        var imgUrl = item.imageUrl || '';
        if (item.mediaType === 'video') {
          if (imgUrl.includes('youtube.com') || imgUrl.includes('youtu.be')) {
            html += '<div style="background:#000; width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><i class="fa fa-youtube-play" style="color:red; font-size:40px;"></i></div>';
          } else if (imgUrl.includes('instagram.com')) {
            html += '<div style="background:#000; width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><i class="fa fa-instagram" style="color:#e1306c; font-size:40px;"></i></div>';
          } else {
            html += '<video src="' + imgUrl + '" autoplay muted playsinline loop></video>';
          }
        } else {
          var finalImg = imgUrl ? imgUrl : 'img/new_logo.png';
          html += '  <img src="' + finalImg + '" alt="' + (item.title || '') + '" onerror="this.onerror=null;this.src=\'img/new_logo.png\';">';
        }

        // Hover overlay
        html += '  <div class="ig-hover-overlay">';
        html += '    <span><i class="fa fa-heart"></i> ' + (item.likes ? item.likes.length : 0) + '</span>';
        html += '    <span><i class="fa fa-comment"></i> ' + (item.comments ? item.comments.length : 0) + '</span>';
        html += '  </div>';

        html += '</div>';
      });

      grid.innerHTML = html || '<div class="col-12 text-center py-5 text-muted">No posts available under this tab</div>';
    }

    // Filter Gallery Tabs
    window.filterGallery = function(tabName) {
      currentFilter = tabName;
      document.querySelectorAll('.ig-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('tab-' + tabName).classList.add('active');
      renderGrid();
    };

    // Open Instagram-Style Post Detail View
    window.openPostDetail = function(postId) {
      var item = allGalleryItems.find(i => i._id === postId);
      if (!item) return;
      activeDetailPost = item;

      // Render Media
      var mediaContainer = document.getElementById('modalMediaContainer');
      var mediaHtml = '';
      var imgUrl = item.imageUrl || '';
      
      if (item.mediaType === 'video') {
        if (imgUrl.includes('youtube.com') || imgUrl.includes('youtu.be') || imgUrl.includes('shorts')) {
          var ytid = getYouTubeId(imgUrl);
          if (ytid) {
             mediaHtml = '<iframe src="https://www.youtube.com/embed/' + ytid + '?autoplay=1&mute=1&loop=1&playlist=' + ytid + '" style="width:100%;height:100%;border:none;" allow="autoplay; fullscreen" allowfullscreen></iframe>';
          } else {
             mediaHtml = '<a href="' + imgUrl + '" target="_blank" style="display:flex; align-items:center; justify-content:center; height:100%; color:#fff; text-decoration:none;"><i class="fa fa-youtube-play" style="font-size:50px; color:red; margin-right:10px;"></i> Watch on YouTube</a>';
          }
        } else if (imgUrl.includes('instagram.com')) {
          
            var igUrl = imgUrl.split('?')[0];
            if (!igUrl.endsWith('/')) igUrl += '/';
            igUrl += 'embed/captioned';
            mediaHtml = '<iframe src="' + igUrl + '" style="width:100%;height:100%;border:none;background:#fff;border-radius:12px;" scrolling="yes" allowtransparency="true" allow="encrypted-media"></iframe>';

        } else {
          mediaHtml = '<video id="modalVideo" src="' + imgUrl + '" controls autoplay muted playsinline loop style="max-height:80vh; max-width:100%; cursor:pointer;" onclick="this.muted=false;"></video>';
        }
      } else {
        var finalImg = imgUrl ? imgUrl : 'img/new_logo.png';
        mediaHtml = '<img src="' + finalImg + '" alt="' + (item.title || '') + '" style="max-height:80vh; max-width:100%; object-fit:contain;" onerror="this.onerror=null;this.src=\'img/new_logo.png\';">';
      }
      mediaContainer.innerHTML = mediaHtml;

      // Caption & Title
      document.getElementById('modalCaption').innerHTML = '<strong>muttichira_dars</strong> ' + item.title + (item.description ? '<br><span style="color:#555;font-size:0.85rem;">' + item.description + '</span>' : '');
      
      // Hashtags
      var hashtagsContainer = document.getElementById('modalHashtags');
      var tagHtml = '';
      if (item.hashtags && item.hashtags.length > 0) {
        item.hashtags.forEach(tag => {
          tagHtml += '<a href="#" class="ig-hashtag">#' + tag + '</a> ';
        });
      }
      hashtagsContainer.innerHTML = tagHtml;

      // Likes count
      document.getElementById('modalLikesCount').textContent = item.likes ? item.likes.length : 0;
      
      // Post Date
      var dateText = new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
      document.getElementById('modalPostDate').textContent = dateText;

      // Like Button (Heart) Red state
      var heartBtn = document.getElementById('modalHeartBtn');
      var currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;
      var isLiked = false;
      if (currentUserId && item.likes) {
        isLiked = item.likes.some(like => typeof like === 'object' ? like._id === currentUserId : like === currentUserId);
      }
      if (isLiked) {
        heartBtn.classList.add('liked');
      } else {
        heartBtn.classList.remove('liked');
      }

      // Comments List
      renderModalComments(item.comments);

      // Open Modal
      document.getElementById('postDetailModal').style.display = 'flex';
    };

    function renderModalComments(comments) {
      var container = document.getElementById('modalCommentsList');
      var html = '';
      if (comments && comments.length > 0) {
        comments.forEach(c => {
          var name = c.user ? c.user.name : 'User';
          var pic = (c.user && c.user.picture) ? c.user.picture : 'img/new_logo.png';
          html += '<div class="ig-comment-item">';
          html += '  <img src="' + pic + '" alt="user">';
          html += '  <div class="ig-comment-content">';
          html += '    <strong>' + name + '</strong> ' + c.text;
          html += '    <span class="ig-comment-date">' + new Date(c.date).toLocaleDateString() + '</span>';
          html += '  </div>';
          html += '</div>';
        });
      }
      container.innerHTML = html;
    }

    // Like Action inside modal
    window.likeCurrentPost = function() {
      if (!currentUser) {
        triggerLoginPopup();
        return;
      }
      if (!activeDetailPost) return;
      var id = activeDetailPost._id;
      var currentUserId = currentUser._id || currentUser.id;
      if (!currentUserId) {
        triggerLoginPopup();
        return;
      }

      fetch('/api/gallery/' + id + '/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          var item = allGalleryItems.find(i => i._id === id);
          if (item) {
            // Update likes count from server response
            document.getElementById('modalLikesCount').textContent = res.likes;
            var heartBtn = document.getElementById('modalHeartBtn');
            if (res.alreadyLiked) {
              heartBtn.classList.add('liked');
              showToast('You already liked this post!');
            } else {
              // Add to local likes array so hover count updates
              var isLiked = item.likes.some(like => typeof like === 'object' ? String(like._id) === String(currentUserId) : String(like) === String(currentUserId));
              if (!isLiked) { item.likes.push(currentUserId); }
              heartBtn.classList.add('liked');
              renderGrid();
            }
          }
        } else {
          showToast(res.message || 'Could not like. Please try again.');
        }
      })
      .catch(() => showToast('Network error. Please check your connection.'));
    };


    // Post comment inside modal
    window.postCommentCurrent = function() {
      if (!currentUser) {
        triggerLoginPopup();
        return;
      }
      if (!activeDetailPost) return;
      var input = document.getElementById('modalCommentInput');
      var text = input.value.trim();
      if (!text) return;

      var id = activeDetailPost._id;
      var currentUserId = currentUser._id || currentUser.id;
      fetch('/api/gallery/' + id + '/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, text: text })
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          input.value = '';
          // Update local state comments
          var item = allGalleryItems.find(i => i._id === id);
          if (item) {
            item.comments = res.comments;
            renderModalComments(res.comments);
            renderGrid();
          }
        }
      });
    };

    window.shareCurrentPost = function() {
      if (!activeDetailPost) return;
      if (navigator.share) {
        navigator.share({
          title: activeDetailPost.title,
          text: 'Check out this post from Bayanul Uloom Dars Gallery!',
          url: window.location.origin + '/gallery'
        });
      } else {
        alert('Sharing url: ' + window.location.origin + '/gallery');
      }
    };

    window.focusCommentInput = function() {
      document.getElementById('modalCommentInput').focus();
    };

    window.closePostDetail = function() {
      document.getElementById('postDetailModal').style.display = 'none';
      document.getElementById('modalMediaContainer').innerHTML = '';
      activeDetailPost = null;
    };

    function getYouTubeId(url) {
      if (!url) return null;
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
      var match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }

    // Load home page settings (mudarris details) for footer
    function loadFooterSettings() {
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
              igCont.innerHTML = s.igEmbedCode;
              var scripts = igCont.getElementsByTagName('script');
              for (var i = 0; i < scripts.length; i++) {
                var sTag = document.createElement('script');
                if (scripts[i].src) sTag.src = scripts[i].src;
                else sTag.innerHTML = scripts[i].innerHTML;
                document.body.appendChild(sTag);
              }
              igCont.style.display = 'block';
              
              var gGrid = document.getElementById('galleryGrid');
              if (gGrid) gGrid.style.display = 'none';

              var igTabs = document.getElementById('igTabs');
              if (igTabs) igTabs.style.display = 'none';
            }
          }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
      loadStories();
      loadGallery();
      loadFooterSettings();
    });
  