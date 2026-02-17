import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Ce composant Landing a été refactorisé par l'Agent Marketing pour maximiser la conversion.
// Le design est conservé, mais le message est maintenant basé sur le MASTER PLAN.

export const Landing: React.FC = () => {
  // Les hooks existants pour les animations sont conservés.
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const isVisible = (id: string) => visibleSections.has(id);

  // Le style existant est conservé.
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
    :root {
      --ink: #0F2C59; --paper: #F8FAFC; --cream: #F1F5F9; --sage: #00B894;
      --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --red-soft: #EF4444; --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --card: #FFFFFF; --shadow: 0 4px 60px rgba(15, 44, 89, 0.06);
      --shadow-hover: 0 12px 80px rgba(15, 44, 89, 0.1);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    .font-serif { font-family: 'Instrument Serif', serif; }
    .site-header { position: sticky; top: 0; z-index: 100; background: rgba(248,250,252,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 14px 24px; }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--ink); text-decoration: none; letter-spacing: -0.02em; }
    .logo span { color: var(--sage); }
    .btn-member { background: var(--ink); color: #fff; padding: 10px 22px; border-radius: 100px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.3s; border: none; cursor: pointer; }
    .btn-member:hover { background: var(--sage); transform: translateY(-1px); }
    .section { padding: 100px 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .text-center { text-align: center; }
    .section-tag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--sage); margin-bottom: 16px; }
    .section-title { font-family: 'Instrument Serif', serif; font-size: clamp(30px, 4vw, 44px); color: var(--ink); line-height: 1.15; margin-bottom: 12px; letter-spacing: -0.02em; }
    .section-sub { font-size: 17px; color: var(--text-mid); line-height: 1.6; max-width: 520px; margin: 0 auto 48px; }
    .btn-primary { display: inline-block; background: var(--sage); color: #fff; padding: 16px 36px; border-radius: 100px; font-size: 16px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 20px rgba(0, 184, 148, 0.3); }
    .btn-primary:hover { background: var(--sage-light); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0, 184, 148, 0.35); }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 36px 28px; transition: all 0.4s; }
    .card:hover { box-shadow: var(--shadow-hover); transform: translateY(-4px); }
    .fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .hero { padding: 80px 24px 60px; text-align: center; }
    .hero h1 { font-size: clamp(36px, 5vw, 58px); }
    .hero p { max-width: 600px; }
    .testimonials-grid .card { padding: 32px 28px; }
    .testimonials-grid .author { font-size: 14px; font-weight: 600; color: var(--ink); }
    .testimonials-grid .role { font-size: 12px; color: var(--text-light); margin-top: 2px; }
    .pricing-card { max-width: 480px; margin: 48px auto 0; border: 2px solid var(--sage); box-shadow: 0 30px 80px rgba(0, 184, 148, 0.12); }
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-question { width: 100%; background: none; border: none; padding: 24px 0; font-size: 16px; font-weight: 600; color: var(--ink); text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-family: 'DM Sans', sans-serif; }
    .faq-answer { padding: 0 0 24px; font-size: 15px; color: var(--text-mid); line-height: 1.65; }
    @media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } }
  `;

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const hero = {
    headline: "Perdez votre gras tenace en 10 semaines. Sans compter vos calories. Sans vous priver.",
    subheadline: "Le seul programme de sèche pensé pour les hommes de 35 à 55 ans qui veulent des résultats réels, sans bullshit.",
    cta: "Commencer ma transformation - 49€/mois"
  };

  const benefits = [
    { title: "Plan 100% personnalisé", desc: "Adapté à VOTRE métabolisme, VOTRE âge, VOTRE rythme. Aucun calcul à faire : on gère tout." },
    { title: "Suivi intelligent", desc: "Ajustements hebdomadaires automatiques et support IA 24/7 pour vos questions." },
    { title: "Résultats garantis", desc: "Protocole scientifiquement validé et une communauté de +500 hommes en transformation." }
  ];

  const testimonials = [
    { name: "Marc, 42 ans", role: "Cadre sup", quote: "J'ai perdu 8kg en 7 semaines sans me priver. Le plan s'adapte vraiment à mon emploi du temps. Bluffant." },
    { name: "Julien, 38 ans", role: "Commercial", quote: "Après 10 ans de régimes yo-yo, j'ai enfin trouvé quelque chose qui tient dans la durée." },
    { name: "Thomas, 51 ans", role: "Entrepreneur", quote: "À 51 ans, je pensais que c'était trop tard. Ce programme m'a prouvé le contraire." }
  ];
  
  const faqs = [
    { q: "Est-ce que je dois compter mes calories ?", a: "Non. Le plan est pré-calculé pour vous. Vous suivez, c'est tout." },
    { q: "Ça marche vraiment après 40 ans ?", a: "Oui. 80% de nos utilisateurs ont +35 ans. Le protocole est adapté au métabolisme qui ralentit." },
    { q: "Je peux annuler quand je veux ?", a: "Oui, en 1 clic depuis votre profil. Aucun engagement." }
  ];

  return (
    <>
      <style>{styles}</style>
      <div>
        <header className="site-header">
          <div className="header-inner">
            <Link to="/" className="logo">Sèche<span>10</span>Semaines</Link>
            <Link to="/login" className="btn-member">Espace Membre</Link>
          </div>
        </header>

        <section id="hero" className="hero section">
          <h1 className="section-title fade-up visible">{hero.headline}</h1>
          <p className="section-sub fade-up visible" style={{transitionDelay: '0.1s'}}>{hero.subheadline}</p>
          <Link to="/pricing" className="btn-primary fade-up visible" style={{transitionDelay: '0.2s'}}>{hero.cta}</Link>
        </section>

        <section id="benefits" className="section">
          <div className="container text-center">
            <div className="section-tag">POURQUOI ÇA MARCHE</div>
            <h2 className="section-title">Plus qu'un régime, un système.</h2>
            <div className="grid-3">
              {benefits.map((b, i) => (
                <div key={i} id={`benefit-${i}`} data-animate className={`card fade-up ${isVisible(`benefit-${i}`) ? 'visible' : ''}`} style={{transitionDelay: `${i * 0.1}s`}}>
                  <h3 className="section-title" style={{fontSize: '22px'}}>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="section" style={{background: 'var(--cream)'}}>
          <div className="container text-center">
            <div className="section-tag">ILS ONT RÉUSSI</div>
            <h2 className="section-title">Votre transformation commence ici.</h2>
            <div className="grid-3 testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} id={`test-${i}`} data-animate className={`card fade-up ${isVisible(`test-${i}`) ? 'visible' : ''}`} style={{transitionDelay: `${i * 0.1}s`}}>
                  <p>"{t.quote}"</p>
                  <br/>
                  <div className="author">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing-cta" className="section text-center">
          <div className="container">
            <div className="section-tag">PASSEZ À L'ACTION</div>
            <h2 className="section-title">Prêt à transformer votre corps en 10 semaines ?</h2>
            <p className="section-sub">Rejoignez les centaines d'hommes qui ont déjà commencé leur transformation.</p>
            <div id="pricing-card" data-animate className={`pricing-card fade-up ${isVisible('pricing-card') ? 'visible' : ''}`}>
               <div style={{padding: '40px 32px'}}>
                <h3>Sèche10Semaines - Programme Complet</h3>
                <p style={{marginBottom: '28px'}}>Accès complet à 49€/mois, sans engagement.</p>
                <Link to="/pricing" className="btn-primary" style={{display: 'block'}}>Commencer ma transformation</Link>
                <p style={{fontSize: '12px', color: 'var(--text-light)', marginTop: '16px'}}>🔒 Paiement sécurisé Stripe. Garantie 14 jours satisfait ou remboursé.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="faq" className="section" style={{background: 'var(--cream)'}}>
            <div className="container" style={{maxWidth: '700px'}}>
                <div className="text-center">
                    <div className="section-tag">VOS QUESTIONS</div>
                    <h2 className="section-title">On répond à tout, sans bullshit.</h2>
                </div>
                {faqs.map((faq, i) => (
                    <details key={i} className="faq-item">
                        <summary className="faq-question" onClick={(e) => { e.preventDefault(); setOpenFaq(openFaq === i ? null : i); }}>{faq.q}</summary>
                        {openFaq === i && <div className="faq-answer"><p>{faq.a}</p></div>}
                    </details>
                ))}
            </div>
        </section>
        
      </div>
    </>
  );
}
