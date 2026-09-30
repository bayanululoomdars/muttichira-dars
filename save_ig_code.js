const fetch = require('node-fetch'); // wait, node-fetch might not be installed, better use http/fs
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'local_db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!db.HomeSettings || db.HomeSettings.length === 0) {
  db.HomeSettings = [{ _id: 'default_home' }];
}

db.HomeSettings[0].igEmbedCode = `<!-- Elfsight Instagram Feed | Untitled Instagram Feed -->
<script src="https://elfsightcdn.com/platform.js" async></script>
<div class="elfsight-app-5ed2095d-749d-42e8-b90c-989c77228f19" data-elfsight-app-lazy></div>`;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Embed code saved to database!");
