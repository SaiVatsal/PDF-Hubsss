const fs = require('fs');
const path = require('path');

// Files to clean up (temporary setup files)
const filesToRemove = [
  'build-project.js',
  'init-project.js',
  'run-build.js',
  'setup.js',
  'setup.bat',
  'run.bat'
];

console.log('🧹 Cleaning up temporary files...\n');

filesToRemove.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Removed ${file}`);
    } catch (err) {
      console.error(`✗ Failed to remove ${file}: ${err.message}`);
    }
  }
});

console.log('\n✅ Cleanup complete! Only essential files remain.');
console.log('   Ready to run: npm start\n');
