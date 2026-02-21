import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { blogArticles } from '../data/blogArticles';
import { seoArticles25 } from '../data/seoArticles25';

export const BlogArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug) || seoArticles25.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      document.title = `${article.title} | Sèche 10 Semaines`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', article.metaDescription);
    }
    return () => {
      document.title = 'Sèche 10 Semaines — Programme Métabolique Scientifique';
    };
  }, [slug, article]);

  if (!article) return <Navigate to="/blog" />;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828; --paper: #F8FAFC; --cream: #F1F5F9;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --card: #FFFFFF;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); -webkit-font-smoothing: antialiased; }

    .art-header { position: sticky; top: 0; z-index: 100; background: rgba(7,24,40,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; }
    .art-header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .art-logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; letter-spacing: -0.02em; }
    .art-logo span { color: var(--sage); }
    .art-nav { display: flex; gap: 16px; align-items: center; }
    .art-nav a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 13px; font-weight: 500; transition: color 0.3s; }
    .art-nav a:hover { color: var(--sage); }
    .art-nav .btn-member { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.25); padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; transition: all 0.3s; }
    .art-nav .btn-member:hover { border-color: var(--sage); color: var(--sage); }

    .art-hero { background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 50%, #0a3d52 100%); padding: 48px 20px 40px; text-align: center; position: relative; overflow: hidden; }
    .art-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,184,148,0.12) 0%, transparent 70%); }
    .art-hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
    .art-breadcrumb { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 16px; }
    .art-breadcrumb a { color: var(--sage-glow); text-decoration: none; }
    .art-meta { display: flex; justify-content: center; gap: 16px; margin-bottom: 16px; }
    .art-meta span { font-size: 12px; color: rgba(255,255,255,0.5); }
    .art-meta .keyword { color: var(--sage-glow); font-weight: 600; }
    .art-hero h1 { font-family: 'Instrument Serif', serif; font-size: 30px; color: #fff; line-height: 1.15; letter-spacing: -0.03em; }

    .art-body { max-width: 720px; margin: 0 auto; padding: 40px 20px 60px; }
    .art-body h2 { font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--ink); margin: 36px 0 14px; line-height: 1.2; letter-spacing: -0.02em; }
    .art-body h3 { font-size: 18px; font-weight: 700; color: var(--ink); margin: 28px 0 10px; }
    .art-body p { font-size: 15px; color: var(--text-mid); line-height: 1.75; margin-bottom: 16px; }
    .art-body strong { color: var(--text); }
    .art-body em { font-style: italic; }
    .art-body ul, .art-body ol { margin: 12px 0 16px 24px; }
    .art-body li { font-size: 15px; color: var(--text-mid); line-height: 1.7; margin-bottom: 6px; }
    .art-body blockquote { border-left: 3px solid var(--sage); padding: 12px 20px; margin: 20px 0; background: var(--sage-muted); border-radius: 0 8px 8px 0; }
    .art-body blockquote p { color: var(--sage-light); font-weight: 500; margin-bottom: 0; }

    .art-cta-box { background: linear-gradient(135deg, var(--ink) 0%, #163A70 100%); border-radius: 16px; padding: 32px 24px; text-align: center; margin: 48px 0 32px; }
    .art-cta-box h3 { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; margin: 0 0 10px; }
    .art-cta-box p { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 20px; line-height: 1.6; }
    .art-cta-btn { display: inline-block; background: var(--sage); color: #fff; padding: 14px 28px; border-radius: 100px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.3s; box-shadow: 0 8px 40px rgba(0,184,148,0.35); }
    .art-cta-btn:hover { background: var(--sage-light); transform: translateY(-2px); }
    .art-cta-guarantee { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 12px; }

    .art-footer { background: var(--ink-deep); padding: 32px 20px; text-align: center; }
    .art-footer-logo { font-family: 'Instrument Serif', serif; font-size: 18px; color: #fff; margin-bottom: 10px; }
    .art-footer-logo span { color: var(--sage); }
    .art-footer-links { display: flex; justify-content: center; gap: 16px; margin-bottom: 10px; flex-wrap: wrap; }
    .art-footer-links a { font-size: 11px; color: rgba(255,255,255,0.4); text-decoration: none; }
    .art-footer-copy { font-size: 10px; color: rgba(255,255,255,0.25); }

    @media (min-width: 768px) {
      .art-hero h1 { font-size: 36px; }
      .art-body h2 { font-size: 28px; }
    }
  `;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Simple markdown-to-HTML converter for our article content
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const html: string[] = [];
    let inList = false;
    let listType = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === '') {
        if (inList) {
          html.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        continue;
      }

      // H2
      if (line.startsWith('## ')) {
        if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; }
        html.push(`<h2>${line.slice(3)}</h2>`);
        continue;
      }

      // H3
      if (line.startsWith('### ')) {
        if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; }
        html.push(`<h3>${line.slice(4)}</h3>`);
        continue;
      }

      // List items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        if (!inList) { html.push('<ul>'); inList = true; listType = 'ul'; }
        html.push(`<li>${formatInline(line.trim().slice(2))}</li>`);
        continue;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        if (!inList) { html.push('<ol>'); inList = true; listType = 'ol'; }
        html.push(`<li>${formatInline(numMatch[2])}</li>`);
        continue;
      }

      // Paragraph
      if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; }
      html.push(`<p>${formatInline(line)}</p>`);
    }

    if (inList) html.push(listType === 'ul' ? '</ul>' : '</ol>');

    return html.join('\n');
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  };

  return (
    <>
      <style>{styles}</style>

      <header className="art-header">
        <div className="art-header-inner">
          <Link to="/" className="art-logo">Sèche<span>10</span>Semaines</Link>
          <div className="art-nav">
            <Link to="/blog">Blog</Link>
            <Link to="/login" className="btn-member">Espace Membre</Link>
          </div>
        </div>
      </header>

      <section className="art-hero">
        <div className="art-hero-content">
          <div className="art-breadcrumb">
            <Link to="/">Accueil</Link> → <Link to="/blog">Blog</Link> → Article
          </div>
          <div className="art-meta">
            <span>{('date' in article) ? formatDate((article as any).date) : 'Fév 2026'}</span>
            <span>⏱ {('readTime' in article) ? (article as any).readTime : '10 min'}</span>
            {('keyword' in article) && <span className="keyword">{(article as any).keyword}</span>}
          </div>
          <h1>{article.title}</h1>
        </div>
      </section>

      <article className="art-body" dangerouslySetInnerHTML={{ __html: renderContent(article.content) }} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 60px' }}>
        <div className="art-cta-box">
          <h3>Prêt à transformer votre physique ?</h3>
          <p>Sèche10Semaines calcule vos macros, génère vos repas et suit votre progression. 100% personnalisé. 5 minutes par jour.</p>
          <Link to="/login" className="art-cta-btn">Commencer maintenant — 29€/mois</Link>
          <div className="art-cta-guarantee">✓ Satisfait ou remboursé 14 jours · ✓ Sans engagement</div>
        </div>
      </div>

      <footer className="art-footer">
        <div className="art-footer-logo">Sèche<span>10</span>Semaines</div>
        <div className="art-footer-links">
          <Link to="/">Accueil</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/login">Espace Membre</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgv">CGV</Link>
          <Link to="/politique-confidentialite">Confidentialité</Link>
        </div>
        <div className="art-footer-copy">© 2026 Sèche10Semaines · Résultats individuels, non contractuels.</div>
      </footer>
    </>
  );
};
