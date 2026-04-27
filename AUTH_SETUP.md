# 🔐 PDF Hub - Authentication System Setup Guide

## Overview

Your PDF Hub server now includes a **complete authentication system** with:

✅ **Email/Password Registration & Login**  
✅ **Google OAuth 2.0 Integration**  
✅ **Session Management**  
✅ **Protected Routes & Dashboard**  

---

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Authentication Files
```bash
node init-auth.js
```

This creates:
- ✅ `public/index.html` - Landing page
- ✅ `public/login.html` - Login page  
- ✅ `public/register.html` - Registration page
- ✅ `public/dashboard.html` - Protected dashboard
- ✅ `data/` - User storage directory

### Step 3: Start the Server with Auth
```bash
node server-auth.js
```

### Step 4: Access Your Application
- **Home**: http://localhost:8000
- **Login**: http://localhost:8000/login
- **Register**: http://localhost:8000/register
- **Dashboard**: http://localhost:8000/dashboard (login required)
- **Health**: http://localhost:8000/health

---

## 📋 Authentication Features

### Email/Password Authentication
**Register a new account:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Google OAuth

#### Getting Google Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Create a new project

2. **Enable Google+ API**
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI:
     ```
     http://localhost:8000/auth/google/callback
     ```
   - Copy your Client ID and Client Secret

4. **Add to .env**
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
   ```

5. **Restart the server**
   ```bash
   node server-auth.js
   ```

---

## 🔐 API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user with email/password
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### POST /auth/login
Login with email/password
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### GET /auth/google
Redirect to Google OAuth login

#### GET /auth/google/callback
Google OAuth callback (handled automatically)

#### POST /auth/logout
Logout current user
```bash
curl -X POST http://localhost:8000/auth/logout
```

#### GET /auth/user
Get current logged-in user info
```bash
curl http://localhost:8000/auth/user
```

**Response:**
```json
{
  "id": "user-id",
  "email": "john@example.com",
  "name": "John Doe",
  "avatar": "url-to-avatar"
}
```

### Page Routes

| Route | Purpose | Auth Required |
|-------|---------|--------------|
| GET / | Landing page | No |
| GET /login | Login page | No |
| GET /register | Registration page | No |
| GET /dashboard | User dashboard | Yes |
| GET /health | Health check | No |

---

## 💾 User Storage

Users are stored in `data/users.json`:

```json
{
  "local_1234567890": {
    "id": "local_1234567890",
    "email": "user@example.com",
    "name": "User Name",
    "password": "$2a$10$hashed-password...",
    "createdAt": "2026-04-27T09:22:03.197Z"
  },
  "google_1234567890": {
    "id": "google_1234567890",
    "googleId": "1234567890",
    "email": "user@gmail.com",
    "name": "Google User",
    "avatar": "https://...",
    "createdAt": "2026-04-27T09:22:03.197Z"
  }
}
```

---

## 🔒 Security Features

### Password Hashing
- Passwords are hashed using **bcryptjs** with 10 salt rounds
- Never stored in plain text
- Cannot be recovered, only reset

### Session Management
- **httpOnly cookies** - prevents XSS attacks
- **Secure flag** - HTTPS only in production
- **24-hour expiry** - automatic logout after inactivity
- Session secret in environment variables

### Protected Routes
- Dashboard only accessible when authenticated
- Auto-redirect to login if not authenticated
- Session validation on server-side

### Data Protection
- User passwords never logged
- Sensitive data in .env file
- Production mode uses secure cookies

---

## ⚙️ Configuration (.env)

```env
# Server
PORT=8000
HOST=localhost
NODE_ENV=development

# Session
SESSION_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
```

### Environment Variable Reference

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8000 | Server port |
| HOST | localhost | Server host |
| NODE_ENV | development | Environment mode |
| SESSION_SECRET | dev-key | Session encryption key (change in production!) |
| GOOGLE_CLIENT_ID | - | Google OAuth Client ID |
| GOOGLE_CLIENT_SECRET | - | Google OAuth Secret |
| GOOGLE_CALLBACK_URL | http://localhost:8000/auth/google/callback | OAuth redirect |

---

## 📁 Project Structure

```
pdf-hub/
├── server-auth.js           ← Express server with auth
├── init-auth.js             ← Setup script for auth pages
├── .env                     ← Configuration
├── public/
│   ├── index.html           ← Landing page
│   ├── login.html           ← Login page
│   ├── register.html        ← Registration page
│   ├── dashboard.html       ← Protected dashboard
│   └── pdf-hub.html         ← Original PDF Hub
├── data/
│   └── users.json           ← User storage
└── README.md, etc.
```

---

## 🧪 Testing

### Test Registration
```bash
# Create account
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Test Login
```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Test User Info
```bash
# Get current user
curl http://localhost:8000/auth/user
```

### Test Logout
```bash
# Logout
curl -X POST http://localhost:8000/auth/logout
```

---

## 🚀 Production Deployment

### Before Going Live

1. **Change SESSION_SECRET**
   ```env
   SESSION_SECRET=generate-long-random-string-here
   ```
   Generate with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use HTTPS**
   ```env
   NODE_ENV=production
   ```
   Set `secure: true` for cookies (requires HTTPS)

3. **Setup Google OAuth**
   - Add production redirect URI to Google Console
   - Update GOOGLE_CALLBACK_URL in .env

4. **Database**
   - Current: File-based (data/users.json)
   - Production: Migrate to MongoDB/PostgreSQL

5. **Environment Variables**
   - Never commit .env to git
   - Use secrets management service
   - Keep CLIENT_SECRET secure

---

## 🐛 Troubleshooting

### Google OAuth not working
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check redirect URI matches exactly in Google Console
- Ensure callback URL is correct

### Users not persisting
- Check `data/users.json` exists and is readable
- Verify write permissions on data/ directory
- Check disk space

### Login not working
- Clear browser cookies
- Check email/password is correct
- Verify user exists in data/users.json

### Sessions timing out
- Increase `maxAge` in session config (milliseconds)
- Default is 24 hours: `24 * 60 * 60 * 1000`

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Check server logs for error messages
3. Verify .env configuration
4. Ensure all files created by init-auth.js

---

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `node init-auth.js`
3. ✅ Configure Google OAuth (optional)
4. ✅ Start: `node server-auth.js`
5. ✅ Visit: http://localhost:8000
6. ✅ Create account and login!

---

**Version**: 1.0.0  
**Status**: ✅ Ready to Use  
**Last Updated**: 2026-04-27
