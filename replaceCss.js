const fs = require('fs');
let css = fs.readFileSync('public/css/custom.css', 'utf8');

const oldCss = `.brochure-launcher-bar {
  width: 100%;
  background: #0a3d1f;
  padding: 16px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid #d4af37;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  position: relative;
  z-index: 10;
}

.bar-logo {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.launch-btn {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.launch-btn:hover {
  background: #d4af37;
  color: #0a3d1f;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}`;

const newCss = `.brochure-launcher-bar {
  width: 100%;
  background: linear-gradient(135deg, #0ba360 0%, #3cba92 100%);
  padding: 24px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid #067041;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(11, 163, 96, 0.25), 0 5px 15px rgba(0,0,0,0.08);
  position: relative;
  z-index: 10;
}

.bar-logo {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.launch-btn {
  background: #ffffff;
  color: #0ba360;
  border: none;
  padding: 10px 24px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.launch-btn:hover {
  background: #f4f8f5;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.2);
  color: #0a4d2e;
}`;

css = css.replace(oldCss, newCss);
fs.writeFileSync('public/css/custom.css', css);
console.log('Replaced CSS successfully');
