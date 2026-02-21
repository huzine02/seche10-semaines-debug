import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export const ReferralBanner: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralCode = user.uid.substring(0, 6).toUpperCase();
  const referralLink = `https://seche10semaines.fr/#/login?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = referralLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      border: '1px solid rgba(0,184,148,0.3)',
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>🎁</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#065F46' }}>Parrainez un ami</div>
          <div style={{ fontSize: 12, color: '#047857' }}>-50% pour lui, 1 mois offert pour vous</div>
        </div>
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 11,
        color: '#475569',
        wordBreak: 'break-all',
        marginBottom: 10,
        border: '1px solid #E2E8F0',
      }}>
        {referralLink}
      </div>
      <button
        onClick={handleCopy}
        style={{
          width: '100%',
          padding: '10px',
          background: copied ? '#059669' : '#00B894',
          color: '#fff',
          border: 'none',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {copied ? '✅ Lien copié !' : '📋 Copier le lien de parrainage'}
      </button>
    </div>
  );
};
