import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildContent, translationFor, renderMarkdown} from '../src/content.mjs';
const page=(id,extra='',body='hello')=>`---\nid: ${id}\ntitle: A title\ndate: '2026-10-22'\n${extra}\n---\n${body}`;
test('discovers new articles and excludes drafts from all output',()=>{
 const c=buildContent({'/content/en/posts/one.md':page('one'),'/content/en/posts/two.md':page('two'),' /content/en/posts/secret.md':page('secret','draft: true','SECRET')});
 assert.equal(c.en.posts.length,2);assert.ok(!JSON.stringify(c).includes('SECRET'));
});
test('matches translations by ID, missing translation is null',()=>{
 const c=buildContent({'/content/en/posts/a.md':page('a'),'/content/zh/posts/a.md':page('a'),'/content/zh/posts/b.md':page('b')});
 assert.equal(translationFor(c.en.posts[0],c).lang,'zh');assert.equal(translationFor(c.zh.posts.find(p=>p.id==='b'),c),null);
});
test('raw HTML is escaped and javascript links are not generated',()=>{
 const html=renderMarkdown('<script>alert(1)</script>\n\n[bad](javascript:alert(1))');
 assert.ok(!html.includes('<script>'));assert.ok(!html.includes('href="javascript:'));
});
test('draft strings are rejected so malformed metadata cannot publish a draft',()=>{
 assert.throws(()=>buildContent({'/content/en/posts/a.md':page('a','draft: "false"')}),/draft/);
});
test('rejects duplicate IDs and unsafe slugs',()=>{
 assert.throws(()=>buildContent({'/content/en/posts/a.md':page('a'),'/content/en/posts/b.md':page('a')}),/Duplicate/);
 assert.throws(()=>buildContent({'/content/en/posts/a.md':page('../a')}),/id/);
});
test('front matter cannot select executable JavaScript engine',()=>{
 globalThis.__yanxExecuted=false;
 assert.throws(()=>buildContent({'/content/en/posts/a.md':'---js\n(globalThis.__yanxExecuted=true,{id:"a",title:"A"})\n---\nHello'}),/front matter/i);
 assert.equal(globalThis.__yanxExecuted,false);
});
test('BOM-prefixed front matter cannot execute JavaScript',()=>{
 globalThis.__yanxBOMExecuted=false;
 assert.throws(()=>buildContent({'/content/en/posts/a.md':'\uFEFF---js\n(globalThis.__yanxBOMExecuted=true,{id:"a",title:"A"})\n---\nHello'}),/front matter/i);
 assert.equal(globalThis.__yanxBOMExecuted,false);
});
test('BOM-prefixed normal YAML remains editable',()=>{
 const c=buildContent({'/content/en/posts/a.md':'\uFEFF'+page('a')});assert.equal(c.en.posts[0].id,'a');
});
