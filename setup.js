const fs = require('fs');
const path = require('path');

const dirs = [
  'c:\\Users\\Sai Vatsal\\Desktop\\hub\\config',
  'c:\\Users\\Sai Vatsal\\Desktop\\hub\\src',
  'c:\\Users\\Sai Vatsal\\Desktop\\hub\\public'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  } else {
    console.log(`Already exists: ${dir}`);
  }
});

console.log('Setup complete');
