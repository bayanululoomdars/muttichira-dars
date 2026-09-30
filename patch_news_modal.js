const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

const editNewsModalHtml = `
<!-- Edit News Modal -->
<div class="modal-overlay" id="editNewsModal">
  <div class="modal-box">
    <button class="modal-close-btn" onclick="closeModal('editNewsModal')">&times;</button>
    <div class="modal-title"><i class="fa fa-edit"></i> Edit News</div>
    <form onsubmit="submitEditNews(event)">
      <input type="hidden" id="editNewsId">
      <div class="form-group">
        <label class="form-label">Title *</label>
        <input class="form-control" type="text" id="editNewsTitle" required>
      </div>
      <div class="form-group">
        <label class="form-label">Description *</label>
        <textarea class="form-control" id="editNewsDesc" rows="3" required></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Update Image (optional)</label>
        <input class="form-control" type="file" id="editNewsImage" accept="image/*">
        <small class="text-muted">Leave empty to keep existing image</small>
      </div>
      <div id="editNewsStatus" style="color:var(--accent); margin-bottom:15px;"></div>
      <button type="submit" class="btn btn-accent"><i class="fa fa-save"></i> Save Changes</button>
    </form>
  </div>
</div>
`;

if (!html.includes('id="editNewsModal"')) {
    html = html.replace('EDIT GALLERY MODAL', 'EDIT GALLERY MODAL\n-->\n' + editNewsModalHtml + '\n<!--');
    fs.writeFileSync('public/admin.html', html);
    console.log("Added editNewsModal");
} else {
    console.log("Already exists");
}
