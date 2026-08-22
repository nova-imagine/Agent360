/**
 * Lean static file server — replaces wrangler pages dev
 * Uses only Node.js built-ins (no npm install needed).
 * Serves dist/index.html for all non-static routes (SPA mode).
 * Serves dist/static/* directly with streaming (handles large files).
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT   = 3000;
const DIST   = path.join(__dirname, 'dist');
const STATIC = path.join(DIST, 'static');
const INDEX  = path.join(DIST, 'index.html');

const MIME = {
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
};

// Pre-load the index.html into memory at startup (1MB — fine)
const indexHTML = fs.readFileSync(INDEX, 'utf8');
console.log('[server] index.html loaded — ' + indexHTML.length + ' bytes');

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0]; // strip query string

  // Static files — stream directly from disk, no workerd overhead
  if (urlPath.startsWith('/static/')) {
    const fileName = urlPath.slice('/static/'.length);
    const filePath = path.resolve(STATIC, fileName);

    // Security: block directory traversal
    if (!filePath.startsWith(STATIC)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found: ' + urlPath);
        return;
      }
      const ext  = path.extname(filePath).toLowerCase();
      const mime = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type':   mime,
        'Content-Length': stat.size,
        'Cache-Control':  'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    });
    return;
  }

  // Favicon — skip
  if (urlPath === '/favicon.ico') {
    res.writeHead(204); res.end(); return;
  }

  // Everything else → serve index.html (SPA)
  res.writeHead(200, {
    'Content-Type':   'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(indexHTML),
    'Cache-Control':  'no-cache',
  });
  res.end(indexHTML);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[server] Ready on http://0.0.0.0:' + PORT);
  console.log('[server] Serving from: ' + DIST);
});

server.on('error', err => {
  console.error('[server] Error:', err);
  process.exit(1);
});
