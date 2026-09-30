const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const startIdx = html.indexOf('<!-- Existing Exams List -->');
const endIdx = html.indexOf('<!-- Student Roster Overview -->', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    // There might be some div closing tags before "Student Roster Overview" that I need to keep.
    // Let's just remove the card itself.
    const blockStart = html.indexOf('<div class="card"', startIdx);
    const blockEnd = html.indexOf('</div>\n        </div>', blockStart);
    
    // Actually let's use regex to remove exactly the block starting from <!-- Existing Exams List --> up to the last </div> before <!-- Student Roster Overview -->
    // Let's just remove from <!-- Existing Exams List --> to the end of its div.
    
    const block = html.substring(startIdx, endIdx);
    
    // Remove it
    html = html.replace(block, '');
    fs.writeFileSync('public/login.html', html);
    console.log('Removed Existing Exams List from login.html');
} else {
    console.log('Could not find block');
}
