const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const showToastJS = `
    function showToast(msg, isError = false) {
      // Remove existing toast if any
      const existing = document.getElementById('globalToast');
      if (existing) existing.remove();
      
      const bg = isError ? 'bg-danger' : 'bg-success';
      const icon = isError ? 'fa-exclamation-circle' : 'fa-check-circle';
      
      const toastHtml = \`
        <div id="globalToast" class="toast align-items-center text-white \${bg} border-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: fixed; bottom: 20px; right: 20px; z-index: 1060; min-width: 250px;">
          <div class="d-flex">
            <div class="toast-body font-weight-bold">
              <i class="fa \${icon} mr-2"></i> \${msg}
            </div>
            <button type="button" class="close text-white mr-2 m-auto" data-dismiss="toast" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      \`;
      
      document.body.insertAdjacentHTML('beforeend', toastHtml);
      $('#globalToast').toast({ delay: 3000 }).toast('show');
    }
`;

if (!html.includes('function showToast')) {
  html = html.replace('function showAlert(msg, type) {', showToastJS + '\n\n    function showAlert(msg, type) {');
  fs.writeFileSync('public/login.html', html);
  console.log('showToast added to login.html');
} else {
  console.log('showToast already exists');
}
