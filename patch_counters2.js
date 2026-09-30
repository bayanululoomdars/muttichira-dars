const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Replace the stats assignment logic
const originalLogic = `          // Dynamic About Us counts
          if (s.statsStudents) document.getElementById('aboutStudentsCount').textContent = s.statsStudents;
          if (s.statsUstads) document.getElementById('aboutUstadsCount').textContent = s.statsUstads;`;

const newLogic = `          // Dynamic About Us counts
          // Override counters with LIVE portal API data
          fetch('/api/portal/counter')
            .then(function(r) { return r.json(); })
            .then(function(data) {
              if (data && data.success && data.stats) {
                animateCounter('counterStudents', data.stats.currentStudents || 0);
                animateCounter('counterAlumni', data.stats.alumniBiruthadhari || 0);
                document.getElementById('aboutStudentsCount').textContent = data.stats.currentStudents || 0;
                document.getElementById('aboutUstadsCount').textContent = data.stats.totalUsthads || 0;
              }
            })
            .catch(function() {});`;

html = html.replace(originalLogic, newLogic);
fs.writeFileSync('public/index.html', html);
console.log('Patched index.html for live counters part 2');
