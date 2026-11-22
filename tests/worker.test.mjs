import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../.cloudflare/worker.mjs';
const get=(path,options)=>worker.fetch(new Request('https://ecconailslakemary.com'+path,options));
test('home, images, and sitemap serve correctly',async()=>{
 const home=await get('/');assert.equal(home.status,200);assert.match(await home.text(),/A little time/);
 const img=await get('/images/jade-manicure.jpg');assert.equal(img.headers.get('Content-Type'),'image/jpeg');assert.ok((await img.arrayBuffer()).byteLength>1000);
 assert.match(await(await get('/sitemap.xml')).text(),/https:\/\/ecconailslakemary.com\//);
});
test('unknown routes and unsupported methods',async()=>{assert.equal((await get('/missing')).status,404);assert.equal((await get('/',{method:'POST'})).status,405);});
test('HEAD and conditional requests',async()=>{assert.equal(await(await get('/',{method:'HEAD'})).text(),'');const etag=(await get('/')).headers.get('ETag');const r=await get('/',{headers:{'If-None-Match':etag}});assert.equal(r.status,304);assert.equal(await r.text(),'');});
test('canonical redirects preserve queries',async()=>{const r=await worker.fetch(new Request('https://www.ecconailslakemary.com/?from=google'));assert.equal(r.status,301);assert.equal(r.headers.get('Location'),'https://ecconailslakemary.com/?from=google');assert.equal((await get('/index.html')).headers.get('Location'),'https://ecconailslakemary.com/');});
