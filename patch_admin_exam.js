const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// Replace UI labels for Exam
html = html.replace('<label class="form-label">Target Class</label>', '<label class="form-label">Target Batch Number</label>');
html = html.replace(/newExamClass/g, 'newExamBatchNo');

const oldOptions = `<option value="Dars 3rd Year">Dars 3rd Year</option>
                    <option value="Dars 2nd Year">Dars 2nd Year</option>
                    <option value="Dars 1st Year">Dars 1st Year</option>
                    <option value="Dars Senior">Dars Senior</option>
                    <option value="Dars Junior">Dars Junior</option>
                    <option value="Dars Sub Junior">Dars Sub Junior</option>`;
const newOptions = `<option value="1">Batch 1</option>
                    <option value="2">Batch 2</option>
                    <option value="3">Batch 3</option>
                    <option value="4">Batch 4</option>
                    <option value="5">Batch 5</option>
                    <option value="6">Batch 6</option>`;
html = html.replace(oldOptions, newOptions);

// Also remove Batch Year from exam creation, since we only use Batch Number now!
// Wait, the user said "ക്ലാസ്സ് അതേപോലെ ക്ലാസ്, ബാച്ച് ഇയർ എന്നിവ വേണ്ട, ബാച്ച് നമ്പർ മാത്രം മതി" for students. 
// For exams: "ഓരോ ബാച്ച് നമ്പറും വെച്ച് ആ ബാച്ചിന് ഏതൊക്കെ പരീക്ഷകളുണ്ട്...". So Batch Number is enough.
html = html.replace(/<div class="form-group">\s*<label class="form-label">Batch Year<\/label>\s*<input type="text" id="newExamBatch" class="form-control" value="2025">\s*<\/div>/g, '');

fs.writeFileSync('public/admin.html', html);
console.log('Patched admin.html exam creation');
