import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

/**
 * StripeCheckout
 * Redirige vers Stripe Checkout (hosted) via Firebase Function.
 * La Firebase Function crée une Checkout Session et retourne l'URL.
 *
 * Flux :
 *  1. User clique "Payer"
 *  2. On appelle createCheckoutSession (Firebase Function)
 *  3. Firebase Function crée une Stripe Checkout Session (mode: subscription)
 *  4. On redirige vers session.url
 *  5. Stripe redirect vers /success?session_id=... ou /cancel
 */

const CHECKOUT_URL = 'https://createcheckoutsession-vyniq7423a-uc.a.run.app';

export const StripeCheckout: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();

      const response = await fetch(CHECKOUT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          priceId: 'price_1Sev1dDWHAsAimG7iucf8bR1',
          successUrl: `${window.location.origin}/#/success`,
          cancelUrl: `${window.location.origin}/#/pricing`,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erreur lors de la création de la session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      setLoading(false);
    }
  };

  const styles = `
    .stripe-checkout-wrapper { width: 100%; }
    .stripe-btn {
      display: block; width: 100%;
      background: #00B894; color: #fff;
      padding: 18px 32px; border-radius: 100px;
      font-size: 17px; font-weight: 700;
      text-align: center; text-decoration: none;
      border: none; cursor: pointer;
      transition: all 0.3s;
      font-family: 'DM Sans', sans-serif;
      box-shadow: 0 8px 40px rgba(0,184,148,0.35);
      animation: pulse-btn 2.5s ease-in-out infinite;
    }
    .stripe-btn:disabled { opacity: 0.65; cursor: not-allowed; animation: none; }
    .stripe-btn:not(:disabled):hover { background: #059669; transform: translateY(-2px); }
    @keyframes pulse-btn {
      0%, 100% { box-shadow: 0 8px 40px rgba(0,184,148,0.35); }
      50% { box-shadow: 0 8px 60px rgba(0,184,148,0.6); }
    }
    .stripe-loading { display: flex; align-items: center; justify-content: center; gap: 10px; }
    .spinner {
      width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .stripe-error {
      margin-top: 12px; padding: 12px 16px;
      background: #fef2f2; border: 1px solid #fecaca;
      border-radius: 10px; font-size: 13px; color: #dc2626;
    }
    .stripe-powered {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      margin-top: 10px; font-size: 11px; color: #94A3B8;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="stripe-checkout-wrapper">
        <button className="stripe-btn" onClick={handleCheckout} disabled={loading}>
          {loading ? (
            <span className="stripe-loading">
              <span className="spinner" />
              Redirection vers le paiement...
            </span>
          ) : (
            'Démarrer mon programme — 29€/mois →'
          )}
        </button>

        {error && <div className="stripe-error">⚠️ {error}</div>}

        <div className="stripe-powered">
          Propulsé par <strong>Stripe</strong> — Paiement SSL sécurisé
        </div>
      </div>
    </>
  );
};
