import {readdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {buildContent} from '../src/content.mjs';
const root=resolve(process.argv[2]||'.'),files={};
async function scan(dir){for(const item of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,item.name);if(item.isDirectory())await scan(path);else if(path.endsWith('.md'))files['/'+relative(root,path).replaceAll('\\','/')]=await readFile(path,'utf8');}}
await scan(resolve(root,'content'));
await writeFile(resolve(root,'src/generated-content.json'),JSON.stringify(buildContent(files)));
console.log('Prepared published content');
