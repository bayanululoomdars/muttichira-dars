const fs = require('fs');

let content = fs.readFileSync('public/gallery.html', 'utf8');

// Remove the override logic block
const overrideBlockRegex = /\/\/ OVERRIDE TABS FOR ELFSIGHT[\s\S]*?igTabs\.style\.display = 'flex';\s*}/;
content = content.replace(overrideBlockRegex, "var igTabs = document.getElementById('igTabs');\n              if (igTabs) igTabs.style.display = 'none';");

// Remove the filterElfsight function
const filterFuncRegex = /function filterElfsight\([\s\S]*?}\s*}\s*}\s*\);\s*}/;
content = content.replace(filterFuncRegex, "");

fs.writeFileSync('public/gallery.html', content);
console.log("Removed tabs and filter function from gallery.html");
