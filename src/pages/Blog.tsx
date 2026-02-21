import React from 'react';
import { Link } from 'react-router-dom';
import { blogArticles } from '../data/blogArticles';

export const Blog: React.FC = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828; --paper: #F8FAFC; --cream: #F1F5F9;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --card: #FFFFFF;
      --shadow: 0 4px 60px rgba(15,44,89,0.07); --shadow-hover: 0 20px 80px rgba(15,44,89,0.14);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); -webkit-font-smoothing: antialiased; }
    .font-serif { font-family: 'Instrument Serif', serif; }

    .blog-header { position: sticky; top: 0; z-index: 100; background: rgba(7,24,40,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; }
    .blog-header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .blog-logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; letter-spacing: -0.02em; }
    .blog-logo span { color: var(--sage); }
    .blog-nav { display: flex; gap: 16px; align-items: center; }
    .blog-nav a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 13px; font-weight: 500; transition: color 0.3s; }
    .blog-nav a:hover { color: var(--sage); }
    .blog-nav .btn-member { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.25); padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; transition: all 0.3s; }
    .blog-nav .btn-member:hover { border-color: var(--sage); color: var(--sage); }

    .blog-hero { background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 50%, #0a3d52 100%); padding: 60px 20px 50px; text-align: center; position: relative; overflow: hidden; }
    .blog-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,184,148,0.12) 0%, transparent 70%); }
    .blog-hero-content { position: relative; z-index: 1; }
    .blog-hero h1 { font-family: 'Instrument Serif', serif; font-size: 38px; color: #fff; margin-bottom: 12px; letter-spacing: -0.03em; }
    .blog-hero h1 em { color: var(--sage-glow); font-style: italic; }
    .blog-hero p { font-size: 16px; color: rgba(255,255,255,0.6); max-width: 500px; margin: 0 auto; line-height: 1.6; }

    .blog-grid { max-width: 900px; margin: 0 auto; padding: 48px 20px 80px; display: grid; grid-template-columns: 1fr; gap: 24px; }
    .blog-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; transition: all 0.3s; text-decoration: none; color: inherit; display: block; }
    .blog-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-4px); border-color: rgba(0,184,148,0.3); }
    .blog-card-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .blog-card-date { font-size: 12px; color: var(--text-light); }
    .blog-card-read { font-size: 12px; color: var(--sage); font-weight: 600; }
    .blog-card-keyword { display: inline-block; background: var(--sage-muted); color: var(--sage-light); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; }
    .blog-card h2 { font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--ink); line-height: 1.2; margin-bottom: 10px; letter-spacing: -0.02em; }
    .blog-card p { font-size: 14px; color: var(--text-mid); line-height: 1.6; }
    .blog-card-arrow { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 13px; font-weight: 600; color: var(--sage); }

    .blog-footer { background: var(--ink-deep); padding: 32px 20px; text-align: center; }
    .blog-footer-logo { font-family: 'Instrument Serif', serif; font-size: 18px; color: #fff; margin-bottom: 10px; }
    .blog-footer-logo span { color: var(--sage); }
    .blog-footer-links { display: flex; justify-content: center; gap: 16px; margin-bottom: 10px; flex-wrap: wrap; }
    .blog-footer-links a { font-size: 11px; color: rgba(255,255,255,0.4); text-decoration: none; }
    .blog-footer-copy { font-size: 10px; color: rgba(255,255,255,0.25); }

    @media (min-width: 768px) {
      .blog-hero h1 { font-size: 48px; }
      .blog-grid { grid-template-columns: 1fr; gap: 28px; }
      .blog-card h2 { font-size: 26px; }
    }
  `;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <style>{styles}</style>

      <header className="blog-header">
        <div className="blog-header-inner">
          <Link to="/" className="blog-logo">Sèche<span>10</span>Semaines</Link>
          <div className="blog-nav">
            <Link to="/blog">Blog</Link>
            <Link to="/login" className="btn-member">Espace Membre</Link>
          </div>
        </div>
      </header>

      <section className="blog-hero">
        <div className="blog-hero-content">
          <h1 className="font-serif">Le Blog <em>Sèche</em></h1>
          <p>Conseils experts, études scientifiques et stratégies concrètes pour votre transformation physique après 35 ans.</p>
        </div>
      </section>

      <div className="blog-grid">
        {blogArticles.map((article) => (
          <Link to={`/blog/${article.slug}`} className="blog-card" key={article.slug}>
            <div className="blog-card-meta">
              <span className="blog-card-date">{formatDate(article.date)}</span>
              <span className="blog-card-read">⏱ {article.readTime}</span>
              <span className="blog-card-keyword">{article.keyword}</span>
            </div>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <div className="blog-card-arrow">Lire l'article →</div>
          </Link>
        ))}
      </div>

      <footer className="blog-footer">
        <div className="blog-footer-logo">Sèche<span>10</span>Semaines</div>
        <div className="blog-footer-links">
          <Link to="/">Accueil</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/login">Espace Membre</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgv">CGV</Link>
          <Link to="/politique-confidentialite">Confidentialité</Link>
        </div>
        <div className="blog-footer-copy">© 2026 Sèche10Semaines · Résultats individuels, non contractuels.</div>
      </footer>
    </>
  );
};
