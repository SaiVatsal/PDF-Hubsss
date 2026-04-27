#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const dirs = ['public', 'src', 'data'];

console.log('🔧 Setting up authentication system...\n');

// Create directories
dirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created ${dir}/ directory`);
  }
});

// Copy pdf-hub.html to public
const pdfHubPath = path.join(baseDir, 'pdf-hub.html');
const publicPath = path.join(baseDir, 'public', 'pdf-hub.html');
if (fs.existsSync(pdfHubPath) && !fs.existsSync(publicPath)) {
  fs.copyFileSync(pdfHubPath, publicPath);
  console.log('✓ Copied pdf-hub.html to public/');
}

console.log('\n✅ Setup complete! Required directories created.');
console.log('   Run: npm install');
console.log('   Then: npm start (with server-auth.js for auth features)\n');
