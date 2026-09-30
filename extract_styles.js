const fs = require('fs');
const html = fs.readFileSync('public/admin.html', 'utf8');
const styles = html.match(/<style>[\s\S]*?<\/style>/g);
if (styles) {
    styles.forEach((s, i) => {
        console.log(`--- Style Block ${i} ---`);
        console.log(s);
    });
} else {
    console.log("No style tags");
}
