import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Success: React.FC = () => {
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700&display=swap');
    :root {
      --ink: #0F2C59; --sage: #00B894; --sage-muted: #ECFDF5; --sage-glow: #34D399;
      --text-mid: #475569; --border: #E2E8F0;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    .success-page {
      min-height: 100vh;
      background: linear-gradient(160deg, #071828 0%, #0F2C59 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 40px 24px;
    }
    .success-card {
      background: #fff; border-radius: 28px;
      padding: 56px 48px; text-align: center;
      max-width: 520px; width: 100%;
      box-shadow: 0 40px 120px rgba(0,0,0,0.4);
      animation: pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes pop-in {
      from { opacity: 0; transform: scale(0.85) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .success-icon {
      width: 80px; height: 80px;
      background: var(--sage-muted);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 38px; margin: 0 auto 24px;
      border: 3px solid rgba(0,184,148,0.3);
    }
    .success-title {
      font-family: 'Instrument Serif', serif;
      font-size: 34px; color: var(--ink);
      line-height: 1.15; margin-bottom: 14px;
    }
    .success-sub {
      font-size: 16px; color: var(--text-mid);
      line-height: 1.65; margin-bottom: 36px;
    }
    .success-steps {
      background: var(--sage-muted);
      border: 1px solid rgba(0,184,148,0.2);
      border-radius: 16px; padding: 24px 28px;
      text-align: left; margin-bottom: 32px;
    }
    .success-steps h4 {
      font-size: 13px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--sage); margin-bottom: 16px;
    }
    .success-steps ol {
      list-style: none; padding: 0;
    }
    .success-steps li {
      display: flex; align-items: center; gap: 12px;
      font-size: 15px; color: #1E293B;
      padding: 8px 0; border-bottom: 1px solid rgba(0,184,148,0.15);
    }
    .success-steps li:last-child { border-bottom: none; }
    .step-num {
      width: 26px; height: 26px; border-radius: 50%;
      background: var(--sage); color: #fff;
      font-size: 13px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .btn-dashboard {
      display: block; width: 100%;
      background: var(--sage); color: #fff;
      padding: 16px 32px; border-radius: 100px;
      font-size: 16px; font-weight: 700;
      text-decoration: none; text-align: center;
      transition: all 0.3s;
      box-shadow: 0 8px 40px rgba(0,184,148,0.35);
    }
    .btn-dashboard:hover { background: #059669; transform: translateY(-2px); }
    .success-footer {
      margin-top: 20px; font-size: 12px; color: #94A3B8;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h1 className="success-title">
            Bienvenue dans<br />Sèche 10 Semaines !
          </h1>
          <p className="success-sub">
            Votre abonnement est activé. Votre transformation commence maintenant.
          </p>

          <div className="success-steps">
            <h4>Vos prochaines étapes</h4>
            <ol>
              <li><span className="step-num">1</span>Configurez votre profil alimentaire</li>
              <li><span className="step-num">2</span>Recevez votre plan personnalisé</li>
              <li><span className="step-num">3</span>Commencez dès aujourd'hui</li>
            </ol>
          </div>

          <Link to="/setup" className="btn-dashboard">
            Configurer mon profil →
          </Link>
          <p className="success-footer">
            Un email de confirmation a été envoyé par Stripe. <br />
            Des questions ? <a href="mailto:contact@seche10semaines.fr" style={{color: 'var(--sage)'}}>contact@seche10semaines.fr</a>
          </p>
        </div>
      </div>
    </>
  );
};
