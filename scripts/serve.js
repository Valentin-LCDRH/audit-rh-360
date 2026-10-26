#!/usr/bin/env node
/*!
 * Audit RH 360° — serveur statique de recette (aucune dépendance).
 *
 *   npm run build && npm run serve   →   http://localhost:4173
 *
 * Sert la racine du dépôt en lecture seule, sur la boucle locale uniquement.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, url === '/' ? 'index.html' : url);
  /* Aucun accès hors du dépôt. */
  if (!path.resolve(file).startsWith(path.resolve(ROOT))) { res.writeHead(403).end('403'); return; }
  fs.readFile(file, (e, buf) => {
    if (e) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404 ' + url); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(buf);
  });
}).listen(PORT, '127.0.0.1', () => console.log('Recette Audit RH 360° : http://localhost:' + PORT));
