import React from 'react';

interface Props {
  streak: number;
  bestStreak: number;
  compact?: boolean;
}

export const StreakBadge: React.FC<Props> = ({ streak, bestStreak, compact }) => {
  const flame = streak >= 7 ? '🔥🔥🔥' : streak >= 3 ? '🔥🔥' : streak >= 1 ? '🔥' : '💤';
  const msg = streak >= 14 ? 'Inarrêtable !'
    : streak >= 7 ? 'En feu !'
    : streak >= 3 ? 'Beau streak !'
    : streak >= 1 ? 'C\'est parti !'
    : 'Commencez aujourd\'hui';

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: streak >= 3 ? 'linear-gradient(135deg, #FFF7ED, #FFFBEB)' : '#F8FAFC',
        border: `1px solid ${streak >= 3 ? '#FED7AA' : '#E2E8F0'}`,
        borderRadius: 10, padding: '8px 14px',
      }}>
        <span style={{ fontSize: 18 }}>{flame}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F2C59' }}>{streak} jour{streak > 1 ? 's' : ''}</div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>{msg}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: streak >= 7
        ? 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)'
        : streak >= 3
          ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
          : 'linear-gradient(135deg, #0F2C59 0%, #1E3A5F 100%)',
      borderRadius: 16, padding: '20px 22px', color: '#fff',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.75, marginBottom: 4 }}>
          Streak actuel
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
          {streak} <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.8 }}>jour{streak > 1 ? 's' : ''}</span>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{msg}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 36 }}>{flame}</div>
        {bestStreak > 0 && (
          <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>Record : {bestStreak}j</div>
        )}
      </div>
    </div>
  );
};
