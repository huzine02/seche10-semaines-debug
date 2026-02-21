import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { trackEvent } from '../utils/analytics';

export const Success: React.FC = () => {
  const { userProfile, refreshProfile } = useAuth();
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Check if already active
  const isActive = userProfile?.subscriptionStatus === 'active' || userProfile?.subscriptionStatus === 'trialing';

  // Poll for subscription activation after Stripe payment
  const pollActivation = useCallback(async () => {
    const maxAttempts = 15; // 15 × 2s = 30s
    for (let i = 0; i < maxAttempts; i++) {
      await refreshProfile();
      // Small delay to let state update
      await new Promise(r => setTimeout(r, 2000));
    }
    // If we get here, timeout
    setTimedOut(true);
  }, [refreshProfile]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setVisible(true), 100);

    if (!isActive) {
      pollActivation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isActive && !activated) {
      setActivated(true);
      trackEvent('subscription_active');
    }
  }, [isActive, activated]);

  const showContent = activated || isActive;

  const s = {
    page: {
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #071828 0%, #0F2C59 55%, #0a3d52 100%)',
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: '24px 16px',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    glow: {
      position: 'absolute' as const,
      top: '-80px', left: '50%',
      transform: 'translateX(-50%)',
      width: '400px', height: '400px',
      background: 'radial-gradient(circle, rgba(0,184,148,0.22) 0%, transparent 70%)',
      pointerEvents: 'none' as const,
    },
    card: {
      background: '#fff',
      borderRadius: '24px',
      padding: '40px 28px',
      width: '100%',
      maxWidth: '440px',
      textAlign: 'center' as const,
      boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
      position: 'relative' as const,
      zIndex: 1,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
      transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
    },
    title: {
      fontFamily: "'Instrument Serif', serif",
      fontSize: 'clamp(26px, 7vw, 36px)',
      color: '#0F2C59',
      lineHeight: 1.15,
      marginBottom: '10px',
      letterSpacing: '-0.02em',
    },
    cta: {
      display: 'block',
      width: '100%',
      background: '#00B894',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: '100px',
      fontSize: '16px', fontWeight: 700,
      textDecoration: 'none',
      textAlign: 'center' as const,
      boxShadow: '0 8px 32px rgba(0,184,148,0.4)',
      marginBottom: '12px',
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes bounce { from { transform: translateY(0px); } to { transform: translateY(-8px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={s.page}>
        <div style={s.glow} />
        <div style={s.card}>

          {!showContent && !timedOut && (
            <>
              <div style={{ width: 48, height: 48, border: '4px solid #E2E8F0', borderTop: '4px solid #00B894', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
              <h1 style={{ ...s.title, fontSize: '22px' }}>Activation en cours...</h1>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
                Votre paiement a été reçu. Nous activons votre accès, cela prend quelques secondes.
              </p>
            </>
          )}

          {!showContent && timedOut && (
            <>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>⏳</span>
              <h1 style={{ ...s.title, fontSize: '22px' }}>Activation en cours</h1>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
                L'activation peut prendre quelques instants. Rechargez la page ou réessayez dans une minute.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{ ...s.cta, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" } as any}
              >
                🔄 Recharger la page
              </button>
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>
                Si le problème persiste, contactez <a href="mailto:contact@seche10semaines.fr" style={{ color: '#00B894' }}>contact@seche10semaines.fr</a>
              </p>
            </>
          )}

          {showContent && (
            <>
              <span style={{ fontSize: 52, marginBottom: 12, display: 'block', animation: 'bounce 1s ease-in-out infinite alternate' }}>🎉</span>
              <div style={{ display: 'inline-block', background: '#ECFDF5', border: '1px solid rgba(0,184,148,0.35)', color: '#059669', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '5px 14px', borderRadius: 100, marginBottom: 16 }}>
                Paiement confirmé ✓
              </div>

              <h1 style={s.title}>
                Bienvenue dans<br />
                <em style={{ color: '#00B894', fontStyle: 'italic' }}>Sèche 10 Semaines</em>
              </h1>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
                Votre abonnement est activé. La transformation commence maintenant.
              </p>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, textAlign: 'left' as const, marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#00B894', marginBottom: 14 }}>🚀 Vos prochaines étapes</div>
                {[
                  { n: 1, label: 'Profil configuré ✓', desc: 'Biométrie + profil santé complétés' },
                  { n: 2, label: 'Plan personnalisé prêt ✓', desc: 'Macros + cyclage calorique calculés' },
                  { n: 3, label: 'Commencer dès maintenant', desc: 'Journal quotidien + suivi progression' },
                ].map((step, i, arr) => (
                  <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i === arr.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00B894, #059669)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.n}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{step.label}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/dashboard" style={s.cta}>
                Accéder à mon programme →
              </Link>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>🔒 Données sécurisées · Annulable à tout moment</div>
            </>
          )}

        </div>
      </div>
    </>
  );
};
