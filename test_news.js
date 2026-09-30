const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('live_index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const news = [
  {
    title: 'സമസ്ത പ്രാർത്ഥനദിനം',
    description: 'സമസ്ത പ്രാർത്ഥനദിനം',
    imageUrl: '/api/media/tg/AgACAgUAAxkDAANEaruE-RGv-f65gQbkU8yl26awv_wAAroQaxuWQNhVXi2PQVMpJkMBAAMCAAN4AAM9BA',
    telegramFileId: 'AgACAgUAAxkDAANEaruE-RGv-f65gQbkU8yl26awv_wAAroQaxuWQNhVXi2PQVMpJkMBAAMCAAN4AAM9BA',
    _id: '8dcfe1aaa5e95694eadaf40d',
    createdAt: '2026-09-29T09:29:29.886Z'
  },
  {
    title: 'Test2',
    description: 'Content2',
    _id: 'd4a1f9717721bdbed3d002a3',
    createdAt: '2026-09-11T06:46:37.864Z'
  }
];

var container = document.getElementById('dynamicNews');
if (!container) {
    console.log("NO dynamicNews CONTAINER!");
} else {
    var cardsHtml = '';
    news.forEach(function(item) {
      var imgHtml = '';
      if (item.imageUrl) {
        imgHtml = '<div style="flex-shrink:0; width: 140px; height: 140px; padding: 15px;">' +
          '<img src="' + item.imageUrl + '" alt="' + item.title + '" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="this.onerror=null;this.src=\'img/new_logo.png\';">' +
          '</div>';
      } else {
        imgHtml = '<div style="flex-shrink:0; width: 140px; height: 140px; padding: 15px;">' +
          '<div style="width: 100%; height: 100%; background:linear-gradient(135deg, #0a4d2e 0%, #0f6b3f 100%); display:flex; align-items:center; justify-content:center; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">' +
          '<i class="fa fa-newspaper-o" style="color:#d4af37; font-size:30px;"></i>' +
          '</div></div>';
      }
      cardsHtml += '<div class="col-12 mb-4">' +
        '<div style="background:#fff; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.06); display:flex; align-items:center; overflow:hidden; transition:transform 0.3s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'none\'">' +
        imgHtml +
        '<div style="padding: 15px 20px; flex: 1;">' +
        '  <h4 style="font-family:\'Outfit\',sans-serif; color:#000; font-weight:700; font-size:1.6rem; margin:0 0 8px 0;">' + item.title + '</h4>' +
        '  <p style="color:#0056b3; font-size:1.05rem; line-height:1.5; margin:0;">' + (item.description || '') + '</p>' +
        '</div>' +
        '</div></div>';
    });
    container.innerHTML = cardsHtml;
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    console.log("FINAL HTML:");
    console.log(document.getElementById('services').outerHTML);
}
