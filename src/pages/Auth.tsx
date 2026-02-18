import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { createInitialUserProfile } from '../utils/onboarding';
import { useAuth } from '../AuthContext';

export const Auth: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lire le redirect dans l'URL (ex: ?redirect=pricing)
  const redirectTo = new URLSearchParams(location.search).get('redirect');
  const afterLoginPath = redirectTo ? `/${redirectTo}` : '/dashboard';

  useEffect(() => {
    if (user) navigate(afterLoginPath);
  }, [user, navigate, afterLoginPath]);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const res = await getRedirectResult(auth);
        if (res) {
          const userDoc = await getDoc(doc(db, 'users', res.user.uid));
          if (!userDoc.exists()) {
            const profile = createInitialUserProfile(res.user);
            // @ts-ignore
            await setDoc(doc(db, 'users', res.user.uid), profile);
            navigate('/setup');
          } else {
            navigate(afterLoginPath);
          }
        }
      } catch (err: unknown) {
        handleAuthError(err);
      }
    };
    checkRedirect();
  }, [navigate, afterLoginPath]);

  const handleAuthError = (err: unknown) => {
    const e = err as { code?: string; message?: string };
    if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
      setError('Email ou mot de passe incorrect.');
    } else if (e.code === 'auth/email-already-in-use') {
      setError('Cet email est déjà utilisé.');
    } else if (e.code === 'auth/weak-password') {
      setError('Mot de passe trop faible (6 caractères min).');
    } else if (e.code === 'permission-denied') {
      setError('Erreur de permissions Firestore.');
    } else {
      setError(e.message || 'Une erreur est survenue.');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (view === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Email envoyé ! Vérifiez vos spams.');
        setView('login');
      } else if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        navigate(afterLoginPath);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const profile = createInitialUserProfile(res.user, name);
        // @ts-ignore
        await setDoc(doc(db, 'users', res.user.uid), profile);
        // Après inscription, aller au pricing si redirect=pricing, sinon setup
        navigate(redirectTo === 'pricing' ? '/pricing' : '/setup');
      }
    } catch (err: unknown) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setError('');
      await signInWithRedirect(auth, googleProvider);
    } catch (err: unknown) {
      handleAuthError(err);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
    :root {
      --ink: #0F2C59; --ink-deep: #071828;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --red: #EF4444; --red-light: #FEF2F2;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

    .auth-page {
      min-height: 100vh;
      background: linear-gradient(160deg, var(--ink-deep) 0%, var(--ink) 60%, #0a3d52 100%);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 40px 20px;
    }
    .auth-logo {
      font-family: 'Instrument Serif', serif;
      font-size: 26px; color: #fff;
      text-decoration: none; margin-bottom: 32px;
      display: block; text-align: center;
    }
    .auth-logo span { color: var(--sage); }
    .auth-card {
      background: #fff; border-radius: 24px;
      padding: 40px 36px; width: 100%; max-width: 420px;
      box-shadow: 0 40px 100px rgba(0,0,0,0.4);
      animation: slide-up 0.4s ease both;
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .auth-title {
      font-family: 'Instrument Serif', serif;
      font-size: 26px; color: var(--ink);
      text-align: center; margin-bottom: 6px;
    }
    .auth-sub {
      font-size: 14px; color: var(--text-light);
      text-align: center; margin-bottom: 28px;
    }

    .auth-error {
      background: var(--red-light); border: 1px solid #FECACA;
      color: var(--red); border-radius: 10px;
      padding: 12px 14px; font-size: 13px;
      margin-bottom: 16px; text-align: center;
    }
    .auth-success {
      background: var(--sage-muted); border: 1px solid rgba(0,184,148,0.3);
      color: var(--sage-light); border-radius: 10px;
      padding: 12px 14px; font-size: 13px;
      margin-bottom: 16px; text-align: center;
    }

    .auth-form { display: flex; flex-direction: column; gap: 12px; }
    .auth-input {
      width: 100%; padding: 14px 16px;
      background: #F8FAFC; border: 1.5px solid var(--border);
      border-radius: 12px; font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      color: var(--text); outline: none;
      transition: border-color 0.2s;
    }
    .auth-input:focus { border-color: var(--ink); background: #fff; }
    .auth-input::placeholder { color: var(--text-light); }

    .btn-auth {
      width: 100%; padding: 15px;
      background: var(--ink); color: #fff;
      border: none; border-radius: 100px;
      font-size: 16px; font-weight: 700;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer; transition: all 0.3s;
      margin-top: 4px;
    }
    .btn-auth:hover:not(:disabled) { background: var(--sage); transform: translateY(-1px); }
    .btn-auth:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-auth.green {
      background: var(--sage);
      box-shadow: 0 6px 30px rgba(0,184,148,0.35);
      animation: pulse-btn 2.5s ease-in-out infinite;
    }
    .btn-auth.green:hover:not(:disabled) { background: var(--sage-light); }
    @keyframes pulse-btn {
      0%, 100% { box-shadow: 0 6px 30px rgba(0,184,148,0.35); }
      50% { box-shadow: 0 6px 50px rgba(0,184,148,0.55); }
    }

    .auth-divider {
      display: flex; align-items: center; gap: 12px;
      margin: 20px 0; color: var(--text-light); font-size: 12px;
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
    }
    .auth-divider::before, .auth-divider::after {
      content: ''; flex: 1; height: 1px; background: var(--border);
    }

    .btn-google {
      width: 100%; padding: 13px;
      background: #fff; border: 1.5px solid var(--border);
      border-radius: 100px; font-size: 15px; font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      color: var(--text);
    }
    .btn-google:hover { background: #F8FAFC; border-color: #CBD5E1; }
    .btn-google img { width: 20px; height: 20px; }

    .auth-links { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; text-align: center; }
    .auth-link {
      font-size: 14px; font-weight: 600;
      color: var(--sage); background: none; border: none;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      text-decoration: none; transition: opacity 0.2s;
    }
    .auth-link:hover { opacity: 0.75; }
    .auth-link.muted { color: var(--text-light); font-weight: 500; font-size: 13px; }

    .auth-pricing-hint {
      background: var(--sage-muted); border: 1px solid rgba(0,184,148,0.2);
      border-radius: 12px; padding: 12px 16px;
      font-size: 13px; color: var(--sage-light);
      text-align: center; margin-bottom: 20px;
    }
    .auth-pricing-hint strong { color: var(--ink); }
  `;

  const titles = {
    login: { title: 'Espace Membre', sub: 'Connectez-vous pour accéder au programme.' },
    register: { title: 'Créer mon compte', sub: 'Commencez votre transformation maintenant.' },
    reset: { title: 'Mot de passe oublié', sub: 'Entrez votre email, on vous envoie un lien.' },
  };

  return (
    <>
      <style>{styles}</style>
      <div className-auth-page style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #071828 0%, #0F2C59 60%, #0a3d52 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <Link to="/" style={{ fontFamily: "'Instrument Serif', serif", fontSize: '26px', color: '#fff', textDecoration: 'none', marginBottom: '32px', display: 'block', textAlign: 'center' }}>
          Sèche<span style={{ color: '#00B894' }}>10</span>Semaines
        </Link>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '40px 36px', width: '100%', maxWidth: '420px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', animation: 'slide-up 0.4s ease both' }}>

          {/* Hint si redirect depuis pricing */}
          {redirectTo === 'pricing' && (
            <div className="auth-pricing-hint">
              🔒 Créez un compte gratuit pour finaliser votre abonnement <strong>49€/mois</strong>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '26px', color: '#0F2C59', marginBottom: '6px' }}>
              {titles[view].title}
            </div>
            <div style={{ fontSize: '14px', color: '#94A3B8' }}>{titles[view].sub}</div>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}
          {success && <div className="auth-success">✅ {success}</div>}

          <form onSubmit={handleAuth} className="auth-form">
            {view === 'register' && (
              <input className="auth-input" type="text" placeholder="Votre prénom" value={name}
                onChange={(e) => setName(e.target.value)} required />
            )}
            <input className="auth-input" type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
            {view !== 'reset' && (
              <input className="auth-input" type="password" placeholder="Mot de passe (6 caractères min)" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            )}
            <button
              type="submit"
              disabled={loading}
              className={`btn-auth ${view === 'register' ? 'green' : ''}`}
            >
              {loading ? '⏳ Chargement...' : (
                view === 'login' ? 'Se connecter →' :
                view === 'register' ? 'Créer mon compte →' :
                'Envoyer le lien'
              )}
            </button>
          </form>

          {view !== 'reset' && (
            <>
              <div className="auth-divider">ou</div>
              <button type="button" onClick={handleGoogle} className="btn-google">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                Continuer avec Google
              </button>
            </>
          )}

          <div className="auth-links">
            {view === 'login' && (
              <>
                <button onClick={() => setView('register')} className="auth-link">
                  Pas encore membre ? Créer un compte
                </button>
                <button onClick={() => setView('reset')} className="auth-link muted">
                  Mot de passe oublié ?
                </button>
              </>
            )}
            {view === 'register' && (
              <button onClick={() => setView('login')} className="auth-link">
                Déjà membre ? Se connecter
              </button>
            )}
            {view === 'reset' && (
              <button onClick={() => setView('login')} className="auth-link muted">
                ← Retour à la connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
