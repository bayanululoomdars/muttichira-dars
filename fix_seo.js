const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

const jsonld = `
  <!-- AI & Search Engine Understanding (Schema.org) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Muttichira Bayanul Uloom Dars",
    "alternateName": ["Muttichira Dars", "Al Bayan Muttichira", "Bayanul Uloom Dars"],
    "url": "https://muttichira-dars.onrender.com/",
    "logo": "https://muttichira-dars.onrender.com/img/new_logo.png",
    "description": "The official website of Muttichira Bayanul Uloom Dars, a premier Islamic educational institution."
  }
  </script>
</head>`;

if (!c.includes('application/ld+json')) {
    c = c.replace('</head>', jsonld);
    fs.writeFileSync('public/index.html', c);
    console.log('Added structured data successfully.');
} else {
    console.log('Already exists.');
}
