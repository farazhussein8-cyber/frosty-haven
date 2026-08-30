// Tiny static file server for local preview.
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, port = +process.argv[2] || +process.env.PORT || 4321;
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.webp':'image/webp', '.png':'image/png',
  '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.json':'application/json', '.ico':'image/x-icon' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain'}).end('404'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
                         'Cache-Control': 'no-cache' });
    res.end(buf);
  });
}).listen(port, () => console.log('Frosty Haven → http://localhost:' + port));
