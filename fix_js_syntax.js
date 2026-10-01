const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

const lines = html.split('\\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Also populate msgUsthadSelect')) {
    newLines.push(lines[i]);
    // keep pushing until we hit the '});' that closes it
    let j = i + 1;
    while (j < lines.length && !lines[j].includes('Usthad Dashboard Loader')) {
      newLines.push(lines[j]);
      j++;
    }
    
    // Now we must fix the extra closing braces in the accumulated lines.
    // The last few lines should just be:
    //         }
    //       }
    //     });
    // }
    //
    // So let's look at the end of newLines and clean it up.
    
    // Let's pop lines until we reach 'sel.innerHTML = opts;'
    while(newLines.length > 0 && !newLines[newLines.length - 1].includes('sel.innerHTML = opts;')) {
      newLines.pop();
    }
    // Now push the correct closing braces:
    newLines.push('            }');
    newLines.push('          }');
    newLines.push('        });');
    newLines.push('    }');
    newLines.push('');
    
    i = j - 1; // advance i to just before "Usthad Dashboard Loader"
  } else {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync('public/login.html', newLines.join('\\n'));
console.log('Fixed syntax by replacing lines');
