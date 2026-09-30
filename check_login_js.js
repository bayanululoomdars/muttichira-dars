const fs = require('fs');
const html = fs.readFileSync('public/login.html', 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/g);
if (scriptMatch) {
    const scriptCode = scriptMatch.map(s => s.replace(/<\/?script>/g, '')).join('\n');
    try {
        require('vm').Script(scriptCode);
        console.log('JS syntax is valid.');
    } catch (e) {
        console.error('JS Syntax Error in login.html:', e);
    }
} else {
    console.log('No scripts found.');
}
