const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const regexToReplace = /animateCounter\('counterStudents', 111\);\s*animateCounter\('counterUstads', 8\);\s*animateCounter\('counterYears', calcYears\);\s*animateCounter\('counterAlumni', 0\);/;
html = html.replace(regexToReplace, '// Initial animation deferred to fetch');

const regexFetch = /fetch\('\/api\/portal\/counter'\)[\s\S]*?animateCounter\('counterAlumni', data\.stats\.alumniBiruthadhari \|\| 0\);/g;

const newFetch = `fetch('/api/portal/counter')
            .then(function(r) { return r.json(); })
            .then(function(data) {
              if (data && data.success && data.stats) {
                animateCounter('counterStudents', data.stats.currentStudents || 0);
                animateCounter('counterAlumni', data.stats.alumniBiruthadhari || 0);
                animateCounter('counterUstads', data.stats.totalUsthads || 0);
                animateCounter('counterYears', data.stats.yearsOfTradition || calcYears);`;

html = html.replace(/fetch\('\/api\/portal\/counter'\)[\s\S]*?animateCounter\('counterAlumni', data\.stats\.alumniBiruthadhari \|\| 0\);/, newFetch);

// Also remove the old fetch HomeSettings logic that animate counterUstads and counterYears
const oldHomeSettingsRegex = /animateCounter\('counterUstads', s\.statsUstads !== undefined \? s\.statsUstads : 8\);\s*animateCounter\('counterYears', s\.statsYears !== undefined \? s\.statsYears : calcYears\);/g;
html = html.replace(oldHomeSettingsRegex, '// Handled by api/portal/counter');

fs.writeFileSync('public/index.html', html);
console.log('Fixed counter animations in index.html');
