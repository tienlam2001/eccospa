// assets is generated from the Vite build by scripts/package-worker.mjs.
export default {
 async fetch(request) {
  const url = new URL(request.url);
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  if (url.hostname === 'www.ecconailslakemary.com') { url.hostname='ecconailslakemary.com'; return Response.redirect(url.toString(),301); }
  if (url.pathname === '/index.html') { url.pathname='/'; return Response.redirect(url.toString(),301); }
  const file=assets[url.pathname==='/'?'/index.html':url.pathname];
  const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
  if (!file) return new Response(request.method==='HEAD'?null:'Page not found',{status:404,headers});
  Object.assign(headers,{'Content-Type':file.type,'ETag':file.etag,'Cache-Control':file.type.startsWith('text/html')?'public, max-age=0, must-revalidate':'public, max-age=3600'});
  if(request.headers.get('If-None-Match')===file.etag) return new Response(null,{status:304,headers});
  const body=request.method==='HEAD'?null:Uint8Array.from(atob(file.body),c=>c.charCodeAt(0));
  return new Response(body,{headers});
 }
};
