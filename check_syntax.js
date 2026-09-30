const fs = require('fs');
const { execSync } = require('child_process');

function extractScripts(filename) {
  const html = fs.readFileSync(filename, 'utf8');
  const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
  let match;
  let i = 0;
  let hasError = false;
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    fs.writeFileSync(`temp_${i}.js`, scriptContent);
    try {
      execSync(`node -c temp_${i}.js`, { stdio: 'pipe' });
    } catch (e) {
      console.log(`Syntax error in ${filename} script block ${i}:`);
      console.log(e.stderr.toString());
      hasError = true;
    }
    fs.unlinkSync(`temp_${i}.js`);
    i++;
  }
  if (!hasError) console.log(`${filename}: All inline scripts have valid syntax.`);
}

extractScripts('public/index.html');
extractScripts('public/login.html');
extractScripts('public/admin.html');
