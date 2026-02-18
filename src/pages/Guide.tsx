import React from 'react';
import { Link } from 'react-router-dom';

export const Guide: React.FC = () => {
  const s = {
    page: { fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#1E293B', maxWidth: '800px', margin: '0 auto', padding: '24px 20px 60px' },
    header: { background: '#0F2C59', color: '#fff', padding: '20px 24px', borderRadius: '0 0 16px 16px', marginBottom: '32px', display: 'flex' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
    logo: { fontFamily: 'serif', fontSize: '20px', color: '#fff', textDecoration: 'none' as const },
    printBtn: { background: '#00B894', color: '#fff', padding: '8px 18px', borderRadius: '100px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '13px' },
    h1: { fontSize: 'clamp(24px, 5vw, 36px)', color: '#0F2C59', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 },
    warning: { background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '14px 16px', color: '#9A3412', fontSize: '13px', marginBottom: '28px', lineHeight: 1.6 },
    h2: { fontSize: '20px', color: '#0F2C59', fontWeight: 700, borderLeft: '4px solid #00B894', paddingLeft: '14px', margin: '36px 0 16px', lineHeight: 1.3 },
    h3: { fontSize: '15px', color: '#00B894', fontWeight: 700, margin: '20px 0 10px' },
    p: { fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '12px' },
    box: { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px 18px', marginBottom: '16px' },
    ul: { paddingLeft: '20px', margin: '8px 0 12px' },
    li: { fontSize: '14px', color: '#475569', marginBottom: '8px', lineHeight: 1.6 },
    footer: { marginTop: '48px', textAlign: 'center' as const, fontSize: '12px', color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: '20px' },
    backLink: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
        }
        @media (max-width: 480px) {
          .guide-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: '#0F2C59' }}>
        <div style={{ ...s.header, borderRadius: 0, maxWidth: '800px', margin: '0 auto' }}>
          <Link to="/profile" style={s.backLink} className="no-print">← Retour au Profil</Link>
          <button onClick={() => window.print()} style={s.printBtn} className="no-print">
            🖨️ Imprimer / PDF
          </button>
        </div>
      </div>

      <div style={s.page}>
        <h1 style={s.h1}>Sèche 10 Semaines</h1>
        <p style={{ ...s.p, color: '#00B894', fontWeight: 700, marginBottom: '24px' }}>Protocole Métabolique Complet — Guide Officiel</p>

        <div style={s.warning}>
          <strong>⚠️ Avertissement médical :</strong> Ce guide est un outil d'hygiène de vie. Il ne remplace pas un avis médical. Consultez votre médecin avant de commencer, notamment en cas de diabète, pathologie cardiovasculaire ou traitement en cours.
        </div>

        <p style={s.p}>Ce programme repose sur une approche métabolique globale qui cible simultanément trois objectifs : la perte de masse grasse, la préservation de la masse musculaire, et l'amélioration des marqueurs de santé (glycémie, cholestérol).</p>

        {/* ─── PILIERS ─── */}
        <h2 style={s.h2}>1. Les 3 Piliers du Programme</h2>

        <div style={s.box}>
          <div style={s.h3}>Pilier 1 — Nutrition Anti-Inflammatoire</div>
          <p style={s.p}>Une alimentation riche en protéines, en fibres, avec des glucides à index glycémique bas consommés au bon moment pour stabiliser l'insuline et réduire le stockage adipeux.</p>
        </div>
        <div style={s.box}>
          <div style={s.h3}>Pilier 2 — Entraînement Anti-Catabolique</div>
          <p style={s.p}>Maintenir la tension mécanique sur les muscles pour signaler à l'organisme de préserver la masse maigre pendant le déficit calorique. 3 séances/semaine suffisent.</p>
        </div>
        <div style={s.box}>
          <div style={s.h3}>Pilier 3 — Gestion du Stress et du Sommeil</div>
          <p style={s.p}>Le cortisol favorise le stockage abdominal. Un sommeil insuffisant (&lt; 7h) augmente la ghréline (hormone de la faim) de 28%. Ces facteurs sont non négociables.</p>
        </div>

        {/* ─── NUTRITION ─── */}
        <h2 style={s.h2}>2. Nutrition Métabolique</h2>

        <div style={s.box}>
          <strong style={{ fontSize: '14px', color: '#0F2C59' }}>Répartition des Macronutriments</strong>
          <ul style={s.ul}>
            <li style={s.li}><strong>Protéines :</strong> 2,0 à 2,2g/kg de poids corporel (préservation musculaire en déficit — Morton 2018)</li>
            <li style={s.li}><strong>Lipides :</strong> 25–30% des calories (hormones, absorption vitamines liposolubles)</li>
            <li style={s.li}><strong>Glucides :</strong> Le reste — concentrés autour de l'entraînement (cyclage calorique)</li>
          </ul>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }} className="guide-grid">
          <div style={s.box}>
            <div style={s.h3}>✅ À Privilégier</div>
            <ul style={s.ul}>
              <li style={s.li}><strong>Protéines :</strong> Poulet, dinde, bœuf 5%, poissons blancs, saumon, œufs, fromage blanc 0%</li>
              <li style={s.li}><strong>Glucides IG bas :</strong> Riz basmati, patate douce, avoine, quinoa, légumineuses</li>
              <li style={s.li}><strong>Lipides sains :</strong> Huile d'olive, avocat, noix, amandes, oméga-3</li>
              <li style={s.li}><strong>Légumes :</strong> À volonté (brocolis, épinards, courgettes, poivrons)</li>
            </ul>
          </div>
          <div style={{ ...s.box, background: '#FEF2F2', borderColor: '#FECACA' }}>
            <div style={{ ...s.h3, color: '#EF4444' }}>❌ À Limiter</div>
            <ul style={s.ul}>
              <li style={s.li}>Sucres rapides (sodas, viennoiseries, bonbons)</li>
              <li style={s.li}>Alcool (inhibe l'oxydation des graisses jusqu'à 36h)</li>
              <li style={s.li}>Huiles végétales pro-inflammatoires (tournesol, maïs)</li>
              <li style={s.li}>Ultra-transformés (charcuterie industrielle, plats préparés)</li>
            </ul>
          </div>
        </div>

        <div style={s.box}>
          <div style={s.h3}>🕐 Timing des Repas — Protocole 16/8</div>
          <p style={s.p}>Fenêtre alimentaire de 12h00 à 20h30. Le jeûne intermittent améliore la sensibilité à l'insuline et favorise l'autophagie. Ne mangez pas avant midi.</p>
          <ul style={s.ul}>
            <li style={s.li}><strong>12h00 — Repas 1 :</strong> Rupture du jeûne. Protéines + légumes + glucides complexes</li>
            <li style={s.li}><strong>16h00 — Repas 2 :</strong> Post-training ou collation. Whey + glucides</li>
            <li style={s.li}><strong>20h00 — Repas 3 :</strong> Dîner. Protéines + légumes (glucides réduits si repos)</li>
          </ul>
        </div>

        {/* ─── ENTRAÎNEMENT ─── */}
        <h2 style={s.h2}>3. L'Entraînement PPL</h2>
        <p style={s.p}>Fréquence recommandée : 3 séances de musculation + 2 sessions de cardio basse intensité (marche rapide 30-45 min).</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }} className="guide-grid">
          {[
            { jour: 'Lundi', type: 'PUSH', muscles: 'Pecs · Épaules · Triceps', exs: ['Développé couché 3×6-8', 'Développé militaire 3×8-10', 'Dips ou pompes 3×Max', 'Élévations latérales 3×12-15', 'Extensions triceps 3×10-12'] },
            { jour: 'Mercredi', type: 'PULL', muscles: 'Dos · Biceps · Arrière épaules', exs: ['Tractions 3×Max', 'Rowing barre 3×8-10', 'Tirage horizontal 3×10-12', 'Oiseau haltères 3×12-15', 'Curl biceps 3×10-12'] },
            { jour: 'Vendredi', type: 'LEGS', muscles: 'Jambes · Abdos', exs: ['Squat 3×8-10', 'Fentes marchées 3×10/jambe', 'Leg curl ou glute bridge 3×12', 'Mollets debout 4×15', 'Gainage 3×45sec'] },
          ].map(w => (
            <div key={w.type} style={s.box}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#00B894', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '4px' }}>{w.jour}</div>
              <div style={{ fontWeight: 700, color: '#0F2C59', fontSize: '16px', marginBottom: '4px' }}>{w.type}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '10px' }}>{w.muscles}</div>
              <ul style={{ ...s.ul, paddingLeft: '14px' }}>
                {w.exs.map((e, i) => <li key={i} style={{ ...s.li, fontSize: '12px', marginBottom: '4px' }}>{e}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={s.box}>
          <div style={s.h3}>💊 Stack Suppléments (Optionnel)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }} className="guide-grid">
            {[
              { n: 'Vitamine D3', d: '5 000 UI / matin' }, { n: 'Magnésium', d: '400mg / soir' },
              { n: 'Oméga-3', d: '3-4g EPA+DHA / soir' }, { n: 'Créatine', d: '5g / repas 1' },
              { n: 'Vitamine C', d: '1 000mg / matin' }, { n: 'Protéine Whey', d: '30-40g / post-training' },
            ].map(s2 => (
              <div key={s2.n} style={{ fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' as const }}>
                <strong style={{ color: '#0F2C59' }}>{s2.n}</strong>
                <span style={{ color: '#64748B', fontSize: '12px' }}>{s2.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PHASES ─── */}
        <h2 style={s.h2}>4. Protocole Semaine par Semaine</h2>

        {[
          { phase: 'Phase 1 : Reset Métabolique', semaines: 'Semaines 1–3', obj: 'Détox, sensibilité à l\'insuline, mise en place des habitudes', deficit: '-300 kcal', focus: 'Priorité : sommeil 8h, suppression sucres rapides, hydratation 3L/j' },
          { phase: 'Phase 2 : Sèche Viscérale', semaines: 'Semaines 4–7', obj: 'Brûlage maximal du gras abdominal viscéral', deficit: '-500 kcal', focus: 'C\'est ici que le tour de taille diminue le plus. Intensité entraînement max.' },
          { phase: 'Phase 3 : Définition', semaines: 'Semaines 8–10', obj: 'Finition, stabilisation, préparation sortie de sèche', deficit: '-300 kcal', focus: 'Réintroduction progressive des glucides (reverse diet) pour éviter l\'effet yoyo.' },
        ].map(ph => (
          <div key={ph.phase} style={s.box}>
            <div style={s.h3}>{ph.phase}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase' as const }}>{ph.semaines}</div>
            <p style={s.p}><strong>Objectif :</strong> {ph.obj}</p>
            <p style={s.p}><strong>Déficit :</strong> {ph.deficit}</p>
            <p style={{ ...s.p, background: '#F0FDF4', padding: '8px 12px', borderRadius: '8px', color: '#059669', fontStyle: 'italic', marginBottom: 0 }}>{ph.focus}</p>
          </div>
        ))}

        {/* ─── FAQ ─── */}
        <h2 style={s.h2}>5. FAQ & Troubleshooting</h2>
        {[
          { q: "J'ai faim constamment", r: "Augmentez les légumes verts (volume sans calories) et l'eau. Vérifiez que vos protéines sont bien au niveau cible — elles sont 2× plus rassasiantes que les glucides." },
          { q: "Je stagne depuis 2 semaines", r: "Les paliers sont normaux. Ajoutez 15-20 min de marche par jour. Vérifiez que vous ne compensez pas inconsciemment en mangeant plus le week-end." },
          { q: "J'ai eu un écart alimentaire", r: "Ne culpabilisez pas et ne sautez pas le repas suivant pour compenser. Reprenez simplement le plan au prochain repas. L'écart occasionnel n'impacte pas les résultats." },
          { q: "Puis-je boire de l'alcool ?", r: "Limitez à 1-2 verres maximum par semaine. L'alcool stoppe l'oxydation des graisses pendant 36h. Le vendredi soir est prévu pour ça dans le programme." },
          { q: "Comment ajuster les macros si je ne progresse pas ?", r: "Réduisez les glucides de 20-30g sur les jours de repos. Gardez les protéines intactes. Ne touchez pas aux lipides qui sont essentiels pour les hormones." },
        ].map((faq, i) => (
          <div key={i} style={{ ...s.box, marginBottom: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F2C59', marginBottom: '8px' }}>❓ {faq.q}</div>
            <p style={{ ...s.p, marginBottom: 0 }}>{faq.r}</p>
          </div>
        ))}

        <div style={s.footer}>
          © 2025 Sèche 10 Semaines — Programme Officiel<br />
          Généré depuis votre espace membre · <Link to="/profile" style={{ color: '#00B894' }}>Retour au profil</Link>
        </div>
      </div>
    </>
  );
};
