import React from 'react';
import { Link } from 'react-router-dom';

const C = {
  primary: '#0F2C59',
  accent: '#00B894',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textMuted: '#64748B',
};

export const Guide: React.FC = () => {
  const pdfUrl = `${(import.meta as any).env?.BASE_URL || '/'}guide-seche-10-semaines.pdf`;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');`}</style>

      {/* HEADER */}
      <header style={{
        background: C.primary,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
          ← Retour
        </Link>
        <span style={{ fontFamily: 'serif', fontSize: 18, color: '#fff' }}>
          Sèche<span style={{ color: C.accent }}>10</span>Semaines
        </span>
        <a
          href={pdfUrl}
          download="Guide-Seche-10-Semaines.pdf"
          style={{
            background: C.accent,
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          📥 Télécharger PDF
        </a>
      </header>

      {/* PDF INFO CARD */}
      <div style={{ padding: '20px 16px' }}>
        <div style={{
          background: C.surface,
          borderRadius: 16,
          padding: '24px 20px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(15,44,89,0.06)',
          border: '1px solid #E2E8F0',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginBottom: 6 }}>
            Guide Complet
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 20 }}>
            Le Protocole Métabolique Scientifique — 9 chapitres, 30 recettes, programme semaine par semaine.
          </p>

          {/* Chapters list */}
          <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
            {[
              { ch: '1', title: 'Comprendre la Sèche Métabolique' },
              { ch: '2', title: 'Nutrition Métabolique' },
              { ch: '3', title: "Programme d'Entraînement PPL" },
              { ch: '4', title: 'Gestion du Sommeil et du Stress' },
              { ch: '5', title: 'Protocole Semaine par Semaine' },
              { ch: '6', title: '30 Recettes IG Bas Rapides' },
              { ch: '7', title: 'FAQ & Troubleshooting' },
              { ch: '8', title: 'Après les 10 Semaines' },
              { ch: '9', title: 'Annexes & Références' },
            ].map(c => (
              <div key={c.ch} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid #F1F5F9',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: C.accent, color: '#fff',
                  fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {c.ch}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.title}</span>
              </div>
            ))}
          </div>

          {/* Download buttons */}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <a
              href={pdfUrl}
              download="Guide-Seche-10-Semaines.pdf"
              style={{
                display: 'block',
                width: '100%',
                maxWidth: 360,
                background: C.accent,
                color: '#fff',
                padding: '14px 24px',
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,184,148,0.3)',
              }}
            >
              📥 Télécharger le Guide (PDF)
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                width: '100%',
                maxWidth: 360,
                background: C.surface,
                color: C.primary,
                padding: '12px 24px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                textAlign: 'center',
                border: `1px solid #E2E8F0`,
              }}
            >
              👁️ Lire en ligne
            </a>
          </div>

          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 16 }}>
            📄 PDF · 519 Ko · Compatible tous appareils
          </p>
        </div>
      </div>
    </div>
  );
};
