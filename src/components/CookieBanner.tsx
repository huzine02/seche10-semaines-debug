import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  const styles: Record<string, React.CSSProperties> = {
    banner: {
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(7,24,40,0.97)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 16, flexWrap: 'wrap' as const,
      fontFamily: "'DM Sans', sans-serif",
    },
    text: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, textAlign: 'center' as const },
    link: { color: '#34D399', textDecoration: 'underline' },
    btn: {
      background: '#00B894', color: '#fff', border: 'none', borderRadius: 100,
      padding: '8px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
      flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
    },
  };

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        🍪 Ce site utilise des cookies techniques nécessaires au fonctionnement du service.{' '}
        <Link to="/politique-confidentialite" style={styles.link}>En savoir plus</Link>
      </p>
      <button style={styles.btn} onClick={accept}>J'accepte</button>
    </div>
  );
};
