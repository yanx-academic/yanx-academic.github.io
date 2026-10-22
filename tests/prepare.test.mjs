import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
test('build input contains published posts only, never raw draft text',async()=>{
 const root=await mkdtemp(join(tmpdir(),'yanx-content-'));
 try{await mkdir(join(root,'content/en/posts'),{recursive:true});await mkdir(join(root,'src'));
 await writeFile(join(root,'content/en/posts/secret.md'),'---\nid: secret\ntitle: Secret\ndraft: true\n---\nDO_NOT_BUNDLE_ME');
 await writeFile(join(root,'content/en/posts/public.md'),'---\nid: public\ntitle: Public\n---\nPublished text');
 execFileSync(process.execPath,[resolve('scripts/prepare-content.mjs'),root]);
 const json=await readFile(join(root,'src/generated-content.json'),'utf8');
 assert.ok(!json.includes('DO_NOT_BUNDLE_ME'));assert.ok(json.includes('Published text'));
 }finally{await rm(root,{recursive:true,force:true})}
});
