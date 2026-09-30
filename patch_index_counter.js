const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const regexCounter = /function animateCounter\(id, target\) \{[\s\S]*?var current = 0;[\s\S]*?var step = Math\.max\(1, Math\.floor\(numTarget \/ 40\)\);[\s\S]*?var timer = setInterval\(function\(\) \{[\s\S]*?el\.textContent = current;\s*\}, 30\);\s*\}/;

const newCounterLogic = `// Store active timers
    const activeTimers = {};

    function animateCounter(id, target) {
      var el = document.getElementById(id);
      if (!el) return;

      if (activeTimers[id]) {
        clearInterval(activeTimers[id]);
      }

      var strTarget = String(target || '');
      var hasPlus = strTarget.includes('+');
      var numTarget = parseInt(strTarget, 10) || 0;
      if (numTarget <= 0) {
        el.textContent = strTarget;
        return;
      }
      var current = 0;
      var step = Math.max(1, Math.floor(numTarget / 40));
      activeTimers[id] = setInterval(function() {
        current += step;
        if (current >= numTarget) {
          current = numTarget;
          clearInterval(activeTimers[id]);
        }
        el.textContent = current + (hasPlus ? '+' : '');
      }, 30);
    }`;

html = html.replace(regexCounter, newCounterLogic);
fs.writeFileSync('public/index.html', html);
console.log('Fixed animateCounter blinking issue in index.html');
