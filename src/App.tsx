import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
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
import { LoadingScreen } from './components/LoadingScreen';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen message="Vérification du compte..." />;

  if (!user) return <Navigate to="/login" />;

  // Only redirect to setup if we have a profile and onboarding is not complete
  // (if userProfile is null, profile is still loading — don't redirect yet)
  if (user && userProfile && !userProfile.onboardingComplete && location.pathname !== '/setup') {
    return <Navigate to="/setup" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<Success />} />
          <Route path="/guide" element={<Guide />} />
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
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
      </HashRouter>
    </AuthProvider>
  );
}
