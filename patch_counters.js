const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// The original logic gets home-settings and animates. Let's find it.
html = html.replace(/fetch\('\/api\/home-settings'\)[\s\S]*?animateCounter\('counterYears', s\.statsYears !== undefined \? s\.statsYears : 25\);\s*}\s*\)\.catch\(\(\) => \{\}\);/, (match) => {
    return match + `\n
    // Fetch live portal counters to override manual settings
    fetch('/api/portal/counter').then(r=>r.json()).then(data=>{
      if(data.success && data.stats) {
        animateCounter('counterStudents', data.stats.currentStudents || 0);
        animateCounter('counterAlumni', data.stats.alumniBiruthadhari || 0);
        // animateCounter('counterUsthads', data.stats.totalUsthads || 0);
        document.getElementById('aboutStudentsCount').textContent = data.stats.currentStudents || 0;
        document.getElementById('aboutUstadsCount').textContent = data.stats.totalUsthads || 0;
      }
    }).catch(()=>{});`;
});

fs.writeFileSync('public/index.html', html);
console.log('Patched index.html for live counters');
