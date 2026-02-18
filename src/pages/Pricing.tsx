import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { StripeCheckout } from '../components/StripeCheckout';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828; --paper: #F8FAFC; --cream: #F1F5F9;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --card: #FFFFFF;
      --shadow-green: 0 8px 40px rgba(0,184,148,0.35);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); -webkit-font-smoothing: antialiased; }

    .pricing-page {
      min-height: 100vh;
      background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 60%, #0a3d52 100%);
      display: flex; flex-direction: column;
    }
    .pricing-header {
      padding: 18px 24px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .logo { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; text-decoration: none; }
    .logo span { color: var(--sage); }
    .btn-back { font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s; }
    .btn-back:hover { color: #fff; }

    .pricing-content {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 60px 24px;
    }
    .pricing-tag {
      display: inline-block;
      background: rgba(0,184,148,0.15);
      border: 1px solid rgba(0,184,148,0.4);
      color: var(--sage-glow);
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      padding: 6px 16px; border-radius: 100px;
      margin-bottom: 24px;
    }
    .pricing-headline {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(30px, 5vw, 50px);
      color: #fff; text-align: center;
      line-height: 1.15; letter-spacing: -0.02em;
      margin-bottom: 12px; max-width: 700px;
    }
    .pricing-sub {
      font-size: 17px; color: rgba(255,255,255,0.6);
      text-align: center; margin-bottom: 48px; max-width: 500px;
      line-height: 1.6;
    }

    .plan-card {
      width: 100%; max-width: 500px;
      background: #fff; border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 40px 120px rgba(0,0,0,0.45);
    }
    .plan-header {
      background: linear-gradient(135deg, var(--sage) 0%, var(--sage-light) 100%);
      padding: 32px 36px; text-align: center;
    }
    .plan-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2); color: #fff;
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 5px 14px; border-radius: 100px; margin-bottom: 12px;
    }
    .plan-name {
      font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; margin-bottom: 16px;
    }
    .plan-price-row { display: flex; align-items: baseline; justify-content: center; gap: 12px; }
    .plan-price { font-family: 'Instrument Serif', serif; font-size: 72px; color: #fff; line-height: 1; }
    .plan-price-details { text-align: left; }
    .plan-period { color: rgba(255,255,255,0.85); font-size: 16px; font-weight: 600; }
    .plan-old { color: rgba(255,255,255,0.55); font-size: 18px; text-decoration: line-through; }
    .plan-saving {
      display: inline-block; margin-top: 12px;
      background: rgba(255,255,255,0.2); color: #fff;
      font-size: 12px; font-weight: 700;
      padding: 4px 12px; border-radius: 100px;
    }

    .plan-body { padding: 32px 36px; }
    .plan-list { list-style: none; margin-bottom: 28px; }
    .plan-list li {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 10px 0; border-bottom: 1px solid var(--border);
      font-size: 15px; color: var(--text); line-height: 1.4;
    }
    .plan-list li:last-child { border-bottom: none; }
    .plan-list li .check { color: var(--sage); font-weight: 700; font-size: 16px; flex-shrink: 0; margin-top: 1px; }

    .btn-checkout {
      display: block; width: 100%;
      background: var(--sage); color: #fff;
      padding: 18px 32px; border-radius: 100px;
      font-size: 17px; font-weight: 700;
      text-align: center; text-decoration: none;
      border: none; cursor: pointer;
      transition: all 0.3s;
      box-shadow: var(--shadow-green);
      animation: pulse-btn 2.5s ease-in-out infinite;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-checkout:hover { background: var(--sage-light); transform: translateY(-2px); box-shadow: 0 16px 50px rgba(0,184,148,0.5); }
    @keyframes pulse-btn {
      0%, 100% { box-shadow: 0 8px 40px rgba(0,184,148,0.35); }
      50% { box-shadow: 0 8px 60px rgba(0,184,148,0.6); }
    }

    .plan-secure {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      margin-top: 12px; font-size: 12px; color: var(--text-light);
    }
    .plan-guarantee {
      background: var(--sage-muted);
      border: 1px solid rgba(0,184,148,0.2);
      border-radius: 12px; padding: 14px 18px;
      display: flex; align-items: center; gap: 10px;
      margin-top: 16px; font-size: 13px; color: var(--text-mid);
    }
    .plan-guarantee strong { color: var(--ink); }

    .trust-row {
      display: flex; justify-content: center; gap: 32px;
      margin-top: 32px; flex-wrap: wrap;
    }
    .trust-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.55); }

    @media (max-width: 560px) {
      .plan-body { padding: 24px 20px; }
      .plan-header { padding: 28px 20px; }
    }
  `;

  const features = [
    'Plan alimentaire 100% personnalisé à votre profil',
    'Ajustements hebdomadaires automatiques',
    'Support IA 24h/24 pour toutes vos questions',
    'App de suivi intelligent (poids, énergie, humeur)',
    'Bibliothèque de +200 recettes adaptées 35-55 ans',
    'Communauté privée de 500+ hommes',
    'Bilan de composition corporelle mensuel',
    'Guides PDF téléchargeables',
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="pricing-page">
        <header className="pricing-header">
          <Link to="/" className="logo">Sèche<span>10</span>Semaines</Link>
          <Link to="/" className="btn-back">← Retour</Link>
        </header>

        <div className="pricing-content">
          <div className="pricing-tag">🔥 Offre de lancement</div>
          <h1 className="pricing-headline">
            Votre transformation commence<br />aujourd'hui.
          </h1>
          <p className="pricing-sub">
            Sans engagement. Annulation en 1 clic. Garantie 14 jours satisfait ou remboursé.
          </p>

          <div className="plan-card">
            <div className="plan-header">
              <div className="plan-badge">Programme Complet</div>
              <div className="plan-name">Sèche 10 Semaines</div>
              <div className="plan-price-row">
                <span className="plan-price">49€</span>
                <div className="plan-price-details">
                  <div className="plan-period">/mois</div>
                  <div className="plan-old">97€</div>
                </div>
              </div>
              <div className="plan-saving">🎉 Vous économisez 48€/mois</div>
            </div>

            <div className="plan-body">
              <ul className="plan-list">
                {features.map((f, i) => (
                  <li key={i}><span className="check">✓</span>{f}</li>
                ))}
              </ul>

              {showCheckout ? (
                <StripeCheckout />
              ) : (
                <>
                  {user ? (
                    <button className="btn-checkout" onClick={() => setShowCheckout(true)}>
                      Commencer ma transformation →
                    </button>
                  ) : (
                    <Link to="/login?redirect=pricing" className="btn-checkout">
                      Créer mon compte et commencer →
                    </Link>
                  )}
                </>
              )}

              <div className="plan-secure">🔒 Paiement 100% sécurisé Stripe · SSL · Sans engagement</div>

              <div className="plan-guarantee">
                <span style={{ fontSize: '20px' }}>🛡️</span>
                <div>
                  <strong>Garantie 14 jours satisfait ou remboursé.</strong><br />
                  Vous essayez, vous ne voyez pas de résultats — on rembourse. Sans questions.
                </div>
              </div>
            </div>
          </div>

          <div className="trust-row">
            <div className="trust-item">✅ Sans engagement</div>
            <div className="trust-item">🔒 Paiement sécurisé</div>
            <div className="trust-item">⭐ 4,9/5 sur 500 avis</div>
          </div>
        </div>
      </div>
    </>
  );
};
