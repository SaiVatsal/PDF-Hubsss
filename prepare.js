const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'pdf-hub.html');
const destDir = path.join(__dirname, 'public');
const dest = path.join(destDir, 'pdf-hub.html');

// Create public directory
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('✓ Created public/ directory');
}

// Copy pdf-hub.html
if (fs.existsSync(source)) {
  fs.copyFileSync(source, dest);
  console.log('✓ Copied pdf-hub.html to public/');
} else {
  console.error('✗ pdf-hub.html not found');
  process.exit(1);
}

// Verify
if (fs.existsSync(dest)) {
  const stats = fs.statSync(dest);
  console.log(`✓ File exists (${stats.size} bytes)`);
}

console.log('\n✅ Setup complete! Ready to start server.');
console.log('Run: npm start');
