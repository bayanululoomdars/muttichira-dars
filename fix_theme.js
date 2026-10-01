const fs = require('fs');

// 1. Fix Index.html (Digital Book Background)
let idxStr = fs.readFileSync('public/index.html', 'utf8');

idxStr = idxStr.replace(
  'background: linear-gradient(135deg, #073a21 0%, #03140a 100%); border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.5); box-shadow: 0 20px 50px rgba(0,0,0,0.5);',
  'background: linear-gradient(135deg, #ffffff 0%, #f4f8f5 100%); border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.1);'
);

// Update text color inside digital book
idxStr = idxStr.replace(
  '<h2 style="color: #d4af37; font-size: 2.8rem; font-weight: 800; font-family: \'Outfit\', sans-serif; margin: 0; line-height: 1.2; text-shadow: 0 4px 10px rgba(0,0,0,0.6);">',
  '<h2 style="color: #0a4d2e; font-size: 2.8rem; font-weight: 800; font-family: \'Outfit\', sans-serif; margin: 0; line-height: 1.2;">'
);
idxStr = idxStr.replace(
  'ഡിജിറ്റൽ<br><span style="color: #ffffff;">കൈപ്പുസ്തകം</span>',
  'ഡിജിറ്റൽ<br><span style="color: #063821;">കൈപ്പുസ്തകം</span>'
);
idxStr = idxStr.replace(
  '<p style="color: #ffffff; font-size: 1.15rem; font-weight: 500; line-height: 1.7; margin: 5px 0 15px 0; max-width: 500px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">',
  '<p style="color: #475569; font-size: 1.15rem; font-weight: 500; line-height: 1.7; margin: 5px 0 15px 0; max-width: 500px;">'
);
idxStr = idxStr.replace(
  'background: rgba(212,175,55,0.2); color: #e6c86a; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 700; width: max-content; border: 1px solid rgba(212,175,55,0.5); text-transform: uppercase; letter-spacing: 1px;',
  'background: rgba(212,175,55,0.15); color: #b45309; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 700; width: max-content; border: 1px solid rgba(212,175,55,0.4); text-transform: uppercase; letter-spacing: 1px;'
);
idxStr = idxStr.replace(
  '<div style="position: absolute; bottom: -100px; right: -50px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(10,77,46,0.6) 0%, transparent 70%); pointer-events: none;"></div>',
  '<div style="position: absolute; bottom: -100px; right: -50px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(10,77,46,0.15) 0%, transparent 70%); pointer-events: none;"></div>'
);

fs.writeFileSync('public/index.html', idxStr);

// 2. Fix login.html (Portal Dark Mode -> White Mode)
let logStr = fs.readFileSync('public/login.html', 'utf8');

const oldCss = `:root {
      --bg: #090f11;
      --bg-card: #111a1c;
      --bg-card-2: #162427;
      --border: #1f3133;
      --border-soft: #2a3f42;
      --text: #e2e8f0;
      --text-muted: #94a3b8;
      --text-soft: #cbd5e1;
      --accent: #d4af37;
      --accent-dim: rgba(212, 175, 55, 0.15);
      --bg-input: #0b1416;
      --shadow-sm: 0 4px 6px rgba(0,0,0,0.3);
      --shadow-md: 0 8px 15px rgba(0,0,0,0.4);
      --shadow-lg: 0 15px 30px rgba(0,0,0,0.5);
    }`;

const newCss = `:root {
      --bg: #f8fafc;
      --bg-card: #ffffff;
      --bg-card-2: #f1f5f9;
      --border: #e2e8f0;
      --border-soft: #cbd5e1;
      --text: #1e293b;
      --text-muted: #64748b;
      --text-soft: #475569;
      --accent: #0a4d2e;
      --accent-dim: rgba(10, 77, 46, 0.1);
      --bg-input: #ffffff;
      --shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 10px rgba(0,0,0,0.08);
      --shadow-lg: 0 10px 25px rgba(0,0,0,0.12);
    }`;

logStr = logStr.replace(oldCss, newCss);

// Fix login portal body background style override if it exists
logStr = logStr.replace('background: linear-gradient(135deg, var(--bg), #061517);', 'background: var(--bg);');

fs.writeFileSync('public/login.html', logStr);

console.log('Fixed themes.');
