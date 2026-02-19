import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../theme';
import { useJournalStatus } from '../hooks/useJournalStatus';

const ChartIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);

const BookIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const PersonIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const BottomNav: React.FC = () => {
  const { pathname } = useLocation();
  const { isDark } = useTheme();
  const C = isDark ? darkTheme : lightTheme;
  const { todayCompleted } = useJournalStatus();

  const items: { to: string; icon: React.FC<{ color: string }>; label: string; badge?: boolean }[] = [
    { to: '/dashboard', icon: ChartIcon, label: 'Suivi' },
    { to: '/journal', icon: BookIcon, label: 'Journal', badge: !todayCompleted },
    { to: '/profile', icon: PersonIcon, label: 'Profil' },
  ];

  return (
    <>
      <style>{`
        @keyframes nav-bounce { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }
        .nav-icon-active { animation: nav-bounce 0.3s ease; }
      `}</style>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        padding: '6px 24px 20px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        zIndex: 30,
        boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.3)' : '0 -4px 20px rgba(0,0,0,0.06)',
      }}>
        {items.map(({ to, icon: Icon, label, badge }) => {
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
                color: active ? C.accent : C.textMuted,
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
              <span className={active ? 'nav-icon-active' : ''} style={{ position: 'relative', display: 'flex' }}>
                <Icon color={active ? C.accent : C.textMuted} />
                {badge && (
                  <span style={{
                    position: 'absolute', top: -2, right: -4,
                    width: 6, height: 6, borderRadius: '50%',
                    background: C.red,
                  }} />
                )}
              </span>
              <span style={{
                fontSize: '10px', fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                color: active ? C.primary : C.textMuted,
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
