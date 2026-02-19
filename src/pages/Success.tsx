import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Success: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setVisible(true), 100);
  }, []);

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
    confetti: {
      fontSize: '52px',
      marginBottom: '12px',
      display: 'block',
      animation: 'bounce 1s ease-in-out infinite alternate',
    },
    badge: {
      display: 'inline-block',
      background: '#ECFDF5',
      border: '1px solid rgba(0,184,148,0.35)',
      color: '#059669',
      fontSize: '11px', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase' as const,
      padding: '5px 14px', borderRadius: '100px',
      marginBottom: '16px',
    },
    title: {
      fontFamily: "'Instrument Serif', serif",
      fontSize: 'clamp(26px, 7vw, 36px)',
      color: '#0F2C59',
      lineHeight: 1.15,
      marginBottom: '10px',
      letterSpacing: '-0.02em',
    },
    sub: {
      fontSize: '15px',
      color: '#64748B',
      lineHeight: 1.6,
      marginBottom: '28px',
    },
    stepsBox: {
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'left' as const,
      marginBottom: '24px',
    },
    stepsTitle: {
      fontSize: '11px', fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase' as const,
      color: '#00B894', marginBottom: '14px',
    },
    step: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid #F1F5F9',
    },
    stepNum: {
      width: '28px', height: '28px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #00B894, #059669)',
      color: '#fff',
      fontSize: '13px', fontWeight: 700,
      display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const,
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0,184,148,0.3)',
    },
    stepText: { flex: 1 },
    stepLabel: { fontSize: '14px', fontWeight: 600, color: '#1E293B' },
    stepDesc: { fontSize: '11px', color: '#94A3B8', marginTop: '1px' },
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
      transition: 'all 0.3s',
      marginBottom: '12px',
    },
    secure: {
      fontSize: '11px',
      color: '#94A3B8',
      marginBottom: '4px',
    },
    footer: {
      marginTop: '20px',
      padding: '0 4px',
    },
    footerText: {
      fontSize: '11px',
      color: '#94A3B8',
      lineHeight: 1.6,
    },
    footerLink: {
      color: '#00B894',
      textDecoration: 'none',
      fontWeight: 600,
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes bounce {
          from { transform: translateY(0px); }
          to   { transform: translateY(-8px); }
        }
        @keyframes pulse-cta {
          0%, 100% { box-shadow: 0 8px 32px rgba(0,184,148,0.4); }
          50%       { box-shadow: 0 8px 48px rgba(0,184,148,0.65); }
        }
      `}</style>

      <div style={s.page}>
        <div style={s.glow} />

        <div style={s.card}>
          <span style={s.confetti}>🎉</span>
          <div style={s.badge}>Paiement confirmé ✓</div>

          <h1 style={s.title}>
            Bienvenue dans<br />
            <em style={{ color: '#00B894', fontStyle: 'italic' }}>Sèche 10 Semaines</em>
          </h1>
          <p style={s.sub}>
            Votre abonnement est activé. La transformation commence maintenant — suivez ces 3 étapes pour démarrer.
          </p>

          <div style={s.stepsBox}>
            <div style={s.stepsTitle}>🚀 Vos prochaines étapes</div>
            {[
              { n: 1, label: 'Profil configuré ✓', desc: 'Biométrie + profil santé complétés' },
              { n: 2, label: 'Plan personnalisé prêt ✓', desc: 'Macros + cyclage calorique calculés' },
              { n: 3, label: 'Commencer dès maintenant', desc: 'Journal quotidien + suivi progression' },
            ].map((step, i, arr) => (
              <div key={step.n} style={{ ...s.step, borderBottom: i === arr.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                <div style={s.stepNum}>{step.n}</div>
                <div style={s.stepText}>
                  <div style={s.stepLabel}>{step.label}</div>
                  <div style={s.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/dashboard" style={s.cta}>
            Accéder à mon programme →
          </Link>
          <div style={s.secure}>🔒 Données sécurisées · Annulable à tout moment</div>

          <div style={s.footer}>
            <p style={s.footerText}>
              Un email de confirmation Stripe vous a été envoyé.<br />
              Une question ? <a href="mailto:contact@seche10semaines.fr" style={s.footerLink}>contact@seche10semaines.fr</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
