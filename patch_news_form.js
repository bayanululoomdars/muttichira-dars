const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// Step 1: Extract the contents of newsForm
const newsFormRegex = /<form id="newsForm"[\s\S]*?<\/form>/;
const newsFormMatch = html.match(newsFormRegex);
if (newsFormMatch) {
    const newsFormHtml = newsFormMatch[0];
    
    // Replace the inline form with a button
    html = html.replace(
        newsFormRegex,
        '<div style="padding: 15px;"><button class="btn btn-accent" onclick="openModal(\'addNewsModal\')"><i class="fa fa-plus"></i> Add News / Achievement</button></div>'
    );
    
    // Step 2: Inject addNewsModal
    const addNewsModalHtml = `
<!-- Add News Modal -->
<div class="modal-overlay" id="addNewsModal">
  <div class="modal-box">
    <button class="modal-close-btn" onclick="closeModal('addNewsModal')">&times;</button>
    <div class="modal-title"><i class="fa fa-newspaper-o"></i> Add News</div>
    ${newsFormHtml}
  </div>
</div>
`;
    // Insert before editNewsModal
    html = html.replace('<!-- Edit News Modal -->', addNewsModalHtml + '\n<!-- Edit News Modal -->');
    fs.writeFileSync('public/admin.html', html);
    console.log("Converted newsForm to addNewsModal");
} else {
    console.log("newsForm not found");
}

