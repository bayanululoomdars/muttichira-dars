const fs = require('fs');
const html = fs.readFileSync('public/admin.html','utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes("onclick=\"editUserAdmin(")) {
        console.log(l);
    }
});
