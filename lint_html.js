const fs = require('fs');

const lines = fs.readFileSync('public/admin.html', 'utf8').split('\n');

let stack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('<div class="page"')) {
    const idMatch = line.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : 'unknown';
    console.log(`\n--- Page started: ${id} at line ${i+1}`);
    stack.push({tag: 'page', line: i+1, id: id});
  } else if (line.includes('<div')) {
    const count = (line.match(/<div/g) || []).length;
    for(let c=0; c<count; c++) stack.push({tag: 'div', line: i+1});
  }
  
  if (line.includes('</div')) {
    const count = (line.match(/<\/div/g) || []).length;
    for(let c=0; c<count; c++) {
      const popped = stack.pop();
      if (popped && popped.tag === 'page') {
        console.log(`--- Page closed: ${popped.id} at line ${i+1}`);
      }
    }
  }
}

if (stack.length > 0) {
  console.log('UNCLOSED TAGS DETECTED:');
  stack.forEach(s => console.log(s));
} else {
  console.log('All tags closed properly.');
}
