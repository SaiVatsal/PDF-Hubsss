const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

// 1. Create directories
['config', 'src', 'public'].forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  try {
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✓ Created ${dir}/`);
    }
  } catch (e) {
    console.error(`Failed to create ${dir}:`, e.message);
  }
});

// 2. Move existing files
try {
  const pdfHubPath = path.join(baseDir, 'pdf-hub.html');
  const publicPath = path.join(baseDir, 'public', 'pdf-hub.html');
  
  if (fs.existsSync(pdfHubPath) && !fs.existsSync(publicPath)) {
    fs.copyFileSync(pdfHubPath, publicPath);
    console.log('✓ Copied pdf-hub.html to public/');
  }
} catch (e) {
  console.error('Could not move pdf-hub.html:', e.message);
}

// 3. Create config/config.js
const configFile = path.join(baseDir, 'config', 'config.js');
if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, `require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8000,
  HOST: process.env.HOST || 'localhost',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
`);
  console.log('✓ Created config/config.js');
}

// 4. Create src/logger.js
const loggerFile = path.join(baseDir, 'src', 'logger.js');
if (!fs.existsSync(loggerFile)) {
  fs.writeFileSync(loggerFile, `const config = require('../config/config');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const getCurrentLevel = () => LOG_LEVELS[config.LOG_LEVEL] || LOG_LEVELS.info;

const log = (level, message, data = '') => {
  const timestamp = new Date().toISOString();
  const levelNum = LOG_LEVELS[level] || 2;
  
  if (levelNum <= getCurrentLevel()) {
    const output = data ? \`[\${timestamp}] \${level.toUpperCase()}: \${message} | \${JSON.stringify(data)}\` : \`[\${timestamp}] \${level.toUpperCase()}: \${message}\`;
    if (level === 'error') {
      console.error(output);
    } else {
      console.log(output);
    }
  }
};

module.exports = {
  error: (msg, data) => log('error', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  info: (msg, data) => log('info', msg, data),
  debug: (msg, data) => log('debug', msg, data),
};
`);
  console.log('✓ Created src/logger.js');
}

// 5. Create src/mimeTypes.js
const mimeTypesFile = path.join(baseDir, 'src', 'mimeTypes.js');
if (!fs.existsSync(mimeTypesFile)) {
  fs.writeFileSync(mimeTypesFile, `module.exports = {
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.zip': 'application/zip',
  '.gz': 'application/gzip',
  '.tar': 'application/x-tar',
};
`);
  console.log('✓ Created src/mimeTypes.js');
}

// 6. Create src/security.js
const securityFile = path.join(baseDir, 'src', 'security.js');
if (!fs.existsSync(securityFile)) {
  fs.writeFileSync(securityFile, `const path = require('path');

const addSecurityHeaders = (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
};

const validateFilePath = (requestPath, baseDir) => {
  try {
    const normalizedPath = path.normalize(requestPath);
    const resolvedPath = path.resolve(baseDir, normalizedPath);
    const normalizedBase = path.normalize(baseDir);
    
    if (!resolvedPath.startsWith(normalizedBase)) {
      return null;
    }
    
    return resolvedPath;
  } catch (err) {
    return null;
  }
};

module.exports = {
  addSecurityHeaders,
  validateFilePath,
};
`);
  console.log('✓ Created src/security.js');
}

// 7. Create src/server.js
const serverFile = path.join(baseDir, 'src', 'server.js');
if (!fs.existsSync(serverFile)) {
  fs.writeFileSync(serverFile, `const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const config = require('../config/config');
const logger = require('./logger');
const mimeTypes = require('./mimeTypes');
const { addSecurityHeaders, validateFilePath } = require('./security');

const PORT = config.PORT;
const HOST = config.HOST;
const BASE_DIR = path.join(__dirname, '../public');

if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
  logger.info('Created public directory');
}

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
};

const shouldCompress = (contentType) => {
  return contentType.includes('text') || 
         contentType.includes('javascript') || 
         contentType.includes('json') ||
         contentType === 'image/svg+xml';
};

const setCacheHeaders = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.html') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return;
  }
  
  res.setHeader('Cache-Control', 'public, max-age=604800');
};

const handleRequest = (req, res) => {
  try {
    const startTime = Date.now();
    const urlPath = req.url.split('?')[0];
    
    if (urlPath === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      logger.info(\`GET \${urlPath}\`, { duration: Date.now() - startTime });
      return;
    }

    const normalizedPath = urlPath === '/' ? '/pdf-hub.html' : urlPath;
    const filePath = validateFilePath(normalizedPath, BASE_DIR);
    
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('400 - Invalid Path\\n');
      logger.warn(\`Bad request - invalid path: \${urlPath}\`);
      return;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Not Found\\n');
          logger.warn(\`GET \${urlPath} - 404 Not Found\`, { duration: Date.now() - startTime });
        } else if (err.code === 'EACCES') {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('403 - Forbidden\\n');
          logger.warn(\`GET \${urlPath} - 403 Forbidden\`, { duration: Date.now() - startTime });
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 - Server Error\\n');
          logger.error(\`GET \${urlPath} - Server Error\`, { error: err.message });
        }
        return;
      }

      const contentType = getMimeType(filePath);
      const acceptEncoding = req.headers['accept-encoding'] || '';
      
      addSecurityHeaders(res);
      setCacheHeaders(res, filePath);
      res.setHeader('Content-Type', contentType);

      if (shouldCompress(contentType) && acceptEncoding.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip');
        res.writeHead(200);
        fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
      } else if (shouldCompress(contentType) && acceptEncoding.includes('deflate')) {
        res.setHeader('Content-Encoding', 'deflate');
        res.writeHead(200);
        fs.createReadStream(filePath).pipe(zlib.createDeflate()).pipe(res);
      } else {
        res.writeHead(200);
        fs.createReadStream(filePath).pipe(res);
      }

      logger.info(\`GET \${urlPath}\`, { 
        contentType, 
        duration: Date.now() - startTime,
        compressed: acceptEncoding.includes('gzip') || acceptEncoding.includes('deflate')
      });
    });
  } catch (err) {
    logger.error('Unexpected server error', { error: err.message });
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 - Server Error\\n');
  }
};

const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
  logger.info('');
  logger.info('✅ PDF Hub Server Running!');
  logger.info(\`📌 Open your browser to: http://\${HOST}:\${PORT}\`);
  logger.info(\`🏥 Health check: http://\${HOST}:\${PORT}/health\`);
  logger.info(\`🚀 Press Ctrl+C to stop the server\`);
  logger.info(\`⚙️  Environment: \${config.NODE_ENV}\`);
  logger.info('');
});

server.on('error', (err) => {
  logger.error('Server error', { error: err.message });
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
`);
  console.log('✓ Created src/server.js');
}

console.log('\\n🎉 All files initialized successfully!');
process.exit(0);
