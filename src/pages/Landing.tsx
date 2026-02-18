import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [count, setCount] = useState({ hommes: 0, kg: 0, satisfaction: 0, semaines: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const duration = 2000;
    const targets = { hommes: 500, kg: 82, satisfaction: 94, semaines: 10 };
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        hommes: Math.round(targets.hommes * progress),
        kg: Math.round(targets.kg * progress) / 10,
        satisfaction: Math.round(targets.satisfaction * progress),
        semaines: Math.min(10, Math.round(targets.semaines * progress)),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

    :root {
      --ink: #0F2C59;
      --ink-deep: #071828;
      --paper: #F8FAFC;
      --cream: #F1F5F9;
      --sage: #00B894;
      --sage-light: #059669;
      --sage-glow: #34D399;
      --sage-muted: #ECFDF5;
      --neon: #00FFB3;
      --red-soft: #EF4444;
      --text: #1E293B;
      --text-mid: #475569;
      --text-light: #94A3B8;
      --border: #E2E8F0;
      --card: #FFFFFF;
      --shadow: 0 4px 60px rgba(15,44,89,0.07);
      --shadow-hover: 0 20px 80px rgba(15,44,89,0.14);
      --shadow-green: 0 8px 40px rgba(0,184,148,0.35);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--paper);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    .font-serif { font-family: 'Instrument Serif', serif; }

    /* ─── HEADER ─── */
    .site-header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(7,24,40,0.96);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 14px 24px;
    }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; text-decoration: none; letter-spacing: -0.02em; }
    .logo span { color: var(--sage); }
    .btn-member {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      padding: 9px 22px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
    }
    .btn-member:hover { border-color: var(--sage); color: var(--sage); }

    /* ─── HERO ─── */
    .hero {
      background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 50%, #0a3d52 100%);
      padding: 100px 24px 80px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,184,148,0.18) 0%, transparent 70%);
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(0,184,148,0.15);
      border: 1px solid rgba(0,184,148,0.4);
      color: var(--sage-glow);
      font-size: 12px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 7px 18px; border-radius: 100px;
      margin-bottom: 28px;
    }
    .hero h1 {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(36px, 6vw, 68px);
      color: #fff;
      line-height: 1.1;
      letter-spacing: -0.03em;
      max-width: 860px;
      margin: 0 auto 24px;
    }
    .hero h1 em { color: var(--sage-glow); font-style: italic; }
    .hero-sub {
      font-size: clamp(16px, 2vw, 19px);
      color: rgba(255,255,255,0.72);
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto 40px;
    }
    .hero-cta-group { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .btn-primary {
      display: inline-block;
      background: var(--sage);
      color: #fff;
      padding: 18px 40px;
      border-radius: 100px;
      font-size: 17px; font-weight: 700;
      text-decoration: none;
      border: none; cursor: pointer;
      transition: all 0.3s;
      box-shadow: var(--shadow-green);
      animation: pulse-btn 2.5s ease-in-out infinite;
    }
    .btn-primary:hover {
      background: var(--sage-light);
      transform: translateY(-3px);
      box-shadow: 0 16px 50px rgba(0,184,148,0.5);
    }
    @keyframes pulse-btn {
      0%, 100% { box-shadow: 0 8px 40px rgba(0,184,148,0.35); }
      50% { box-shadow: 0 8px 60px rgba(0,184,148,0.6); }
    }
    .hero-guarantee {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
    }
    .hero-guarantee strong { color: rgba(255,255,255,0.75); }

    /* ─── STATS BAR ─── */
    .stats-bar {
      background: #fff;
      border-bottom: 1px solid var(--border);
      padding: 32px 24px;
      box-shadow: 0 4px 30px rgba(15,44,89,0.06);
    }
    .stats-inner {
      max-width: 900px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 0;
    }
    .stat-item {
      text-align: center;
      padding: 8px 16px;
      border-right: 1px solid var(--border);
    }
    .stat-item:last-child { border-right: none; }
    .stat-number {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(28px, 4vw, 42px);
      color: var(--ink);
      line-height: 1;
      margin-bottom: 6px;
    }
    .stat-number span { color: var(--sage); }
    .stat-label { font-size: 13px; color: var(--text-mid); font-weight: 500; }

    /* ─── SECTIONS ─── */
    .section { padding: 90px 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .text-center { text-align: center; }
    .section-tag {
      display: inline-block;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--sage);
      margin-bottom: 14px;
    }
    .section-title {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(28px, 4vw, 44px);
      color: var(--ink);
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }
    .section-sub {
      font-size: 17px;
      color: var(--text-mid);
      line-height: 1.65;
      max-width: 540px;
      margin: 0 auto 48px;
    }

    /* ─── PAIN SECTION ─── */
    .pain-section { background: linear-gradient(160deg, #fff8f8 0%, #fff 100%); }
    .pain-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; }
    .pain-item {
      display: flex; align-items: flex-start; gap: 14px;
      background: #fff;
      border: 1px solid #fde8e8;
      border-radius: 14px;
      padding: 20px 22px;
    }
    .pain-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
    .pain-text { font-size: 15px; color: var(--text-mid); line-height: 1.5; }
    .pain-text strong { color: var(--text); display: block; margin-bottom: 2px; }

    /* ─── HOW IT WORKS ─── */
    .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
    .step-card {
      background: linear-gradient(145deg, #fff 0%, var(--sage-muted) 100%);
      border: 1px solid rgba(0,184,148,0.2);
      border-radius: 20px;
      padding: 36px 28px;
      text-align: center;
      transition: all 0.4s;
    }
    .step-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
    .step-number {
      width: 52px; height: 52px;
      background: var(--sage);
      color: #fff;
      border-radius: 50%;
      font-family: 'Instrument Serif', serif;
      font-size: 24px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 4px 20px rgba(0,184,148,0.3);
    }
    .step-icon { font-size: 32px; margin-bottom: 12px; }
    .step-title { font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--ink); margin-bottom: 10px; }
    .step-desc { font-size: 15px; color: var(--text-mid); line-height: 1.6; }

    /* ─── TESTIMONIALS ─── */
    .testimonials-section { background: var(--cream); }
    .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
    .testi-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px 26px;
      transition: all 0.4s;
    }
    .testi-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .testi-stars { font-size: 16px; margin-bottom: 14px; }
    .testi-quote { font-size: 15px; color: var(--text-mid); line-height: 1.65; margin-bottom: 20px; font-style: italic; }
    .testi-result {
      background: var(--sage-muted);
      border: 1px solid rgba(0,184,148,0.25);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 14px; font-weight: 700;
      color: var(--sage-light);
      margin-bottom: 18px;
    }
    .testi-author { display: flex; align-items: center; gap: 12px; }
    .testi-avatar {
      width: 44px; height: 44px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Instrument Serif', serif;
      font-size: 18px;
      color: #fff;
      flex-shrink: 0;
    }
    .testi-name { font-size: 14px; font-weight: 700; color: var(--ink); }
    .testi-role { font-size: 12px; color: var(--text-light); margin-top: 2px; }

    /* ─── PRICING ─── */
    .pricing-section { background: linear-gradient(160deg, var(--ink-deep) 0%, var(--ink) 100%); }
    .pricing-section .section-tag { color: var(--sage-glow); }
    .pricing-section .section-title { color: #fff; }
    .pricing-section .section-sub { color: rgba(255,255,255,0.65); }
    .pricing-card {
      max-width: 520px;
      margin: 0 auto;
      background: #fff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.4);
    }
    .pricing-header {
      background: linear-gradient(135deg, var(--sage) 0%, var(--sage-light) 100%);
      padding: 32px 36px;
      text-align: center;
    }
    .pricing-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      color: #fff;
      font-size: 12px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 5px 14px; border-radius: 100px;
      margin-bottom: 16px;
    }
    .pricing-name { font-family: 'Instrument Serif', serif; font-size: 26px; color: #fff; margin-bottom: 8px; }
    .pricing-price { display: flex; align-items: baseline; gap: 10px; justify-content: center; }
    .price-amount { font-family: 'Instrument Serif', serif; font-size: 64px; color: #fff; line-height: 1; }
    .price-details { color: rgba(255,255,255,0.8); font-size: 15px; }
    .price-old { text-decoration: line-through; opacity: 0.6; font-size: 20px; }
    .pricing-body { padding: 36px; }
    .pricing-list { list-style: none; margin-bottom: 28px; }
    .pricing-list li {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      font-size: 15px; color: var(--text);
    }
    .pricing-list li:last-child { border-bottom: none; }
    .pricing-list li::before { content: '✓'; color: var(--sage); font-weight: 700; font-size: 16px; flex-shrink: 0; }
    .btn-pricing {
      display: block;
      width: 100%;
      background: var(--sage);
      color: #fff;
      padding: 18px 32px;
      border-radius: 100px;
      font-size: 17px; font-weight: 700;
      text-decoration: none;
      border: none; cursor: pointer;
      text-align: center;
      transition: all 0.3s;
      box-shadow: var(--shadow-green);
      animation: pulse-btn 2.5s ease-in-out infinite;
    }
    .btn-pricing:hover { background: var(--sage-light); transform: translateY(-2px); }
    .pricing-secure { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 14px; font-size: 12px; color: var(--text-light); }

    /* ─── GUARANTEE ─── */
    .guarantee-section { background: var(--sage-muted); }
    .guarantee-box {
      max-width: 700px; margin: 0 auto;
      background: #fff;
      border: 2px solid rgba(0,184,148,0.3);
      border-radius: 24px;
      padding: 48px 40px;
      text-align: center;
      box-shadow: 0 10px 60px rgba(0,184,148,0.1);
    }
    .guarantee-icon { font-size: 56px; margin-bottom: 20px; }
    .guarantee-title { font-family: 'Instrument Serif', serif; font-size: 30px; color: var(--ink); margin-bottom: 16px; }
    .guarantee-text { font-size: 16px; color: var(--text-mid); line-height: 1.7; }

    /* ─── FAQ ─── */
    .faq-section { background: var(--cream); }
    .faq-container { max-width: 720px; margin: 0 auto; }
    .faq-item { background: #fff; border: 1px solid var(--border); border-radius: 14px; margin-bottom: 12px; overflow: hidden; transition: box-shadow 0.3s; }
    .faq-item:hover { box-shadow: var(--shadow); }
    .faq-question {
      width: 100%; background: none; border: none;
      padding: 22px 24px;
      font-size: 16px; font-weight: 600;
      color: var(--ink); text-align: left;
      cursor: pointer;
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'DM Sans', sans-serif;
      gap: 16px;
    }
    .faq-chevron { flex-shrink: 0; font-size: 18px; transition: transform 0.3s; }
    .faq-chevron.open { transform: rotate(180deg); }
    .faq-answer { padding: 0 24px 22px; font-size: 15px; color: var(--text-mid); line-height: 1.7; }

    /* ─── FOOTER ─── */
    .site-footer {
      background: var(--ink-deep);
      padding: 40px 24px;
      text-align: center;
    }
    .footer-logo { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; margin-bottom: 12px; }
    .footer-logo span { color: var(--sage); }
    .footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 16px; }
    .footer-links a { font-size: 13px; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
    .footer-links a:hover { color: var(--sage); }
    .footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); }

    /* ─── ANIMATIONS ─── */
    .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }

    /* ─── STICKY CTA (mobile) ─── */
    .sticky-cta {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: var(--ink-deep);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 12px 20px;
      display: none;
      align-items: center; justify-content: space-between;
      z-index: 99;
    }
    .sticky-cta-text { font-size: 13px; color: rgba(255,255,255,0.7); }
    .sticky-cta-btn {
      background: var(--sage);
      color: #fff;
      padding: 10px 22px;
      border-radius: 100px;
      font-size: 14px; font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 768px) {
      .stats-inner { grid-template-columns: repeat(2, 1fr); }
      .stat-item:nth-child(2) { border-right: none; }
      .pain-grid { grid-template-columns: 1fr; }
      .steps-grid { grid-template-columns: 1fr; }
      .testi-grid { grid-template-columns: 1fr; }
      .sticky-cta { display: flex; }
      .pricing-body { padding: 24px; }
      .guarantee-box { padding: 32px 24px; }
    }
    @media (max-width: 480px) {
      .hero { padding: 70px 20px 60px; }
      .hero h1 { font-size: 34px; }
    }
  `;

  const faqs = [
    {
      q: "Est-ce que je dois compter mes calories ?",
      a: "Non. Le plan est entièrement pré-calculé en fonction de votre profil. Vous suivez les recommandations — c'est tout. Pas de pesée obsessionnelle, pas de macros à calculer."
    },
    {
      q: "Ça marche vraiment après 40 ans ?",
      a: "Absolument. 80% de nos membres ont plus de 35 ans. Notre protocole est spécifiquement conçu pour le métabolisme qui ralentit avec l'âge, les variations hormonales et le mode de vie des cadres actifs."
    },
    {
      q: "Combien de temps faut-il consacrer par semaine ?",
      a: "Entre 30 et 45 minutes de suivi par semaine. Le programme s'adapte à votre emploi du temps chargé — pas de séances d'1h30 en salle exigées."
    },
    {
      q: "Je peux annuler quand je veux ?",
      a: "Oui, en 1 clic depuis votre espace membre. Aucun engagement, aucun frais de résiliation. Vous restez parce que ça fonctionne, pas parce que vous y êtes obligé."
    },
    {
      q: "Et si ça ne marche pas pour moi ?",
      a: "Vous êtes protégé par notre garantie 14 jours satisfait ou remboursé. Si vous suivez le programme et ne voyez aucun résultat, on vous rembourse intégralement. Sans questions."
    },
  ];

  const testimonials = [
    {
      name: "Marc", age: 42, role: "Cadre dirigeant",
      result: "−8 kg en 7 semaines",
      quote: "J'ai essayé une dizaine de régimes en 5 ans. C'est le seul truc qui m'a permis de perdre du gras en continuant à manger normalement au restaurant. Résultat bluffant.",
      avatar: "M", color: "#6366F1"
    },
    {
      name: "Julien", age: 38, role: "Commercial terrain",
      result: "−11 kg en 10 semaines",
      quote: "Après 10 ans de yo-yo, j'avais perdu espoir. Ce programme m'a appris à manger intelligemment, pas moins. J'ai perdu du ventre et retrouvé de l'énergie pour mes enfants.",
      avatar: "J", color: "#F59E0B"
    },
    {
      name: "Thomas", age: 51, role: "Entrepreneur",
      result: "−6 kg en 6 semaines",
      quote: "À 51 ans, je pensais que mon corps ne répondait plus. Le protocole adapté à mon âge a tout changé. Je me sens comme à 38 ans. Vraiment.",
      avatar: "T", color: "#EC4899"
    },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* ─── HEADER ─── */}
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">Sèche<span>10</span>Semaines</Link>
          <Link to="/login" className="btn-member">Espace Membre</Link>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-badge">🔥 Programme N°1 pour hommes 35-55 ans</div>
        <h1 className="font-serif">
          Perdez votre gras tenace en{' '}
          <em>10 semaines.</em>
          <br />
          Sans compter vos calories.
        </h1>
        <p className="hero-sub">
          Le seul programme de sèche pensé pour les hommes actifs de 35 à 55 ans qui veulent
          des résultats <strong style={{ color: 'rgba(255,255,255,0.95)' }}>réels et durables</strong> — sans régime draconien, sans salle de sport obsessionnelle.
        </p>
        <div className="hero-cta-group">
          <Link to="/pricing" className="btn-primary">
            Commencer ma transformation → 49€/mois
          </Link>
          <span className="hero-guarantee">
            🛡️ <strong>Garantie 14 jours</strong> satisfait ou remboursé · Sans engagement
          </span>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-number">{count.hommes}<span>+</span></div>
            <div className="stat-label">Hommes transformés</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{count.kg}<span>kg</span></div>
            <div className="stat-label">Perdus en moyenne</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{count.satisfaction}<span>%</span></div>
            <div className="stat-label">De satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{count.semaines}</div>
            <div className="stat-label">Semaines de résultats</div>
          </div>
        </div>
      </div>

      {/* ─── PAIN POINTS ─── */}
      <section id="pain" className="section pain-section">
        <div className="container">
          <div className="text-center">
            <div className="section-tag">VOUS RECONNAISSEZ-VOUS ?</div>
            <h2 className="section-title">Vous n'êtes pas seul dans cette situation.</h2>
            <p className="section-sub">Ces frustrations, des centaines d'hommes comme vous les ont vécues. Avant de trouver la solution.</p>
          </div>
          <div
            id="pain-grid"
            data-animate
            className={`pain-grid fade-up ${isVisible('pain-grid') ? 'visible' : ''}`}
          >
            {[
              { icon: '❌', title: "Les régimes ne tiennent pas", desc: "Vous perdez 3 kg, puis vous les reprenez avec les intérêts. Le cycle yo-yo depuis des années." },
              { icon: '❌', title: "Votre métabolisme a ralenti", desc: "Après 35 ans, ce qui marchait avant ne marche plus. Manger moins ne suffit plus." },
              { icon: '❌', title: "Pas le temps de tout calculer", desc: "Compter chaque calorie, peser chaque aliment — irréaliste avec un emploi du temps chargé." },
              { icon: '❌', title: "Le ventre résiste à tout", desc: "Le gras abdominal s'installe malgré vos efforts. Et vous savez que ça nuit à votre santé." },
              { icon: '❌', title: "Vous mangez 'bien' sans résultat", desc: "Vous faites des efforts, vous êtes raisonnable — mais la balance ne bouge pas." },
              { icon: '❌', title: "Vous manquez d'énergie", desc: "Fatigue chronique, sommeil médiocre, motivation en berne. Le corps envoie des signaux d'alarme." },
            ].map((p, i) => (
              <div key={i} className="pain-item">
                <span className="pain-icon">{p.icon}</span>
                <div className="pain-text">
                  <strong>{p.title}</strong>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="text-center">
            <div className="section-tag">COMMENT ÇA MARCHE</div>
            <h2 className="section-title">Un système. Pas un régime.</h2>
            <p className="section-sub">
              3 étapes simples. Adaptées à votre vie, votre âge, votre métabolisme.
            </p>
          </div>
          <div className="steps-grid">
            {[
              {
                num: 1, icon: '🎯',
                title: 'Votre profil sur mesure',
                desc: 'En 5 minutes, vous répondez à un bilan personnalisé. Âge, poids, objectif, mode de vie. Notre algorithme crée votre plan alimentaire unique — aucun calcul de votre côté.'
              },
              {
                num: 2, icon: '📱',
                title: 'Le suivi intelligent',
                desc: 'Chaque semaine, le plan s\'ajuste automatiquement à vos résultats. Le support IA répond à vos questions 24h/24. Vous n\'êtes jamais seul.'
              },
              {
                num: 3, icon: '💪',
                title: 'Les résultats qui durent',
                desc: 'Pas un régime flash. Un rééquilibrage réel. Vous perdez du gras de façon durable, retrouvez de l\'énergie, et adoptez de nouveaux réflexes pour la vie.'
              },
            ].map((step, i) => (
              <div
                key={i}
                id={`step-${i}`}
                data-animate
                className={`step-card fade-up ${isVisible(`step-${i}`) ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="section testimonials-section">
        <div className="container">
          <div className="text-center">
            <div className="section-tag">ILS ONT RÉUSSI</div>
            <h2 className="section-title">Leurs transformations parlent d'elles-mêmes.</h2>
            <p className="section-sub">Des hommes ordinaires. Des résultats extraordinaires.</p>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div
                key={i}
                id={`testi-${i}`}
                data-animate
                className={`testi-card fade-up ${isVisible(`testi-${i}`) ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="testi-stars">⭐⭐⭐⭐⭐</div>
                <div className="testi-result">✅ Résultat : {t.result}</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="testi-name">{t.name}, {t.age} ans</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="section pricing-section text-center">
        <div className="container">
          <div className="section-tag">REJOINDRE LE PROGRAMME</div>
          <h2 className="section-title">Tout inclus. Sans mauvaise surprise.</h2>
          <p className="section-sub">Un investissement dans votre santé, votre énergie, votre confiance en vous.</p>

          <div
            id="pricing-card"
            data-animate
            className={`pricing-card fade-up ${isVisible('pricing-card') ? 'visible' : ''}`}
          >
            <div className="pricing-header">
              <div className="pricing-badge">🔥 Offre la plus populaire</div>
              <div className="pricing-name">Sèche 10 Semaines — Programme Complet</div>
              <div className="pricing-price">
                <span className="price-amount">49€</span>
                <div className="price-details">
                  <div>/mois</div>
                  <div className="price-old">97€</div>
                </div>
              </div>
            </div>
            <div className="pricing-body">
              <ul className="pricing-list">
                {[
                  'Plan alimentaire 100% personnalisé',
                  'Ajustements hebdomadaires automatiques',
                  'Support IA 24h/24 — 7j/7',
                  'Accès à l\'app de suivi intelligent',
                  'Bibliothèque de +200 recettes adaptées',
                  'Communauté privée de 500+ membres',
                  'Bilan de composition corporelle mensuel',
                  'Guides PDF téléchargeables',
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <Link to="/pricing" className="btn-pricing">
                Commencer ma transformation maintenant
              </Link>
              <div className="pricing-secure">
                🔒 Paiement 100% sécurisé Stripe · SSL · Annulation en 1 clic
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GUARANTEE ─── */}
      <section className="section guarantee-section">
        <div className="container">
          <div
            id="guarantee"
            data-animate
            className={`guarantee-box fade-up ${isVisible('guarantee') ? 'visible' : ''}`}
          >
            <div className="guarantee-icon">🛡️</div>
            <div className="guarantee-title">Garantie 14 jours — Satisfait ou Remboursé</div>
            <p className="guarantee-text">
              Vous essayez le programme pendant 14 jours. Si vous suivez les recommandations
              et que vous ne constatez pas de résultats, on vous rembourse intégralement.
              <br /><br />
              <strong>Aucune question, aucune condition, aucun délai.</strong> Parce qu'on est
              confiants dans ce qu'on propose — et vous méritez de l'être aussi.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="section faq-section">
        <div className="container faq-container">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <div className="section-tag">VOS QUESTIONS</div>
            <h2 className="section-title">On répond à tout.<br />Sans bullshit.</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span className={`faq-chevron ${openFaq === i ? 'open' : ''}`}>▾</span>
              </button>
              {openFaq === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="site-footer">
        <div className="footer-logo">Sèche<span>10</span>Semaines</div>
        <div className="footer-links">
          <Link to="/login">Espace Membre</Link>
          <a href="mailto:contact@seche10semaines.fr">Contact</a>
          <a href="#">Mentions légales</a>
          <a href="#">CGV</a>
        </div>
        <div className="footer-copy">© 2025 Sèche10Semaines. Tous droits réservés.</div>
      </footer>

      {/* ─── STICKY CTA (mobile) ─── */}
      <div className="sticky-cta">
        <span className="sticky-cta-text">Programme à 49€/mois</span>
        <Link to="/pricing" className="sticky-cta-btn">Commencer →</Link>
      </div>
    </>
  );
};
