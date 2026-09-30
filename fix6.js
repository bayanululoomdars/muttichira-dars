const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

const oldStr = `        </div>\r\n    </section><!-- #portfolio -->`;

const newStr = `        </div>

        <!-- Explore More Button -->
        <div class="text-center" style="margin: 20px 0 30px;">
          <a href="/gallery" style="display:inline-flex; align-items:center; gap:8px; padding:12px 28px; background:linear-gradient(135deg, #0a4d2e, #106b3f); color:#fff; border-radius:30px; font-weight:700; text-decoration:none; box-shadow:0 4px 15px rgba(10,77,46,0.25); transition:transform 0.3s; font-size:1rem;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
            <i class="fa fa-th"></i> Explore Full Gallery
          </a>
        </div>

      </div>
    </section><!-- #portfolio -->`;

c = c.replace(oldStr, newStr);

fs.writeFileSync('public/index.html', c);
const ok = c.includes('Explore Full Gallery');
console.log('done - button ' + (ok ? 'ADDED ✓' : 'NOT added ✗'));
