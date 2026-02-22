import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { SetupDiet } from './pages/SetupDiet';
import { Dashboard } from './pages/Dashboard';
import { Journal } from './pages/Journal';
import { Profile } from './pages/Profile';
import { Pricing } from './pages/Pricing';
import { Success } from './pages/Success';
import { Guide } from './pages/Guide';
import { NotFound } from './pages/NotFound';
import { Blog } from './pages/Blog';
import { BlogArticle } from './pages/BlogArticle';
import { MentionsLegales } from './pages/MentionsLegales';
import { CGV } from './pages/CGV';
import { PolitiqueConfidentialite } from './pages/PolitiqueConfidentialite';
import { APropos } from './pages/APropos';
import { LoadingScreen } from './components/LoadingScreen';
import { CookieBanner } from './components/CookieBanner';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireSub?: boolean }> = ({ children, requireSub = true }) => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen message="Vérification du compte..." />;

  if (!user) return <Navigate to="/login" />;

  // Wait for profile to load before deciding
  if (!userProfile) return <LoadingScreen message="Chargement du profil..." />;

  // Onboarding not done → setup first
  if (!userProfile.onboardingComplete && location.pathname !== '/setup') {
    return <Navigate to="/setup" />;
  }

  // Subscription check: block access if no active/trialing subscription
  if (requireSub && userProfile.onboardingComplete) {
    const sub = userProfile.subscriptionStatus;
    if (sub !== 'active' && sub !== 'trialing' && sub !== 'cancelling') {
      return <Navigate to="/pricing" />;
    }
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<ProtectedRoute requireSub={false}><Success /></ProtectedRoute>} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route
            path="/setup"
            element={
              <ProtectedRoute requireSub={false}>
                <SetupDiet />
              </ProtectedRoute>
            }
          />
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
