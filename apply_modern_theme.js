const fs = require('fs');

const themeCSS = `
    /* MODERN THEME UPGRADE */
    :root {
      --primary: #0d47a1;
      --primary-light: #1e88e5;
      --primary-dark: #071f3d;
      --accent: #38bdf8;
      --accent-light: #7dd3fc;
      --bg: #061121;
      --bg-card: rgba(13, 27, 49, 0.75);
      --bg-card-2: rgba(20, 42, 74, 0.65);
      --text: #f0f4f8;
      --text-soft: #a0aec0;
      --border: rgba(255, 255, 255, 0.08);
      --border-soft: rgba(255, 255, 255, 0.04);
      --shadow-sm: 0 4px 12px rgba(0,0,0,0.15);
      --shadow-lg: 0 12px 32px rgba(0,0,0,0.4);
      --radius: 16px;
    }
    body {
      background: linear-gradient(135deg, var(--bg), #081d3a);
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
      background: linear-gradient(135deg, #0d47a1, #1e88e5) !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 50px !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 15px rgba(13, 71, 161, 0.35) !important;
      transition: all 0.3s ease !important;
    }
    .btn-accent:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(30, 136, 229, 0.5) !important;
      background: linear-gradient(135deg, #1e88e5, #0d47a1) !important;
    }
    input.form-control, select.form-control, textarea.form-control {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid var(--border) !important;
      color: var(--text) !important;
      border-radius: 8px !important;
    }
    input.form-control:focus, select.form-control:focus, textarea.form-control:focus {
      border-color: #1e88e5 !important;
      box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.25) !important;
    }
    .nav-pills .nav-link.active {
      background: linear-gradient(135deg, #0d47a1, #1e88e5) !important;
      border: 1px solid #1e88e5 !important;
      color: #ffffff !important;
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
