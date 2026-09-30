const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// 1. Remove defaults
html = html.replace('<div class="num" id="cntStudents">111</div>', '<div class="num" id="cntStudents">0</div>');
html = html.replace('<div class="num" id="cntUsthads">8</div>', '<div class="num" id="cntUsthads">0</div>');
html = html.replace('<div class="num" id="cntYears">25</div>', '<div class="num" id="cntYears">0</div>');

// 2. Add animation logic
const oldLoadStats = `function loadCounterStats() {
      fetch('/api/portal/counter')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.stats) {
            document.getElementById('cntAlumni').textContent = data.stats.alumniBiruthadhari;
            document.getElementById('cntStudents').textContent = data.stats.currentStudents;
            document.getElementById('cntUsthads').textContent = data.stats.totalUsthads;
            document.getElementById('cntYears').textContent = data.stats.yearsOfTradition || String(new Date().getFullYear() - 2001);
          }
        });
    }`;

const newLoadStats = `function animateCounterLogin(id, target) {
      let current = 0;
      const el = document.getElementById(id);
      if (!el) return;
      const increment = Math.ceil(target / 50) || 1;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 30);
    }

    function loadCounterStats() {
      fetch('/api/portal/counter')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.stats) {
            animateCounterLogin('cntAlumni', Number(data.stats.alumniBiruthadhari) || 0);
            animateCounterLogin('cntStudents', Number(data.stats.currentStudents) || 0);
            animateCounterLogin('cntUsthads', Number(data.stats.totalUsthads) || 0);
            animateCounterLogin('cntYears', Number(data.stats.yearsOfTradition) || Number(new Date().getFullYear() - 1999));
          }
        });
    }`;

html = html.replace(oldLoadStats, newLoadStats);

fs.writeFileSync('public/login.html', html);
console.log('Fixed default values and added animations in login.html');
