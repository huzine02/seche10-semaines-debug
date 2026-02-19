import React from 'react';
import { Link } from 'react-router-dom';

export const PolitiqueConfidentialite: React.FC = () => {
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
    .legal-container strong { color: #1E293B; }
    .data-table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    .data-table th, .data-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #E2E8F0; }
    .data-table th { background: #F1F5F9; color: #0F2C59; font-weight: 600; font-size: 12px; }
    .data-table td { color: #475569; }
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
          <h1>Politique de Confidentialité</h1>
          <p className="updated">Dernière mise à jour : 19 février 2026</p>

          <p>
            La présente politique de confidentialité décrit comment vos données personnelles sont collectées,
            utilisées et protégées dans le cadre de l'utilisation du service Sèche 10 Semaines, conformément au
            Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            [Nom à compléter] — Entreprise Individuelle (en cours de création)<br />
            5 bis rue de la Bouvine, 34130 Candillargues, France<br />
            Email : <a href="mailto:contact@seche10semaines.fr">contact@seche10semaines.fr</a>
          </p>

          <h2>2. Données collectées</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Données</th>
                <th>Sensibilité</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Identité</td>
                <td>Email, nom, prénom</td>
                <td>Standard</td>
              </tr>
              <tr>
                <td>Données biométriques</td>
                <td>Poids, taille, tour de taille</td>
                <td>Sensible (art. 9 RGPD)</td>
              </tr>
              <tr>
                <td>Données de santé</td>
                <td>Glycémie, cholestérol</td>
                <td>Sensible (art. 9 RGPD)</td>
              </tr>
              <tr>
                <td>Photos</td>
                <td>Photos de progression</td>
                <td>Sensible</td>
              </tr>
              <tr>
                <td>Paiement</td>
                <td>Données de transaction (via Stripe)</td>
                <td>Standard</td>
              </tr>
            </tbody>
          </table>

          <p>
            <strong>⚠️ Données sensibles :</strong> Les données biométriques, de santé et les photos de progression
            constituent des données sensibles au sens de l'article 9 du RGPD. Leur traitement nécessite votre
            <strong> consentement explicite</strong>, recueilli lors de l'onboarding.
          </p>

          <h2>3. Base légale du traitement</h2>
          <ul>
            <li><strong>Consentement explicite</strong> (art. 6.1.a et 9.2.a RGPD) : pour les données sensibles (santé, biométrie, photos)</li>
            <li><strong>Exécution du contrat</strong> (art. 6.1.b RGPD) : pour la personnalisation du programme et la gestion de l'abonnement</li>
          </ul>

          <h2>4. Finalités du traitement</h2>
          <ul>
            <li>Personnalisation du programme nutritionnel (calcul TDEE, macros, repas)</li>
            <li>Suivi de progression (poids, mensurations, marqueurs de santé)</li>
            <li>Gestion de l'abonnement et du paiement</li>
            <li>Communication liée au service (emails transactionnels)</li>
          </ul>

          <h2>5. Durée de conservation</h2>
          <p>
            Vos données sont conservées pendant toute la durée de votre abonnement, puis <strong>3 ans</strong> après
            la fin de celui-ci (obligation légale de conservation). Passé ce délai, vos données sont supprimées ou
            anonymisées. Vous pouvez demander la suppression anticipée à tout moment.
          </p>

          <h2>6. Sous-traitants</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Sous-traitant</th>
                <th>Service</th>
                <th>Localisation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Firebase (Google LLC)</td>
                <td>Authentification, base de données, hébergement</td>
                <td>États-Unis (clauses contractuelles types)</td>
              </tr>
              <tr>
                <td>Stripe Payments Europe, Ltd.</td>
                <td>Paiement sécurisé</td>
                <td>Irlande / États-Unis</td>
              </tr>
              <tr>
                <td>Vercel Inc.</td>
                <td>Hébergement de l'application</td>
                <td>États-Unis</td>
              </tr>
            </tbody>
          </table>

          <h2>7. Transferts hors Union Européenne</h2>
          <p>
            Certaines données sont transférées vers les États-Unis via nos sous-traitants (Google LLC, Vercel Inc.).
            Ces transferts sont encadrés par des <strong>clauses contractuelles types</strong> (CCT) approuvées par la
            Commission Européenne, conformément à l'article 46.2 du RGPD.
          </p>

          <h2>8. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et en recevoir une copie</li>
            <li><strong>Droit de rectification</strong> : corriger vos données inexactes ou incomplètes</li>
            <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible</li>
            <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
            <li><strong>Droit au retrait du consentement</strong> : retirer votre consentement à tout moment</li>
          </ul>
          <p>
            Pour exercer vos droits, envoyez un email à{' '}
            <a href="mailto:contact@seche10semaines.fr">contact@seche10semaines.fr</a>. Nous répondrons dans un
            délai de 30 jours.
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale
            de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
          </p>

          <h2>9. Cookies</h2>
          <p>
            Le site utilise uniquement des <strong>cookies techniques nécessaires</strong> au fonctionnement du service :
          </p>
          <ul>
            <li><strong>Firebase Authentication</strong> : cookie de session pour maintenir votre connexion (fonctionnel, nécessaire)</li>
          </ul>
          <p>
            Aucun cookie publicitaire, analytique ou de tracking n'est utilisé. Ces cookies techniques ne nécessitent
            pas de consentement au titre de l'article 82 de la loi Informatique et Libertés.
          </p>

          <h2>10. Modification de la politique</h2>
          <p>
            Cette politique peut être mise à jour à tout moment. En cas de modification substantielle, vous serez
            informé par email ou notification dans l'application. La date de dernière mise à jour est indiquée en
            haut de cette page.
          </p>
        </div>
      </div>
    </>
  );
};
