const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// Remove Usthad ID from HTML form
html = html.replace(/<div class="form-group">\s*<label class="form-label">Usthad ID[\s\S]*?<\/div>/g, (match) => {
    if (match.includes('adminUsthadId')) return '';
    return match;
});

// Remove Usthad ID from JS switchUnifiedRole mapping and save logic
html = html.replace("safeSetVal('adminUsthadId', user.usthadId);", "");
html = html.replace("fd.append('usthadId', safeGetValue('adminUsthadId'));", "");

fs.writeFileSync('public/admin.html', html);
console.log('Removed Usthad ID from admin.html');
