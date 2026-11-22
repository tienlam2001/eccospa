import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { createHash } from 'node:crypto';
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8' };
const assets = {};
async function collect(dir, prefix = '') {
 for (const item of await readdir(dir, { withFileTypes:true })) {
  const path = join(dir, item.name);
  if (item.isDirectory()) await collect(path, prefix + '/' + item.name);
  else { const bytes = await readFile(path); assets[prefix + '/' + item.name] = {body:bytes.toString('base64'),type:types[extname(item.name)] || 'application/octet-stream',etag:'"'+createHash('sha256').update(bytes).digest('hex').slice(0,24)+'"'}; }
 }
}
await collect('dist');
await mkdir('.cloudflare', { recursive:true });
await writeFile('.cloudflare/worker.mjs', 'const assets = ' + JSON.stringify(assets) + ';\n' + await readFile('src/worker.js','utf8'));
console.log('Packaged', Object.keys(assets).length, 'files for the eccospa website Worker.');
