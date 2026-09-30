const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const regex = /'<td><code style="color:var\(--text-soft\);">'\s*\+\s*phoneVal\s*\+\s*'<\/code><\/td>'\s*\+\s*'<td><div class="action-buttons">'/;
html = html.replace(regex, `'<td><code style="color:var(--text-soft);">' + phoneVal + '</code></td>' +
      '<td><code style="color:var(--accent);">' + (u.password || phoneVal) + '</code></td>' +
      '<td><div class="action-buttons">'`);

fs.writeFileSync('public/admin.html', html);
console.log('Fixed password column in table body');
