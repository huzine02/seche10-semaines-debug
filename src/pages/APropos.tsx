import React from 'react';
import { Link } from 'react-router-dom';

export const APropos: React.FC = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828; --paper: #F8FAFC;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); }

    .ap-header { position: sticky; top: 0; z-index: 100; background: rgba(7,24,40,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; }
    .ap-header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .ap-logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; }
    .ap-logo span { color: var(--sage); }
    .ap-nav a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 13px; margin-left: 16px; }

    .ap-hero { background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 100%); padding: 60px 20px 48px; text-align: center; }
    .ap-hero h1 { font-family: 'Instrument Serif', serif; font-size: 32px; color: #fff; margin-bottom: 12px; }
    .ap-hero p { font-size: 15px; color: rgba(255,255,255,0.6); max-width: 500px; margin: 0 auto; line-height: 1.6; }

    .ap-body { max-width: 700px; margin: 0 auto; padding: 48px 20px 80px; }
    .ap-body h2 { font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--ink); margin: 36px 0 14px; }
    .ap-body p { font-size: 15px; color: var(--text-mid); line-height: 1.75; margin-bottom: 16px; }
    .ap-body strong { color: var(--text); }
    .ap-body ul { margin: 12px 0 16px 24px; }
    .ap-body li { font-size: 15px; color: var(--text-mid); line-height: 1.7; margin-bottom: 6px; }

    .ap-card { background: var(--sage-muted); border: 1px solid rgba(0,184,148,0.2); border-radius: 16px; padding: 24px; margin: 32px 0; }
    .ap-card h3 { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
    .ap-card p { margin-bottom: 0; }

    .ap-footer { background: var(--ink-deep); padding: 32px 20px; text-align: center; }
    .ap-footer a { font-size: 11px; color: rgba(255,255,255,0.4); text-decoration: none; margin: 0 8px; }
    .ap-footer-copy { font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 10px; }

    @media (min-width: 768px) {
      .ap-hero h1 { font-size: 40px; }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <header className="ap-header">
        <div className="ap-header-inner">
          <Link to="/" className="ap-logo">Sèche<span>10</span>Semaines</Link>
          <nav className="ap-nav">
            <Link to="/blog">Blog</Link>
            <Link to="/login">Espace Membre</Link>
          </nav>
        </div>
      </header>

      <section className="ap-hero">
        <h1>À propos de Sèche 10 Semaines</h1>
        <p>Un programme de nutrition scientifique, créé par un passionné, validé par la recherche.</p>
      </section>

      <div className="ap-body">
        <h2>Pourquoi ce programme existe</h2>
        <p>
          Sèche 10 Semaines est né d'un constat simple : <strong>les régimes ne marchent pas</strong>. 
          Pas parce que les gens manquent de volonté, mais parce que la plupart des programmes ignorent 
          la science du métabolisme.
        </p>
        <p>
          J'ai passé des mois à étudier les publications scientifiques — Mifflin-St Jeor pour le calcul 
          du métabolisme de base, les études de Helms sur les protéines en déficit, l'étude DPP du 
          New England Journal of Medicine sur la prévention du diabète — pour créer un outil qui 
          <strong>calcule votre plan exact</strong> basé sur votre profil unique.
        </p>

        <h2>Ce qui nous différencie</h2>
        <ul>
          <li><strong>100% personnalisé par algorithme</strong> — pas de plan générique. Vos macros sont calculées selon votre âge, poids, taille, tour de taille, niveau d'activité et profil métabolique.</li>
          <li><strong>Cyclage calorique automatique</strong> — jours d'entraînement et jours de repos ont des apports différents. Votre métabolisme ne s'adapte pas au déficit.</li>
          <li><strong>Approche santé métabolique</strong> — au-delà de la perte de poids, nous suivons des marqueurs comme la glycémie, le tour de taille et le bilan lipidique.</li>
          <li><strong>Fondé sur la recherche</strong> — chaque formule, chaque recommandation est traçable vers une publication scientifique.</li>
        </ul>

        <div className="ap-card">
          <h3>🔬 Notre engagement</h3>
          <p>
            Nous ne promettons pas de miracles. Nous promettons un <strong>cadre scientifique rigoureux</strong> et 
            un suivi quotidien pour vous donner les meilleures chances de transformer votre corps et votre santé. 
            Les résultats dépendent de votre engagement — notre rôle est de rendre le chemin le plus simple possible.
          </p>
        </div>

        <h2>À qui s'adresse ce programme</h2>
        <p>
          Sèche 10 Semaines est conçu pour les <strong>hommes de 35 à 55+ ans</strong> qui veulent :
        </p>
        <ul>
          <li>Perdre du gras viscéral de manière durable (pas un régime crash)</li>
          <li>Améliorer leurs marqueurs de santé métabolique (glycémie, cholestérol, tour de taille)</li>
          <li>Suivre un plan concret sans y passer des heures</li>
          <li>Comprendre la science derrière leur transformation</li>
        </ul>

        <div className="ap-card">
          <h3>⚕️ Avertissement santé</h3>
          <p>
            Ce programme ne remplace pas un suivi médical. Si vous êtes en situation de prédiabète, 
            de cholestérol élevé ou de toute autre condition, <strong>consultez votre médecin</strong> avant 
            de commencer. Nous sommes un outil complémentaire, pas un substitut à l'accompagnement médical.
          </p>
        </div>

        <h2>Contact</h2>
        <p>
          Une question ? Écrivez-nous à <a href="mailto:contact@seche10semaines.fr" style={{ color: '#00B894' }}>contact@seche10semaines.fr</a>
        </p>
      </div>

      <footer className="ap-footer">
        <div>
          <Link to="/">Accueil</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/login">Espace Membre</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgv">CGV</Link>
          <Link to="/politique-confidentialite">Confidentialité</Link>
        </div>
        <div className="ap-footer-copy">© 2026 Sèche10Semaines · BH Digital</div>
      </footer>
    </>
  );
};
