# PDF Hub - Enhanced Server

A secure, performant PDF hub server with comprehensive error handling, security features, and modern best practices.

## 🚀 Features

### Security
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy
- **Path Traversal Protection**: Validates all file requests to prevent directory traversal attacks
- **MIME Type Validation**: Proper content-type headers for all file types
- **Permissions Policy**: Restricts geolocation, microphone, and camera access

### Performance
- **Gzip/Deflate Compression**: Automatic compression for text, JSON, and SVG files
- **Cache Control Headers**: Smart caching strategy (no-cache for HTML, 7-day cache for static assets)
- **Stream-based File Serving**: Efficient memory usage for large files
- **Request Timing Metrics**: Tracks response time for each request

### Error Handling
- **Detailed Error Responses**: 404, 403, 400, 500 with meaningful messages
- **Graceful Shutdown**: Clean server shutdown on SIGINT
- **Request Logging**: Timestamped logs with request method, path, and response time
- **Error Recovery**: Comprehensive try-catch blocks for unexpected errors

### Extensibility
- **Environment Configuration**: PORT, HOST, NODE_ENV, LOG_LEVEL via .env
- **Modular Design**: Organized into config, src directories
- **Health Check Endpoint**: `/health` for monitoring and uptime checks

## 📋 MIME Types Supported

**Documents**: PDF, TXT, Markdown, XML, JSON  
**Media**: HTML, CSS, JavaScript  
**Images**: PNG, JPG, GIF, SVG, WebP, ICO  
**Fonts**: WOFF, WOFF2, TTF, OTF  
**Audio/Video**: MP3, WAV, MP4, WebM  
**Archives**: ZIP, GZIP, TAR  

## 🛠️ Setup

### Prerequisites
- Node.js 14+

### Installation

```bash
# Clone or navigate to project directory
cd pdf-hub

# Install dependencies
npm install

# Create .env file (optional - uses defaults)
cp .env.example .env
```

### Running the Server

```bash
# Development
npm start

# Or directly
node server.js
```

The server will output:
```
✅ PDF Hub Server Running!
📌 Open your browser to: http://localhost:8000
🏥 Health check: http://localhost:8000/health
⚙️  Environment: development
```

## 📊 Configuration

Set environment variables in `.env`:

```env
PORT=8000              # Server port
HOST=localhost         # Server host
NODE_ENV=development   # Environment (development/production)
LOG_LEVEL=info         # Log level (error/warn/info/debug)
```

## 🔍 API Endpoints

### GET /
Serves `public/pdf-hub.html` - the main landing page

### GET /health
Returns JSON health status:
```json
{
  "status": "ok",
  "timestamp": "2026-04-27T08:29:08.265Z"
}
```

### GET /[file]
Serves static files from `public/` directory with:
- Automatic MIME type detection
- Gzip compression (if supported)
- Proper cache headers
- Security headers

## 📝 Request Logging

Each request is logged with format:
```
[2026-04-27T08:29:08.265Z] INFO: GET / | {"contentType":"text/html","duration":2,"compressed":true}
```

Includes:
- Timestamp
- Request method & path
- Content type
- Response time (ms)
- Compression status

## 🔒 Security Features

1. **Path Validation**: Prevents `../` traversal attacks
2. **Content-Type Sniffing Protection**: Forces correct MIME types
3. **Clickjacking Protection**: X-Frame-Options: DENY
4. **CSP Header**: Restricts resource loading to same origin
5. **Referrer Policy**: Protects user privacy

## 📁 Project Structure

```
pdf-hub/
├── server.js           # Main server file (improved)
├── package.json        # Dependencies & scripts
├── .env               # Environment configuration
├── .env.example       # Environment template
├── public/            # Static files (HTML, CSS, JS, PDFs)
│   └── pdf-hub.html   # Main landing page
└── README.md          # This file
```

## ⚡ Performance Tips

1. **Static Assets**: Place all static files in `public/` directory
2. **Compression**: Enable gzip compression in browser (automatically handled)
3. **Caching**: Browser caches static assets for 7 days
4. **Monitoring**: Use `/health` endpoint to monitor server status

## 🧪 Testing

Test the server:

```bash
# Health check
curl http://localhost:8000/health

# Main page
curl http://localhost:8000/

# With compression
curl -H "Accept-Encoding: gzip" http://localhost:8000/ | gunzip
```

## 🛑 Graceful Shutdown

Press `Ctrl+C` to stop the server. The server will:
1. Stop accepting new connections
2. Close existing connections gracefully
3. Log shutdown message
4. Exit cleanly

## 📈 Recent Improvements

✅ Security headers (X-Content-Type-Options, X-Frame-Options, CSP)  
✅ Path traversal protection  
✅ 30+ MIME types support  
✅ Request logging with timestamps  
✅ Gzip/Deflate compression  
✅ Cache control headers  
✅ Health check endpoint  
✅ Error handling & recovery  
✅ Environment configuration  
✅ Graceful shutdown  

## 📄 License

MIT

---

**Last Updated**: 2026-04-27  
**Version**: 2.0.0
