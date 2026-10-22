import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
const md=new MarkdownIt({html:false,linkify:true,typographer:true});
export const renderMarkdown=text=>md.render(text);
export function buildContent(files){
 const result={zh:{posts:[],about:null},en:{posts:[],about:null}};
 for(const [path,raw] of Object.entries(files)){
  const match=path.match(/\/content\/(zh|en)\/(.*)\.md$/);if(!match)continue;
  const [,lang,file]=match;
  const normalized=raw.replace(/^\uFEFF/,'');
  if(normalized.startsWith('---')&&normalized.split(/\r?\n/,1)[0]!=='---')throw new Error(`Only YAML front matter is supported in ${path}`);
  const rejectEngine=()=>{throw new Error('Only YAML front matter is supported')};
  const {data,content}=matter(normalized,{engines:{javascript:rejectEngine,js:rejectEngine}});
  if(data.draft!==undefined&&typeof data.draft!=='boolean')throw new Error(`Invalid draft in ${path}: use true or false`);
  if(data.draft===true)continue;
  const id=data.id;if(typeof id!=='string'||!(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).test(id))throw new Error(`Invalid id in ${path}`);
  if(typeof data.title!=='string'||!data.title.trim())throw new Error(`Missing title in ${path}`);
  const item={...data,id,lang,body:renderMarkdown(content),title:data.title,date:String(data.date||'')};
  if(file==='about')result[lang].about=item;
  else if(file.startsWith('posts/')){
   if(result[lang].posts.some(p=>p.id===id))throw new Error(`Duplicate id ${id}`);
   result[lang].posts.push(item);
  }
 }
 for(const lang of ['zh','en'])result[lang].posts.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
 return result;
}
export {translationFor} from './translations.mjs';
