import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const C = { accent: '#00B894', muted: '#CBD5E1', surface: '#FFFFFF', border: '#F1F5F9', primary: '#0F2C59' };

export const BottomNav: React.FC = () => {
  const { pathname } = useLocation();

  const items = [
    { to: '/dashboard', icon: '🏠', label: 'Suivi' },
    { to: '/journal', icon: '📖', label: 'Journal' },
    { to: '/profile', icon: '👤', label: 'Profil' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      padding: '6px 24px 20px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 30,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
    }}>
      {items.map(({ to, icon, label }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '2px',
              padding: '6px 20px',
              textDecoration: 'none',
              color: active ? C.accent : C.muted,
              transition: 'all 0.25s ease',
              position: 'relative',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute', top: -6,
                width: 20, height: 3, borderRadius: 2,
                background: C.accent,
              }} />
            )}
            <span style={{
              fontSize: '20px',
              transition: 'transform 0.2s ease',
              transform: active ? 'scale(1.1)' : 'scale(1)',
            }}>{icon}</span>
            <span style={{
              fontSize: '10px', fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              color: active ? C.primary : C.muted,
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
