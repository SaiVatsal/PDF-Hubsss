#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

console.log('🚀 Setting up PDF Hub for GitHub Pages...\n');

// Files to copy from public to root
const filesToCopy = [
  'index.html',
  'login.html',
  'register.html',
  'dashboard.html',
  'pdf-hub.html'
];

let copiedCount = 0;

filesToCopy.forEach(file => {
  const src = path.join(baseDir, 'public', file);
  const dest = path.join(baseDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
    copiedCount++;
  }
});

// Create .nojekyll file (tells GitHub to not process files)
fs.writeFileSync(path.join(baseDir, '.nojekyll'), '');
console.log('✓ Created .nojekyll (disables Jekyll processing)');

// Create CNAME if user has custom domain
const cnameFile = path.join(baseDir, 'CNAME');
if (!fs.existsSync(cnameFile)) {
  // User can edit this manually if they have a custom domain
  console.log('\n💡 For custom domain:');
  console.log('   1. Create a CNAME file in root with your domain');
  console.log('   2. Content: your-domain.com');
}

console.log('\n✅ GitHub Pages setup complete!\n');

console.log('Next steps:');
console.log('  1. git add .');
console.log('  2. git commit -m "Deploy to GitHub Pages"');
console.log('  3. git push origin main');
console.log('  4. Go to Settings → Pages');
console.log('  5. Set Source to: main / (root)');
console.log('  6. Click Save');
console.log('  7. Wait 1-5 minutes');
console.log('  8. Visit your GitHub Pages domain\n');

console.log('Your site will be available at:');
console.log('  https://your-username.github.io/repository-name\n');

console.log('⚠️  Note: Static files only - authentication requires backend server\n');
