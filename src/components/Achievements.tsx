import React from 'react';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export const getAchievements = (stats: {
  totalDays: number;
  streak: number;
  bestStreak: number;
  weightLost: number;
  waistLost: number;
  perfectDays: number;
}): Achievement[] => [
  { id: 'first-day', icon: '🌱', title: 'Premier Pas', desc: 'Compléter sa première journée', unlocked: stats.totalDays >= 1 },
  { id: 'week-1', icon: '📅', title: 'Semaine 1', desc: '7 jours de programme complétés', unlocked: stats.totalDays >= 7 },
  { id: 'month-1', icon: '🏆', title: 'Un Mois', desc: '30 jours de programme', unlocked: stats.totalDays >= 30 },
  { id: 'streak-3', icon: '🔥', title: 'En Route', desc: 'Streak de 3 jours consécutifs', unlocked: stats.bestStreak >= 3 },
  { id: 'streak-7', icon: '🔥🔥', title: 'En Feu', desc: 'Streak de 7 jours consécutifs', unlocked: stats.bestStreak >= 7 },
  { id: 'streak-14', icon: '💎', title: 'Diamant', desc: 'Streak de 14 jours consécutifs', unlocked: stats.bestStreak >= 14 },
  { id: 'streak-30', icon: '👑', title: 'Légende', desc: 'Streak de 30 jours consécutifs', unlocked: stats.bestStreak >= 30 },
  { id: 'perfect-1', icon: '⭐', title: 'Journée Parfaite', desc: 'Premier 100% compliance', unlocked: stats.perfectDays >= 1 },
  { id: 'perfect-5', icon: '🌟', title: 'Excellence', desc: '5 journées parfaites', unlocked: stats.perfectDays >= 5 },
  { id: 'kg-1', icon: '📉', title: 'Premier Kilo', desc: 'Perdre son premier kg', unlocked: stats.weightLost >= 1 },
  { id: 'kg-5', icon: '💪', title: '-5 kg', desc: 'Cap des 5 kg perdus', unlocked: stats.weightLost >= 5 },
  { id: 'waist-3', icon: '📏', title: '-3 cm', desc: '3 cm de tour de taille en moins', unlocked: stats.waistLost >= 3 },
];

interface Props {
  stats: Parameters<typeof getAchievements>[0];
  compact?: boolean;
}

export const AchievementGrid: React.FC<Props> = ({ stats, compact }) => {
  const achievements = getAchievements(stats);
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            🏅 Badges ({unlocked.length}/{achievements.length})
          </span>
          <div style={{ background: '#ECFDF5', color: '#059669', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>
            {Math.round((unlocked.length / achievements.length) * 100)}%
          </div>
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: compact ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
        gap: compact ? 6 : 10,
      }}>
        {[...unlocked, ...locked].slice(0, compact ? 8 : undefined).map(a => (
          <div key={a.id} style={{
            background: a.unlocked ? '#fff' : '#F8FAFC',
            border: `1px solid ${a.unlocked ? '#E2E8F0' : '#F1F5F9'}`,
            borderRadius: 12,
            padding: compact ? '10px 6px' : '14px 10px',
            textAlign: 'center',
            opacity: a.unlocked ? 1 : 0.45,
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: compact ? 20 : 26, marginBottom: 4 }}>{a.icon}</div>
            <div style={{ fontSize: compact ? 9 : 11, fontWeight: 700, color: '#0F2C59', lineHeight: 1.2 }}>{a.title}</div>
            {!compact && <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>{a.desc}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
