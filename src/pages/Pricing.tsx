import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { StripeCheckout } from '../components/StripeCheckout';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [spotsLeft] = useState(14);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0;
      --shadow-green: 0 8px 40px rgba(0,184,148,0.35);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: #F8FAFC; color: var(--text); -webkit-font-smoothing: antialiased; }

    .pricing-page {
      min-height: 100vh;
      background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 60%, #0a3d52 100%);
      display: flex; flex-direction: column;
    }
    .pricing-header {
      padding: 14px 20px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; }
    .logo span { color: var(--sage); }
    .btn-back { font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none; }

    .pricing-content {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 40px 20px 60px;
    }

    .spots-banner {
      background: linear-gradient(90deg, #DC2626, #B91C1C);
      color: #fff; font-size: 12px; font-weight: 700;
      padding: 6px 16px; border-radius: 100px;
      margin-bottom: 20px; display: inline-flex; align-items: center; gap: 6px;
      animation: spots-pulse 2s ease-in-out infinite;
    }
    @keyframes spots-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.85; } }

    .pricing-tag {
      display: inline-block;
      background: rgba(0,184,148,0.15);
      border: 1px solid rgba(0,184,148,0.4);
      color: var(--sage-glow);
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      padding: 5px 14px; border-radius: 100px;
      margin-bottom: 20px;
    }
    .pricing-headline {
      font-family: 'Instrument Serif', serif;
      font-size: 30px; color: #fff; text-align: center;
      line-height: 1.15; letter-spacing: -0.02em;
      margin-bottom: 10px; max-width: 500px;
    }
    .pricing-sub {
      font-size: 14px; color: rgba(255,255,255,0.55);
      text-align: center; margin-bottom: 32px; max-width: 420px;
      line-height: 1.6;
    }

    .plan-card {
      width: 100%; max-width: 440px;
      background: #fff; border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 40px 120px rgba(0,0,0,0.45);
    }
    .plan-header {
      background: linear-gradient(135deg, var(--sage) 0%, var(--sage-light) 100%);
      padding: 24px; text-align: center;
    }
    .plan-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2); color: #fff;
      font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 4px 12px; border-radius: 100px; margin-bottom: 10px;
    }
    .plan-name {
      font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; margin-bottom: 14px;
    }
    .plan-price-row { display: flex; align-items: baseline; justify-content: center; gap: 10px; }
    .plan-price { font-family: 'Instrument Serif', serif; font-size: 64px; color: #fff; line-height: 1; }
    .plan-price-details { text-align: left; }
    .plan-period { color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 600; }
    .plan-old { color: rgba(255,255,255,0.55); font-size: 16px; text-decoration: line-through; }
    .plan-saving {
      display: inline-block; margin-top: 10px;
      background: rgba(255,255,255,0.2); color: #fff;
      font-size: 11px; font-weight: 700;
      padding: 4px 12px; border-radius: 100px;
    }

    .plan-body { padding: 24px; }
    .plan-list { list-style: none; margin-bottom: 24px; }
    .plan-list li {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 8px 0; border-bottom: 1px solid var(--border);
      font-size: 13px; color: var(--text); line-height: 1.4;
    }
    .plan-list li:last-child { border-bottom: none; }
    .plan-list li .check { color: var(--sage); font-weight: 700; font-size: 15px; flex-shrink: 0; }

    .btn-checkout {
      display: block; width: 100%;
      background: var(--sage); color: #fff;
      padding: 16px 28px; border-radius: 100px;
      font-size: 15px; font-weight: 700;
      text-align: center; text-decoration: none;
      border: none; cursor: pointer;
      transition: all 0.3s;
      box-shadow: var(--shadow-green);
      animation: pulse-btn 2.5s ease-in-out infinite;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-checkout:hover { background: var(--sage-light); transform: translateY(-2px); }
    @keyframes pulse-btn {
      0%, 100% { box-shadow: 0 8px 40px rgba(0,184,148,0.35); }
      50% { box-shadow: 0 8px 60px rgba(0,184,148,0.6); }
    }

    .plan-secure {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      margin-top: 10px; font-size: 10px; color: var(--text-light);
    }
    .plan-guarantee {
      background: var(--sage-muted);
      border: 1px solid rgba(0,184,148,0.2);
      border-radius: 10px; padding: 12px 16px;
      display: flex; align-items: center; gap: 10px;
      margin-top: 14px; font-size: 12px; color: var(--text-mid); line-height: 1.5;
    }
    .plan-guarantee strong { color: var(--ink); }

    .trust-row {
      display: flex; justify-content: center; gap: 20px;
      margin-top: 24px; flex-wrap: wrap;
    }
    .trust-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.5); }

    @media (min-width: 769px) {
      .pricing-headline { font-size: 44px; }
      .pricing-content { padding: 60px 24px; }
      .plan-header { padding: 32px 36px; }
      .plan-body { padding: 32px 36px; }
      .plan-list li { font-size: 15px; }
    }
  `;

  const features = [
    'Plan alimentaire 100% personnalisé (algorithme Mifflin-St Jeor)',
    'Cyclage calorique automatique Training / Repos',
    'Journal quotidien avec 3 repas pré-calculés',
    'Programme d\'entraînement PPL complet',
    'Suivi poids, tour de taille et glycémie',
    'Guide complet téléchargeable',
    'Communauté privée Telegram',
    'Garantie 14 jours satisfait ou remboursé',
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
          <div className="spots-banner">🔥 Plus que {spotsLeft} places à ce tarif</div>
          <div className="pricing-tag">Offre de lancement · 50 premiers inscrits</div>
          <h1 className="pricing-headline">
            Votre transformation<br />commence aujourd'hui.
          </h1>
          <p className="pricing-sub">
            Sans engagement. Annulation en 1 clic. Garantie 14 jours.
          </p>

          <div className="plan-card">
            <div className="plan-header">
              <div className="plan-badge">🔥 Offre limitée — {spotsLeft} places</div>
              <div className="plan-name">Programme Complet · 10 Semaines</div>
              <div className="plan-price-row">
                <span className="plan-price">29€</span>
                <div className="plan-price-details">
                  <div className="plan-period">/mois</div>
                  <div className="plan-old">49€</div>
                </div>
              </div>
              <div className="plan-saving">🎉 -40% pour les 50 premiers inscrits</div>
            </div>

            <div className="plan-body">
              <ul className="plan-list">
                {features.map((f, i) => (
                  <li key={i}><span className="check">✓</span>{f}</li>
                ))}
              </ul>

              {user ? (
                <StripeCheckout />
              ) : (
                <Link to="/login?redirect=pricing" className="btn-checkout">
                  Créer mon compte — 29€/mois →
                </Link>
              )}

              <div className="plan-secure">🔒 Paiement sécurisé Stripe · SSL · Annulation en 1 clic</div>

              <div className="plan-guarantee">
                <span style={{ fontSize: 18 }}>🛡️</span>
                <div>
                  <strong>Garantie 14 jours satisfait ou remboursé.</strong><br />
                  Pas de conditions cachées. Un email suffit.
                </div>
              </div>
            </div>
          </div>

          <div className="trust-row">
            <div className="trust-item">✅ Sans engagement</div>
            <div className="trust-item">🔒 Paiement sécurisé</div>
            <div className="trust-item">🛡️ Garanti 14 jours</div>
          </div>
        </div>
      </div>
    </>
  );
};
