import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {render,routes} from '../dist/ssr/entry-server.js';
const template=await readFile('dist/client/index.html','utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const path of routes()){
 const page=render(path),folder=`dist/client${path}`;
 await mkdir(folder,{recursive:true});
 const html=template.replace('<div id="root"></div>',`<div id="root" data-path="${esc(path)}">${page.html}</div>`).replace('<html lang="en">',`<html lang="${page.lang==='zh'?'zh-CN':'en'}">`).replace(/<title>.*?<\/title>/,`<title>${esc(page.title)}</title>`).replace(/name="description" content="[^"]*"/,`name="description" content="${esc(page.description)}"`);
 await writeFile(`${folder}/index.html`,html);
}
const missing=render('/en/not-found/');
await writeFile('dist/client/404.html',template.replace('<div id="root"></div>',`<div id="root">${missing.html}</div>`));
await writeFile('dist/client/.nojekyll','');
console.log(`Prerendered ${routes().length} static routes`);
