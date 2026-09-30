const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const regex = /<div class="col-lg-5 col-md-12 footer-mudarris">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="container">/g;

const newBlock = `<div class="col-lg-5 col-md-12 footer-mudarris">
            <h4>PRINCIPAL MUDARRIS:</h4>
            <p style="margin-bottom: 8px;"><strong><span style="font-size: 15px;">Sheikhuna Ibrahim Baqavi Al Haithami</span></strong><br><span style="color:#d4af37; font-weight:600; font-size:0.8rem;">ASSISTANT MUDARRIS:</span></p>
            <p><strong>Usthad Mansoor Faizy<br> Usthad Musthafa Baqavi<br> Usthad Jahfar Jalali<br> Usthad Abdulla Faizy<br> Usthad Shameem Jalali<br> Usthad Rashid Baqavi<br> Usthad Shan Baqavi<br> Usthad Shafeeq Jalali</strong><span style="color:#e0e0e0; font-size:0.95rem; line-height:1.6; display:inline-block; margin-top:4px;"></span></p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">`;

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let c = fs.readFileSync(filePath, 'utf8');
    
    // First try a generic replace based on the existing content pattern
    if (c.includes('Usthad Shan Baqavi')) {
        c = c.replace(/Usthad Shan Baqavi(?:<\/strong>|<br>)/g, 'Usthad Shan Baqavi<br> Usthad Shafeeq Jalali</strong>');
        // Let's also fix the font size span typo that was in the original: `<span style="font: size 15px;">` -> `font-size: 15px;`
        c = c.replace(/font:\s*size\s*15px;/g, 'font-size: 15px;');
        
        fs.writeFileSync(filePath, c);
        console.log('Updated', file);
    }
});
console.log('Done');
