import React from 'react';
import { Link } from 'react-router-dom';

export const CGV: React.FC = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    .legal-page { min-height: 100vh; background: #F8FAFC; font-family: 'DM Sans', sans-serif; color: #1E293B; }
    .legal-header { background: #071828; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
    .legal-header .logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; }
    .legal-header .logo span { color: #00B894; }
    .legal-header .back { font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none; }
    .legal-container { max-width: 720px; margin: 0 auto; padding: 40px 20px 80px; }
    .legal-container h1 { font-family: 'Instrument Serif', serif; font-size: 32px; color: #0F2C59; margin-bottom: 8px; }
    .legal-container .updated { font-size: 13px; color: #94A3B8; margin-bottom: 32px; }
    .legal-container h2 { font-family: 'Instrument Serif', serif; font-size: 20px; color: #0F2C59; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #E2E8F0; }
    .legal-container p, .legal-container li { font-size: 14px; line-height: 1.7; color: #475569; }
    .legal-container p { margin-bottom: 12px; }
    .legal-container ul { margin: 8px 0 12px 20px; }
    .legal-container li { margin-bottom: 4px; }
    .legal-container a { color: #00B894; }
    @media (min-width: 769px) { .legal-container { padding: 60px 24px 100px; } .legal-container h1 { font-size: 40px; } }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="legal-page">
        <header className="legal-header">
          <Link to="/" className="logo">Sèche<span>10</span>Semaines</Link>
          <Link to="/" className="back">← Retour</Link>
        </header>
        <div className="legal-container">
          <h1>Conditions Générales de Vente</h1>
          <p className="updated">Dernière mise à jour : 19 février 2026</p>

          <h2>Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent l'accès et l'utilisation du service
            « Sèche 10 Semaines », un programme de coaching nutritionnel digital personnalisé, accessible via
            l'application web seche10semaines.fr.
          </p>

          <h2>Article 2 — Prix</h2>
          <p>
            Le prix de l'abonnement est de <strong>29 € TTC par mois</strong> (tarif de lancement). Ce prix est
            susceptible d'évoluer ; le tarif applicable est celui en vigueur au moment de la souscription. Toute
            modification tarifaire sera communiquée à l'avance et ne s'appliquera qu'aux nouveaux abonnements ou
            renouvellements.
          </p>

          <h2>Article 3 — Abonnement</h2>
          <p>
            L'abonnement est <strong>mensuel et sans engagement</strong>. Il se renouvelle automatiquement chaque mois
            à la date anniversaire de la souscription, sauf résiliation par l'utilisateur avant la date de
            renouvellement.
          </p>

          <h2>Article 4 — Paiement</h2>
          <p>
            Le paiement est effectué par carte bancaire via la plateforme sécurisée <strong>Stripe</strong>
            (Stripe Payments Europe, Ltd.). Le prélèvement est automatique et mensuel. L'éditeur ne conserve
            aucune donnée bancaire, celles-ci étant gérées exclusivement par Stripe.
          </p>

          <h2>Article 5 — Droit de rétractation</h2>
          <p>
            Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de
            <strong> 14 jours</strong> à compter de la souscription pour exercer votre droit de rétractation,
            sans avoir à justifier de motif ni à payer de pénalités.
          </p>
          <p>
            Pour exercer ce droit, envoyez un email à{' '}
            <a href="mailto:contact@seche10semaines.fr">contact@seche10semaines.fr</a> avec votre demande
            de remboursement. Le remboursement sera effectué dans un délai de 14 jours suivant la réception
            de votre demande, via le même moyen de paiement utilisé lors de la souscription.
          </p>

          <h2>Article 6 — Résiliation</h2>
          <p>
            L'utilisateur peut résilier son abonnement <strong>à tout moment</strong>, directement depuis son
            espace personnel dans l'application ou par email à{' '}
            <a href="mailto:contact@seche10semaines.fr">contact@seche10semaines.fr</a>. La résiliation prend
            effet à la fin de la période en cours déjà payée. Aucun remboursement au prorata n'est dû pour
            la période entamée.
          </p>

          <h2>Article 7 — Accès au service</h2>
          <p>
            L'accès au service est <strong>100 % digital</strong> et disponible immédiatement après confirmation
            du paiement. Le service est accessible depuis tout appareil disposant d'un navigateur web et d'une
            connexion internet. L'éditeur s'engage à assurer une disponibilité maximale du service, sans
            toutefois garantir une accessibilité ininterrompue.
          </p>

          <h2>Article 8 — Responsabilité</h2>
          <p>
            Le programme Sèche 10 Semaines est un outil de coaching nutritionnel à vocation informative.
            Il <strong>ne se substitue en aucun cas à un avis médical</strong>. Il est recommandé de consulter
            un professionnel de santé avant de commencer tout programme nutritionnel, notamment en cas de
            pathologie, traitement médical en cours, ou antécédents médicaux.
          </p>
          <p>
            L'éditeur décline toute responsabilité quant aux résultats obtenus, ceux-ci dépendant de nombreux
            facteurs individuels (assiduité, état de santé, mode de vie, etc.).
          </p>

          <h2>Article 9 — Données personnelles</h2>
          <p>
            Les données personnelles collectées dans le cadre de l'utilisation du service sont traitées
            conformément à notre{' '}
            <Link to="/politique-confidentialite">Politique de Confidentialité</Link>. L'utilisateur est invité
            à en prendre connaissance.
          </p>

          <h2>Article 10 — Litiges</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à
            rechercher une solution amiable. À défaut, l'utilisateur peut recourir gratuitement au service de
            médiation de la consommation. Le tribunal compétent est celui de <strong>Montpellier</strong>.
          </p>

          <h2>Article 11 — Modification des CGV</h2>
          <p>
            L'éditeur se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront
            informés de toute modification substantielle par email ou notification dans l'application. La
            poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.
          </p>
        </div>
      </div>
    </>
  );
};
