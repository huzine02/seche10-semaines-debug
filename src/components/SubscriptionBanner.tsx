import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const C = {
  sage: '#00B894', sageDark: '#059669', sageMuted: '#ECFDF5',
  ink: '#0F2C59', orange: '#F59E0B', red: '#EF4444',
  border: '#E2E8F0',
};

/**
 * Affiche une bannière si l'abonnement est inactif, en échec de paiement, ou annulé.
 * Invisible si l'abonnement est actif ou en trial.
 */
export const SubscriptionBanner: React.FC = () => {
  const { userProfile } = useAuth();
  const status = userProfile?.subscriptionStatus;

  // Pas de bannière si actif ou en trial
  if (!status || status === 'active' || status === 'trialing') return null;

  const configs: Record<string, { bg: string; border: string; color: string; icon: string; text: string; cta: string }> = {
    inactive: {
      bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8',
      icon: '🔒', text: 'Accédez au programme complet — 49€/mois, sans engagement.',
      cta: 'Commencer maintenant',
    },
    payment_failed: {
      bg: '#FEF2F2', border: '#FECACA', color: '#DC2626',
      icon: '⚠️', text: 'Votre paiement a échoué. Mettez à jour votre moyen de paiement pour continuer.',
      cta: 'Mettre à jour',
    },
    cancelling: {
      bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C',
      icon: '⏳', text: 'Votre abonnement sera annulé à la prochaine échéance. Vous conservez l\'accès jusqu\'à cette date.',
      cta: 'Réactiver',
    },
    cancelled: {
      bg: '#F8FAFC', border: '#E2E8F0', color: '#475569',
      icon: '❌', text: 'Votre abonnement est annulé. Réabonnez-vous pour retrouver l\'accès.',
      cta: 'Se réabonner',
    },
  };

  const cfg = configs[status] || configs.inactive;

  return (
    <div style={{
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: '12px',
      padding: '12px 16px',
      margin: '12px 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{cfg.icon}</span>
      <div style={{ flex: 1, fontSize: '13px', color: cfg.color, lineHeight: 1.5 }}>
        {cfg.text}
      </div>
      <Link
        to="/pricing"
        style={{
          background: C.sage,
          color: '#fff',
          padding: '7px 14px',
          borderRadius: '100px',
          fontSize: '12px',
          fontWeight: 700,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {cfg.cta}
      </Link>
    </div>
  );
};
