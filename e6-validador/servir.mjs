import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 8765);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.md': 'text/plain', '.png': 'image/png' };
http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (error, data) => {
        if (error) return res.writeHead(404).end();
        res.setHeader('Content-Type', (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
        res.end(data);
    });
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
