import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LeadMagnetPopup } from '../components/LeadMagnetPopup';

export const Landing: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Removed fake spotsLeft counter and fake timer (DGCCRF compliance)
  const [activeScreen, setActiveScreen] = useState(0);
  const [cinemaStep, setCinemaStep] = useState(0);
  const CINEMA_STEPS = 6;
  const CINEMA_STEP_DURATION = 2800;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Timer removed (was fake/non-persistent)

  // Auto-rotate app screens
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Cinema transformation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCinemaStep((prev) => (prev + 1) % CINEMA_STEPS);
    }, CINEMA_STEP_DURATION);
    return () => clearInterval(interval);
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);
  // pad() removed with timer

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828; --paper: #F8FAFC; --cream: #F1F5F9;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --neon: #00FFB3; --red-soft: #EF4444; --orange: #F59E0B;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --card: #FFFFFF;
      --shadow: 0 4px 60px rgba(15,44,89,0.07); --shadow-hover: 0 20px 80px rgba(15,44,89,0.14);
      --shadow-green: 0 8px 40px rgba(0,184,148,0.35);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    .font-serif { font-family: 'Instrument Serif', serif; }

    /* ═══ HEADER ═══ */
    .site-header { position: sticky; top: 0; z-index: 100; background: rgba(7,24,40,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; letter-spacing: -0.02em; }
    .logo span { color: var(--sage); }
    .btn-member { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.25); padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.3s; cursor: pointer; }
    .btn-member:hover { border-color: var(--sage); color: var(--sage); }

    /* ═══ URGENCY BAR ═══ */
    .urgency-bar { background: linear-gradient(90deg, #DC2626 0%, #B91C1C 100%); padding: 8px 16px; text-align: center; }
    .urgency-inner { max-width: 700px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .urgency-text { color: #fff; font-size: 12px; font-weight: 700; }
    .urgency-timer { display: inline-flex; gap: 3px; align-items: center; color: #fff; font-size: 12px; font-weight: 700; }
    .urgency-digit { background: rgba(0,0,0,0.3); color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: 800; font-variant-numeric: tabular-nums; }

    /* ═══ HERO — MOBILE FIRST ═══ */
    .hero { background: linear-gradient(160deg, var(--ink-deep) 0%, #0F2C59 50%, #0a3d52 100%); padding: 48px 20px 40px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,184,148,0.12) 0%, transparent 70%); }
    .hero-content { position: relative; z-index: 1; }
    .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,184,148,0.12); border: 1px solid rgba(0,184,148,0.35); color: var(--sage-glow); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; margin-bottom: 20px; }
    .hero h1 { font-family: 'Instrument Serif', serif; font-size: 34px; color: #fff; line-height: 1.1; letter-spacing: -0.03em; margin: 0 auto 16px; }
    .hero h1 em { color: var(--sage-glow); font-style: italic; }
    .hero-sub { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.6; max-width: 500px; margin: 0 auto 24px; }
    .hero-sub strong { color: rgba(255,255,255,0.95); }
    .hero-cta-group { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 32px; }
    .btn-primary { display: inline-block; background: var(--sage); color: #fff; padding: 16px 28px; border-radius: 100px; font-size: 15px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; transition: all 0.3s; box-shadow: var(--shadow-green); animation: pulse-btn 2.5s ease-in-out infinite; text-align: center; line-height: 1.3; }
    .btn-primary:hover { background: var(--sage-light); transform: translateY(-3px); box-shadow: 0 16px 50px rgba(0,184,148,0.5); }
    @keyframes pulse-btn { 0%, 100% { box-shadow: 0 8px 40px rgba(0,184,148,0.35); } 50% { box-shadow: 0 8px 60px rgba(0,184,148,0.6); } }
    .hero-guarantee { font-size: 12px; color: rgba(255,255,255,0.5); }
    .hero-guarantee strong { color: rgba(255,255,255,0.75); }

    /* ═══ PHONE MOCKUP ═══ */
    .hero-phone-wrapper { margin-top: 8px; display: flex; justify-content: center; }
    .phone-frame { width: 220px; height: 440px; background: #111; border-radius: 32px; padding: 8px; box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
    .phone-notch { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 80px; height: 22px; background: #111; border-radius: 0 0 14px 14px; z-index: 10; }
    .phone-screen { width: 100%; height: 100%; border-radius: 24px; overflow: hidden; position: relative; background: #F8FAFC; }
    .phone-screen-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.5s ease; }
    .phone-screen-slide.active { opacity: 1; }

    /* Mini Dashboard inside phone */
    .mini-dash { padding: 32px 12px 12px; background: linear-gradient(180deg, #0F2C59 0%, #0F2C59 90px, #F0F4F8 90px); height: 100%; }
    .mini-dash-greeting { font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 2px; }
    .mini-dash-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 10px; }
    .mini-dash-card { background: #fff; border-radius: 12px; padding: 10px; margin-bottom: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
    .mini-dash-card-title { font-size: 8px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .mini-progress-bar { height: 6px; background: #E2E8F0; border-radius: 100px; overflow: hidden; margin-bottom: 4px; }
    .mini-progress-fill { height: 100%; background: linear-gradient(90deg, #00B894, #34D399); border-radius: 100px; transition: width 1s ease; }
    .mini-stat-row { display: flex; gap: 6px; }
    .mini-stat { flex: 1; background: #F0F4F8; border-radius: 8px; padding: 6px; text-align: center; }
    .mini-stat-value { font-size: 13px; font-weight: 700; color: #0F2C59; }
    .mini-stat-label { font-size: 7px; color: #94A3B8; }
    .mini-phase { background: linear-gradient(135deg, #00B894, #059669); border-radius: 10px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; }
    .mini-phase-week { font-size: 18px; font-weight: 700; color: #fff; }
    .mini-phase-text { font-size: 8px; color: rgba(255,255,255,0.8); line-height: 1.3; }
    .mini-phase-name { font-size: 9px; font-weight: 700; color: #fff; }

    /* Mini Journal inside phone */
    .mini-journal { padding: 32px 12px 12px; background: #F8FAFC; height: 100%; }
    .mini-journal-header { font-size: 14px; font-weight: 700; color: #0F2C59; margin-bottom: 4px; text-align: center; }
    .mini-journal-date { font-size: 9px; color: #94A3B8; text-align: center; margin-bottom: 10px; }
    .mini-meal { background: #fff; border-radius: 10px; padding: 8px 10px; margin-bottom: 6px; border-left: 3px solid #00B894; }
    .mini-meal-title { font-size: 9px; font-weight: 700; color: #0F2C59; margin-bottom: 2px; }
    .mini-meal-items { font-size: 7px; color: #64748B; line-height: 1.5; }
    .mini-meal-macros { display: flex; gap: 6px; margin-top: 4px; }
    .mini-macro { font-size: 7px; font-weight: 600; padding: 2px 5px; border-radius: 4px; }
    .mini-macro.p { background: #DBEAFE; color: #2563EB; }
    .mini-macro.g { background: #FEF3C7; color: #D97706; }
    .mini-macro.l { background: #FCE7F3; color: #DB2777; }
    .mini-check { display: flex; align-items: center; gap: 4px; font-size: 8px; color: #059669; font-weight: 600; margin-top: 4px; }

    /* Mini Repas/Setup inside phone */
    .mini-setup { padding: 32px 12px 12px; background: #F8FAFC; height: 100%; }
    .mini-setup-header { font-size: 13px; font-weight: 700; color: #0F2C59; margin-bottom: 8px; text-align: center; }
    .mini-setup-sub { font-size: 8px; color: #94A3B8; text-align: center; margin-bottom: 10px; }
    .mini-input-group { margin-bottom: 8px; }
    .mini-label { font-size: 8px; font-weight: 600; color: #475569; margin-bottom: 3px; }
    .mini-input { width: 100%; height: 24px; background: #fff; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0 8px; font-size: 8px; color: #1E293B; display: flex; align-items: center; }
    .mini-select-row { display: flex; gap: 4px; margin-bottom: 8px; }
    .mini-select-btn { flex: 1; padding: 6px 4px; border-radius: 8px; text-align: center; font-size: 8px; font-weight: 600; border: 1px solid #E2E8F0; background: #fff; color: #475569; }
    .mini-select-btn.active { background: #0F2C59; color: #fff; border-color: #0F2C59; }
    .mini-result-card { background: linear-gradient(135deg, #0F2C59, #163A70); border-radius: 10px; padding: 10px; margin-top: 8px; }
    .mini-result-title { font-size: 8px; color: rgba(255,255,255,0.7); margin-bottom: 4px; }
    .mini-result-value { font-size: 20px; font-weight: 700; color: #34D399; }
    .mini-result-unit { font-size: 8px; color: rgba(255,255,255,0.5); }

    /* Screen labels under phone */
    .screen-tabs { display: flex; justify-content: center; gap: 8px; margin-top: 16px; }
    .screen-tab { padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s; border: 1px solid transparent; }
    .screen-tab.active { color: var(--sage-glow); border-color: rgba(0,184,148,0.4); background: rgba(0,184,148,0.1); }

    /* ═══ TRUST BAR ═══ */
    .trust-bar { background: #fff; border-bottom: 1px solid var(--border); padding: 16px; overflow-x: auto; }
    .trust-inner { display: flex; justify-content: center; gap: 16px; min-width: max-content; }
    .trust-item { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: var(--text-mid); white-space: nowrap; }

    /* ═══ SECTIONS ═══ */
    .section { padding: 56px 20px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .text-center { text-align: center; }
    .section-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--sage); margin-bottom: 12px; }
    .section-title { font-family: 'Instrument Serif', serif; font-size: 26px; color: var(--ink); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 12px; }
    .section-sub { font-size: 14px; color: var(--text-mid); line-height: 1.6; max-width: 500px; margin: 0 auto 36px; }

    /* ═══ CINEMA TRANSFORMATION SECTION ═══ */
    .cinema-section { background: linear-gradient(160deg, #000 0%, #0a1628 40%, #0F2C59 100%); padding: 56px 16px; position: relative; overflow: hidden; }
    .cinema-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,184,148,0.06) 0%, transparent 70%); }
    .cinema-section .section-tag { color: var(--sage-glow); }
    .cinema-section .section-title { color: #fff; }
    .cinema-section .section-sub { color: rgba(255,255,255,0.55); }

    .cinema-frame { max-width: 600px; margin: 32px auto 0; aspect-ratio: 3/4; background: #000; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 30px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(0,184,148,0.15); z-index: 1; }
    .cinema-inner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }

    /* Each cinema slide */
    .cinema-slide { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; opacity: 0; transform: scale(0.95); transition: opacity 0.6s ease, transform 0.6s ease; text-align: center; }
    .cinema-slide.active { opacity: 1; transform: scale(1); }

    /* Slide: Intro (Marc) */
    .cinema-avatar { width: 90px; height: 90px; border-radius: 50%; border: 3px solid rgba(0,184,148,0.5); margin-bottom: 14px; box-shadow: 0 0 30px rgba(0,184,148,0.3); overflow: hidden; }
    .cinema-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .cinema-name { font-family: 'Instrument Serif', serif; font-size: 24px; color: #fff; margin-bottom: 4px; }
    .cinema-meta { font-size: 12px; color: rgba(255,255,255,0.5); letter-spacing: 0.05em; }

    /* Slide: Stats */
    .cinema-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 320px; }
    .cinema-stat-box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 10px; text-align: center; }
    .cinema-stat-label { font-size: 9px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
    .cinema-stat-value { font-family: 'Instrument Serif', serif; font-size: 28px; color: #fff; line-height: 1; }
    .cinema-stat-unit { font-size: 11px; color: rgba(255,255,255,0.4); }
    .cinema-stat-box.highlight { border-color: rgba(0,184,148,0.4); background: rgba(0,184,148,0.08); }
    .cinema-stat-box.highlight .cinema-stat-value { color: var(--sage-glow); }

    /* Slide: Timeline */
    .cinema-timeline { width: 100%; max-width: 340px; }
    .cinema-tl-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 100px; margin: 16px 0; position: relative; overflow: hidden; }
    .cinema-tl-fill { height: 100%; background: linear-gradient(90deg, var(--sage), var(--sage-glow)); border-radius: 100px; transition: width 0.8s ease; }
    .cinema-tl-weeks { display: flex; justify-content: space-between; font-size: 9px; color: rgba(255,255,255,0.35); }
    .cinema-tl-weeks .current { color: var(--sage-glow); font-weight: 700; }
    .cinema-week-label { font-family: 'Instrument Serif', serif; font-size: 32px; color: #fff; }
    .cinema-week-desc { font-size: 13px; color: var(--sage-glow); font-weight: 600; margin-top: 4px; }

    /* Slide: Before/After numbers */
    .cinema-ba { display: flex; gap: 24px; align-items: center; width: 100%; max-width: 360px; justify-content: center; }
    .cinema-ba-col { text-align: center; flex: 1; }
    .cinema-ba-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
    .cinema-ba-label.before { color: #EF4444; }
    .cinema-ba-label.after { color: var(--sage-glow); }
    .cinema-ba-num { font-family: 'Instrument Serif', serif; font-size: 38px; line-height: 1; margin-bottom: 4px; }
    .cinema-ba-num.before { color: rgba(255,255,255,0.3); }
    .cinema-ba-num.after { color: var(--sage-glow); text-shadow: 0 0 30px rgba(0,184,148,0.5); }
    .cinema-ba-sub { font-size: 11px; color: rgba(255,255,255,0.4); }
    .cinema-ba-arrow { font-size: 28px; color: rgba(255,255,255,0.15); }
    .cinema-ba-diff { background: rgba(0,184,148,0.15); border: 1px solid rgba(0,184,148,0.3); border-radius: 8px; padding: 6px 14px; margin-top: 16px; display: inline-block; }
    .cinema-ba-diff span { font-size: 13px; font-weight: 700; color: var(--sage-glow); }

    /* Slide: Result */
    .cinema-result-icon { font-size: 40px; margin-bottom: 10px; }
    .cinema-result-title { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; margin-bottom: 6px; line-height: 1.2; }
    .cinema-result-sub { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; max-width: 260px; }
    .cinema-result-stats { display: flex; gap: 16px; margin-top: 14px; }
    .cinema-result-stat { text-align: center; }
    .cinema-result-stat .val { font-family: 'Instrument Serif', serif; font-size: 20px; color: var(--sage-glow); }
    .cinema-result-stat .lab { font-size: 8px; color: rgba(255,255,255,0.4); margin-top: 2px; }

    /* Progress dots */
    .cinema-dots { display: flex; justify-content: center; gap: 6px; margin-top: 16px; position: relative; z-index: 1; }
    .cinema-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: all 0.3s; cursor: pointer; }
    .cinema-dot.active { background: var(--sage-glow); width: 20px; border-radius: 3px; }

    /* Caption under cinema */
    .cinema-caption { text-align: center; margin-top: 20px; position: relative; z-index: 1; }
    .cinema-caption-text { font-size: 12px; color: rgba(255,255,255,0.4); font-style: italic; }
    .cinema-caption-text strong { color: rgba(255,255,255,0.7); }

    .feature-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 24px; position: relative; z-index: 1; }
    .feature-pill { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); padding: 8px 14px; border-radius: 100px; font-size: 11px; font-weight: 600; }
    .feature-pill .pill-icon { margin-right: 5px; }

    /* ═══ PAIN ═══ */
    .pain-section { background: linear-gradient(160deg, #fff8f8 0%, #fff 100%); }
    .pain-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 32px; }
    .pain-item { display: flex; align-items: flex-start; gap: 12px; background: #fff; border: 1px solid #fde8e8; border-radius: 14px; padding: 16px; }
    .pain-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
    .pain-text { font-size: 13px; color: var(--text-mid); line-height: 1.5; }
    .pain-text strong { color: var(--text); display: block; margin-bottom: 2px; font-size: 13px; }

    /* ═══ STEPS ═══ */
    .steps-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 32px; }
    .step-card { background: linear-gradient(145deg, #fff 0%, var(--sage-muted) 100%); border: 1px solid rgba(0,184,148,0.2); border-radius: 16px; padding: 24px 20px; text-align: center; transition: all 0.4s; }
    .step-number { width: 40px; height: 40px; background: var(--sage); color: #fff; border-radius: 50%; font-family: 'Instrument Serif', serif; font-size: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; box-shadow: 0 4px 20px rgba(0,184,148,0.3); }
    .step-icon { font-size: 28px; margin-bottom: 8px; }
    .step-title { font-family: 'Instrument Serif', serif; font-size: 18px; color: var(--ink); margin-bottom: 8px; }
    .step-desc { font-size: 13px; color: var(--text-mid); line-height: 1.55; }

    /* ═══ TESTIMONIALS ═══ */
    .testimonials-section { background: var(--cream); }
    .testi-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 32px; }
    .testi-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.4s; }
    .testi-stars { font-size: 13px; margin-bottom: 10px; }
    .testi-quote { font-size: 13px; color: var(--text-mid); line-height: 1.6; margin-bottom: 14px; font-style: italic; }
    .testi-result { background: var(--sage-muted); border: 1px solid rgba(0,184,148,0.25); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 700; color: var(--sage-light); margin-bottom: 14px; display: inline-block; }
    .testi-author { display: flex; align-items: center; gap: 10px; }
    .testi-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Instrument Serif', serif; font-size: 15px; color: #fff; flex-shrink: 0; }
    .testi-name { font-size: 12px; font-weight: 700; color: var(--ink); }
    .testi-role { font-size: 10px; color: var(--text-light); margin-top: 1px; }

    /* ═══ VALUE COMPARE ═══ */
    .value-section { background: #fff; }
    .value-grid { display: grid; grid-template-columns: 1fr; gap: 14px; max-width: 500px; margin: 0 auto; }
    .value-card { border-radius: 16px; padding: 24px 20px; }
    .value-card.old { background: #FEF2F2; border: 1px solid #FECACA; }
    .value-card.new { background: var(--sage-muted); border: 2px solid var(--sage); }
    .value-price { font-family: 'Instrument Serif', serif; font-size: 32px; margin: 10px 0 8px; }
    .value-price.crossed { text-decoration: line-through; color: #DC2626; opacity: 0.7; }
    .value-list { list-style: none; text-align: left; font-size: 13px; color: var(--text-mid); }
    .value-list li { padding: 5px 0; display: flex; align-items: center; gap: 8px; }

    /* ═══ PRICING ═══ */
    .pricing-section { background: linear-gradient(160deg, var(--ink-deep) 0%, var(--ink) 100%); }
    .pricing-section .section-tag { color: var(--sage-glow); }
    .pricing-section .section-title { color: #fff; }
    .pricing-section .section-sub { color: rgba(255,255,255,0.65); }
    .pricing-card { max-width: 440px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.4); }
    .pricing-header { background: linear-gradient(135deg, var(--sage) 0%, var(--sage-light) 100%); padding: 24px; text-align: center; }
    .pricing-badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; margin-bottom: 10px; }
    .pricing-name { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; margin-bottom: 8px; }
    .pricing-price { display: flex; align-items: baseline; gap: 8px; justify-content: center; }
    .price-amount { font-family: 'Instrument Serif', serif; font-size: 52px; color: #fff; line-height: 1; }
    .price-details { color: rgba(255,255,255,0.8); font-size: 13px; }
    .price-old { text-decoration: line-through; opacity: 0.6; font-size: 16px; }
    .pricing-body { padding: 24px; }
    .pricing-list { list-style: none; margin-bottom: 20px; }
    .pricing-list li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text); }
    .pricing-list li:last-child { border-bottom: none; }
    .pricing-list li::before { content: '✓'; color: var(--sage); font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .btn-pricing { display: block; width: 100%; background: var(--sage); color: #fff; padding: 16px 24px; border-radius: 100px; font-size: 15px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; text-align: center; transition: all 0.3s; box-shadow: var(--shadow-green); animation: pulse-btn 2.5s ease-in-out infinite; }
    .btn-pricing:hover { background: var(--sage-light); transform: translateY(-2px); }
    .pricing-secure { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; font-size: 10px; color: var(--text-light); }

    /* ═══ GUARANTEE ═══ */
    .guarantee-section { background: var(--sage-muted); }
    .guarantee-box { max-width: 600px; margin: 0 auto; background: #fff; border: 2px solid rgba(0,184,148,0.3); border-radius: 20px; padding: 36px 24px; text-align: center; box-shadow: 0 10px 60px rgba(0,184,148,0.1); }
    .guarantee-icon { font-size: 44px; margin-bottom: 14px; }
    .guarantee-title { font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--ink); margin-bottom: 12px; }
    .guarantee-text { font-size: 14px; color: var(--text-mid); line-height: 1.65; }

    /* ═══ FAQ ═══ */
    .faq-section { background: var(--cream); }
    .faq-container { max-width: 600px; margin: 0 auto; }
    .faq-item { background: #fff; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 8px; overflow: hidden; }
    .faq-question { width: 100%; background: none; border: none; padding: 16px 18px; font-size: 14px; font-weight: 600; color: var(--ink); text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-family: 'DM Sans', sans-serif; gap: 12px; }
    .faq-chevron { flex-shrink: 0; font-size: 14px; transition: transform 0.3s; }
    .faq-chevron.open { transform: rotate(180deg); }
    .faq-answer { padding: 0 18px 16px; font-size: 13px; color: var(--text-mid); line-height: 1.65; }

    /* ═══ FINAL CTA ═══ */
    .final-cta { background: linear-gradient(160deg, var(--ink-deep), var(--ink)); padding: 56px 20px; text-align: center; }
    .final-cta h2 { font-family: 'Instrument Serif', serif; font-size: 26px; color: #fff; margin-bottom: 12px; line-height: 1.2; }
    .final-cta p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.6; }

    .site-footer { background: var(--ink-deep); padding: 32px 20px; text-align: center; }
    .footer-logo { font-family: 'Instrument Serif', serif; font-size: 18px; color: #fff; margin-bottom: 10px; }
    .footer-logo span { color: var(--sage); }
    .footer-links { display: flex; justify-content: center; gap: 16px; margin-bottom: 10px; flex-wrap: wrap; }
    .footer-links a { font-size: 11px; color: rgba(255,255,255,0.4); text-decoration: none; }
    .footer-copy { font-size: 10px; color: rgba(255,255,255,0.25); }

    /* ═══ APP PREVIEW ═══ */
    .preview-section { background: var(--paper); padding: 56px 20px; }
    .preview-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 36px; }
    .preview-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px 20px; box-shadow: 0 2px 20px rgba(15,44,89,0.05); transition: all 0.4s; }
    .preview-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-4px); }
    .preview-icon { font-size: 32px; margin-bottom: 12px; }
    .preview-card-title { font-family: 'Instrument Serif', serif; font-size: 18px; color: var(--ink); margin-bottom: 8px; }
    .preview-card-desc { font-size: 13px; color: var(--text-mid); line-height: 1.55; margin-bottom: 16px; }
    .preview-visual { background: var(--cream); border-radius: 10px; padding: 14px; border: 1px solid var(--border); }

    /* Mini macro bars */
    .mini-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .mini-bar-label { font-size: 10px; font-weight: 600; color: var(--text-mid); width: 60px; flex-shrink: 0; }
    .mini-bar-track { flex: 1; height: 8px; background: #E2E8F0; border-radius: 100px; overflow: hidden; }
    .mini-bar-fill { height: 100%; border-radius: 100px; transition: width 1s ease; }
    .mini-bar-fill.prot { background: linear-gradient(90deg, #3B82F6, #60A5FA); }
    .mini-bar-fill.gluc { background: linear-gradient(90deg, #F59E0B, #FBBF24); }
    .mini-bar-fill.lip { background: linear-gradient(90deg, #EC4899, #F472B6); }
    .mini-bar-value { font-size: 10px; font-weight: 700; color: var(--text); width: 32px; text-align: right; flex-shrink: 0; }

    /* Mini menu */
    .mini-menu-item { display: flex; align-items: flex-start; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--border); }
    .mini-menu-item:last-child { border-bottom: none; }
    .mini-menu-label { font-size: 10px; font-weight: 700; color: var(--sage-light); }
    .mini-menu-content { font-size: 11px; color: var(--text-mid); line-height: 1.4; }

    /* Mini progress ring */
    .progress-ring-container { display: flex; align-items: center; gap: 16px; justify-content: center; }
    .progress-ring { position: relative; width: 80px; height: 80px; }
    .progress-ring svg { transform: rotate(-90deg); }
    .progress-ring-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: var(--sage); }
    .streak-badge-mini { background: linear-gradient(135deg, #FFF7ED, #FFEDD5); border: 1px solid #FED7AA; border-radius: 10px; padding: 8px 14px; font-size: 14px; font-weight: 700; color: #D97706; }

    .fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }

    /* ═══ STICKY MOBILE CTA ═══ */
    .sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(7,24,40,0.97); backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,0.1); padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; z-index: 99; }
    .sticky-cta-text { font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.3; }
    .sticky-cta-text strong { color: var(--sage-glow); }
    .sticky-cta-btn { background: var(--sage); color: #fff; padding: 10px 18px; border-radius: 100px; font-size: 13px; font-weight: 700; text-decoration: none; white-space: nowrap; flex-shrink: 0; }

    /* ═══ DESKTOP OVERRIDES ═══ */
    @media (min-width: 769px) {
      .site-header { padding: 14px 24px; }
      .hero { padding: 80px 24px 60px; }
      .hero h1 { font-size: 56px; }
      .hero-sub { font-size: 17px; }
      .btn-primary { padding: 18px 36px; font-size: 16px; }
      .section { padding: 80px 24px; }
      .section-title { font-size: 40px; }
      .section-sub { font-size: 16px; }
      .pain-grid { grid-template-columns: 1fr 1fr; }
      .steps-grid { grid-template-columns: repeat(3, 1fr); }
      .testi-grid { grid-template-columns: repeat(3, 1fr); }
      .preview-grid { grid-template-columns: repeat(3, 1fr); }
      .value-grid { grid-template-columns: 1fr 1fr; max-width: 700px; }
      .sticky-cta { display: none; }
      .cinema-frame { max-width: 700px; aspect-ratio: 16/10; }
      .cinema-stat-grid { max-width: 400px; }
      .cinema-slide { padding: 32px; }
      .phone-frame { width: 260px; height: 520px; }
      .hero-phone-wrapper .phone-frame { width: 260px; height: 520px; }
    }

    /* ═══ BOTTOM SAFE AREA (sticky CTA) ═══ */
    @media (max-width: 768px) {
      .site-footer { padding-bottom: 80px; }
    }
  `;

  const pains = [
    { icon: '😤', title: 'Le pantalon de l\'an dernier ne ferme plus', desc: 'Chaque matin devant le miroir, même constat. Le ventre prend, la confiance recule.' },
    { icon: '🔄', title: 'Les régimes ? Toujours le même cycle', desc: '-3 kg, +5 kg. Restriction, craquage, culpabilité. Rien ne tient.' },
    { icon: '⏰', title: 'Zéro temps pour des plans compliqués', desc: 'Boulot, enfants, dîners clients — compter les calories est irréaliste.' },
    { icon: '📉', title: 'Votre métabolisme vous a lâché', desc: 'Ce qui marchait à 25 ans ne marche plus. Manger "normalement" fait grossir.' },
    { icon: '⚠️', title: 'Votre médecin a parlé de prédiabète', desc: 'Glycémie élevée, cholestérol, tour de taille qui augmente. Les signaux sont là.' },
    { icon: '😓', title: 'Essoufflé en montant les escaliers', desc: 'L\'énergie d\'avant a disparu. Fatigue, sommeil médiocre, motivation en berne.' },
  ];

  const testimonials = [
    { name: 'Marc', age: 42, role: 'Cadre en entreprise', result: 'Protocole 10 semaines · Profil sédentaire', quote: 'À 42 ans, j\'avais tout essayé. Ce programme m\'a donné un plan clair : 1 680 kcal les jours de repos, 1 920 les jours training. En 10 semaines, j\'ai perdu 9 kg sans jamais avoir faim.', avatar: 'M', color: '#6366F1' },
    { name: 'Laurent', age: 38, role: 'Commercial terrain', result: 'Protocole 10 semaines · Profil actif', quote: 'Je mange au restaurant 3 fois par semaine pour le boulot. Le cyclage calorique m\'a permis de compenser : training days + high carbs = je ne stocke plus. -7 kg, masse musculaire intacte.', avatar: 'L', color: '#F59E0B' },
    { name: 'Thomas', age: 51, role: 'Entrepreneur', result: 'Protocole adapté 50+ ans', quote: 'Mon médecin m\'avait dit "prédiabète". En 10 semaines avec le programme, ma glycémie est passée de 1.18 à 0.95 g/L. L\'algorithme adapte tout à mon âge, c\'est ce qui fait la différence.', avatar: 'T', color: '#EC4899' },
  ];

  const faqs = [
    { q: 'Est-ce que je dois compter mes calories ?', a: 'Non. Chaque repas est pré-calculé pour votre profil. Pas de pesée obsessionnelle.' },
    { q: 'Ça marche vraiment après 40 ans ?', a: 'Le programme est conçu pour le métabolisme qui ralentit avec l\'âge. Équations de Mifflin-St Jeor calibrées + cyclage calorique.' },
    { q: 'Combien de temps ça prend par jour ?', a: '5 minutes. Ouvrez le journal, suivez les repas, cochez les compléments. C\'est tout.' },
    { q: 'Je peux annuler quand je veux ?', a: 'Oui, en 1 clic depuis votre profil. Vous avez 7 jours gratuits pour tester. Ensuite c\'est 29€/mois, sans engagement — annulable à tout moment.' },
    { q: 'Et si ça ne marche pas pour moi ?', a: 'Vous ne payez rien pendant 7 jours. Si le programme ne vous convient pas, annulez avant la fin de l\'essai et vous ne serez jamais facturé.' },
    { q: 'C\'est quoi la différence avec un régime ?', a: 'Un régime dit quoi ne pas manger. Ce programme dit quoi manger, quand, combien — personnalisé à votre profil avec suivi quotidien.' },
  ];

  const screenNames = ['Dashboard', 'Journal', 'Mon Plan'];

  return (
    <>
      <style>{styles}</style>

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">Sèche<span>10</span>Semaines</Link>
          <Link to="/blog" className="btn-member" style={{marginRight: 8, borderColor: 'rgba(255,255,255,0.15)'}}>Blog</Link>
          <Link to="/login" className="btn-member">Espace Membre</Link>
        </div>
      </header>

      {/* INFO BAR */}
      <div className="urgency-bar" style={{ background: 'linear-gradient(90deg, #059669 0%, #047857 100%)' }}>
        <div className="urgency-inner">
          <span className="urgency-text">🧪 Programme personnalisé par algorithme · Résultats en 10 semaines · 29€/mois · 7 jours gratuits</span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎯 Programme nutrition scientifique · Hommes 35-55 ans</div>
          <h1 className="font-serif">
            Perdez du gras.<br />Reprenez votre <em>santé en main.</em>
          </h1>
          <p className="hero-sub">
            Sèche musculaire ou santé métabolique — un programme <strong>100% personnalisé</strong> par algorithme.
            Glycémie, cholestérol, tour de taille : tout est suivi. <strong>5 minutes par jour suffisent.</strong>
          </p>
          <div className="hero-cta-group">
            <Link to="/login" className="btn-primary">
              Découvrir mon plan personnalisé →
            </Link>
            <span className="hero-guarantee">
              ✅ <strong>7 jours gratuits</strong> · Puis 29€/mois · Annulation en 1 clic
            </span>
          </div>

          {/* PHONE MOCKUP IN HERO */}
          <div className="hero-phone-wrapper">
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-screen">
                {/* Screen 1: Dashboard */}
                <div className={`phone-screen-slide ${activeScreen === 0 ? 'active' : ''}`}>
                  <div className="mini-dash">
                    <div className="mini-dash-greeting">Bonjour Marc 👋</div>
                    <div className="mini-dash-title">Semaine 4 / 10</div>
                    <div className="mini-dash-card">
                      <div className="mini-dash-card-title">Progression</div>
                      <div className="mini-progress-bar">
                        <div className="mini-progress-fill" style={{ width: '40%' }} />
                      </div>
                      <div style={{ fontSize: 7, color: '#94A3B8', textAlign: 'right' }}>4.2 kg perdus</div>
                    </div>
                    <div className="mini-dash-card">
                      <div className="mini-stat-row">
                        <div className="mini-stat">
                          <div className="mini-stat-value">1 680</div>
                          <div className="mini-stat-label">kcal/jour</div>
                        </div>
                        <div className="mini-stat">
                          <div className="mini-stat-value">140g</div>
                          <div className="mini-stat-label">protéines</div>
                        </div>
                        <div className="mini-stat">
                          <div className="mini-stat-value">🔥 12</div>
                          <div className="mini-stat-label">jours streak</div>
                        </div>
                      </div>
                    </div>
                    <div className="mini-phase">
                      <div className="mini-phase-week">S4</div>
                      <div>
                        <div className="mini-phase-name">Sèche Viscérale</div>
                        <div className="mini-phase-text">Accélération Déficit</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screen 2: Journal */}
                <div className={`phone-screen-slide ${activeScreen === 1 ? 'active' : ''}`}>
                  <div className="mini-journal">
                    <div className="mini-journal-header">📋 Journal du jour</div>
                    <div className="mini-journal-date">Mardi 18 Février · Jour Training</div>
                    <div className="mini-meal">
                      <div className="mini-meal-title">🌅 Petit-déjeuner</div>
                      <div className="mini-meal-items">Omelette 3 œufs · Flocons d'avoine 40g · Myrtilles</div>
                      <div className="mini-meal-macros">
                        <span className="mini-macro p">P 32g</span>
                        <span className="mini-macro g">G 38g</span>
                        <span className="mini-macro l">L 14g</span>
                      </div>
                      <div className="mini-check">✅ Complété</div>
                    </div>
                    <div className="mini-meal">
                      <div className="mini-meal-title">☀️ Déjeuner</div>
                      <div className="mini-meal-items">Poulet grillé 180g · Riz basmati · Brocolis</div>
                      <div className="mini-meal-macros">
                        <span className="mini-macro p">P 48g</span>
                        <span className="mini-macro g">G 52g</span>
                        <span className="mini-macro l">L 8g</span>
                      </div>
                    </div>
                    <div className="mini-meal">
                      <div className="mini-meal-title">🌙 Dîner</div>
                      <div className="mini-meal-items">Saumon 150g · Patate douce · Salade verte</div>
                      <div className="mini-meal-macros">
                        <span className="mini-macro p">P 38g</span>
                        <span className="mini-macro g">G 34g</span>
                        <span className="mini-macro l">L 18g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screen 3: Setup/Plan */}
                <div className={`phone-screen-slide ${activeScreen === 2 ? 'active' : ''}`}>
                  <div className="mini-setup">
                    <div className="mini-setup-header">🎯 Votre profil</div>
                    <div className="mini-setup-sub">Personnalisation par algorithme</div>
                    <div className="mini-input-group">
                      <div className="mini-label">Âge</div>
                      <div className="mini-input">42 ans</div>
                    </div>
                    <div className="mini-input-group">
                      <div className="mini-label">Objectif</div>
                      <div className="mini-select-row">
                        <div className="mini-select-btn">Perte douce</div>
                        <div className="mini-select-btn active">Sèche</div>
                        <div className="mini-select-btn">Sèche intense</div>
                      </div>
                    </div>
                    <div className="mini-input-group">
                      <div className="mini-label">Niveau d'activité</div>
                      <div className="mini-select-row">
                        <div className="mini-select-btn">Sédentaire</div>
                        <div className="mini-select-btn active">Actif</div>
                        <div className="mini-select-btn">Très actif</div>
                      </div>
                    </div>
                    <div className="mini-result-card">
                      <div className="mini-result-title">Votre TDEE calculé</div>
                      <div className="mini-result-value">2 180 <span className="mini-result-unit">kcal/jour</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="screen-tabs">
            {screenNames.map((name, i) => (
              <div key={i} className={`screen-tab ${activeScreen === i ? 'active' : ''}`} onClick={() => setActiveScreen(i)}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-inner">
          <div className="trust-item"><span>🔬</span>Science (Mifflin-St Jeor)</div>
          <div className="trust-item"><span>🔒</span>Paiement Stripe</div>
          <div className="trust-item"><span>🎁</span>7 jours gratuits</div>
          <div className="trust-item"><span>📱</span>100% mobile</div>
        </div>
      </div>

      {/* PAIN POINTS */}
      <section id="pain" className="section pain-section">
        <div className="container text-center">
          <div className="section-tag">VOUS RECONNAISSEZ-VOUS ?</div>
          <h2 className="section-title">Si vous lisez cette page,<br />c'est que vous savez.</h2>
          <p className="section-sub">Ces frustrations, vous les vivez depuis des mois — peut-être des années.</p>
        </div>
        <div className="container">
          <div id="pain-grid" data-animate className={`pain-grid fade-up ${isVisible('pain-grid') ? 'visible' : ''}`}>
            {pains.map((p, i) => (
              <div key={i} className="pain-item">
                <span className="pain-icon">{p.icon}</span>
                <div className="pain-text"><strong>{p.title}</strong>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMA TRANSFORMATION — THE "WAHOU" SECTION */}
      <section className="cinema-section">
        <div className="container text-center">
          <div className="section-tag">LA TRANSFORMATION</div>
          <h2 className="section-title font-serif">L'histoire de Marc, 42 ans.<br />La vôtre commence aujourd'hui.</h2>
          <p className="section-sub">Cadre en entreprise, père de 2 enfants. Il ne comptait plus les régimes ratés.</p>
        </div>

        <div className="cinema-frame">
          <div className="cinema-inner">
            {/* Slide 0: Intro — Who is Marc */}
            <div className={`cinema-slide ${cinemaStep === 0 ? 'active' : ''}`}>
              <div className="cinema-avatar">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Marc" />
              </div>
              <div className="cinema-name">Marc, 42 ans</div>
              <div className="cinema-meta">Cadre · Lyon · Père de 2 enfants</div>
              <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', maxWidth: 260, lineHeight: 1.5 }}>
                "J'ai essayé 6 régimes en 5 ans. Rien n'a jamais tenu."
              </div>
            </div>

            {/* Slide 1: Starting stats */}
            <div className={`cinema-slide ${cinemaStep === 1 ? 'active' : ''}`}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.15em', marginBottom: 14 }}>Jour 1 — Le bilan</div>
              <div className="cinema-stat-grid">
                <div className="cinema-stat-box">
                  <div className="cinema-stat-label">Poids</div>
                  <div className="cinema-stat-value">92<span className="cinema-stat-unit"> kg</span></div>
                </div>
                <div className="cinema-stat-box">
                  <div className="cinema-stat-label">Tour de taille</div>
                  <div className="cinema-stat-value">98<span className="cinema-stat-unit"> cm</span></div>
                </div>
                <div className="cinema-stat-box">
                  <div className="cinema-stat-label">TDEE calculé</div>
                  <div className="cinema-stat-value">2 180<span className="cinema-stat-unit"> kcal</span></div>
                </div>
                <div className="cinema-stat-box">
                  <div className="cinema-stat-label">Objectif</div>
                  <div className="cinema-stat-value" style={{ fontSize: 16, color: 'var(--sage-glow)' }}>Sèche 10 sem.</div>
                </div>
              </div>
            </div>

            {/* Slide 2: Timeline progression */}
            <div className={`cinema-slide ${cinemaStep === 2 ? 'active' : ''}`}>
              <div className="cinema-week-label">Semaine 4</div>
              <div className="cinema-week-desc">Sèche Viscérale — Accélération</div>
              <div className="cinema-timeline">
                <div className="cinema-tl-bar">
                  <div className="cinema-tl-fill" style={{ width: '40%' }} />
                </div>
                <div className="cinema-tl-weeks">
                  <span>S1</span><span>S2</span><span>S3</span><span className="current">S4</span><span>S5</span><span>S6</span><span>S7</span><span>S8</span><span>S9</span><span>S10</span>
                </div>
              </div>
              <div style={{ marginTop: 18, display: 'flex', gap: 16, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: 'var(--sage-glow)' }}>-4.2</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>kg perdus</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: 'var(--sage-glow)' }}>-5</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>cm taille</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: '#F59E0B' }}>🔥 28</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>jours streak</div>
                </div>
              </div>
            </div>

            {/* Slide 3: Daily routine */}
            <div className={`cinema-slide ${cinemaStep === 3 ? 'active' : ''}`}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.15em', marginBottom: 12 }}>Sa routine quotidienne</div>
              <div style={{ width: '100%', maxWidth: 280 }}>
                {[
                  { time: '7h00', icon: '🌅', text: 'Omelette 3 œufs · Avoine · Fruits', done: true },
                  { time: '12h30', icon: '☀️', text: 'Poulet grillé · Riz basmati · Brocolis', done: true },
                  { time: '19h00', icon: '🌙', text: 'Saumon · Patate douce · Salade', done: false },
                  { time: '21h00', icon: '💊', text: 'Oméga-3 · Vitamine D · Magnésium', done: true },
                ].map((meal, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', width: 30, flexShrink: 0 }}>{meal.time}</span>
                    <span style={{ fontSize: 14 }}>{meal.icon}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', flex: 1 }}>{meal.text}</span>
                    <span style={{ fontSize: 12 }}>{meal.done ? '✅' : '⏳'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide 4: Before/After numbers */}
            <div className={`cinema-slide ${cinemaStep === 4 ? 'active' : ''}`}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.15em', marginBottom: 16 }}>Semaine 10 — Résultat</div>
              <div className="cinema-ba">
                <div className="cinema-ba-col">
                  <div className="cinema-ba-label before">Avant</div>
                  <div className="cinema-ba-num before">92</div>
                  <div className="cinema-ba-sub">kg</div>
                </div>
                <div className="cinema-ba-arrow">→</div>
                <div className="cinema-ba-col">
                  <div className="cinema-ba-label after">Après</div>
                  <div className="cinema-ba-num after">82</div>
                  <div className="cinema-ba-sub">kg</div>
                </div>
              </div>
              <div className="cinema-ba-diff">
                <span>-10 kg · -11 cm tour de taille</span>
              </div>
            </div>

            {/* Slide 5: Final — his words */}
            <div className={`cinema-slide ${cinemaStep === 5 ? 'active' : ''}`}>
              <div className="cinema-result-icon">🏆</div>
              <div className="cinema-result-title">Marc a retrouvé<br />sa confiance.</div>
              <div className="cinema-result-sub">
                "Pour la première fois en 10 ans, j'ai enlevé mon t-shirt à la plage sans y penser."
              </div>
              <div className="cinema-result-stats">
                <div className="cinema-result-stat"><div className="val">-10 kg</div><div className="lab">Poids</div></div>
                <div className="cinema-result-stat"><div className="val">-11 cm</div><div className="lab">Taille</div></div>
                <div className="cinema-result-stat"><div className="val">70 j</div><div className="lab">Streak</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="cinema-dots">
          {Array.from({ length: CINEMA_STEPS }).map((_, i) => (
            <div key={i} className={`cinema-dot ${cinemaStep === i ? 'active' : ''}`} onClick={() => setCinemaStep(i)} />
          ))}
        </div>

        <div className="cinema-caption">
          <div className="cinema-caption-text">
            <strong>Profil type · Protocole Sèche 10 Semaines.</strong> Résultats individuels, non contractuels.
          </div>
        </div>

        <div className="feature-pills">
          <div className="feature-pill"><span className="pill-icon">📊</span>Suivi progression</div>
          <div className="feature-pill"><span className="pill-icon">🍽️</span>Repas pré-calculés</div>
          <div className="feature-pill"><span className="pill-icon">🔄</span>Cyclage calorique auto</div>
          <div className="feature-pill"><span className="pill-icon">🏋️</span>Programme PPL</div>
          <div className="feature-pill"><span className="pill-icon">📈</span>Courbe de poids</div>
          <div className="feature-pill"><span className="pill-icon">💊</span>Compléments guidés</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section" style={{ background: '#fff' }}>
        <div className="container text-center">
          <div className="section-tag">COMMENT ÇA MARCHE</div>
          <h2 className="section-title font-serif">3 étapes. 5 minutes par jour.</h2>
          <p className="section-sub">Notre algorithme crée votre protocole unique. Ensuite, vous suivez.</p>
        </div>
        <div className="container">
          <div className="steps-grid">
            {[
              { num: 1, icon: '🎯', title: 'Votre bilan en 5 min', desc: 'Âge, poids, profil glycémique, mode de vie. L\'algorithme calcule votre plan unique.' },
              { num: 2, icon: '📱', title: 'Suivez votre journal', desc: 'Vos 3 repas sont prêts chaque jour, compléments listés, entraînement détaillé.' },
              { num: 3, icon: '📉', title: 'Votre corps change', desc: 'Suivez votre courbe de poids, tour de taille, marqueurs de santé semaine après semaine.' },
            ].map((step, i) => (
              <div key={i} id={`step-${i}`} data-animate className={`step-card fade-up ${isVisible(`step-${i}`) ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE COMPARISON */}
      <section className="section value-section">
        <div className="container text-center">
          <div className="section-tag">COMPAREZ</div>
          <h2 className="section-title font-serif">Le même résultat,<br />10× moins cher.</h2>
          <p className="section-sub">Un accompagnement pro coûte 480€/mois minimum.</p>
          <div id="value-grid" data-animate className={`value-grid fade-up ${isVisible('value-grid') ? 'visible' : ''}`}>
            <div className="value-card old">
              <div style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Accompagnement classique</div>
              <div className="value-price crossed">480€<span style={{ fontSize: 14, fontWeight: 400 }}>/mois</span></div>
              <ul className="value-list">
                <li>❌ Nutritionniste 120€ × 4</li>
                <li>❌ Plan générique</li>
                <li>❌ Pas de suivi quotidien</li>
              </ul>
            </div>
            <div className="value-card new">
              <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Sèche 10 Semaines</div>
              <div className="value-price" style={{ color: '#059669' }}>29€<span style={{ fontSize: 14, fontWeight: 400 }}>/mois</span></div>
              <ul className="value-list">
                <li>✅ Plan personnalisé par algorithme</li>
                <li>✅ Journal quotidien détaillé</li>
                <li>✅ Suivi complet + entraînement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="section testimonials-section">
        <div className="container text-center">
          <div className="section-tag">ILS L'ONT FAIT</div>
          <h2 className="section-title font-serif">Des hommes comme vous. Des résultats réels.</h2>
          <p className="section-sub">Protocoles personnalisés par notre algorithme. Résultats individuels, non contractuels.</p>
        </div>
        <div className="container">
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} id={`testi-${i}`} data-animate className={`testi-card fade-up ${isVisible(`testi-${i}`) ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="testi-stars" style={{color: '#00B894', fontSize: 12, fontWeight: 700}}>✅ PROTOCOLE SUIVI</div>
                <div className="testi-result">📋 {t.result}</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="testi-name">{t.name}, {t.age} ans</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section pricing-section text-center">
        <div className="container">
          <div className="section-tag">VOTRE PROGRAMME</div>
          <h2 className="section-title font-serif">Tout inclus. Résultats garantis.</h2>
          <p className="section-sub">L'investissement le plus rentable de votre santé.</p>

          <div id="pricing-card" data-animate className={`pricing-card fade-up ${isVisible('pricing-card') ? 'visible' : ''}`}>
            <div className="pricing-header">
              <div className="pricing-badge">🎯 Votre programme sur mesure</div>
              <div className="pricing-name">Programme Complet · 10 Semaines</div>
              <div className="pricing-price">
                <span className="price-amount">29€</span>
                <div className="price-details">
                  <div>/mois</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>sans engagement</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '3px 10px', borderRadius: 100 }}>7 jours gratuits · Sans engagement</div>
            </div>
            <div className="pricing-body">
              <ul className="pricing-list">
                {[
                  'Plan alimentaire 100% personnalisé',
                  'Cyclage calorique Training / Repos',
                  'Journal quotidien avec repas détaillés',
                  'Programme d\'entraînement PPL complet',
                  'Suivi poids, tour de taille, glycémie',
                  'Guide complet téléchargeable',
                  'Communauté privée Telegram',
                  '7 jours gratuits · Annulation en 1 clic',
                ].map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <Link to="/login" className="btn-pricing">
                Créer mon programme personnalisé →
              </Link>
              <div className="pricing-secure">🔒 Paiement sécurisé · Annulation en 1 clic</div>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="section guarantee-section">
        <div className="container">
          <div id="guarantee" data-animate className={`guarantee-box fade-up ${isVisible('guarantee') ? 'visible' : ''}`}>
            <div className="guarantee-icon">🎁</div>
            <div className="guarantee-title font-serif">7 jours gratuits — Zéro risque</div>
            <p className="guarantee-text">
              Testez le programme complet pendant 7 jours. Aucun paiement avant la fin de l'essai.<br /><br />
              <strong>Annulation en 1 clic depuis votre profil. Aucun engagement.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* LA SCIENCE DERRIÈRE LE PROGRAMME */}
      <section style={{ padding: '80px 20px', background: '#0a0f1a' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="text-center" style={{ marginBottom: 40 }}>
            <div className="section-tag">Fondations scientifiques</div>
            <h2 className="section-title font-serif" style={{ color: '#fff' }}>Chaque calcul est basé sur la recherche.</h2>
          </div>
          {[
            { icon: '🔬', title: 'Équation de Mifflin-St Jeor (1990)', desc: 'La référence mondiale pour calculer votre métabolisme de base. Plus précise que Harris-Benedict, validée sur des milliers de sujets. C\'est elle qui détermine vos calories quotidiennes.' },
            { icon: '📊', title: 'Étude DPP — New England Journal of Medicine (2002)', desc: 'Sur 3 234 participants prédiabétiques, une modification du mode de vie a réduit le risque de diabète de 58%. C\'est le fondement de notre approche santé métabolique.' },
            { icon: '💪', title: 'Protéines en déficit — Helms et al. (2014)', desc: '2.0 à 2.2g/kg de protéines par jour en période de déficit calorique pour préserver la masse musculaire. C\'est exactement ce que notre algorithme applique.' },
            { icon: '🔄', title: 'Cyclage calorique — Byrne et al. (2018)', desc: 'Alterner jours d\'entraînement (plus de glucides) et jours de repos (moins de glucides) préserve le métabolisme et accélère la perte de gras vs. déficit continu.' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, #141b2d 0%, #1a2340 100%)',
              borderRadius: 16, padding: '28px 24px', marginBottom: 20,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{item.title}</div>
              </div>
              <p style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APP PREVIEW */}
      <section className="preview-section">
        <div className="container text-center">
          <div className="section-tag">APERÇU</div>
          <h2 className="section-title font-serif">Votre programme en action</h2>
          <p className="section-sub">Découvrez ce qui vous attend dès votre inscription</p>
        </div>
        <div className="container">
          <div id="preview-grid" data-animate className={`preview-grid fade-up ${isVisible('preview-grid') ? 'visible' : ''}`}>
            {/* Card 1 — Plan Personnalisé */}
            <div className="preview-card">
              <div className="preview-icon">🎯</div>
              <div className="preview-card-title">Plan calculé pour VOUS</div>
              <p className="preview-card-desc">Macros adaptées à votre métabolisme, votre âge et votre activité. Jours d'entraînement vs repos différenciés.</p>
              <div className="preview-visual">
                <div className="mini-bar-row">
                  <span className="mini-bar-label">Protéines</span>
                  <div className="mini-bar-track"><div className="mini-bar-fill prot" style={{ width: '85%' }} /></div>
                  <span className="mini-bar-value">170g</span>
                </div>
                <div className="mini-bar-row">
                  <span className="mini-bar-label">Glucides</span>
                  <div className="mini-bar-track"><div className="mini-bar-fill gluc" style={{ width: '72%' }} /></div>
                  <span className="mini-bar-value">180g</span>
                </div>
                <div className="mini-bar-row">
                  <span className="mini-bar-label">Lipides</span>
                  <div className="mini-bar-track"><div className="mini-bar-fill lip" style={{ width: '45%' }} /></div>
                  <span className="mini-bar-value">65g</span>
                </div>
              </div>
            </div>

            {/* Card 2 — Repas Quotidiens */}
            <div className="preview-card" style={{ transitionDelay: '0.12s' }}>
              <div className="preview-icon">🍽️</div>
              <div className="preview-card-title">+80 recettes adaptées</div>
              <p className="preview-card-desc">3 repas + collation calculés chaque jour. Ingrédients simples, 15-20 min de préparation.</p>
              <div className="preview-visual">
                <div className="mini-menu-item">
                  <div>
                    <div className="mini-menu-label">☀️ Déjeuner</div>
                    <div className="mini-menu-content">150g Poulet + 70g Riz + Brocolis</div>
                  </div>
                </div>
                <div className="mini-menu-item">
                  <div>
                    <div className="mini-menu-label">🌙 Dîner</div>
                    <div className="mini-menu-content">150g Saumon + Patate douce + Salade</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 — Suivi & Gamification */}
            <div className="preview-card" style={{ transitionDelay: '0.24s' }}>
              <div className="preview-icon">🔥</div>
              <div className="preview-card-title">Suivi intelligent</div>
              <p className="preview-card-desc">Streaks, badges, compliance, pesées et tour de taille. Votre progression visualisée semaine par semaine.</p>
              <div className="preview-visual">
                <div className="progress-ring-container">
                  <div className="progress-ring">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#00B894" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34 * 0.72} ${2 * Math.PI * 34 * 0.28}`} />
                    </svg>
                    <div className="progress-ring-text">72%</div>
                  </div>
                  <div className="streak-badge-mini">🔥 12 jours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faq-section">
        <div className="container faq-container">
          <div className="text-center" style={{ marginBottom: 28 }}>
            <div className="section-tag">FAQ</div>
            <h2 className="section-title font-serif">Vos questions.</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className={`faq-chevron ${openFaq === i ? 'open' : ''}`}>▾</span>
              </button>
              {openFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* URGENCE OFFRE */}
      <section style={{
        padding: '50px 20px', textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #00B894 0%, #00a381 100%)',
      }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Votre transformation commence ici</div>
          <h2 className="font-serif" style={{ color: '#fff', fontSize: 28, marginBottom: 8 }}>
            29€<span style={{ fontSize: 16 }}>/mois</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginBottom: 20 }}>
            7 jours gratuits · Puis 29€/mois · Annulation en 1 clic
          </p>
          <Link to="/login" className="btn-primary" style={{ background: '#fff', color: '#00a381' }}>
            Découvrir mon plan en 5 min →
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2 className="font-serif">Prêt à retrouver le corps<br />que vous méritez ?</h2>
        <p>Votre transformation commence par une décision.</p>
        <Link to="/login" className="btn-primary">
          Je veux mon programme →
        </Link>
      </section>

      {/* DISCLAIMER MÉDICAL */}
      <div style={{ background: '#0a0f1a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 16px', textAlign: 'center' as const }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
          ⚕️ <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Avertissement santé :</strong> Sèche 10 Semaines est un programme de nutrition et ne remplace en aucun cas un avis médical. Si vous êtes en situation de prédiabète, de cholestérol élevé ou de toute autre condition métabolique, consultez votre médecin avant de commencer un programme alimentaire. Les résultats présentés sont des estimations basées sur des modèles scientifiques et varient selon les individus.
        </p>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-logo">Sèche<span>10</span>Semaines</div>
        <div className="footer-links">
          <Link to="/blog">Blog</Link>
          <Link to="/a-propos">À propos</Link>
          <Link to="/login">Espace Membre</Link>
          <a href="mailto:contact@seche10semaines.fr">Contact</a>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgv">CGV</Link>
          <Link to="/politique-confidentialite">Politique de confidentialité</Link>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>🎁 Parrainez un ami : -50% pour lui, 1 mois offert pour vous</div>
        <div className="footer-copy">© 2026 Sèche10Semaines · Résultats individuels, non contractuels.</div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-cta">
        <div className="sticky-cta-text"><strong>29€/mois</strong> · Votre plan en 5 min · Garanti 14j</div>
        <Link to="/login" className="sticky-cta-btn">Commencer →</Link>
      </div>

      <LeadMagnetPopup />
    </>
  );
};
