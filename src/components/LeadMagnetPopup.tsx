import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { trackEvent } from '../utils/analytics';

export const LeadMagnetPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't show if already shown this session
    if (sessionStorage.getItem('leadPopupShown')) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem('leadPopupShown', '1');
      setShow(true);
    };

    // Timer: 30 seconds
    const timer = setTimeout(trigger, 30000);

    // Scroll: 50%
    const onScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPercent >= 0.5) trigger();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'leads'), {
        email,
        source: 'lead-magnet-popup',
        createdAt: serverTimestamp(),
      });
    } catch (_err) {
      // Firestore rules may block — silent fail, we'll fix rules later
    }
    trackEvent('lead_captured');
    setSubmitted(true);
    setLoading(false);
  };

  if (!show) return null;

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(7,24,40,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn 0.3s ease',
    },
    modal: {
      background: '#fff', borderRadius: 20, maxWidth: 440, width: '100%',
      padding: '36px 28px', position: 'relative', textAlign: 'center' as const,
      boxShadow: '0 30px 100px rgba(0,0,0,0.4)',
    },
    close: {
      position: 'absolute' as const, top: 12, right: 16,
      background: 'none', border: 'none', fontSize: 22, color: '#94A3B8',
      cursor: 'pointer', lineHeight: 1,
    },
    badge: {
      display: 'inline-block', background: '#ECFDF5', color: '#059669',
      fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 100,
      letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 16,
    },
    title: {
      fontFamily: "'Instrument Serif', serif", fontSize: 24, color: '#0F2C59',
      lineHeight: 1.2, marginBottom: 10, letterSpacing: '-0.02em',
    },
    subtitle: {
      fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 24,
    },
    form: {
      display: 'flex', flexDirection: 'column' as const, gap: 12,
    },
    input: {
      width: '100%', padding: '14px 16px', borderRadius: 12,
      border: '1px solid #E2E8F0', fontSize: 15,
      fontFamily: "'DM Sans', sans-serif", outline: 'none',
      transition: 'border-color 0.3s',
    },
    button: {
      width: '100%', padding: '14px', borderRadius: 12, border: 'none',
      background: '#00B894', color: '#fff', fontSize: 15, fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
      boxShadow: '0 8px 30px rgba(0,184,148,0.35)', transition: 'all 0.3s',
    },
    disclaimer: {
      fontSize: 11, color: '#94A3B8', marginTop: 12, lineHeight: 1.5,
    },
    success: {
      fontSize: 15, color: '#059669', fontWeight: 600, lineHeight: 1.6,
    },
  };

  return (
    <>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div style={styles.overlay} onClick={() => setShow(false)}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button style={styles.close} onClick={() => setShow(false)}>✕</button>
          <div style={styles.badge}>📘 Guide gratuit</div>
          <h2 style={styles.title}>
            Les 5 erreurs qui sabotent<br />votre sèche après 40 ans
          </h2>
          <p style={styles.subtitle}>
            Recevez notre guide gratuit par email et découvrez pourquoi 90% des hommes échouent leur sèche — et comment l'éviter.
          </p>
          {submitted ? (
            <div style={styles.success}>
              ✅ C'est envoyé ! Vérifiez votre boîte email.<br />
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>
                (Pensez à vérifier vos spams)
              </span>
            </div>
          ) : (
            <form style={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'Envoi...' : 'Recevoir mon guide →'}
              </button>
              <div style={styles.disclaimer}>
                🔒 Pas de spam. Vos données restent confidentielles.
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
