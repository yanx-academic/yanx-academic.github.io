import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve('dist/client');let total=0;const errors=[];
async function walk(dir){for(const f of await readdir(dir,{withFileTypes:true})){const p=join(dir,f.name);if(f.isDirectory())await walk(p);else if(f.name.endsWith('.html')){const html=await readFile(p,'utf8');for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(!url.startsWith('/')||url.startsWith('//'))continue;const path=decodeURI(url.split(/[?#]/)[0]);try{let file=resolve(root,'.'+path);if(!file.startsWith(root+'/')&&file!==root)throw new Error('outside root');if((await stat(file)).isDirectory())file=join(file,'index.html');await stat(file);total++;}catch{errors.push(`${p}: ${url}`)}}}}}
await walk(root);if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`Checked ${total} internal links and assets`);
