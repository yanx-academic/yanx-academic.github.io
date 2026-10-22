export function translationFor(post,content){return content[post.lang==='en'?'zh':'en'].posts.find(p=>p.id===post.id)||null;}
