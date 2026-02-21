const fs = require('fs');
const path = require('path');

const blogContent = fs.readFileSync('src/data/blogArticles.ts', 'utf8');
const seoContent = fs.readFileSync('src/data/seoArticles25.ts', 'utf8');
const rewriteContent = fs.readFileSync('src/data/seoArticlesRewrite.ts', 'utf8');

const articles = [];
const regex = /slug:\s*['"]([^'"]+)['"],\s*\n?\s*title:\s*['"]([^'"]+)['"]/g;
let m;
for (const content of [blogContent, seoContent, rewriteContent]) {
  regex.lastIndex = 0;
  while ((m = regex.exec(content)) !== null) {
    if (!articles.find(a => a.slug === m[1])) {
      articles.push({ slug: m[1], title: m[2] });
    }
  }
}

const metaRegex = /slug:\s*['"]([^'"]+)['"][\s\S]*?metaDescription:\s*['"]([^'"]+)['"]/g;
const metas = {};
for (const content of [blogContent, seoContent, rewriteContent]) {
  metaRegex.lastIndex = 0;
  while ((m = metaRegex.exec(content)) !== null) {
    metas[m[1]] = m[2];
  }
}

// Extract first 500 chars of content for each article (for static page body)
const contentRegex = /slug:\s*['"]([^'"]+)['"][\s\S]*?content:\s*`([\s\S]*?)`/g;
const contents = {};
for (const content of [blogContent, seoContent, rewriteContent]) {
  contentRegex.lastIndex = 0;
  while ((m = contentRegex.exec(content)) !== null) {
    contents[m[1]] = m[2].replace(/<[^>]+>/g, '').substring(0, 800).trim();
  }
}

const outDir = path.join('public', 'blog');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Also generate blog index
let blogIndexHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Blog Sèche 10 Semaines — Nutrition, Musculation et Perte de Gras</title>
  <meta name="description" content="Tous nos articles sur la sèche, la nutrition, la musculation et la perte de gras pour les hommes de 35 à 55 ans. Guides experts, conseils pratiques.">
  <link rel="canonical" href="https://seche10semaines.fr/blog/">
  <meta property="og:title" content="Blog Sèche 10 Semaines">
  <meta property="og:description" content="Articles experts sur la sèche, nutrition et musculation pour hommes 35-55 ans">
  <meta property="og:type" content="website">
  <meta http-equiv="refresh" content="0; url=https://seche10semaines.fr/#/blog">
</head>
<body>
  <h1>Blog Sèche 10 Semaines</h1>
  <p>Nutrition, musculation et perte de gras — guides experts pour hommes 35-55 ans</p>
  <ul>
`;

for (const article of articles) {
  const desc = metas[article.slug] || article.title;
  const bodyText = contents[article.slug] || desc;
  const safeTitle = article.title.replace(/"/g, '&quot;');
  const safeDesc = desc.replace(/"/g, '&quot;');
  const date = '2026-02-21';

  const schemaArticle = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": desc,
    "image": `https://seche10semaines.fr/blog-images/blog-img-${article.slug}.png`,
    "author": { "@type": "Organization", "name": "Sèche 10 Semaines", "url": "https://seche10semaines.fr" },
    "publisher": { "@type": "Organization", "name": "Sèche 10 Semaines", "logo": { "@type": "ImageObject", "url": "https://seche10semaines.fr/blog-images/blog-img-programme-seche-homme-guide-complet.png" } },
    "datePublished": date,
    "dateModified": date,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://seche10semaines.fr/blog/${article.slug}/` }
  });

  const faqItems = [
    { q: `Qu'est-ce que ${article.title.toLowerCase().includes('sèche') ? 'la sèche' : 'ce programme'} ?`, a: desc },
  ];
  const schemaFAQ = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle} | Sèche 10 Semaines</title>
  <meta name="description" content="${safeDesc}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="https://seche10semaines.fr/blog/${article.slug}/">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="https://seche10semaines.fr/blog-images/blog-img-${article.slug}.png">
  <meta property="og:url" content="https://seche10semaines.fr/blog/${article.slug}/">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="fr_FR">
  <meta property="article:published_time" content="${date}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="https://seche10semaines.fr/blog-images/blog-img-${article.slug}.png">
  <script type="application/ld+json">${schemaArticle}</script>
  <script type="application/ld+json">${schemaFAQ}</script>
  <meta http-equiv="refresh" content="0; url=https://seche10semaines.fr/#/blog/${article.slug}">
</head>
<body>
  <article>
    <h1>${article.title}</h1>
    <p><strong>${safeDesc}</strong></p>
    <img src="/blog-images/blog-img-${article.slug}.png" alt="${safeTitle}" width="800" height="450" loading="lazy">
    <div>${bodyText.substring(0, 500)}...</div>
    <p><a href="https://seche10semaines.fr/#/blog/${article.slug}">Lire l'article complet →</a></p>
  </article>
  <nav>
    <p><a href="https://seche10semaines.fr/blog/">Tous les articles</a> | <a href="https://seche10semaines.fr">Sèche 10 Semaines — 29€/mois</a></p>
  </nav>
</body>
</html>`;

  const articleDir = path.join(outDir, article.slug);
  if (!fs.existsSync(articleDir)) fs.mkdirSync(articleDir, { recursive: true });
  fs.writeFileSync(path.join(articleDir, 'index.html'), html);

  blogIndexHtml += `    <li><a href="/blog/${article.slug}/">${article.title}</a> — ${desc.substring(0, 100)}</li>\n`;
}

blogIndexHtml += `  </ul>
  <p><a href="https://seche10semaines.fr">Sèche 10 Semaines — Programme nutrition personnalisé 29€/mois</a></p>
</body>
</html>`;

// Write blog index
const blogIndexDir = path.join('public', 'blog');
fs.writeFileSync(path.join(blogIndexDir, 'index.html'), blogIndexHtml);

console.log(`Generated ${articles.length} static pages + blog index with Schema.org markup`);
