const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(/animateCounter\('counterStudents', s\.statsStudents.*?;/g, "/* overriden */");
html = html.replace(/animateCounter\('counterAlumni', s\.statsAlumni.*?;/g, "/* overriden */");
html = html.replace(/if \(s\.statsStudents\) document\.getElementById\('aboutStudentsCount'\)\.textContent = s\.statsStudents;/, 
`
          fetch('/api/portal/counter')
            .then(function(r) { return r.json(); })
            .then(function(data) {
              if (data && data.success && data.stats) {
                animateCounter('counterStudents', data.stats.currentStudents || 0);
                animateCounter('counterAlumni', data.stats.alumniBiruthadhari || 0);
                document.getElementById('aboutStudentsCount').textContent = data.stats.currentStudents || 0;
                document.getElementById('aboutUstadsCount').textContent = data.stats.totalUsthads || 0;
              }
            }).catch(function() {});
`);

fs.writeFileSync('public/index.html', html);
console.log('Patched index.html regex');
