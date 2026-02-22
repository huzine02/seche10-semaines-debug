/**
 * Generate static HTML snapshots for key SPA pages
 * These are served to crawlers (Google, Bing, AI bots) who can't execute JS
 * The React app takes over (hydration) once JS loads
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://seche10semaines.fr';

const pages = [
  {
    path: 'index.html',
    title: 'Sèche 10 Semaines — Programme Nutrition Personnalisé par Algorithme | Sèche + Santé Métabolique',
    description: 'Programme de sèche musculaire et santé métabolique 100% personnalisé par algorithme. Hommes 35-55 ans. Glycémie, cholestérol, perte de gras. Essai gratuit 7 jours.',
    canonical: SITE + '/',
    content: `
      <h1>Sèche 10 Semaines — Programme Nutrition Personnalisé</h1>
      <p>Perdez du gras. Reprenez votre santé en main. Un programme <strong>100% personnalisé</strong> par algorithme pour les hommes de 35 à 55 ans.</p>
      
      <h2>Sèche musculaire ou santé métabolique — votre programme sur mesure</h2>
      <p>Notre algorithme basé sur l'équation de <strong>Mifflin-St Jeor</strong> calcule vos macros exactes. Cyclage calorique training/repos pour préserver votre masse musculaire tout en brûlant le gras.</p>
      
      <h2>Comment ça marche</h2>
      <ol>
        <li><strong>Votre bilan en 5 min</strong> — Âge, poids, profil glycémique, mode de vie. L'algorithme calcule votre plan unique.</li>
        <li><strong>Suivez votre journal</strong> — Vos 3 repas sont prêts chaque jour, compléments listés, entraînement détaillé.</li>
        <li><strong>Votre corps change</strong> — Suivez votre courbe de poids, tour de taille, marqueurs de santé semaine après semaine.</li>
      </ol>
      
      <h2>Fondations scientifiques</h2>
      <ul>
        <li><strong>Équation de Mifflin-St Jeor (1990)</strong> — Référence mondiale pour le métabolisme de base</li>
        <li><strong>Étude DPP (NEJM, 2002)</strong> — Modification du mode de vie réduit le risque de diabète de 58%</li>
        <li><strong>Helms et al. (2014)</strong> — 2.0-2.2g/kg protéines en déficit pour préserver la masse musculaire</li>
        <li><strong>Cyclage calorique (Byrne 2018)</strong> — Alterner jours training/repos pour optimiser la perte de gras</li>
      </ul>
      
      <h2>Pour qui ?</h2>
      <p>Hommes de 35 à 55+ ans qui veulent :</p>
      <ul>
        <li>Perdre du gras viscéral de manière durable</li>
        <li>Améliorer leur santé métabolique (glycémie, cholestérol, tour de taille)</li>
        <li>Suivre un plan concret basé sur la science</li>
      </ul>
      
      <h2>Tarif</h2>
      <p><strong>29€/mois</strong> — Essai gratuit 7 jours. Sans engagement. Garantie satisfait ou remboursé 14 jours.</p>
      <p>Plan personnalisé + journal quotidien + programme entraînement + suivi santé métabolique + Score Santé.</p>
      
      <h2>Blog</h2>
      <p>Découvrez nos <a href="/blog/">50 articles scientifiques</a> sur la sèche musculaire et la santé métabolique.</p>
      
      <p>⚕️ <strong>Avertissement santé :</strong> Ce programme ne remplace pas un avis médical. Consultez votre médecin avant de commencer.</p>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Sèche 10 Semaines — Programme Nutrition Personnalisé",
      "description": "Programme de sèche personnalisé par algorithme pour hommes 35-55 ans. Menus adaptés, suivi métabolique, résultats en 10 semaines.",
      "brand": { "@type": "Brand", "name": "Sèche 10 Semaines" },
      "offers": {
        "@type": "Offer",
        "price": "29",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": "https://seche10semaines.fr/"
      }
    }
  },
  {
    path: 'a-propos/index.html',
    title: 'À Propos — Sèche 10 Semaines | Notre Méthodologie Scientifique',
    description: 'Découvrez la méthodologie scientifique derrière Sèche 10 Semaines. Mifflin-St Jeor, études DPP, Helms 2014. Programme créé par un passionné, validé par la recherche.',
    canonical: SITE + '/a-propos/',
    content: `
      <h1>À propos de Sèche 10 Semaines</h1>
      <p>Un programme de nutrition scientifique, créé par un passionné, validé par la recherche.</p>
      <h2>Pourquoi ce programme existe</h2>
      <p>Les régimes ne marchent pas. Pas parce que les gens manquent de volonté, mais parce que la plupart des programmes ignorent la science du métabolisme.</p>
      <h2>Ce qui nous différencie</h2>
      <ul>
        <li>100% personnalisé par algorithme (Mifflin-St Jeor)</li>
        <li>Cyclage calorique automatique training/repos</li>
        <li>Approche santé métabolique (glycémie, cholestérol)</li>
        <li>Fondé sur la recherche (études peer-reviewed)</li>
      </ul>
      <p>Contact : <a href="mailto:contact@seche10semaines.fr">contact@seche10semaines.fr</a></p>
    `,
    schema: null
  }
];

// Template HTML
function generateHTML(page) {
  const schemaTag = page.schema 
    ? `<script type="application/ld+json">${JSON.stringify(page.schema)}</script>` 
    : '';
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <link rel="canonical" href="${page.canonical}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${page.canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Sèche 10 Semaines">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  ${schemaTag}
</head>
<body>
  <div id="root">
    ${page.content}
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

// Generate
console.log('📄 Generating static page snapshots...\n');

pages.forEach(page => {
  const fullPath = path.join('public', page.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  // Don't overwrite the main index.html (Vite uses it)
  if (page.path === 'index.html') {
    // For homepage, create a special noscript version that Vercel serves to bots
    const botPath = path.join('public', '_prerender', 'index.html');
    const botDir = path.dirname(botPath);
    if (!fs.existsSync(botDir)) fs.mkdirSync(botDir, { recursive: true });
    fs.writeFileSync(botPath, generateHTML(page), 'utf8');
    console.log(`  ✅ _prerender/index.html (for crawlers)`);
  } else {
    fs.writeFileSync(fullPath, generateHTML(page), 'utf8');
    console.log(`  ✅ ${page.path}`);
  }
});

console.log('\n🎉 Static pages generated!');
