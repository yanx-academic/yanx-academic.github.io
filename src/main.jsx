import React from 'react';
import {hydrateRoot,createRoot} from 'react-dom/client';
import {App} from './App.jsx';
import './styles.css';
const root=document.getElementById('root');
const app=<React.StrictMode><App/></React.StrictMode>;
if(root.hasChildNodes()&&root.dataset.path===window.location.pathname)hydrateRoot(root,app);else createRoot(root).render(app);
document.documentElement.lang=window.location.pathname.startsWith('/zh')?'zh-CN':'en';
