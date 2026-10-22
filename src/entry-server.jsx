import {renderToString} from 'react-dom/server';
import {App,routes,routeFor} from './App.jsx';
import {site} from './site-config.mjs';
export {routes};
export function render(path){const {lang}=routeFor(path);return {html:renderToString(<App path={path}/>),lang,title:`${site.name} — ${lang==='zh'?'思考、随笔与日常':'Thoughts, notes & observations'}`,description:site[lang].description};}
