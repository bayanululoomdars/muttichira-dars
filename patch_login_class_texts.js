const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

html = html.replace(/selectOptions \+= `<option value="\$\{s\.admissionNo\}">\$\{s\.name\} \(\$\{s\.admissionNo\}\) - \$\{s\.className \|\| 'Dars'\}<\/option>`;/g, "selectOptions += `<option value=\"${s.admissionNo}\">${s.name} (${s.admissionNo}) - Batch ${s.batchNumber || '1'}</option>`;");
html = html.replace(/<td>\$\{s\.className \|\| 'Dars'\}<\/td>/g, "<td>Batch ${s.batchNumber || '1'}</td>");
html = html.replace(/bannerTitle\.textContent = `Configured Subjects for \$\{className\}:`;/g, "bannerTitle.textContent = `Configured Subjects for Batch ${className}:`;");
html = html.replace(/No students enrolled in \$\{className\}\./g, "No students enrolled in Batch ${className}.");
html = html.replace(/alert\('Please select a valid Exam and Class with students'\);/g, "alert('Please select a valid Exam and Batch with students');");

fs.writeFileSync('public/login.html', html);
console.log('Fixed login.html class texts');
