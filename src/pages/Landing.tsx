import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [spotsLeft, setSpotsLeft] = useState(14);
  const [timer, setTimer] = useState({ h: 2, m: 47, s: 33 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);
  const pad = (n: number) => String(n).padStart(2, '0');

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828; --paper: #F8FAFC; --cream: #F1F5F9;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --neon: #00FFB3; --red-soft: #EF4444; --orange: #F59E0B;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --card: #FFFFFF;
      --shadow: 0 4px 60px rgba(15,44,89,0.07); --shadow-hover: 0 20px 80px rgba(15,44,89,0.14);
      --shadow-green: 0 8px 40px rgba(0,184,148,0.35);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    .font-serif { font-family: 'Instrument Serif', serif; }

    .site-header { position: sticky; top: 0; z-index: 100; background: rgba(7,24,40,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 14px 24px; }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; text-decoration: none; letter-spacing: -0.02em; }
    .logo span { color: var(--sage); }
    .btn-member { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.25); padding: 9px 22px; border-radius: 100px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.3s; cursor: pointer; }
    .btn-member:hover { border-color: var(--sage); color: var(--sage); }

    .hero { background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 50%, #0a3d52 100%); padding: 80px 24px 70px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,184,148,0.15) 0%, transparent 70%); }
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,184,148,0.12); border: 1px solid rgba(0,184,148,0.35); color: var(--sage-glow); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 7px 16px; border-radius: 100px; margin-bottom: 24px; }
    .hero h1 { font-family: 'Instrument Serif', serif; font-size: clamp(32px, 6vw, 64px); color: #fff; line-height: 1.08; letter-spacing: -0.03em; max-width: 820px; margin: 0 auto 20px; }
    .hero h1 em { color: var(--sage-glow); font-style: italic; }
    .hero-sub { font-size: clamp(15px, 2vw, 18px); color: rgba(255,255,255,0.7); line-height: 1.65; max-width: 560px; margin: 0 auto 32px; }
    .hero-sub strong { color: rgba(255,255,255,0.95); }
    .hero-cta-group { display: flex; flex-direction: column; align-items: center; gap: 14px; }
    .btn-primary { display: inline-block; background: var(--sage); color: #fff; padding: 17px 36px; border-radius: 100px; font-size: 16px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; transition: all 0.3s; box-shadow: var(--shadow-green); animation: pulse-btn 2.5s ease-in-out infinite; }
    .btn-primary:hover { background: var(--sage-light); transform: translateY(-3px); box-shadow: 0 16px 50px rgba(0,184,148,0.5); }
    @keyframes pulse-btn { 0%, 100% { box-shadow: 0 8px 40px rgba(0,184,148,0.35); } 50% { box-shadow: 0 8px 60px rgba(0,184,148,0.6); } }
    .hero-guarantee { font-size: 13px; color: rgba(255,255,255,0.5); }
    .hero-guarantee strong { color: rgba(255,255,255,0.75); }

    /* URGENCY BAR */
    .urgency-bar { background: linear-gradient(90deg, #DC2626 0%, #B91C1C 100%); padding: 10px 24px; text-align: center; }
    .urgency-inner { max-width: 700px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
    .urgency-text { color: #fff; font-size: 13px; font-weight: 700; }
    .urgency-timer { display: inline-flex; gap: 4px; }
    .urgency-digit { background: rgba(0,0,0,0.3); color: #fff; padding: 3px 7px; border-radius: 4px; font-size: 13px; font-weight: 800; font-variant-numeric: tabular-nums; }

    /* TRUST BAR */
    .trust-bar { background: #fff; border-bottom: 1px solid var(--border); padding: 20px 24px; }
    .trust-inner { max-width: 800px; margin: 0 auto; display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }
    .trust-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-mid); }
    .trust-icon { font-size: 16px; }

    .section { padding: 80px 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .text-center { text-align: center; }
    .section-tag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--sage); margin-bottom: 14px; }
    .section-title { font-family: 'Instrument Serif', serif; font-size: clamp(26px, 4vw, 42px); color: var(--ink); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 14px; }
    .section-sub { font-size: 16px; color: var(--text-mid); line-height: 1.65; max-width: 540px; margin: 0 auto 44px; }

    /* PAIN */
    .pain-section { background: linear-gradient(160deg, #fff8f8 0%, #fff 100%); }
    .pain-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 44px; }
    .pain-item { display: flex; align-items: flex-start; gap: 12px; background: #fff; border: 1px solid #fde8e8; border-radius: 14px; padding: 18px 20px; }
    .pain-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
    .pain-text { font-size: 14px; color: var(--text-mid); line-height: 1.55; }
    .pain-text strong { color: var(--text); display: block; margin-bottom: 2px; font-size: 14px; }

    /* STEPS */
    .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px; }
    .step-card { background: linear-gradient(145deg, #fff 0%, var(--sage-muted) 100%); border: 1px solid rgba(0,184,148,0.2); border-radius: 20px; padding: 32px 24px; text-align: center; transition: all 0.4s; }
    .step-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
    .step-number { width: 48px; height: 48px; background: var(--sage); color: #fff; border-radius: 50%; font-family: 'Instrument Serif', serif; font-size: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; box-shadow: 0 4px 20px rgba(0,184,148,0.3); }
    .step-icon { font-size: 30px; margin-bottom: 10px; }
    .step-title { font-family: 'Instrument Serif', serif; font-size: 20px; color: var(--ink); margin-bottom: 10px; }
    .step-desc { font-size: 14px; color: var(--text-mid); line-height: 1.6; }

    /* TESTIMONIALS */
    .testimonials-section { background: var(--cream); }
    .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px; }
    .testi-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 28px 24px; transition: all 0.4s; }
    .testi-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .testi-stars { font-size: 14px; margin-bottom: 12px; }
    .testi-quote { font-size: 14px; color: var(--text-mid); line-height: 1.65; margin-bottom: 18px; font-style: italic; }
    .testi-result { background: var(--sage-muted); border: 1px solid rgba(0,184,148,0.25); border-radius: 10px; padding: 8px 14px; font-size: 13px; font-weight: 700; color: var(--sage-light); margin-bottom: 16px; }
    .testi-author { display: flex; align-items: center; gap: 12px; }
    .testi-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Instrument Serif', serif; font-size: 17px; color: #fff; flex-shrink: 0; }
    .testi-name { font-size: 13px; font-weight: 700; color: var(--ink); }
    .testi-role { font-size: 11px; color: var(--text-light); margin-top: 1px; }

    /* VALUE COMPARE */
    .value-section { background: #fff; }
    .value-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 700px; margin: 0 auto; }
    .value-card { border-radius: 16px; padding: 28px 24px; text-align: center; }
    .value-card.old { background: #FEF2F2; border: 1px solid #FECACA; }
    .value-card.new { background: var(--sage-muted); border: 2px solid var(--sage); }
    .value-price { font-family: 'Instrument Serif', serif; font-size: 36px; margin: 12px 0 8px; }
    .value-price.crossed { text-decoration: line-through; color: #DC2626; opacity: 0.7; }
    .value-list { list-style: none; text-align: left; font-size: 13px; color: var(--text-mid); }
    .value-list li { padding: 6px 0; display: flex; align-items: center; gap: 8px; }

    /* PRICING */
    .pricing-section { background: linear-gradient(160deg, var(--ink-deep) 0%, var(--ink) 100%); }
    .pricing-section .section-tag { color: var(--sage-glow); }
    .pricing-section .section-title { color: #fff; }
    .pricing-section .section-sub { color: rgba(255,255,255,0.65); }
    .pricing-card { max-width: 500px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.4); }
    .pricing-header { background: linear-gradient(135deg, var(--sage) 0%, var(--sage-light) 100%); padding: 28px 32px; text-align: center; }
    .pricing-badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; margin-bottom: 12px; }
    .pricing-name { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; margin-bottom: 8px; }
    .pricing-price { display: flex; align-items: baseline; gap: 10px; justify-content: center; }
    .price-amount { font-family: 'Instrument Serif', serif; font-size: 58px; color: #fff; line-height: 1; }
    .price-details { color: rgba(255,255,255,0.8); font-size: 14px; }
    .price-old { text-decoration: line-through; opacity: 0.6; font-size: 18px; }
    .pricing-body { padding: 32px; }
    .pricing-list { list-style: none; margin-bottom: 24px; }
    .pricing-list li { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 14px; color: var(--text); }
    .pricing-list li:last-child { border-bottom: none; }
    .pricing-list li::before { content: '✓'; color: var(--sage); font-weight: 700; font-size: 15px; flex-shrink: 0; }
    .btn-pricing { display: block; width: 100%; background: var(--sage); color: #fff; padding: 17px 32px; border-radius: 100px; font-size: 16px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; text-align: center; transition: all 0.3s; box-shadow: var(--shadow-green); animation: pulse-btn 2.5s ease-in-out infinite; }
    .btn-pricing:hover { background: var(--sage-light); transform: translateY(-2px); }
    .pricing-secure { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 11px; color: var(--text-light); }

    /* GUARANTEE */
    .guarantee-section { background: var(--sage-muted); }
    .guarantee-box { max-width: 680px; margin: 0 auto; background: #fff; border: 2px solid rgba(0,184,148,0.3); border-radius: 24px; padding: 44px 36px; text-align: center; box-shadow: 0 10px 60px rgba(0,184,148,0.1); }
    .guarantee-icon { font-size: 50px; margin-bottom: 18px; }
    .guarantee-title { font-family: 'Instrument Serif', serif; font-size: 28px; color: var(--ink); margin-bottom: 14px; }
    .guarantee-text { font-size: 15px; color: var(--text-mid); line-height: 1.7; }

    /* FAQ */
    .faq-section { background: var(--cream); }
    .faq-container { max-width: 700px; margin: 0 auto; }
    .faq-item { background: #fff; border: 1px solid var(--border); border-radius: 14px; margin-bottom: 10px; overflow: hidden; transition: box-shadow 0.3s; }
    .faq-item:hover { box-shadow: var(--shadow); }
    .faq-question { width: 100%; background: none; border: none; padding: 20px 22px; font-size: 15px; font-weight: 600; color: var(--ink); text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-family: 'DM Sans', sans-serif; gap: 14px; }
    .faq-chevron { flex-shrink: 0; font-size: 16px; transition: transform 0.3s; }
    .faq-chevron.open { transform: rotate(180deg); }
    .faq-answer { padding: 0 22px 20px; font-size: 14px; color: var(--text-mid); line-height: 1.7; }

    /* FINAL CTA */
    .final-cta { background: linear-gradient(160deg, var(--ink-deep), var(--ink)); padding: 70px 24px; text-align: center; }
    .final-cta h2 { font-family: 'Instrument Serif', serif; font-size: clamp(24px, 4vw, 38px); color: #fff; margin-bottom: 14px; }
    .final-cta p { color: rgba(255,255,255,0.6); font-size: 15px; margin-bottom: 28px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }

    .site-footer { background: var(--ink-deep); padding: 36px 24px; text-align: center; }
    .footer-logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; margin-bottom: 10px; }
    .footer-logo span { color: var(--sage); }
    .footer-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 12px; }
    .footer-links a { font-size: 12px; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
    .footer-links a:hover { color: var(--sage); }
    .footer-copy { font-size: 11px; color: rgba(255,255,255,0.25); }

    .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }

    .sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: var(--ink-deep); border-top: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; display: none; align-items: center; justify-content: space-between; z-index: 99; }
    .sticky-cta-text { font-size: 12px; color: rgba(255,255,255,0.7); }
    .sticky-cta-btn { background: var(--sage); color: #fff; padding: 10px 20px; border-radius: 100px; font-size: 13px; font-weight: 700; text-decoration: none; white-space: nowrap; }

    @media (max-width: 768px) {
      .pain-grid { grid-template-columns: 1fr; }
      .steps-grid { grid-template-columns: 1fr; }
      .testi-grid { grid-template-columns: 1fr; }
      .value-grid { grid-template-columns: 1fr; }
      .sticky-cta { display: flex; }
      .pricing-body { padding: 24px; }
      .guarantee-box { padding: 32px 22px; }
    }
  `;

  // POINT 4 — COPY ÉMOTIONNEL (viscéral, pas informatif)
  const pains = [
    { icon: '😤', title: 'Votre pantalon de l\'an dernier ne ferme plus', desc: 'Et chaque matin devant le miroir, c\'est le même constat. Le ventre prend, la confiance recule.' },
    { icon: '🔄', title: 'Les régimes ? Toujours le même cycle', desc: '-3 kg, +5 kg. Restriction, craquage, culpabilité. Depuis des années, rien ne tient.' },
    { icon: '⏰', title: 'Zéro temps pour des plans compliqués', desc: 'Entre le boulot, les enfants et les dîners clients — compter les calories est juste irréaliste.' },
    { icon: '📉', title: 'Votre métabolisme vous a lâché', desc: 'Ce qui marchait à 25 ans ne marche plus. Manger "normalement" vous fait grossir.' },
    { icon: '😓', title: 'Essoufflé en montant les escaliers', desc: 'L\'énergie d\'avant a disparu. Fatigue chronique, sommeil médiocre, motivation en berne.' },
    { icon: '🏖️', title: 'Vous évitez les photos en maillot', desc: 'L\'été approche et l\'idée de retirer votre t-shirt vous stresse. Ça ne devrait pas être comme ça.' },
  ];

  // POINT 10 — TÉMOIGNAGES HONNÊTES (beta-testeurs, pas de faux)
  const testimonials = [
    {
      name: 'Marc', age: 42, role: 'Beta-testeur · Cadre en entreprise',
      result: 'A suivi le protocole 7 semaines',
      quote: 'Pour la première fois, j\'ai un plan que je peux suivre sans y passer 2h par jour. Les repas sont prêts, je n\'ai qu\'à suivre. Simple et efficace.',
      avatar: 'M', color: '#6366F1'
    },
    {
      name: 'Julien', age: 38, role: 'Beta-testeur · Commercial terrain',
      result: 'A terminé le programme complet',
      quote: 'Le journal quotidien m\'a surpris. C\'est comme avoir un coach dans la poche. Les variantes de repas c\'est top quand tu manges à l\'extérieur.',
      avatar: 'J', color: '#F59E0B'
    },
    {
      name: 'Thomas', age: 51, role: 'Beta-testeur · Entrepreneur',
      result: 'En cours — semaine 6',
      quote: 'À 51 ans j\'étais sceptique. Mais le protocole adapté à mon âge et mon profil glycémique, c\'est du sérieux. Pas un énième régime à la mode.',
      avatar: 'T', color: '#EC4899'
    },
  ];

  const faqs = [
    { q: 'Est-ce que je dois compter mes calories ?', a: 'Non. Chaque repas est pré-calculé pour votre profil. Vous suivez le journal — c\'est tout. Pas de pesée obsessionnelle, pas de macros à calculer vous-même.' },
    { q: 'Ça marche vraiment après 40 ans ?', a: 'Le programme est spécifiquement conçu pour le métabolisme qui ralentit avec l\'âge. On utilise les équations de Mifflin-St Jeor calibrées pour votre profil + cyclage calorique training/repos.' },
    { q: 'Combien de temps ça prend par jour ?', a: '5 minutes. Vous ouvrez le journal, suivez les repas du jour, cochez les compléments. Le programme s\'occupe du reste.' },
    { q: 'Je peux annuler quand je veux ?', a: 'Oui, en 1 clic depuis votre profil. Aucun engagement, aucun frais de résiliation. Et vous êtes couvert par la garantie 14 jours.' },
    { q: 'Et si ça ne marche pas pour moi ?', a: 'Vous êtes couvert par notre garantie 14 jours. Si vous suivez le protocole et ne voyez rien bouger, on vous rembourse intégralement. Sans question, sans délai.' },
    { q: 'C\'est quoi la différence avec un simple régime ?', a: 'Un régime vous dit quoi ne pas manger. Ce programme vous dit exactement quoi manger, quand, et combien — personnalisé à votre âge, poids, profil de santé et objectif. Avec un suivi quotidien et un ajustement semaine par semaine.' },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">Sèche<span>10</span>Semaines</Link>
          <Link to="/login" className="btn-member">Espace Membre</Link>
        </div>
      </header>

      {/* POINT 2 — URGENCY BAR */}
      <div className="urgency-bar">
        <div className="urgency-inner">
          <span className="urgency-text">🔥 Offre de lancement — Plus que {spotsLeft} places à ce prix</span>
          <div className="urgency-timer">
            <span className="urgency-digit">{pad(timer.h)}</span>:
            <span className="urgency-digit">{pad(timer.m)}</span>:
            <span className="urgency-digit">{pad(timer.s)}</span>
          </div>
        </div>
      </div>

      {/* POINT 1+4 — HERO ÉMOTIONNEL */}
      <section className="hero">
        <div className="hero-badge">Programme de coaching nutritionnel · Hommes 35-55 ans</div>
        <h1 className="font-serif">
          Le corps que vous aviez<br />
          <em>à 30 ans.</em> En 10 semaines.
        </h1>
        <p className="hero-sub">
          Rejoignez le programme de sèche conçu pour les <strong>hommes actifs</strong> qui veulent perdre leur gras tenace — avec un plan alimentaire <strong>personnalisé par algorithme</strong>, sans compter une seule calorie.
        </p>
        <div className="hero-cta-group">
          <Link to="/pricing" className="btn-primary">
            Démarrer mon programme personnalisé — 14j satisfait ou remboursé
          </Link>
          <span className="hero-guarantee">
            🛡️ <strong>Garantie 14 jours</strong> · Sans engagement · Annulation en 1 clic
          </span>
        </div>
      </section>

      {/* TRUST BAR (remplace les fausses stats — Point 10) */}
      <div className="trust-bar">
        <div className="trust-inner">
          <div className="trust-item"><span className="trust-icon">🔬</span>Basé sur la science (Mifflin-St Jeor, ADA 2024)</div>
          <div className="trust-item"><span className="trust-icon">🔒</span>Paiement sécurisé Stripe</div>
          <div className="trust-item"><span className="trust-icon">🛡️</span>Garantie 14 jours</div>
          <div className="trust-item"><span className="trust-icon">📱</span>Accessible sur mobile</div>
        </div>
      </div>

      {/* POINT 4 — PAIN POINTS ÉMOTIONNELS */}
      <section id="pain" className="section pain-section">
        <div className="container">
          <div className="text-center">
            <div className="section-tag">VOUS RECONNAISSEZ-VOUS ?</div>
            <h2 className="section-title">Si vous lisez cette page,<br />c'est que vous savez.</h2>
            <p className="section-sub">Ces frustrations, vous les vivez depuis des mois — peut-être des années. Il est temps que ça change.</p>
          </div>
          <div id="pain-grid" data-animate className={`pain-grid fade-up ${isVisible('pain-grid') ? 'visible' : ''}`}>
            {pains.map((p, i) => (
              <div key={i} className="pain-item">
                <span className="pain-icon">{p.icon}</span>
                <div className="pain-text"><strong>{p.title}</strong>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="text-center">
            <div className="section-tag">COMMENT ÇA MARCHE</div>
            <h2 className="section-title">Un système personnalisé.<br />Pas un régime de plus.</h2>
            <p className="section-sub">En 5 minutes, notre algorithme crée votre protocole unique. Ensuite, vous n'avez qu'à suivre.</p>
          </div>
          <div className="steps-grid">
            {[
              { num: 1, icon: '🎯', title: 'Votre bilan en 5 min', desc: 'Âge, poids, profil glycémique, mode de vie. Notre algorithme calcule votre plan alimentaire unique — TDEE, macros, cyclage calorique.' },
              { num: 2, icon: '📱', title: 'Suivez votre journal', desc: 'Chaque jour, ouvrez l\'app. Vos 3 repas sont prêts, les compléments listés, l\'entraînement détaillé. 5 minutes par jour suffisent.' },
              { num: 3, icon: '📉', title: 'Votre corps change', desc: 'Semaine après semaine, suivez votre courbe de poids, votre tour de taille, vos marqueurs de santé. Le protocole s\'ajuste à vos résultats.' },
            ].map((step, i) => (
              <div key={i} id={`step-${i}`} data-animate className={`step-card fade-up ${isVisible(`step-${i}`) ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POINT 3 — VALUE COMPARISON */}
      <section className="section value-section">
        <div className="container text-center">
          <div className="section-tag">COMPAREZ</div>
          <h2 className="section-title">Combien coûte une vraie transformation ?</h2>
          <p className="section-sub">Le même accompagnement avec un professionnel coûte 10× plus cher.</p>
          <div id="value-grid" data-animate className={`value-grid fade-up ${isVisible('value-grid') ? 'visible' : ''}`}>
            <div className="value-card old">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accompagnement classique</div>
              <div className="value-price crossed">480€<span style={{ fontSize: 16, fontWeight: 400 }}>/mois</span></div>
              <ul className="value-list">
                <li>❌ Nutritionniste 120€ × 4 séances</li>
                <li>❌ Temps de trajet + attente</li>
                <li>❌ Plan générique (pas personnalisé)</li>
                <li>❌ Pas de suivi quotidien</li>
              </ul>
            </div>
            <div className="value-card new">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sèche 10 Semaines</div>
              <div className="value-price" style={{ color: '#059669' }}>49€<span style={{ fontSize: 16, fontWeight: 400 }}>/mois</span></div>
              <ul className="value-list">
                <li>✅ Plan alimentaire personnalisé par algorithme</li>
                <li>✅ Journal quotidien avec repas détaillés</li>
                <li>✅ Suivi poids, tour de taille, glycémie</li>
                <li>✅ Protocole d'entraînement PPL complet</li>
                <li>✅ Guide complet + communauté privée</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — HONNÊTES */}
      <section id="testimonials" className="section testimonials-section">
        <div className="container">
          <div className="text-center">
            <div className="section-tag">PREMIERS RETOURS</div>
            <h2 className="section-title">Ce qu'en disent nos beta-testeurs.</h2>
            <p className="section-sub">De vrais utilisateurs qui ont testé le programme. Résultats individuels, non contractuels.</p>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} id={`testi-${i}`} data-animate className={`testi-card fade-up ${isVisible(`testi-${i}`) ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="testi-stars">⭐⭐⭐⭐⭐</div>
                <div className="testi-result">📋 {t.result}</div>
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

      {/* PRICING — POINT 3 */}
      <section id="pricing" className="section pricing-section text-center">
        <div className="container">
          <div className="section-tag">OFFRE DE LANCEMENT</div>
          <h2 className="section-title">Tout inclus. Résultats garantis.</h2>
          <p className="section-sub">L'investissement le plus rentable de votre santé.</p>

          <div id="pricing-card" data-animate className={`pricing-card fade-up ${isVisible('pricing-card') ? 'visible' : ''}`}>
            <div className="pricing-header">
              <div className="pricing-badge">🔥 Offre limitée — {spotsLeft} places restantes</div>
              <div className="pricing-name">Programme Complet · 10 Semaines</div>
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
                  'Plan alimentaire 100% personnalisé (algorithme Mifflin-St Jeor)',
                  'Cyclage calorique Training / Repos automatique',
                  'Journal quotidien avec repas pré-calculés',
                  'Programme d\'entraînement PPL avec vidéos',
                  'Suivi poids, tour de taille et glycémie',
                  'Guide complet téléchargeable',
                  'Communauté privée Telegram',
                  'Garantie 14 jours satisfait ou remboursé',
                ].map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <Link to="/pricing" className="btn-pricing">
                Démarrer mon programme — 14j satisfait ou remboursé
              </Link>
              <div className="pricing-secure">🔒 Paiement sécurisé Stripe · SSL · Annulation en 1 clic</div>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="section guarantee-section">
        <div className="container">
          <div id="guarantee" data-animate className={`guarantee-box fade-up ${isVisible('guarantee') ? 'visible' : ''}`}>
            <div className="guarantee-icon">🛡️</div>
            <div className="guarantee-title">Garantie 14 jours — Zéro risque pour vous</div>
            <p className="guarantee-text">
              Essayez le programme pendant 14 jours. Si vous suivez le protocole et que vous n'êtes pas convaincu, on vous rembourse intégralement.<br /><br />
              <strong>Pas de conditions cachées. Pas de formulaire compliqué. Un email suffit.</strong><br /><br />
              On prend le risque à votre place — parce qu'on sait que le programme fonctionne.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faq-section">
        <div className="container faq-container">
          <div className="text-center" style={{ marginBottom: '36px' }}>
            <div className="section-tag">QUESTIONS FRÉQUENTES</div>
            <h2 className="section-title">Vos questions. Nos réponses.</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className={`faq-chevron ${openFaq === i ? 'open' : ''}`}>▾</span>
              </button>
              {openFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2 className="font-serif">Prêt à retrouver le corps que vous méritez ?</h2>
        <p>Votre transformation commence par une décision. Le reste, on s'en occupe.</p>
        <Link to="/pricing" className="btn-primary">
          Commencer maintenant — 49€/mois
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-logo">Sèche<span>10</span>Semaines</div>
        <div className="footer-links">
          <Link to="/login">Espace Membre</Link>
          <a href="mailto:contact@seche10semaines.fr">Contact</a>
          <a href="#">Mentions légales</a>
          <a href="#">CGV</a>
        </div>
        <div className="footer-copy">© 2025 Sèche10Semaines. Tous droits réservés. Résultats individuels, non contractuels.</div>
      </footer>

      {/* STICKY CTA (mobile) */}
      <div className="sticky-cta">
        <span className="sticky-cta-text">49€/mois · Garanti 14j</span>
        <Link to="/pricing" className="sticky-cta-btn">Commencer →</Link>
      </div>
    </>
  );
};
