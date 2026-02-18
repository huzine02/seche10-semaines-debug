import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
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

  const redirectTo = new URLSearchParams(location.search).get('redirect');
  const afterLoginPath = redirectTo ? `/${redirectTo}` : '/dashboard';

  useEffect(() => {
    if (user) navigate(afterLoginPath);
  }, [user, navigate, afterLoginPath]);

  // (Pas de getRedirectResult - on utilise signInWithPopup)

  const handleAuthError = (err: unknown) => {
    const e = err as { code?: string; message?: string };
    if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
      setError('Email ou mot de passe incorrect.');
    } else if (e.code === 'auth/email-already-in-use') {
      setError('Cet email est déjà utilisé.');
    } else if (e.code === 'auth/weak-password') {
      setError('Mot de passe trop faible (6 caractères min).');
    } else {
      setError((e.message) || 'Une erreur est survenue.');
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
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', res.user.uid));
      if (!userDoc.exists()) {
        const profile = createInitialUserProfile(res.user);
        // @ts-ignore
        await setDoc(doc(db, 'users', res.user.uid), profile);
        navigate(redirectTo === 'pricing' ? '/pricing' : '/setup');
      } else {
        navigate(afterLoginPath);
      }
    } catch (err: unknown) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #071828 0%, #0F2C59 60%, #0a3d52 100%)',
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: '40px 20px',
      fontFamily: "'DM Sans', sans-serif",
    },
    logo: {
      fontFamily: "'Instrument Serif', serif",
      fontSize: '26px',
      color: '#fff',
      textDecoration: 'none' as const,
      marginBottom: '28px',
      display: 'block' as const,
      textAlign: 'center' as const,
    },
    card: {
      background: '#fff',
      borderRadius: '24px',
      padding: '40px 36px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
    },
    hint: {
      background: '#ECFDF5',
      border: '1px solid rgba(0,184,148,0.25)',
      borderRadius: '12px',
      padding: '12px 16px',
      fontSize: '13px',
      color: '#059669',
      textAlign: 'center' as const,
      marginBottom: '20px',
    },
    titleBlock: { textAlign: 'center' as const, marginBottom: '28px' },
    title: {
      fontFamily: "'Instrument Serif', serif",
      fontSize: '28px',
      color: '#0F2C59',
      marginBottom: '6px',
    },
    sub: { fontSize: '14px', color: '#94A3B8' },
    errorBox: {
      background: '#FEF2F2', border: '1px solid #FECACA',
      color: '#EF4444', borderRadius: '10px',
      padding: '12px 14px', fontSize: '13px',
      marginBottom: '16px', textAlign: 'center' as const,
    },
    successBox: {
      background: '#ECFDF5', border: '1px solid rgba(0,184,148,0.3)',
      color: '#059669', borderRadius: '10px',
      padding: '12px 14px', fontSize: '13px',
      marginBottom: '16px', textAlign: 'center' as const,
    },
    form: { display: 'flex' as const, flexDirection: 'column' as const, gap: '12px' },
    input: {
      width: '100%', padding: '14px 16px',
      background: '#F8FAFC', border: '1.5px solid #E2E8F0',
      borderRadius: '12px', fontSize: '15px',
      fontFamily: "'DM Sans', sans-serif",
      color: '#1E293B', outline: 'none',
    },
    btnPrimary: {
      width: '100%', padding: '15px',
      background: '#0F2C59', color: '#fff',
      border: 'none', borderRadius: '100px',
      fontSize: '16px', fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif",
      cursor: 'pointer', marginTop: '4px',
    },
    btnGreen: {
      width: '100%', padding: '15px',
      background: '#00B894', color: '#fff',
      border: 'none', borderRadius: '100px',
      fontSize: '16px', fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif",
      cursor: 'pointer', marginTop: '4px',
      boxShadow: '0 6px 30px rgba(0,184,148,0.35)',
    },
    divider: {
      display: 'flex' as const, alignItems: 'center' as const, gap: '12px',
      margin: '20px 0', color: '#94A3B8',
      fontSize: '12px', fontWeight: 600,
      textTransform: 'uppercase' as const, letterSpacing: '0.08em',
    },
    dividerLine: { flex: 1, height: '1px', background: '#E2E8F0' },
    btnGoogle: {
      width: '100%', padding: '13px',
      background: '#fff', border: '1.5px solid #E2E8F0',
      borderRadius: '100px', fontSize: '15px', fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      cursor: 'pointer', display: 'flex' as const,
      alignItems: 'center' as const, justifyContent: 'center' as const,
      gap: '10px', color: '#1E293B',
    },
    links: {
      marginTop: '20px', display: 'flex' as const,
      flexDirection: 'column' as const, gap: '8px',
      textAlign: 'center' as const,
    },
    linkBtn: {
      fontSize: '14px', fontWeight: 600,
      color: '#00B894', background: 'none', border: 'none',
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    },
    linkBtnMuted: {
      fontSize: '13px', fontWeight: 500,
      color: '#94A3B8', background: 'none', border: 'none',
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    },
  };

  const titles = {
    login: { title: 'Espace Membre', sub: 'Connectez-vous pour accéder au programme.' },
    register: { title: 'Créer mon compte', sub: 'Commencez votre transformation maintenant.' },
    reset: { title: 'Mot de passe oublié', sub: 'Entrez votre email, on vous envoie un lien.' },
  };

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700&display=swap');`}</style>

      <Link to="/" style={s.logo}>
        Sèche<span style={{ color: '#00B894' }}>10</span>Semaines
      </Link>

      <div style={s.card}>

        {redirectTo === 'pricing' && (
          <div style={s.hint}>
            🔒 Créez un compte pour finaliser votre abonnement <strong style={{ color: '#0F2C59' }}>49€/mois</strong>
          </div>
        )}

        <div style={s.titleBlock}>
          <div style={s.title}>{titles[view].title}</div>
          <div style={s.sub}>{titles[view].sub}</div>
        </div>

        {error && <div style={s.errorBox}>⚠️ {error}</div>}
        {success && <div style={s.successBox}>✅ {success}</div>}

        <form onSubmit={handleAuth} style={s.form}>
          {view === 'register' && (
            <input style={s.input} type="text" placeholder="Votre prénom"
              value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input style={s.input} type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          {view !== 'reset' && (
            <input style={s.input} type="password" placeholder="Mot de passe (6 caractères min)"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          )}
          <button
            type="submit"
            disabled={loading}
            style={view === 'register' ? s.btnGreen : s.btnPrimary}
          >
            {loading ? '⏳ Chargement...' : (
              view === 'login' ? 'Se connecter →' :
              view === 'register' ? 'Créer mon compte →' :
              'Envoyer le lien de réinitialisation'
            )}
          </button>
        </form>

        {view !== 'reset' && (
          <>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              ou
              <div style={s.dividerLine} />
            </div>
            <button type="button" onClick={handleGoogle} style={s.btnGoogle}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google" style={{ width: '20px', height: '20px' }} />
              Continuer avec Google
            </button>
          </>
        )}

        <div style={s.links}>
          {view === 'login' && (
            <>
              <button onClick={() => setView('register')} style={s.linkBtn}>
                Pas encore membre ? Créer un compte
              </button>
              <button onClick={() => setView('reset')} style={s.linkBtnMuted}>
                Mot de passe oublié ?
              </button>
            </>
          )}
          {view === 'register' && (
            <button onClick={() => setView('login')} style={s.linkBtn}>
              Déjà membre ? Se connecter
            </button>
          )}
          {view === 'reset' && (
            <button onClick={() => setView('login')} style={s.linkBtnMuted}>
              ← Retour à la connexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
