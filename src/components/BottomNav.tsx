import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const C = { accent: '#00B894', muted: '#CBD5E1', surface: '#FFFFFF', border: '#F1F5F9' };

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
      padding: '8px 24px 20px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 30,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
    }}>
      {items.map(({ to, icon, label }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '3px',
              padding: '6px 16px',
              textDecoration: 'none',
              color: active ? C.accent : C.muted,
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: '20px' }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
