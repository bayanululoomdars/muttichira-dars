const fs = require('fs');

let html = fs.readFileSync('public/gallery.html', 'utf-8');

// Replace YouTube iframe
html = html.replace(
  `'<iframe src="https://www.youtube.com/embed/' + ytid + '" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>'`,
  `'<iframe src="https://www.youtube.com/embed/' + ytid + '?autoplay=1&mute=1&loop=1&playlist=' + ytid + '" style="width:100%;height:100%;border:none;" allow="autoplay; fullscreen" allowfullscreen></iframe>'`
);

// Replace Instagram link with Embed iframe
const oldInsta = `mediaHtml = '<a href="' + imgUrl + '" target="_blank" style="display:flex; align-items:center; justify-content:center; height:100%; color:#fff; text-decoration:none;"><i class="fa fa-instagram" style="font-size:50px; color:#e1306c; margin-right:10px;"></i> Watch on Instagram</a>';`;

const newInsta = `
            var igUrl = imgUrl.split('?')[0];
            if (!igUrl.endsWith('/')) igUrl += '/';
            igUrl += 'embed/captioned';
            mediaHtml = '<iframe src="' + igUrl + '" style="width:100%;height:100%;border:none;background:#fff;border-radius:12px;" scrolling="yes" allowtransparency="true" allow="encrypted-media"></iframe>';
`;

html = html.replace(oldInsta, newInsta);

fs.writeFileSync('public/gallery.html', html);
console.log('gallery.html patched for video embeds');
