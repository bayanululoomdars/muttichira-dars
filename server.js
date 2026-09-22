require('dotenv').config();
const express = require('express');
const path = require('path');

// Import modular configuration and middleware
const { loadDbFromTelegram } = require('./config/telegramDB');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000, httpOnly: true }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gallery.html')));
app.get('/admission', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admission.html')));
app.get(['/about', '/about-us', '/about us', '/about  us'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get(['/contact', '/contact-us', '/contact us'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get(['/login', '/Login'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get(['/admin', '/Admin'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

app.use(errorHandler);

const startServer = async () => {
  await loadDbFromTelegram();
  app.listen(PORT, () => {
    console.log(`🚀 AL BAYAN server running (Telegram DB) at http://localhost:${PORT}`);
  });
};

startServer();
