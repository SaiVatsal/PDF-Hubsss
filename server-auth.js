require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

// Ensure directories exist
const srcDir = path.join(__dirname, 'src');
const dataDir = path.join(__dirname, 'data');
[srcDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Users storage file
const usersFile = path.join(dataDir, 'users.json');
const users = fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile, 'utf8')) : {};

const saveUsers = () => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport setup
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, users[id] || null);
});

passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = Object.values(users).find(u => u.email === email);
      if (!user) return done(null, false, { message: 'Invalid email or password' });
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return done(null, false, { message: 'Invalid email or password' });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use('google', new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      let user = Object.values(users).find(u => u.googleId === profile.id);
      
      if (!user) {
        const userId = `google_${profile.id}`;
        user = {
          id: userId,
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          createdAt: new Date().toISOString(),
        };
        users[userId] = user;
        saveUsers();
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Auth middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

// Routes - Auth
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }
    
    if (Object.values(users).some(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `local_${Date.now()}`;
    
    users[userId] = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    
    saveUsers();
    
    req.logIn(users[userId], (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      res.json({ 
        success: true, 
        message: 'Registration successful',
        user: {
          id: users[userId].id,
          email: users[userId].email,
          name: users[userId].name,
        }
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/login', passport.authenticate('local'), (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.post('/auth/logout', (req, res) => {
  req.logOut((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true, message: 'Logged out' });
  });
});

app.get('/auth/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    avatar: req.user.avatar,
  });
});

// Routes - Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('');
  console.log('✅ PDF Hub Server with Auth Running!');
  console.log(`📌 Open your browser to: http://${HOST}:${PORT}`);
  console.log(`🔐 Login: http://${HOST}:${PORT}/login`);
  console.log(`📝 Register: http://${HOST}:${PORT}/register`);
  console.log(`🏥 Health: http://${HOST}:${PORT}/health`);
  console.log(`🚀 Press Ctrl+C to stop the server`);
  console.log('');
});

module.exports = app;
