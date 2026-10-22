import { ArrowUpRight, ArrowRight, ArrowLeft, GithubLogo } from '@phosphor-icons/react';
import { content } from './site-data.mjs';
import { translationFor } from './translations.mjs';
import { site } from './site-config.mjs';
import { text } from './copy.mjs';

export function routeFor(path) {
  const parts = decodeURI(path).split('/').filter(Boolean);
  return { lang: parts[0] === 'zh' ? 'zh' : 'en', page: parts[1] || 'home', id: parts[2] || '' };
}

export function routes() {
  return ['/', ...['en', 'zh'].flatMap(lang => [
    `/${lang}/`, `/${lang}/journal/`, `/${lang}/about/`, `/${lang}/translation/`,
    ...content[lang].posts.map(post => `/${lang}/journal/${post.id}/`),
  ])];
}

export function App({ path = typeof window === 'undefined' ? '/en/' : window.location.pathname }) {
  const { lang, page, id } = routeFor(path);
  const t = text[lang];
  const other = lang === 'en' ? 'zh' : 'en';
  const post = content[lang].posts.find(item => item.id === id);
  const counterpart = post ? translationFor(post, content) : null;
  const notFound = !['home', 'journal', 'about', 'translation'].includes(page) || (page === 'journal' && id && !post);
  const isHome = page === 'home' && !notFound;
  let switchPath = `/${other}/${page === 'home' ? '' : page + '/'}${id ? id + '/' : ''}`;
  if (page === 'journal' && id && !counterpart) switchPath = `/${other}/translation/`;
  if (notFound) switchPath = `/${other}/`;
  const activePath = notFound ? `/${lang}/` : path;

  return <>
    <a className="skip" href="#main">{lang === 'zh' ? '跳至正文' : 'Skip to content'}</a>
    <Sidebar lang={lang} page={notFound ? '' : page} activePath={activePath} switchPath={switchPath} />
    <div className="page-shell">
      <main id="main" tabIndex={-1} className={isHome ? 'home-page' : 'inner-page'}>
        {isHome ? <Home lang={lang} />
          : notFound ? <section className="reading message-page">
            <p className="eyebrow">404</p>
            <h1>{lang === 'zh' ? '这一页走远了。' : 'A page out of place.'}</h1>
            <a className="action" href={`/${lang}/`}>{t.home}<ArrowRight aria-hidden="true" size={20} /></a>
          </section>
          : page === 'translation' ? <section className="reading message-page">
            <p className="eyebrow">中文 / EN</p><h1>{t.missingTitle}</h1><p className="message-copy">{t.missing}</p>
            <a className="action" href={`/${lang}/journal/`}>{t.back}<ArrowRight aria-hidden="true" size={20} /></a>
          </section>
          : page === 'about' ? <section className="about-page reading">
            <p className="eyebrow">{t.hello}</p>
            <h1>{content[lang].about?.title || t.about}<span className="blue">.</span></h1>
            <div className="prose" dangerouslySetInnerHTML={{ __html: content[lang].about?.body || '' }} />
            <a className="text-link" href={site.github}><GithubLogo weight="fill" size={20} aria-hidden="true" />GitHub<ArrowUpRight size={17} aria-hidden="true" /></a>
          </section>
          : post ? <article className="reading">
            <a className="back-link" href={`/${lang}/journal/`}><ArrowLeft size={18} aria-hidden="true" />{t.back}</a>
            <p className="eyebrow">{post.date}{post.sample ? ` / ${t.sample}` : ''}</p>
            <h1>{post.title}</h1><p className="article-deck">{post.excerpt}</p>
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />
            {counterpart && <a className="translation-link" href={`/${other}/journal/${post.id}/`}>{lang === 'zh' ? 'Read in English' : '阅读中文版'}<ArrowUpRight size={18} aria-hidden="true" /></a>}
          </article>
          : <section className="journal">
            <p className="eyebrow">{t.note}</p><h1>{t.journal}<span className="blue">.</span></h1>
            <PostList lang={lang} posts={content[lang].posts} />
          </section>}
      </main>
      <footer><p>© {new Date().getFullYear()} {site.name}</p><p>{t.footer}</p></footer>
    </div>
  </>;
}

function Sidebar({ lang, page, activePath, switchPath }) {
  const t = text[lang];
  return <header className="sidebar">
    <a className="wordmark" href={`/${lang}/`} aria-label={lang === 'zh' ? `${site.name} 首页` : `${site.name} home`}>
      {site.monogram}<span className="blue">.</span>
    </a>
    <div className="identity"><p className="identity-name">{site.name}</p><p className="identity-label">{t.siteLabel}</p></div>
    <nav className="primary-nav" aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}>
      <a href={`/${lang}/`} aria-current={page === 'home' ? 'page' : undefined}>{t.overview}</a>
      <a href={`/${lang}/journal/`} aria-current={page === 'journal' ? 'page' : undefined}>{t.journal}</a>
      <a href={`/${lang}/about/`} aria-current={page === 'about' ? 'page' : undefined}>{t.about}</a>
    </nav>
    <div className="sidebar-bottom">
      <a className="github-link" href={site.github}><GithubLogo weight="fill" size={24} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={14} aria-hidden="true" /></a>
      <nav className="languages" aria-label={lang === 'zh' ? '语言' : 'Language'}>
        <a href={lang === 'zh' ? activePath : switchPath} lang="zh-CN" aria-current={lang === 'zh' ? 'page' : undefined}>中文</a>
        <span aria-hidden="true">/</span>
        <a href={lang === 'en' ? activePath : switchPath} lang="en" aria-current={lang === 'en' ? 'page' : undefined}>EN</a>
      </nav>
    </div>
  </header>;
}

function Home({ lang }) {
  const t = text[lang], cfg = site[lang];
  return <>
    <section className="hero">
      <p className="eyebrow">{t.greeting}</p>
      <h1>{cfg.headline[0]}<br />{cfg.headline[1]}<span className="blue">.</span></h1>
      <p className="hero-intro">{cfg.intro.map((line, index) => <span key={index}>{line}</span>)}</p>
      <a className="action" href={`/${lang}/journal/`}>{t.explore}<ArrowUpRight size={20} aria-hidden="true" /></a>
    </section>
    <section className="notes" aria-labelledby="latest-heading">
      <div className="section-heading"><h2 id="latest-heading" className="eyebrow">{t.selected}</h2><a href={`/${lang}/journal/`}>{t.all}<ArrowRight size={20} aria-hidden="true" /></a></div>
      <PostList lang={lang} posts={content[lang].posts.slice(0, 3)} />
    </section>
    <section className="beyond" aria-labelledby="beyond-heading">
      <h2 id="beyond-heading" className="eyebrow">{t.beyond}</h2>
      <div className="beyond-content">
        <img src={site.image} alt={lang === 'zh' ? '远山、海面与岩岸。' : 'Sunlit water, distant mountains, and a rocky shoreline.'} width="1536" height="1024" loading="lazy" />
        <div className="beyond-caption"><p>{t.moment}</p><p lang={lang === 'en' ? 'zh-CN' : 'en'}>{t.momentAlt}</p></div>
      </div>
    </section>
  </>;
}

function PostList({ lang, posts }) {
  const t = text[lang], other = lang === 'zh' ? 'en' : 'zh';
  if (!posts.length) return <p className="empty-state">{t.empty}</p>;
  return <ol className="post-list">{posts.map((post, index) => {
    const alt = translationFor(post, content);
    return <li key={post.id}><a className="post-row" href={`/${lang}/journal/${post.id}/`}>
      <span className="post-number">{String(index + 1).padStart(2, '0')}</span>
      <div className="post-title"><h3>{post.title}</h3>{alt && <p lang={other === 'zh' ? 'zh-CN' : 'en'}>{alt.title}</p>}</div>
      <div className="post-excerpt"><p>{post.excerpt}</p>{alt?.excerpt && <p className="alternate-excerpt" lang={other === 'zh' ? 'zh-CN' : 'en'}>{alt.excerpt}</p>}<span className="post-meta">{post.sample ? t.sample : post.date}</span></div>
      <ArrowRight className="post-arrow" size={24} aria-hidden="true" />
    </a></li>;
  })}</ol>;
}
