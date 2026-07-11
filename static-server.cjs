/**
 * Simple HTTP/1.1 static file server for large app.js
 * Serves with gzip compression to avoid HTTP/2 frame issues in wrangler
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3001;
const STATIC_DIR = path.join(__dirname, 'dist/static');

const MIME = {
  '.js':  'application/javascript',
  '.css': 'text/css',
  '.html':'text/html',
  '.json':'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(function(req, res) {
  // CORS headers so wrangler-served page can load from port 3001
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  var url = req.url.split('?')[0]; // strip query string
  var filePath = path.join(STATIC_DIR, url.replace(/^\/static\//, ''));
  var ext = path.extname(filePath);
  var contentType = MIME[ext] || 'application/octet-stream';

  fs.stat(filePath, function(err, stat) {
    if (err || !stat.isFile()) {
      res.writeHead(404); res.end('Not found'); return;
    }

    var acceptEncoding = req.headers['accept-encoding'] || '';
    if (/gzip/.test(acceptEncoding)) {
      // Serve gzip-compressed
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Encoding', 'gzip');
      res.writeHead(200);
      var gzip = zlib.createGzip({ level: 6 });
      var fileStream = fs.createReadStream(filePath);
      fileStream.pipe(gzip).pipe(res);
    } else {
      // Serve uncompressed
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', stat.size);
      res.writeHead(200);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', function() {
  console.log('[static-server] HTTP/1.1 static file server running on port ' + PORT);
  console.log('[static-server] Serving files from: ' + STATIC_DIR);
  console.log('[static-server] CORS enabled - wrangler app at port 3000 can load files');
});

server.on('error', function(err) {
  console.error('[static-server] Error:', err.message);
});
