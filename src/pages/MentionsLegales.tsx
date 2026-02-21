import React from 'react';
import { Link } from 'react-router-dom';

export const MentionsLegales: React.FC = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    .legal-page { min-height: 100vh; background: #F8FAFC; font-family: 'DM Sans', sans-serif; color: #1E293B; }
    .legal-header { background: #071828; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
    .legal-header .logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; }
    .legal-header .logo span { color: #00B894; }
    .legal-header .back { font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none; }
    .legal-container { max-width: 720px; margin: 0 auto; padding: 40px 20px 80px; }
    .legal-container h1 { font-family: 'Instrument Serif', serif; font-size: 32px; color: #0F2C59; margin-bottom: 8px; }
    .legal-container .updated { font-size: 13px; color: #94A3B8; margin-bottom: 32px; }
    .legal-container h2 { font-family: 'Instrument Serif', serif; font-size: 20px; color: #0F2C59; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #E2E8F0; }
    .legal-container p { font-size: 14px; line-height: 1.7; color: #475569; margin-bottom: 12px; }
    .legal-container a { color: #00B894; }
    @media (min-width: 769px) { .legal-container { padding: 60px 24px 100px; } .legal-container h1 { font-size: 40px; } }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="legal-page">
        <header className="legal-header">
          <Link to="/" className="logo">Sèche<span>10</span>Semaines</Link>
          <Link to="/" className="back">← Retour</Link>
        </header>
        <div className="legal-container">
          <h1>Mentions légales</h1>
          <p className="updated">Dernière mise à jour : 19 février 2026</p>

          <h2>Éditeur du site</h2>
          <p>
            BH Digital — Entreprise Individuelle<br />
            5 bis rue de la Bouvine, 34130 Candillargues, France<br />
            SIRET : 509 791 885 00015<br />
            Email : <a href="mailto:contact@seche10semaines.fr">contact@seche10semaines.fr</a>
          </p>

          <h2>Directeur de la publication</h2>
          <p>Hocine Bouhend, en qualité de gérant.</p>

          <h2>Hébergeur</h2>
          <p>
            Vercel Inc.<br />
            340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
            Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu du site seche10semaines.fr (textes, images, graphismes, logo, icônes, logiciels, etc.)
            est la propriété exclusive de l'éditeur ou de ses partenaires. Toute reproduction, représentation, modification,
            publication ou adaptation, totale ou partielle, est interdite sans autorisation préalable écrite de l'éditeur.
          </p>

          <h2>Limitation de responsabilité</h2>
          <p>
            Les informations fournies sur le site sont à titre indicatif et ne constituent en aucun cas un avis médical.
            Le programme Sèche 10 Semaines ne se substitue pas à une consultation médicale. L'éditeur ne saurait être tenu
            responsable de l'utilisation faite des informations et contenus présents sur le site.
          </p>
          <p>
            L'éditeur met tout en œuvre pour assurer l'exactitude des informations diffusées, mais ne peut garantir
            l'exhaustivité ni l'absence d'erreurs. L'éditeur se réserve le droit de modifier le contenu à tout moment et sans préavis.
          </p>

          <h2>Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige,
            les tribunaux compétents de Montpellier seront seuls compétents.
          </p>
        </div>
      </div>
    </>
  );
};
