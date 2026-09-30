const fs = require('fs');

const themeCSS = `
    /* MODERN THEME UPGRADE */
    :root {
      --primary: #043d21;
      --primary-light: #0a5c34;
      --primary-dark: #022413;
      --accent: #d4af37;
      --accent-light: #f5d66c;
      --bg: #09101a;
      --bg-card: rgba(20, 31, 46, 0.7);
      --bg-card-2: rgba(30, 45, 65, 0.6);
      --text: #f0f4f8;
      --text-soft: #a0aec0;
      --border: rgba(255, 255, 255, 0.08);
      --border-soft: rgba(255, 255, 255, 0.04);
      --shadow-sm: 0 4px 12px rgba(0,0,0,0.15);
      --shadow-lg: 0 12px 32px rgba(0,0,0,0.4);
      --radius: 16px;
    }
    body {
      background: linear-gradient(135deg, var(--bg), #061517);
      color: var(--text);
      font-family: 'Inter', sans-serif;
    }
    .card, .portal-card, .login-container {
      background: var(--bg-card) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      border: 1px solid var(--border) !important;
      border-radius: var(--radius) !important;
      box-shadow: var(--shadow-lg) !important;
    }
    .btn-accent {
      background: linear-gradient(135deg, var(--accent), #c29b2b) !important;
      color: #000 !important;
      border: none !important;
      border-radius: 50px !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3) !important;
      transition: all 0.3s ease !important;
    }
    .btn-accent:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4) !important;
    }
    input.form-control, select.form-control, textarea.form-control {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid var(--border) !important;
      color: var(--text) !important;
      border-radius: 8px !important;
    }
    input.form-control:focus, select.form-control:focus, textarea.form-control:focus {
      border-color: var(--accent) !important;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2) !important;
    }
    .nav-pills .nav-link.active {
      background: rgba(212, 175, 55, 0.15) !important;
      border: 1px solid var(--accent) !important;
      color: var(--accent) !important;
      border-radius: 50px !important;
    }
    .nav-pills .nav-link {
      color: var(--text-soft) !important;
      border-radius: 50px !important;
      transition: all 0.3s ease;
    }
    .nav-pills .nav-link:hover {
      background: rgba(255,255,255,0.05) !important;
    }
`;

function injectTheme(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('/* MODERN THEME UPGRADE */')) {
    html = html.replace('</style>', themeCSS + '\n  </style>');
    fs.writeFileSync(file, html);
    console.log('Injected modern theme into ' + file);
  }
}

injectTheme('public/index.html');
injectTheme('public/login.html');
injectTheme('public/admin.html');
