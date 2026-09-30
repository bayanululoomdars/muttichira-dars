const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

html = html.replace(
  '<button class="btn btn-outline-secondary btn-sm portal-filter-btn active" id="pfilter-student" onclick="setPortalFilter(\'student\')" style="font-weight:bold; padding:8px 16px;">Manage Students & Alumni</button>',
  '<button class="btn btn-outline-secondary btn-sm portal-filter-btn active" id="pfilter-student" onclick="setPortalFilter(\'student\')" style="font-weight:bold; padding:8px 16px;">Manage Students & Alumni <span id="badge-students" style="background:#0a4d2e;color:white;border-radius:12px;padding:2px 8px;font-size:12px;margin-left:5px;">0</span></button>'
);

html = html.replace(
  '<button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-usthad" onclick="setPortalFilter(\'usthad\')" style="font-weight:bold; padding:8px 16px;">Manage Usthads</button>',
  '<button class="btn btn-outline-secondary btn-sm portal-filter-btn" id="pfilter-usthad" onclick="setPortalFilter(\'usthad\')" style="font-weight:bold; padding:8px 16px;">Manage Usthads <span id="badge-usthads" style="background:#0a4d2e;color:white;border-radius:12px;padding:2px 8px;font-size:12px;margin-left:5px;">0</span></button>'
);

fs.writeFileSync('public/admin.html', html);
console.log('Added badges to filter buttons');
