require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const log = (level, message, data = '') => {
  const timestamp = new Date().toISOString();
  const levelNum = LOG_LEVELS[level] || 2;
  if (levelNum <= (LOG_LEVELS[LOG_LEVEL] || 2)) {
    const output = data 
      ? `[${timestamp}] ${level.toUpperCase()}: ${message} | ${JSON.stringify(data)}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    console.log(output);
  }
};

const MIME_TYPES = {
  '.pdf': 'application/pdf', '.txt': 'text/plain', '.md': 'text/markdown',
  '.xml': 'application/xml', '.json': 'application/json', '.html': 'text/html',
  '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.zip': 'application/zip', '.gz': 'application/gzip', '.tar': 'application/x-tar',
};

const BASE_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
};

const shouldCompress = (contentType) => {
  return contentType.includes('text') || contentType.includes('javascript') || 
         contentType.includes('json') || contentType === 'image/svg+xml';
};

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
    if (!resolvedPath.startsWith(normalizedBase)) return null;
    return resolvedPath;
  } catch (err) {
    return null;
  }
};

const setCacheHeaders = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  }
};

const server = http.createServer((req, res) => {
  try {
    const startTime = Date.now();
    const urlPath = req.url.split('?')[0];
    
    if (urlPath === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      log('info', `GET ${urlPath}`, { duration: Date.now() - startTime });
      return;
    }

    const normalizedPath = urlPath === '/' ? '/pdf-hub.html' : urlPath;
    const filePath = validateFilePath(normalizedPath, BASE_DIR);
    
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('400 - Invalid Path\n');
      log('warn', `Bad request - invalid path: ${urlPath}`);
      return;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Not Found\n');
          log('warn', `GET ${urlPath} - 404 Not Found`, { duration: Date.now() - startTime });
        } else if (err.code === 'EACCES') {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('403 - Forbidden\n');
          log('warn', `GET ${urlPath} - 403 Forbidden`, { duration: Date.now() - startTime });
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 - Server Error\n');
          log('error', `GET ${urlPath} - Server Error`, { error: err.message });
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

      log('info', `GET ${urlPath}`, { 
        contentType, 
        duration: Date.now() - startTime,
        compressed: acceptEncoding.includes('gzip') || acceptEncoding.includes('deflate')
      });
    });
  } catch (err) {
    log('error', 'Unexpected server error', { error: err.message });
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 - Server Error\n');
  }
});

server.listen(PORT, HOST, () => {
  log('info', '');
  log('info', '✅ PDF Hub Server Running!');
  log('info', `📌 Open your browser to: http://${HOST}:${PORT}`);
  log('info', `🏥 Health check: http://${HOST}:${PORT}/health`);
  log('info', `🚀 Press Ctrl+C to stop the server`);
  log('info', `⚙️  Environment: ${NODE_ENV}`);
  log('info', '');
});

server.on('error', (err) => {
  log('error', 'Server error', { error: err.message });
  process.exit(1);
});

process.on('SIGINT', () => {
  log('info', 'Shutting down gracefully...');
  server.close(() => {
    log('info', 'Server closed');
    process.exit(0);
  });
});

module.exports = server;
