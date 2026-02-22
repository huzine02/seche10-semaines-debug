/**
 * Add FAQPage Schema JSON-LD to static blog HTML pages
 * Each article gets 3-5 relevant FAQ entries for Google Featured Snippets + AI citations
 */
const fs = require('fs');
const path = require('path');

// FAQ data per article slug (or category-based defaults)
const faqData = {
  // SÈCHE ARTICLES
  'programme-seche-homme-guide-complet': [
    { q: 'Combien de temps dure une sèche homme ?', a: 'Une sèche dure typiquement 8 à 12 semaines. Au-delà, les adaptations métaboliques (baisse de leptine, hausse du cortisol) rendent la perte de gras difficile. Le programme Sèche 10 Semaines est calibré sur 10 semaines pour cette raison.' },
    { q: 'Quel déficit calorique pour une sèche sans perdre de muscle ?', a: 'Un déficit de 300 à 500 kcal/jour est optimal, soit 0.5 à 1% du poids corporel par semaine (Helms et al., 2014). Au-delà, le ratio perte de muscle/graisse devient défavorable.' },
    { q: 'Combien de protéines par jour en sèche homme ?', a: 'En sèche, visez 1.8 à 2.7 g de protéines par kg de poids corporel par jour (Morton et al., 2018). Pour un homme de 85 kg, cela représente 153 à 230 g quotidiens.' },
  ],
  'comment-secher-sans-perdre-de-muscle': [
    { q: 'Peut-on sécher sans perdre de muscle ?', a: 'Oui, à condition de maintenir un apport protéique élevé (2.0-2.2 g/kg/jour), un déficit modéré (300-500 kcal), et de continuer la musculation. L\'étude de Garthe et al. (2011) montre qu\'un déficit lent préserve 35% plus de muscle qu\'un déficit rapide.' },
    { q: 'Faut-il continuer la musculation en sèche ?', a: 'Absolument. L\'entraînement en résistance est le signal principal qui dit à votre corps de conserver la masse musculaire. Réduisez le volume si nécessaire, mais maintenez l\'intensité (charges lourdes).' },
  ],
  'deficit-calorique-homme-calcul': [
    { q: 'Comment calculer son déficit calorique ?', a: 'Calculez d\'abord votre TDEE avec la formule de Mifflin-St Jeor : (10 × poids kg) + (6.25 × taille cm) - (5 × âge) + 5, multiplié par votre facteur d\'activité (1.2 à 1.725). Soustrayez ensuite 300-500 kcal pour obtenir votre cible en sèche.' },
    { q: 'Quel est le déficit calorique maximum recommandé ?', a: 'Ne dépassez pas 500-750 kcal de déficit quotidien, soit environ 1% de votre poids corporel perdu par semaine. Un déficit plus agressif augmente la perte musculaire de 35% (Garthe et al., 2011, Int J Sport Nutr Exerc Metab).' },
  ],
  'comment-calculer-ses-macros-pour-secher': [
    { q: 'Comment répartir ses macros en sèche ?', a: 'En sèche : protéines 2.0-2.2 g/kg, lipides 25-30% des calories, glucides = le reste. Pour un homme de 85 kg à 1800 kcal : ~185g protéines, 50g lipides, ~135g glucides.' },
    { q: 'Faut-il compter ses macros pour sécher ?', a: 'C\'est la méthode la plus efficace mais pas la seule. Les alternatives : méthode de l\'assiette (1/2 légumes, 1/4 protéines, 1/4 féculents) ou portions calibrées par la main.' },
  ],
  // SANTÉ MÉTABOLIQUE
  'prediabete-que-faire': [
    { q: 'Le prédiabète est-il réversible ?', a: 'Oui. L\'étude DPP (Knowler et al., 2002, NEJM) a démontré qu\'une modification du mode de vie réduit le risque de progression vers le diabète de 58%. Une perte de 5-7% du poids corporel suffit souvent à normaliser la glycémie.' },
    { q: 'Quels sont les seuils du prédiabète ?', a: 'Glycémie à jeun entre 1.00 et 1.25 g/L, ou HbA1c entre 5.7% et 6.4%, ou glycémie post-charge entre 1.40 et 1.99 g/L (critères ADA 2024).' },
    { q: 'Quelle alimentation pour le prédiabète ?', a: 'Réduisez les glucides raffinés, augmentez les fibres (30g/jour), priorisez les protéines et les graisses saines. L\'étude PREDIMED (2013, NEJM) a montré que le régime méditerranéen réduit le risque de diabète de 52%.' },
  ],
  'glycemie-a-jeun-elevee-causes-solutions': [
    { q: 'Quelle est la glycémie à jeun normale ?', a: 'Une glycémie à jeun normale est inférieure à 1.00 g/L (5.6 mmol/L). Entre 1.00 et 1.25 g/L, c\'est un prédiabète. Au-dessus de 1.26 g/L à deux reprises, c\'est un diabète (critères OMS/ADA).' },
    { q: 'Comment faire baisser sa glycémie à jeun naturellement ?', a: 'Les 5 leviers principaux : réduire les glucides raffinés, augmenter l\'activité physique (marche 15 min après les repas), perdre 5-7% du poids corporel, améliorer le sommeil (7-9h), et gérer le stress (le cortisol élève la glycémie).' },
  ],
  'hba1c-trop-elevee-que-faire': [
    { q: 'Comment faire baisser son HbA1c naturellement ?', a: 'L\'HbA1c reflète la glycémie moyenne sur 2-3 mois. Pour la réduire : restructurez vos repas (protéines + fibres d\'abord, glucides en dernier), faites de l\'exercice (aérobie + musculation = -0.89% d\'HbA1c selon Colberg 2016), et perdez du gras viscéral.' },
    { q: 'Quel taux d\'HbA1c est dangereux ?', a: 'HbA1c ≥ 6.5% = diabète. Entre 5.7% et 6.4% = prédiabète (zone d\'alerte réversible). Chaque augmentation de 1% de l\'HbA1c augmente le risque cardiovasculaire de 20% (Selvin et al., 2010, NEJM).' },
  ],
  'graisse-viscerale-danger-sante': [
    { q: 'Comment savoir si on a trop de graisse viscérale ?', a: 'Le tour de taille est le meilleur indicateur accessible. Au-dessus de 94 cm pour un homme ou 80 cm pour une femme, le risque métabolique augmente significativement (critères IDF). Au-dessus de 102 cm (homme), le risque est élevé.' },
    { q: 'Comment perdre la graisse viscérale ?', a: 'La graisse viscérale est la première à partir avec un déficit calorique modéré. Les leviers : déficit de 300-500 kcal/jour, exercice aérobie + musculation, réduction des glucides raffinés et de l\'alcool, amélioration du sommeil.' },
  ],
  'syndrome-metabolique-traitement-naturel': [
    { q: 'Qu\'est-ce que le syndrome métabolique ?', a: 'Le syndrome métabolique est défini par la présence d\'au moins 3 des 5 critères suivants : tour de taille > 94 cm (homme), triglycérides > 1.50 g/L, HDL < 0.40 g/L (homme), tension > 130/85, glycémie à jeun > 1.00 g/L (Grundy 2005, Circulation).' },
    { q: 'Le syndrome métabolique est-il réversible ?', a: 'Oui. Une perte de poids de 5-10%, combinée à 150 min d\'activité physique par semaine, peut normaliser les 5 critères. L\'étude DPP a montré une réduction de 58% du risque de progression.' },
  ],
  'insulino-resistance-perte-de-poids': [
    { q: 'L\'insulino-résistance empêche-t-elle de maigrir ?', a: 'L\'insulino-résistance rend la perte de poids plus difficile mais pas impossible. Elle favorise le stockage de graisse viscérale et augmente la faim. La solution : privilégier les protéines et les fibres, réduire les glucides à IG élevé, et pratiquer la musculation.' },
    { q: 'Comment savoir si on est insulino-résistant ?', a: 'Les signes : graisse abdominale tenace, fatigue après les repas, envies de sucre, acanthosis nigricans (zones de peau foncée). Le diagnostic se fait par le ratio HOMA-IR (glycémie à jeun × insuline à jeun / 22.5). Un ratio > 2.5 suggère une insulino-résistance.' },
  ],
  'comment-faire-baisser-glycemie-naturellement': [
    { q: 'Quel aliment fait baisser la glycémie rapidement ?', a: 'Le vinaigre de cidre (1-2 cuillères avant un repas) peut réduire les pics glycémiques de 20-34% (Johnston et al., 2004, Diabetes Care). Les fibres solubles (psyllium, avoine), les protéines et les graisses saines ralentissent aussi l\'absorption du glucose.' },
    { q: 'L\'exercice fait-il baisser la glycémie ?', a: 'Oui, significativement. 15-20 minutes de marche après un repas réduit les pics glycémiques de 30-50%. La musculation améliore la sensibilité à l\'insuline pendant 24-48h. La combinaison aérobie + musculation est la plus efficace (Colberg et al., 2016).' },
  ],
};

// Default FAQ for articles without specific ones
const defaultFaqSeche = [
  { q: 'Combien de protéines en sèche homme ?', a: 'Visez 1.8 à 2.7 g/kg/jour (Morton et al., 2018). Pour 85 kg : 153-230 g de protéines quotidiennes.' },
  { q: 'Quel déficit calorique pour sécher ?', a: 'Un déficit de 300-500 kcal/jour est optimal, soit 0.5-1% du poids corporel par semaine (Helms et al., 2014).' },
];

const defaultFaqSante = [
  { q: 'Ce programme remplace-t-il un suivi médical ?', a: 'Non. Sèche 10 Semaines est un outil complémentaire. Consultez votre médecin pour tout problème de santé métabolique (prédiabète, cholestérol, diabète).' },
  { q: 'L\'alimentation peut-elle vraiment inverser le prédiabète ?', a: 'Oui. L\'étude DPP (NEJM, 2002) a démontré qu\'une modification du mode de vie réduit le risque de diabète de 58%, soit presque 2× plus que la metformine.' },
];

const healthSlugs = [
  'prediabete-que-faire', 'glycemie-a-jeun-elevee-causes-solutions',
  'cholesterol-regime-alimentaire-homme', 'comment-faire-baisser-glycemie-naturellement',
  'triglycerides-eleves-alimentation', 'perdre-ventre-homme-50-ans-diabete',
  'hba1c-trop-elevee-que-faire', 'regime-prediabete-menu-semaine',
  'steatose-hepatique-alimentation', 'syndrome-metabolique-traitement-naturel',
  'tour-de-taille-homme-dangereux', 'graisse-viscerale-danger-sante',
  'insulino-resistance-perte-de-poids', 'comment-eviter-diabete-type-2',
  'bilan-lipidique-mauvais-que-manger', 'sport-et-diabete-type-2-programme',
  'indice-glycemique-bas-liste-aliments', 'omega-3-cholesterol-bienfaits',
  'rapport-triglycerides-hdl-calculer', 'taux-sucre-sang-normal-age',
];

const blogDir = path.join('public', 'blog');
const dirs = fs.readdirSync(blogDir).filter(d => fs.statSync(path.join(blogDir, d)).isDirectory());

let count = 0;
dirs.forEach(slug => {
  const htmlPath = path.join(blogDir, slug, 'index.html');
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Skip if already has FAQ schema
  if (html.includes('FAQPage')) return;
  
  // Get FAQ data
  const isHealth = healthSlugs.includes(slug);
  const faqs = faqData[slug] || (isHealth ? defaultFaqSante : defaultFaqSeche);
  
  // Build FAQ JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };
  
  // Also add BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://seche10semaines.fr/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://seche10semaines.fr/blog/" },
      { "@type": "ListItem", "position": 3, "name": slug.replace(/-/g, ' ') }
    ]
  };
  
  const schemaTag = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
  
  // Insert before </head>
  html = html.replace('</head>', `${schemaTag}\n</head>`);
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  count++;
  console.log(`  ✅ ${slug} (${faqs.length} FAQs + breadcrumbs)`);
});

console.log(`\n🎉 Added FAQ + Breadcrumb Schema to ${count} pages`);
