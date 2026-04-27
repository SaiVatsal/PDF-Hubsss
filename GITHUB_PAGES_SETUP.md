# 🚀 GitHub Pages Deployment Guide

## The Problem

**GitHub Pages only serves static files** (HTML, CSS, JavaScript). It cannot run Node.js servers.

When you see only the README on your GitHub Pages domain, it means:
- ❌ GitHub Pages is not finding `index.html`
- ❌ It's defaulting to showing README.md instead

## The Solution

For **GitHub Pages to work**, you need `index.html` in the right location.

---

## ✅ Option 1: Deploy Static Site to GitHub Pages (Recommended)

### Step 1: Move HTML files to root or `/docs`

GitHub Pages looks for `index.html` in these locations (in order):
1. Root directory: `/index.html`
2. Docs directory: `/docs/index.html`

### Step 2: Update GitHub Pages Settings

1. Go to your repo → **Settings** → **Pages**
2. Under "Source", choose:
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)` OR `/docs` (if you moved files there)
3. Click **Save**

### Step 3: Wait for Deployment

GitHub will automatically deploy. This may take a few minutes.

---

## 📁 Directory Structure for GitHub Pages

### Option A: Root Directory (Simplest)
```
your-repo/
├── index.html           ← Homepage
├── login.html
├── register.html
├── dashboard.html
├── style.css            ← Add your CSS
├── script.js            ← Add your JavaScript
├── README.md            ← Documentation
├── package.json
├── .env
└── public/
    └── pdf-hub.html
```

### Option B: Using /docs Folder
```
your-repo/
├── docs/                ← All static files go here
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
├── README.md
├── package.json
├── public/
└── server-auth.js
```

---

## 🔧 Setup Script: Move Files to Root

Run this to set up for GitHub Pages:

```bash
node github-pages-setup.js
```

This will:
1. Copy HTML files from `/public` to root
2. Update file paths
3. Prepare for GitHub Pages deployment

---

## 🚀 Deployment Steps

### 1. Create the setup script
```bash
# The script will be created by the system
# Just run: node github-pages-setup.js
```

### 2. Commit changes
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 3. Enable GitHub Pages
```
Settings → Pages → Source: main / root → Save
```

### 4. Visit your GitHub Pages URL
```
https://your-username.github.io/your-repo-name
```

---

## ⚠️ Important Notes

### Authentication Won't Work on GitHub Pages
- ✅ HTML pages will display
- ❌ Login/Register forms won't work (no backend)
- ❌ Google OAuth won't work (needs server)

**Why?** GitHub Pages only serves static files. It doesn't have a Node.js backend to handle authentication.

### To Keep Authentication:
You have two options:

**Option A: Hybrid Deployment**
- Use GitHub Pages for static site
- Use separate service (Vercel/Heroku) for backend
- Connect frontend to backend API

**Option B: Full Node.js Deployment**
- Don't use GitHub Pages
- Deploy to: Vercel, Heroku, Railway, Render
- See "Alternative Deployment" section below

---

## 📋 Alternative: Deploy Node.js App to Cloud

If you want authentication working, deploy to a cloud service that supports Node.js:

### Vercel (Easiest for Node.js)
```bash
npm i -g vercel
vercel login
vercel
```

### Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Railway.app
```
1. Go to railway.app
2. Connect GitHub repo
3. Deploy with one click
```

### Render
```
1. Go to render.com
2. New → Web Service
3. Connect GitHub
4. Deploy
```

---

## 🎯 What You Need to Do

### For Static GitHub Pages (No Authentication):
1. Run `node github-pages-setup.js`
2. Commit & push: `git add . && git commit -m "GitHub Pages setup" && git push`
3. Go to Settings → Pages → Save
4. Wait 1-5 minutes
5. Visit your GitHub Pages domain ✅

### For Full Functionality (With Authentication):
1. Keep Node.js server
2. Deploy to Vercel/Heroku/Railway instead
3. GitHub Pages won't work for this use case

---

## 🔍 Troubleshooting

### Still seeing README?
- [ ] Check "Source" in Settings → Pages is set to `main` and `/root`
- [ ] Make sure `index.html` exists in root directory
- [ ] Try enforcing HTTPS in Settings → Pages
- [ ] Wait a few minutes for deployment

### Files not updating?
- [ ] Clear browser cache (Ctrl+Shift+Del)
- [ ] Hard refresh (Ctrl+F5)
- [ ] Try incognito/private window

### GitHub Pages domain not showing?
- [ ] Wait 5-10 minutes after first setup
- [ ] Check repo is public (Settings → Visibility)
- [ ] Ensure branch is correct in Pages settings

---

## 📊 Comparison Table

| Feature | GitHub Pages | Vercel | Heroku | Railway |
|---------|---|---|---|---|
| Static Sites | ✅ | ✅ | ❌ | ❌ |
| Node.js | ❌ | ✅ | ✅ | ✅ |
| Authentication | ❌ | ✅ | ✅ | ✅ |
| Cost | Free | Free | Paid | Paid |
| Setup Time | 2 min | 5 min | 10 min | 5 min |

---

## ✨ Recommendation

**For your use case:**
- **If you just want a beautiful static website**: GitHub Pages ✅
- **If you want login/authentication**: Vercel or Railway ✅

---

**Version**: 1.0.0
**Last Updated**: 2026-04-27
