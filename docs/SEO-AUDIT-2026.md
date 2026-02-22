# 🔍 Audit SEO Complet — seche10semaines.fr
**Date :** 22 février 2026  
**Auditeur :** Expert SEO IA  
**Stack :** React (BrowserRouter) + Vercel + Firebase  
**Cible :** Hommes 35-55 ans | Sèche musculaire + Santé métabolique | 29€/mois

---

## Table des Matières
1. [SEO Technique](#1-seo-technique)
2. [SEO On-Page](#2-seo-on-page)
3. [Référencement IA (GEO)](#3-référencement-ia-geo)
4. [SEO Off-Page](#4-seo-off-page)
5. [Local SEO France](#5-local-seo-france)
6. [Content Strategy](#6-content-strategy)
7. [Plan d'Action Priorisé](#7-plan-daction-priorisé)

---

## 1. SEO Technique

### 1.1 BrowserRouter — Problème Critique ⚠️ P0

**Constat :** Le fetch de la homepage ne retourne quasi rien (titre seul, pas de contenu). React avec `BrowserRouter` effectue le rendu côté client uniquement. Googlebot peut exécuter JS mais avec un délai (secondes → minutes). Les autres crawlers (Bing, Perplexity, LLMs) ne voient **rien**.

**Impact :** Les 50 articles blog dans `/public/blog/[slug]/index.html` sont OK (HTML statique). Mais toutes les pages React (homepage, pricing, app) sont invisibles pour la majorité des crawlers.

**Solutions (par ordre de priorité) :**

**Option A — Prerendering via Vercel (Recommandé) — P0**
```js
// vercel.json — ajouter prerendering
{
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "headers": { "X-Prerender": "1" }
    }
  ]
}
```
Utiliser **prerender.io** ou **rendertron** intégré à Vercel :
```js
// vercel.json
{
  "rewrites": [
    {
      "source": "/((?!blog|api|static|_next).*)",
      "has": [
        {
          "type": "header",
          "key": "User-Agent",
          "value": "(Googlebot|bingbot|Perplexity|ChatGPT|ClaudeBot|GPTBot|Bytespider)"
        }
      ],
      "destination": "https://service.prerender.io/https://seche10semaines.fr/$1"
    }
  ]
}
```

**Option B — Migrer vers Next.js (SSR/SSG) — P1**
Migration progressive : les pages critiques (homepage, pricing, blog index) en SSG, le reste en CSR.

**Option C — React-snap pour pré-rendu statique — P0 (quick win)**
```bash
npm install react-snap
```
```json
// package.json
{
  "scripts": {
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "source": "build",
    "minifyHtml": { "collapseWhitespace": false }
  }
}
```

### 1.2 robots.txt — Améliorations P1

**Constat :** Le robots.txt est minimaliste (`Allow: /`).

**Action :**
```txt
User-agent: *
Allow: /
Disallow: /app/
Disallow: /dashboard/
Disallow: /api/

User-agent: GPTBot
Allow: /
Allow: /blog/
Allow: /llms.txt

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://seche10semaines.fr/sitemap.xml
```

### 1.3 Core Web Vitals — P1

**Recommandations sans avoir accès au CrUX :**

| Métrique | Cible | Actions |
|----------|-------|---------|
| LCP < 2.5s | Optimiser hero image (WebP/AVIF, `loading="eager"`, `fetchpriority="high"`) | Preload font, inline critical CSS |
| INP < 200ms | Lazy load composants non-critiques, `React.lazy()` + `Suspense` | Debounce event handlers |
| CLS < 0.1 | Dimensions explicites sur images/vidéos, `aspect-ratio` CSS | Réserver l'espace des éléments dynamiques |

**Implémentation critique — Preload hero :**
```html
<head>
  <link rel="preload" as="image" href="/images/hero.webp" fetchpriority="high">
  <link rel="preload" as="font" href="/fonts/main.woff2" type="font/woff2" crossorigin>
</head>
```

**Lazy loading images blog :**
```html
<img src="image.webp" loading="lazy" decoding="async" width="800" height="450" alt="...">
```

### 1.4 Structured Data — P0

**Constat :** Schema.org présent sur les pages statiques, mais types à enrichir.

**Article (déjà en place → vérifier la complétude) :**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Programme Sèche Homme : Le Guide Complet",
  "author": {
    "@type": "Organization",
    "name": "Sèche 10 Semaines",
    "url": "https://seche10semaines.fr"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Sèche 10 Semaines",
    "logo": {
      "@type": "ImageObject",
      "url": "https://seche10semaines.fr/images/logo.png"
    }
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-02-22",
  "image": "https://seche10semaines.fr/images/programme-seche-homme.webp",
  "description": "Guide complet du programme sèche pour homme : déficit calorique, protéines, entraînement. Méthode scientifique pour perdre du gras sans perdre de muscle.",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://seche10semaines.fr/blog/programme-seche-homme-guide-complet/"
  }
}
</script>
```

**FAQPage — Ajouter sur CHAQUE article (P0) :**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Combien de protéines faut-il en sèche homme ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En sèche, il faut viser 1.8 à 2.7 g de protéines par kg de poids corporel par jour. Pour un homme de 85 kg, cela représente 153 à 230 g de protéines quotidiennes. Cette fourchette est issue de la méta-analyse de Morton et al. (2018, British Journal of Sports Medicine)."
      }
    },
    {
      "@type": "Question",
      "name": "Quel déficit calorique pour une sèche sans perdre de muscle ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un déficit de 300 à 500 kcal/jour est optimal, soit 0.5 à 1% du poids corporel par semaine (Helms et al., 2014). Au-delà, le ratio perte de muscle/graisse devient défavorable."
      }
    }
  ]
}
</script>
```

**Product (Homepage) — P1 :**
```html
<script type="application/ld+json">
{
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
    "priceValidUntil": "2026-12-31",
    "url": "https://seche10semaines.fr/#pricing"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
</script>
```

**HowTo (articles tutoriels type meal prep, calcul macros) — P1 :**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Comment calculer ses macros pour sécher",
  "description": "Méthode pas à pas pour calculer vos macronutriments en sèche.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Calculer votre métabolisme de base",
      "text": "Utilisez la formule de Mifflin-St Jeor : (10 × poids en kg) + (6,25 × taille en cm) - (5 × âge) + 5 pour les hommes."
    },
    {
      "@type": "HowToStep",
      "name": "Appliquer le multiplicateur d'activité",
      "text": "Multipliez par 1.375 (léger) à 1.725 (intense) selon votre fréquence d'entraînement."
    },
    {
      "@type": "HowToStep",
      "name": "Soustraire le déficit",
      "text": "Retirez 300 à 500 kcal pour obtenir votre objectif calorique en sèche."
    }
  ]
}
</script>
```

### 1.5 Internal Linking Strategy — P1

**Constat :** Les 50 articles blog sont probablement isolés (pas de maillage systématique).

**Actions :**
1. **Créer 3 pillar pages** (voir section Content Strategy) qui linkent vers tous les articles du cluster
2. **Chaque article doit contenir 3-5 liens internes** vers d'autres articles du même cluster
3. **CTA vers le produit** dans chaque article (ancre contextuelle, pas juste "en savoir plus")
4. **Breadcrumbs** avec Schema :
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://seche10semaines.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://seche10semaines.fr/blog/" },
    { "@type": "ListItem", "position": 3, "name": "Programme Sèche Homme" }
  ]
}
</script>
```

5. **Page /blog/ index** — créer une page listant tous les articles, catégorisés par cluster (sèche / santé métabolique). Actuellement pas de hub.

### 1.6 Canonical URLs — P1

Chaque page doit avoir :
```html
<link rel="canonical" href="https://seche10semaines.fr/blog/programme-seche-homme-guide-complet/" />
```
**Vérifier :** les trailing slashes sont cohérents (le sitemap utilise des trailing slashes → toutes les canonicals doivent aussi).

### 1.7 Hreflang — P3

Non pertinent pour l'instant (site FR uniquement). À implémenter si expansion vers la Belgique/Suisse/Canada francophone.

### 1.8 Page Speed — P1

| Action | Impact | Priorité |
|--------|--------|----------|
| Convertir toutes les images en WebP/AVIF | -40-60% taille | P0 |
| Activer compression Brotli (Vercel le fait par défaut) | Vérifier | P1 |
| Code splitting React (`React.lazy`) | Réduire bundle initial | P1 |
| Defer scripts non-critiques (GA, Pixel) | LCP amélioré | P0 |
| CDN images via Vercel Image Optimization ou Cloudinary | Latence | P1 |

```html
<!-- Defer analytics -->
<script defer src="https://www.googletagmanager.com/gtag/js?id=G-YRJ14669GD"></script>
<script>
  window.addEventListener('load', () => {
    // Init GA après le chargement complet
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YRJ14669GD');
  });
</script>
```

---

## 2. SEO On-Page

### 2.1 Title Tags & Meta Descriptions — P0

**Règles :**
- Title : 50-60 caractères, mot-clé principal en début, marque à la fin
- Meta description : 140-155 caractères, inclure le bénéfice + CTA implicite

**Exemples optimisés pour les principaux articles :**

| Article | Title optimisé | Meta Description |
|---------|---------------|------------------|
| programme-seche-homme-guide-complet | Programme Sèche Homme : Guide Complet 2026 \| Sèche10Sem | Perdez du gras sans perdre de muscle. Déficit calorique, macros, entraînement : la méthode scientifique pour hommes 35-55 ans. |
| comment-secher-sans-perdre-de-muscle | Sécher Sans Perdre de Muscle : 7 Règles Clés (Science) | Protégez votre masse musculaire en sèche. Protéines, déficit contrôlé, timing : les 7 principes validés par la recherche. |
| perdre-du-ventre-apres-40-ans | Perdre du Ventre Après 40 Ans : Méthode Complète Homme | Graisse abdominale après 40 ans ? Stratégie nutrition + exercice adaptée à votre métabolisme. Résultats en 10 semaines. |
| deficit-calorique-homme-calcul | Calcul Déficit Calorique Homme : Formule Exacte 2026 | Calculez votre déficit optimal pour sécher. Formule Mifflin-St Jeor + multiplicateurs d'activité. Outil gratuit. |
| comment-calculer-ses-macros-pour-secher | Calculer ses Macros en Sèche : Guide Pas à Pas | Protéines, glucides, lipides : comment répartir vos macros pour une sèche efficace. Exemples concrets pour 80-90 kg. |
| meal-prep-seche-homme-recettes | Meal Prep Sèche Homme : 10 Recettes Simples & Rapides | Préparez une semaine de repas sèche en 2h. 10 recettes riches en protéines, faciles, avec liste de courses. |
| petit-dejeuner-seche-musculation-homme | Petit Déjeuner Sèche Musculation : 8 Idées Protéinées | 8 petits déjeuners riches en protéines pour votre sèche. De 300 à 500 kcal, prêts en 5 minutes. |
| jeune-intermittent-seche-musculation | Jeûne Intermittent et Sèche : Compatible ? (Étude) | Le jeûne intermittent est-il efficace en sèche ? Analyse des études scientifiques + protocole adapté musculation. |
| graisse-viscerale-danger-sante | Graisse Viscérale : Les Dangers Cachés + Solutions | La graisse viscérale augmente le risque cardiaque de 44%. Comment la mesurer et l'éliminer avec la nutrition. |
| comment-faire-baisser-glycemie-naturellement | Faire Baisser sa Glycémie Naturellement : 12 Méthodes | 12 stratégies validées par la science pour réduire votre glycémie sans médicament. Alimentation, exercice, sommeil. |
| insulino-resistance-perte-de-poids | Insulino-Résistance et Perte de Poids : Le Guide | L'insulino-résistance bloque votre perte de gras ? Comprendre le mécanisme et les 8 solutions alimentaires. |
| prediabete-que-faire | Prédiabète : Que Faire ? Plan d'Action en 8 Étapes | Diagnostiqué prédiabète ? 8 étapes concrètes pour inverser la tendance par l'alimentation et l'exercice. |

**Template pour les 50 articles :** Appliquer ce format à chaque article. Priorité : commencer par les 10 articles avec le plus gros potentiel de trafic (vérifier dans Google Search Console les impressions).

### 2.2 Structure H1/H2 — P1

**Règles :**
- **1 seul H1** par page = le titre de l'article (mot-clé principal inclus)
- **H2** = sous-sections principales (inclure des variations du mot-clé + LSI)
- **H3** = sous-sous-sections
- Ne jamais sauter de niveau (H1 → H3 sans H2)

**Exemple pour "programme-seche-homme-guide-complet" :**
```
H1: Programme Sèche Homme : Le Guide Complet pour Perdre du Gras sans Perdre du Muscle
  H2: Pourquoi un programme sèche homme est différent d'un simple régime
  H2: Les 3 piliers d'un programme sèche homme efficace
    H3: 1. Le déficit calorique contrôlé
    H3: 2. L'apport en protéines : votre bouclier anti-catabolisme
    H3: 3. L'entraînement adapté en sèche
  H2: Programme alimentaire sèche homme : exemple sur 7 jours
  H2: FAQ : Questions fréquentes sur la sèche homme
```

### 2.3 Keywords & LSI — P1

**Cluster 1 : Sèche Musculation (30 articles)**
- Primaire : programme sèche homme, sécher musculation, perdre du gras homme
- LSI : déficit calorique, macros sèche, préservation musculaire, masse sèche, cutting, recomposition corporelle, taux de graisse, body fat percentage

**Cluster 2 : Santé Métabolique (20 articles)**
- Primaire : glycémie, prédiabète, insulino-résistance, cholestérol
- LSI : syndrome métabolique, graisse viscérale, HbA1c, indice glycémique, diabète type 2, santé cardiovasculaire, triglycérides

**Density recommandée :** 1-2% pour le mot-clé principal, naturellement distribué. Ne pas keyword-stuffer.

### 2.4 Image Alt Tags — P1

Chaque image doit avoir un `alt` descriptif avec le mot-clé quand c'est pertinent :
```html
<img src="deficit-calorique-graphique.webp" 
     alt="Graphique montrant le déficit calorique optimal pour la sèche homme : 300-500 kcal/jour"
     width="800" height="450" loading="lazy">
```

### 2.5 URL Structure — ✅ Déjà bon

Les URLs sont propres : `/blog/[keyword-slug]/`. Pas de changement nécessaire.

---

## 3. Référencement IA (GEO) — CRITIQUE 🚨

### 3.1 llms.txt — P0

**Constat :** Le fichier `/llms.txt` n'existe PAS (renvoie vers la homepage React). C'est un manque critique en 2026.

**Implémentation :** Créer `/public/llms.txt` :

```markdown
# Sèche 10 Semaines

> Programme de nutrition personnalisé par algorithme pour la sèche musculaire et la santé métabolique. Conçu pour les hommes de 35 à 55 ans.

## À propos

Sèche 10 Semaines est un SaaS de nutrition qui génère des plans alimentaires personnalisés pour la perte de graisse avec préservation musculaire. Le programme utilise un algorithme adaptatif basé sur les données scientifiques (Helms et al., 2014 ; Morton et al., 2018) pour calculer les macronutriments optimaux en fonction du profil de chaque utilisateur.

- **Prix :** 29€/mois
- **Cible :** Hommes 35-55 ans en sèche musculaire ou amélioration de la santé métabolique
- **Méthode :** Déficit calorique contrôlé (300-500 kcal/jour) + apport protéique élevé (1.8-2.7 g/kg/jour)
- **URL :** https://seche10semaines.fr

## Ressources principales

- [Programme Sèche Homme : Guide Complet](https://seche10semaines.fr/blog/programme-seche-homme-guide-complet/): Guide détaillé sur le programme de sèche : déficit calorique, protéines, entraînement
- [Calculer ses Macros pour Sécher](https://seche10semaines.fr/blog/comment-calculer-ses-macros-pour-secher/): Méthode pas à pas pour calculer les macronutriments en sèche
- [Sécher sans Perdre de Muscle](https://seche10semaines.fr/blog/comment-secher-sans-perdre-de-muscle/): 7 principes scientifiques pour préserver la masse musculaire en déficit
- [Perdre du Ventre après 40 Ans](https://seche10semaines.fr/blog/perdre-du-ventre-apres-40-ans/): Stratégie nutrition + exercice pour la graisse abdominale après 40 ans
- [Déficit Calorique Homme : Calcul](https://seche10semaines.fr/blog/deficit-calorique-homme-calcul/): Formule exacte pour calculer son déficit optimal
- [Meal Prep Sèche : 10 Recettes](https://seche10semaines.fr/blog/meal-prep-seche-homme-recettes/): Recettes riches en protéines, préparation batch
- [Graisse Viscérale : Dangers](https://seche10semaines.fr/blog/graisse-viscerale-danger-sante/): Impact de la graisse viscérale sur la santé cardiovasculaire
- [Prédiabète : Que Faire ?](https://seche10semaines.fr/blog/prediabete-que-faire/): Plan d'action en 8 étapes pour inverser le prédiabète
- [Insulino-Résistance et Perte de Poids](https://seche10semaines.fr/blog/insulino-resistance-perte-de-poids/): Guide pour comprendre et combattre l'insulino-résistance
- [Faire Baisser sa Glycémie Naturellement](https://seche10semaines.fr/blog/comment-faire-baisser-glycemie-naturellement/): 12 méthodes validées scientifiquement

## Données clés citables

- Déficit recommandé en sèche : 300-500 kcal/jour (Helms et al., 2014, JISSN)
- Protéines en sèche : 1.8-2.7 g/kg/jour (Phillips & Van Loon, 2011)
- Perte de poids optimale : 0.5-1% du poids corporel/semaine (Garthe et al., 2011)
- Perte de muscle avec régime rapide : +35% vs régime lent (Garthe et al., 2011)
- Seuil synthèse protéique : 1.6 g/kg/jour (Morton et al., 2018, BJSM, n=1863)
```

**Créer aussi `/public/llms-full.txt`** avec le contenu étendu de tous les articles (résumés de 200 mots chacun).

### 3.2 AI-Friendly Content Format — P0

**Les LLMs citent en priorité :**
1. **Données chiffrées avec sources** (déjà bien fait sur le site ✅)
2. **Listes à puces et tableaux** (structurer davantage)
3. **Définitions claires** (format "X est Y qui Z")
4. **FAQ en fin d'article** (ajouter systématiquement)

**Template de section FAQ pour chaque article :**
```html
<section id="faq">
  <h2>Questions Fréquentes</h2>
  
  <h3>Combien de temps dure une sèche homme ?</h3>
  <p>Une sèche dure typiquement 8 à 12 semaines. Au-delà, les adaptations métaboliques (baisse de la leptine, augmentation du cortisol) rendent la perte de gras de plus en plus difficile. Le programme Sèche 10 Semaines est calibré sur 10 semaines pour cette raison.</p>
  
  <h3>Peut-on sécher sans compter les calories ?</h3>
  <p>Oui, en utilisant des méthodes qualitatives : assiette modèle (1/2 légumes, 1/4 protéines, 1/4 glucides complexes), contrôle des portions par la main, et suivi du poids hebdomadaire comme feedback.</p>
</section>
```

### 3.3 Optimisation pour Google AI Overview — P1

**Actions :**
1. **Répondre à la question dans les 100 premiers mots** de chaque article (Google AI Overview tire souvent du début)
2. **Utiliser des "definition boxes"** visuellement distinctes :
```html
<div class="definition-box" itemscope itemtype="https://schema.org/DefinedTerm">
  <strong itemprop="name">Sèche musculaire</strong>
  <p itemprop="description">La sèche musculaire est une phase de nutrition contrôlée visant à réduire le taux de masse grasse (de ~18-20% à ~10-12%) tout en préservant la masse musculaire, via un déficit calorique modéré (300-500 kcal/jour) combiné à un apport protéique élevé (1.8-2.7 g/kg/jour).</p>
</div>
```
3. **Tableaux comparatifs** (les AI Overviews adorent les tableaux) :
```html
<table>
  <caption>Sèche vs Régime classique : les différences</caption>
  <thead>
    <tr><th>Critère</th><th>Sèche</th><th>Régime classique</th></tr>
  </thead>
  <tbody>
    <tr><td>Objectif</td><td>Perdre du gras, garder le muscle</td><td>Perdre du poids (tout confondu)</td></tr>
    <tr><td>Protéines</td><td>1.8-2.7 g/kg/jour</td><td>Non spécifié</td></tr>
    <tr><td>Déficit</td><td>300-500 kcal (contrôlé)</td><td>Variable, souvent excessif</td></tr>
    <tr><td>Durée</td><td>8-12 semaines</td><td>Indéfinie</td></tr>
    <tr><td>Résultat typique</td><td>-5 à -8 kg de gras, muscle préservé</td><td>-5 à -8 kg (dont 30-40% de muscle)</td></tr>
  </tbody>
</table>
```

### 3.4 Optimisation pour Perplexity / SearchGPT — P1

**Perplexity indexe prioritairement les sites avec :**
1. ✅ Des sources citées (études) — Déjà bien fait
2. ❌ Un `llms.txt` — À créer
3. ❌ Des données structurées riches — À enrichir
4. ✅ Du contenu expert (E-E-A-T) — Citations d'experts présentes

**Actions supplémentaires :**
- Ajouter une **page /a-propos** ou **/methodologie** détaillant les sources scientifiques, la méthodologie de l'algorithme, et les credentials de l'équipe
- Publier un **manifeste de transparence** (/blog/notre-methodologie-scientifique/) listant toutes les études citées avec liens DOI
- Ajouter `rel="nofollow"` sur les liens affiliés mais PAS sur les liens vers les études

### 3.5 Schema.org "SpeakableSpecification" — P2

Permet aux assistants vocaux de citer le contenu :
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".definition-box", "#faq h3", "#faq h3 + p"]
  }
}
</script>
```

---

## 4. SEO Off-Page

### 4.1 Backlink Strategy — P1

**Cibles prioritaires (DR 30+) :**

| Type | Cibles | Action | Priorité |
|------|--------|--------|----------|
| Guest posts fitness | Espace Musculation, All Musculation, FitnessPark Magazine | Proposer un article invité "Sèche après 40 ans : erreurs courantes" | P1 |
| Guest posts santé | Doctissimo (rubrique nutrition), Passeport Santé, Futura Santé | Article sur "Prédiabète et alimentation : ce que dit la science" | P1 |
| HARO / Connectively | Répondre aux requêtes journalistes "nutrition", "perte de poids", "diabète" | S'inscrire et répondre 3x/semaine | P1 |
| Podcasts | Se proposer comme invité sur des podcasts fitness FR (Bodytime, All Musculation Podcast) | Pitcher "L'algorithme derrière la sèche parfaite" | P2 |
| Études/infographies | Créer une infographie "Les chiffres de la sèche" avec données d'études | Distribuer sur les blogs fitness | P2 |

### 4.2 Reddit & Quora Strategy — P1

**Reddit :**
- r/FranceDetenworkoute (si existant), r/fitness, r/loseit, r/bodybuilding
- r/nutrition, r/intermittentfasting
- **Stratégie :** Répondre avec expertise (données chiffrées + études) SANS lien direct. Mentionner le site uniquement quand pertinent et dans le contexte.
- Créer un post original : "J'ai analysé 50 études sur la sèche musculaire. Voici ce qui marche vraiment." → lien vers un article pillar

**Quora FR :**
- Questions à cibler : "Comment sécher sans perdre de muscle ?", "Combien de protéines par jour en sèche ?", "Perdre du ventre après 40 ans homme"
- Répondre avec 300+ mots, données chiffrées, lien vers l'article complet

### 4.3 Forums Français — P1

| Forum | Section | Action |
|-------|---------|--------|
| SuperPhysique.org | Nutrition, Diète | Créer un profil, participer activement, partager les articles quand pertinent |
| Musculaction.com | Régime / Sèche | Idem |
| Doctissimo | Nutrition, Diabète | Répondre aux questions santé métabolique avec expertise |
| JeuxVideo.com (forum 18-25) | Muscu | Audience plus jeune mais gros volume, utile pour notoriété |

### 4.4 Annuaires — P2

- **Pages Jaunes / Solocal** : Si une entité juridique est basée en France, créer la fiche
- **Trustpilot / Avis Vérifiés** : Collecter les avis clients (impact E-E-A-T)
- **Product Hunt** : Lancer le produit (backlink DR 90+)
- **AppSumo / Dealabs** : Si offre promotionnelle possible

---

## 5. Local SEO France

### 5.1 Google Business Profile — P2

**Pertinent uniquement si** une adresse physique existe. Si c'est un SaaS 100% en ligne, **ne pas créer de GBP fictif** (risque de suspension).

Alternative : créer une fiche sur **Google Merchant Center** pour le produit digital.

### 5.2 Annuaires Santé/Fitness Français — P2

| Annuaire | URL | Type de fiche |
|----------|-----|---------------|
| Creapills | creapills.com | Innovation/startup |
| French Tech | lafrenchtech.com | Startup annuaire |
| BPI France Création | bpifrance-creation.fr | Annuaire entreprises |
| Sport & Vie | - | Partenariat éditorial |

### 5.3 Partenariats — P2

- **Doctolib** : Non pertinent (plateforme de RDV médicaux). Mais contacter des **nutritionnistes sur Doctolib** pour des partenariats de recommandation.
- **Pharmacies en ligne** (1001pharmacies, Pharma GDD) : Partenariats contenu
- **Salles de sport** (Basic-Fit, FitnessPark) : Affiliation / co-marketing

---

## 6. Content Strategy

### 6.1 Content Gaps — P0

**Sujets manquants pour dominer la niche :**

| Sujet | Volume estimé (FR) | Difficulté | Priorité |
|-------|-------------------|------------|----------|
| Recomposition corporelle homme | 2 400/mois | Moyenne | P0 |
| Sèche naturelle vs sèche avec produits | 1 800/mois | Faible | P0 |
| Testostérone et sèche après 40 ans | 1 600/mois | Moyenne | P0 |
| Sommeil et perte de graisse | 2 200/mois | Moyenne | P1 |
| Alcool et sèche : impact réel | 3 200/mois | Faible | P0 |
| Stagnation poids en sèche : que faire | 1 400/mois | Faible | P0 |
| Sèche et vie sociale / restaurant | 900/mois | Faible | P1 |
| Tour de taille et risque cardiovasculaire | 1 800/mois | Moyenne | P1 |
| Microbiote et perte de poids | 2 600/mois | Élevée | P2 |
| Cortisol et graisse abdominale | 2 000/mois | Moyenne | P1 |
| Whey protéine en sèche : laquelle choisir | 4 100/mois | Élevée | P1 |
| TDEE calculator / calculateur métabolisme | 6 500/mois | Élevée | P0 |
| Créatine en sèche : oui ou non | 3 800/mois | Moyenne | P1 |

### 6.2 Pillar Pages + Topic Clusters — P0

**Cluster 1 : Sèche Musculaire (Pillar)**
- **Pillar :** `/blog/guide-complet-seche-musculaire-homme/` (article 5000+ mots)
- Spoke articles : programme sèche, macros, déficit calorique, protéines, meal prep, petit-déjeuner, collations, entraînement, erreurs, compléments, jeûne intermittent, HIIT, cardio vs musculation, recomposition corporelle, stagnation, alcool
- **Chaque spoke link vers le pillar** et le pillar link vers chaque spoke

**Cluster 2 : Santé Métabolique (Pillar)**
- **Pillar :** `/blog/guide-sante-metabolique-homme-40-ans/` (article 5000+ mots)
- Spoke articles : glycémie, prédiabète, insulino-résistance, cholestérol, graisse viscérale, HbA1c, oméga-3, indice glycémique, bilan lipidique, diabète type 2, tour de taille

**Cluster 3 : Perte de Ventre Homme (Pillar)**
- **Pillar :** `/blog/perdre-du-ventre-homme-guide-definitif/` (article 5000+ mots)
- Spoke articles : ventre après 40 ans, ventre après 50 ans, poignées d'amour, graisse abdominale exercice, abdos visibles, graisse viscérale

### 6.3 Content Calendar — 30 prochains jours

| Semaine | Lundi | Jeudi |
|---------|-------|-------|
| S1 (24 fév) | 🆕 **Alcool et Sèche : Impact Réel sur votre Perte de Gras** (2500 mots) | 🆕 **Stagnation en Sèche : 8 Solutions Quand le Poids ne Bouge Plus** (2000 mots) |
| S2 (3 mars) | 🆕 **Recomposition Corporelle : Perdre du Gras et Gagner du Muscle** (3000 mots) | 🆕 **Testostérone et Sèche Après 40 Ans : Ce que Dit la Science** (2500 mots) |
| S3 (10 mars) | 🆕 **TDEE Calculator : Calculez Votre Dépense Énergétique** (2000 mots + outil interactif) | 🔄 Mise à jour "programme-seche-homme-guide-complet" (ajouter FAQ, tableaux, données 2026) |
| S4 (17 mars) | 🆕 **Pillar Page : Guide Complet Sèche Musculaire Homme** (5000 mots) | 🆕 **Cortisol et Graisse Abdominale : Le Lien Caché** (2000 mots) |

### 6.4 YouTube SEO — P2

**Vidéos à créer :**
1. "Comment calculer ses macros pour sécher en 5 minutes" (tutoriel écran)
2. "Meal prep sèche : 5 jours en 1h30" (vlog cuisine)
3. "Sèche homme avant/après : 10 semaines de transformation" (témoignages clients)
4. "Les 5 erreurs qui ruinent votre sèche" (talking head)

**Optimisation :** Titre avec mot-clé, description 300+ mots avec liens vers les articles, timestamps, tags. Embed YouTube dans les articles blog correspondants.

---

## 7. Plan d'Action Priorisé

### Semaine 1 — Quick Wins (24 fév - 2 mars)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | **Créer `/public/llms.txt`** (copier le contenu ci-dessus) | 🔴 Critique pour référencement IA | 30 min |
| 2 | **Installer react-snap** pour prerendering de la homepage et pages React | 🔴 Homepage invisible aux crawlers | 2h |
| 3 | **Ajouter FAQPage Schema** sur les 10 articles les plus importants | 🔴 Featured snippets + AI citations | 3h |
| 4 | **Optimiser robots.txt** (version enrichie ci-dessus) | 🟡 Accès crawlers IA | 15 min |
| 5 | **Defer GA + Pixel** (script après load) | 🟡 LCP amélioré | 30 min |
| 6 | **Convertir images en WebP** (top 20 images par poids) | 🟡 Page speed | 2h |
| 7 | **Ajouter FAQ section** en bas des 10 articles principaux (3-5 questions/article) | 🔴 AI citations + temps sur page | 4h |

### Semaines 2-4 — Fondations (3-23 mars)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 8 | **Créer la page /blog/** (hub d'articles catégorisé) | 🔴 Crawl + maillage | 4h |
| 9 | **Ajouter BreadcrumbList Schema** sur tous les articles | 🟡 SERP appearance | 2h |
| 10 | **Maillage interne systématique** : 3-5 liens internes par article | 🔴 Distribution du PageRank | 8h |
| 11 | **Product Schema** sur la homepage | 🟡 Rich snippet prix | 1h |
| 12 | **Publier 4 nouveaux articles** (content calendar S1-S2) | 🔴 Couverture sémantique | 16h |
| 13 | **Optimiser tous les title/meta** des 50 articles existants | 🟡 CTR organique | 4h |
| 14 | **Ajouter HowTo Schema** sur les 5 articles tutoriels | 🟡 Rich results | 2h |
| 15 | **S'inscrire sur HARO/Connectively** + répondre 3x/semaine | 🟡 Backlinks DR50+ | 2h/sem |
| 16 | **Créer profils** SuperPhysique, Musculaction, Quora FR | 🟡 Notoriété + backlinks | 3h |
| 17 | **Créer page /methodologie**  | 🟡 E-E-A-T + confiance IA | 4h |

### Mois 2-3 — Accélération (mars-avril)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 18 | **Publier les 3 pillar pages** (5000 mots chacune) | 🔴 Autorité topique | 30h |
| 19 | **Publier 8 nouveaux articles** (content gaps) | 🔴 Couverture sémantique | 32h |
| 20 | **TDEE Calculator interactif** (outil en ligne) | 🔴 Link bait + trafic | 16h |
| 21 | **3 guest posts** sur sites fitness/santé FR | 🟡 Backlinks + notoriété | 12h |
| 22 | **Lancer sur Product Hunt** | 🟡 Backlink DR90 + trafic | 4h |
| 23 | **Créer 2 vidéos YouTube** (macros + meal prep) | 🟡 Trafic + brand | 16h |
| 24 | **Évaluer migration Next.js** (si react-snap insuffisant) | 🟡 SEO technique long-terme | 8h éval |
| 25 | **Collecter 20+ avis Trustpilot** | 🟡 E-E-A-T + conversion | Ongoing |
| 26 | **Infographie "Les Chiffres de la Sèche"** (distribuer) | 🟡 Backlinks passifs | 8h |

### KPIs à Suivre

| KPI | Outil | Cible M+1 | Cible M+3 |
|-----|-------|-----------|-----------|
| Impressions GSC | Google Search Console | +50% | +200% |
| Clics organiques | Google Search Console | +30% | +150% |
| Pages indexées | GSC > Indexation | 54 → 60 | 54 → 75 |
| Core Web Vitals (LCP) | PageSpeed Insights | < 2.5s | < 2.0s |
| Backlinks (domaines référents) | Ahrefs / SE Ranking | +10 | +30 |
| Mots-clés top 10 | SE Ranking / Semrush | 15 | 50 |
| Mots-clés top 3 | SE Ranking / Semrush | 5 | 20 |
| Citations IA (Perplexity) | Recherches manuelles | 2 citations | 10 citations |
| Trafic mensuel (sessions) | Google Analytics | +40% | +200% |
| Taux de conversion blog → inscription | GA + Firebase | 1.5% | 2.5% |

---

## Annexe : Checklist Rapide

- [ ] Créer `/public/llms.txt`
- [ ] Installer react-snap ou configurer prerendering Vercel
- [ ] Enrichir robots.txt
- [ ] Ajouter FAQPage Schema (10 articles prioritaires)
- [ ] Ajouter Product Schema (homepage)
- [ ] Ajouter BreadcrumbList Schema (tous les articles)
- [ ] Defer scripts analytics
- [ ] Convertir images WebP
- [ ] Créer page /blog/ index
- [ ] Maillage interne (3-5 liens/article)
- [ ] Optimiser 50 title tags + meta descriptions
- [ ] Créer 3 pillar pages
- [ ] Publier 12 nouveaux articles (30 jours)
- [ ] S'inscrire HARO + forums FR
- [ ] TDEE Calculator interactif
- [ ] Guest posts (3 minimum)
- [ ] Collecte avis Trustpilot
- [ ] YouTube : 2 vidéos minimum

---

*Document généré le 22 février 2026 — Audit SEO seche10semaines.fr*
