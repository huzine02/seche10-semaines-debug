import React, { useState, useEffect, useRef } from 'react';

export interface HealthScoreProps {
  glucoseReadings?: { date: string; value: number }[];
  tourDeTaille?: { date: string; value: number }[];
  pesees?: { date: string; poids: number }[];
  lipidesReadings?: { dateAnalyse: string; total?: number; ldl: number; hdl: number; triglycerides: number }[];
  initialWeight?: number;
  initialWaistline?: number;
  projectedLoss?: { weight: number };
  streak?: number;
  totalDays?: number;
  perfectDays?: number;
  firstName?: string;
  createdAt?: string;
  colors: Record<string, string>;
  isDark: boolean;
}

// ─── SCORE CALCULATIONS ─────────────────────────────────

function calcGlucoseScore(readings?: { date: string; value: number }[]): { score: number; latest?: number; evolution?: number } {
  if (!readings || readings.length === 0) return { score: -1 };
  const sorted = [...readings].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0].value;
  let score: number;
  if (latest >= 0.70 && latest <= 0.99) score = 100;
  else if (latest <= 1.09) score = 70;
  else if (latest <= 1.25) score = 40;
  else score = 10;
  const evolution = sorted.length >= 2 ? ((latest - sorted[1].value) / sorted[1].value) * 100 : undefined;
  return { score, latest, evolution };
}

function calcWaistScore(readings?: { date: string; value: number }[]): { score: number; latest?: number; delta?: number } {
  if (!readings || readings.length === 0) return { score: -1 };
  const sorted = [...readings].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0].value;
  let score: number;
  if (latest < 94) score = 100;
  else if (latest <= 102) score = 60;
  else score = 20;
  const delta = sorted.length >= 2 ? Math.round((latest - sorted[sorted.length - 1].value) * 10) / 10 : undefined;
  return { score, latest, delta };
}

function calcWeightScore(pesees?: { date: string; poids: number }[], initialWeight?: number, projectedLoss?: { weight: number }): { score: number; latest?: number; delta?: number } {
  if (!pesees || pesees.length === 0 || !initialWeight) return { score: -1 };
  const sorted = [...pesees].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0].poids;
  const delta = Math.round((latest - initialWeight) * 10) / 10;
  const totalLoss = initialWeight - latest;
  const target = projectedLoss?.weight || initialWeight * 0.1;
  let score: number;
  if (totalLoss >= target) score = 100;
  else if (totalLoss >= target * 0.6) score = 70;
  else if (totalLoss >= 0) score = 40;
  else score = 10;
  return { score, latest, delta };
}

function calcLipidScore(readings?: { dateAnalyse: string; total?: number; ldl: number; hdl: number; triglycerides: number }[]): { score: number; latest?: { hdl: number; ldl: number; tg: number } } {
  if (!readings || readings.length === 0) return { score: -1 };
  const sorted = [...readings].sort((a, b) => b.dateAnalyse.localeCompare(a.dateAnalyse));
  const l = sorted[0];
  let score = 0;
  if (l.hdl > 0.40) score += 33;
  if (l.ldl < 1.60) score += 34;
  if (l.triglycerides < 1.50) score += 33;
  return { score, latest: { hdl: l.hdl, ldl: l.ldl, tg: l.triglycerides } };
}

function calcComplianceScore(streak?: number, totalDays?: number, perfectDays?: number): { score: number; pct?: number } {
  if (!totalDays || totalDays === 0) return { score: -1 };
  const pct = Math.round(((perfectDays || 0) / totalDays) * 100);
  const streakBonus = Math.min((streak || 0) * 2, 20);
  const score = Math.min(100, pct + streakBonus);
  return { score, pct };
}

// ─── COMPONENT ──────────────────────────────────────────

export const HealthScore: React.FC<HealthScoreProps> = (props) => {
  const { colors: C, isDark } = props;
  const [animatedScore, setAnimatedScore] = useState(0);
  const mounted = useRef(false);

  const glucose = calcGlucoseScore(props.glucoseReadings);
  const waist = calcWaistScore(props.tourDeTaille);
  const weight = calcWeightScore(props.pesees, props.initialWeight, props.projectedLoss);
  const lipid = calcLipidScore(props.lipidesReadings);
  const compliance = calcComplianceScore(props.streak, props.totalDays, props.perfectDays);

  const criteria = [
    { name: 'Glycémie', weight: 0.30, result: glucose },
    { name: 'Tour de taille', weight: 0.25, result: waist },
    { name: 'Poids', weight: 0.20, result: weight },
    { name: 'Bilan lipidique', weight: 0.15, result: lipid },
    { name: 'Compliance', weight: 0.10, result: compliance },
  ];

  const available = criteria.filter(c => c.result.score >= 0);
  const hasData = available.length > 0;

  // Recalculate weights proportionally for available criteria
  const totalWeight = available.reduce((s, c) => s + c.weight, 0);
  const finalScore = hasData
    ? Math.round(available.reduce((s, c) => s + (c.result.score * (c.weight / totalWeight)), 0))
    : 0;

  useEffect(() => {
    if (!hasData) return;
    mounted.current = true;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * finalScore);
      setAnimatedScore(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [finalScore, hasData]);

  const scoreColor = finalScore >= 70 ? (C.accent || '#00B894') : finalScore >= 40 ? (C.orange || '#F59E0B') : (C.red || '#EF4444');
  const scoreLabel = finalScore >= 80 ? 'Excellent' : finalScore >= 70 ? 'Bon' : finalScore >= 40 ? 'À améliorer' : 'Attention';

  // SVG gauge
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  // Personalized message
  const getMessage = (): string | null => {
    if (!hasData) return null;
    if (glucose.evolution !== undefined && glucose.evolution < 0) {
      return `Votre glycémie a baissé de ${Math.abs(Math.round(glucose.evolution))}% — continuez !`;
    }
    if (weight.delta !== undefined && weight.delta < 0) {
      return `Vous avez perdu ${Math.abs(weight.delta)} kg — bravo !`;
    }
    if ((props.streak || 0) >= 7) {
      return `${props.streak} jours de suite — impressionnant !`;
    }
    if (finalScore >= 70) return 'Vos indicateurs sont au vert, continuez ainsi !';
    return 'Restez régulier pour améliorer votre score.';
  };

  const handleExport = () => {
    const now = new Date().toLocaleDateString('fr-FR');
    const weeksCount = props.createdAt
      ? Math.max(1, Math.ceil((Date.now() - new Date(props.createdAt).getTime()) / (7 * 864e5)))
      : '?';
    const compliancePct = compliance.pct ?? '—';
    const text = `SUIVI SANTÉ MÉTABOLIQUE — Sèche 10 Semaines
Patient : ${props.firstName || '—'}
Date : ${now}
Score Santé : ${finalScore}/100

Glycémie à jeun : ${glucose.latest != null ? glucose.latest + ' g/L' : '—'} (évolution : ${glucose.evolution != null ? (glucose.evolution > 0 ? '+' : '') + Math.round(glucose.evolution) + '%' : '—'})
Tour de taille : ${waist.latest != null ? waist.latest + ' cm' : '—'} (évolution : ${waist.delta != null ? (waist.delta > 0 ? '+' : '') + waist.delta + ' cm' : '—'})
Poids : ${weight.latest != null ? weight.latest + ' kg' : '—'} (évolution : ${weight.delta != null ? (weight.delta > 0 ? '+' : '') + weight.delta + ' kg' : '—'})
Bilan lipidique : ${lipid.latest ? 'HDL ' + lipid.latest.hdl + ' / LDL ' + lipid.latest.ldl + ' / TG ' + lipid.latest.tg : '—'}

Programme suivi depuis : ${weeksCount} semaine(s)
Compliance : ${compliancePct}%`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  const [copied, setCopied] = useState(false);

  return (
    <section style={{
      background: C.surface,
      borderRadius: 14,
      padding: 18,
      border: `1px solid ${C.borderLight}`,
      boxShadow: '0 2px 12px -2px rgba(15,44,89,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ background: isDark ? 'rgba(0,184,148,0.15)' : '#E6FFF9', color: C.accent || '#00B894', padding: 4, borderRadius: 6, fontSize: 13, lineHeight: 1 }}>💚</span>
        <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: C.primary, margin: 0 }}>Score Santé Métabolique</h3>
      </div>

      {!hasData ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: C.textMuted, fontSize: 13 }}>
          <p style={{ marginBottom: 8 }}>Ajoutez vos données pour calculer votre score</p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Glycémie · Tour de taille · Pesées · Bilan lipidique</p>
        </div>
      ) : (
        <>
          {/* Gauge circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={radius} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'} strokeWidth="10" />
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
              <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="800" fill={C.primary}>{animatedScore}</text>
              <text x="70" y="82" textAnchor="middle" fontSize="10" fill={C.textMuted}>/100</text>
            </svg>
            <span style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: scoreColor }}>{scoreLabel}</span>
          </div>

          {/* Criteria bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {criteria.map(c => {
              const val = c.result.score;
              const missing = val < 0;
              const barColor = missing ? (isDark ? 'rgba(255,255,255,0.06)' : '#eee') : val >= 70 ? (C.accent || '#00B894') : val >= 40 ? (C.orange || '#F59E0B') : (C.red || '#EF4444');
              return (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: C.textMuted }}>{c.name} ({Math.round(c.weight * 100)}%)</span>
                    <span style={{ color: missing ? C.textMuted : C.primary, fontWeight: 600 }}>{missing ? '—' : val + ' pts'}</span>
                  </div>
                  <div style={{ height: 5, background: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: barColor, borderRadius: 100, width: missing ? '0%' : `${val}%`, transition: 'width 1.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message */}
          {getMessage() && (
            <p style={{ fontSize: 12, color: C.textMuted, textAlign: 'center', margin: '0 0 12px', fontStyle: 'italic' }}>
              {getMessage()}
            </p>
          )}

          {/* Export button */}
          <button
            onClick={handleExport}
            style={{
              width: '100%',
              padding: '10px 0',
              background: isDark ? 'rgba(255,255,255,0.06)' : '#f7f7f7',
              border: `1px solid ${C.borderLight}`,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: C.primary,
            }}
          >
            {copied ? '✅ Copié dans le presse-papier !' : '📄 Exporter pour mon médecin'}
          </button>
        </>
      )}
    </section>
  );
};
