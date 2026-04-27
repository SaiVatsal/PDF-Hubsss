#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const dirs = ['public', 'data'];

console.log('🔐 Setting up PDF Hub with Authentication System...\n');

// Create directories
dirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created ${dir}/`);
  }
});

// Copy main PDF Hub file
const pdfHubPath = path.join(baseDir, 'pdf-hub.html');
const publicPdfPath = path.join(baseDir, 'public', 'pdf-hub.html');
if (fs.existsSync(pdfHubPath) && !fs.existsSync(publicPdfPath)) {
  fs.copyFileSync(pdfHubPath, publicPdfPath);
  console.log('✓ Copied pdf-hub.html to public/');
}

// Create index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF Hub - Welcome</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: white;
      border-radius: 12px;
      padding: 60px 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .logo { font-size: 64px; margin-bottom: 20px; }
    h1 { color: #333; font-size: 36px; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 18px; margin-bottom: 40px; }
    .buttons { display: flex; gap: 12px; justify-content: center; }
    a {
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }
    .btn-login {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102,126,234,0.3);
    }
    .btn-register {
      border: 2px solid #667eea;
      color: #667eea;
      background: transparent;
    }
    .btn-register:hover {
      background: #f5f7ff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">📄</div>
    <h1>Welcome to PDF Hub</h1>
    <p class="subtitle">Secure PDF storage and management platform</p>
    <div class="buttons">
      <a href="/login" class="btn-login">Sign In</a>
      <a href="/register" class="btn-register">Create Account</a>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(baseDir, 'public', 'index.html'), indexHtml);
console.log('✓ Created public/index.html');

// Create login.html
const loginHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - PDF Hub</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 420px;
      padding: 20px;
    }
    .login-box {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      padding: 40px;
    }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-icon { font-size: 48px; margin-bottom: 10px; }
    h1 { font-size: 28px; color: #333; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px; }
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }
    input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .login-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }
    .login-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102,126,234,0.3); }
    .divider { display: flex; align-items: center; margin: 25px 0; color: #999; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #ddd; }
    .divider span { padding: 0 10px; font-size: 13px; }
    .oauth-btn {
      display: block;
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      color: #333;
      transition: all 0.2s;
    }
    .oauth-btn:hover { background: #f5f5f5; border-color: #999; }
    .links { display: flex; justify-content: space-between; margin-top: 20px; font-size: 13px; }
    .links a { color: #667eea; text-decoration: none; }
    .links a:hover { text-decoration: underline; }
    .error { color: #e74c3c; font-size: 13px; margin-top: 5px; display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="login-box">
      <div class="logo">
        <div class="logo-icon">📄</div>
        <h1>PDF Hub</h1>
        <p class="subtitle">Sign in to your account</p>
      </div>

      <form id="loginForm">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="you@example.com" required>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="••••••••" required>
        </div>

        <button type="submit" class="login-btn">Sign In</button>
        <div class="error" id="formError"></div>
      </form>

      <div class="divider"><span>or</span></div>

      <a href="/auth/google" class="oauth-btn">🔵 Continue with Google</a>

      <div class="links">
        <a href="/register">Create account</a>
        <a href="/">Back to home</a>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Login failed');
        }
        
        window.location.href = '/dashboard';
      } catch (error) {
        document.getElementById('formError').textContent = error.message;
        document.getElementById('formError').style.display = 'block';
      }
    });
  </script>
</body>
</html>\`;

fs.writeFileSync(path.join(baseDir, 'public', 'login.html'), loginHtml);
console.log('✓ Created public/login.html');

// Create register.html
const registerHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register - PDF Hub</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container { width: 100%; max-width: 420px; padding: 20px; }
    .register-box {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      padding: 40px;
    }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-icon { font-size: 48px; margin-bottom: 10px; }
    h1 { font-size: 28px; color: #333; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px; }
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }
    input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .register-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }
    .register-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102,126,234,0.3); }
    .links { margin-top: 20px; text-align: center; font-size: 13px; }
    .links a { color: #667eea; text-decoration: none; }
    .links a:hover { text-decoration: underline; }
    .error { color: #e74c3c; font-size: 13px; margin-top: 5px; display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="register-box">
      <div class="logo">
        <div class="logo-icon">📄</div>
        <h1>PDF Hub</h1>
        <p class="subtitle">Create your account</p>
      </div>

      <form id="registerForm">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" placeholder="John Doe" required>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="you@example.com" required>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="••••••••" required>
        </div>

        <button type="submit" class="register-btn">Create Account</button>
        <div class="error" id="formError"></div>
      </form>

      <div class="links">
        <a href="/login">Already have an account? Sign in</a>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const res = await fetch('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Registration failed');
        }
        
        window.location.href = '/dashboard';
      } catch (error) {
        document.getElementById('formError').textContent = error.message;
        document.getElementById('formError').style.display = 'block';
      }
    });
  </script>
</body>
</html>\`;

fs.writeFileSync(path.join(baseDir, 'public', 'register.html'), registerHtml);
console.log('✓ Created public/register.html');

// Create dashboard.html
const dashboardHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - PDF Hub</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
    }
    .navbar {
      background: white;
      border-bottom: 1px solid #eee;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .logo { font-size: 24px; font-weight: 600; color: #333; }
    .user-menu { display: flex; align-items: center; gap: 15px; }
    .user-info { text-align: right; }
    .user-name { font-weight: 600; color: #333; }
    .user-email { font-size: 12px; color: #666; }
    .logout-btn {
      padding: 8px 16px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }
    .logout-btn:hover { background: #c0392b; }
    .container {
      max-width: 1000px;
      margin: 40px auto;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    h2 { color: #333; margin-bottom: 15px; }
    .welcome { color: #666; font-size: 16px; }
  </style>
</head>
<body>
  <div class="navbar">
    <div class="logo">📄 PDF Hub</div>
    <div class="user-menu">
      <div class="user-info">
        <div class="user-name" id="userName">Loading...</div>
        <div class="user-email" id="userEmail"></div>
      </div>
      <button class="logout-btn" onclick="logout()">Logout</button>
    </div>
  </div>

  <div class="container">
    <div class="card">
      <h2>Welcome to Your Dashboard!</h2>
      <p class="welcome">You are securely logged in. Upload and manage your PDFs here.</p>
    </div>
  </div>

  <script>
    async function loadUser() {
      try {
        const res = await fetch('/auth/user');
        if (!res.ok) {
          window.location.href = '/login';
          return;
        }
        const user = await res.json();
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
      } catch (error) {
        window.location.href = '/login';
      }
    }

    async function logout() {
      try {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }

    loadUser();
  </script>
</body>
</html>\`;

fs.writeFileSync(path.join(baseDir, 'public', 'dashboard.html'), dashboardHtml);
console.log('✓ Created public/dashboard.html');

console.log('\\n✅ Authentication system setup complete!\\n');
console.log('Next steps:');
console.log('  1. npm install');
console.log('  2. Add to .env (optional):');
console.log('     GOOGLE_CLIENT_ID=your-client-id');
console.log('     GOOGLE_CLIENT_SECRET=your-client-secret');
console.log('     GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback');
console.log('  3. npm install');
console.log('  4. node server-auth.js');
console.log('\\n');
