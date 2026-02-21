const fs = require('fs');
const path = require('path');

// Read article slugs and titles
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

// Also extract metaDescription
const metaRegex = /slug:\s*['"]([^'"]+)['"][\s\S]*?metaDescription:\s*['"]([^'"]+)['"]/g;
const metas = {};
for (const content of [blogContent, seoContent, rewriteContent]) {
  metaRegex.lastIndex = 0;
  while ((m = metaRegex.exec(content)) !== null) {
    metas[m[1]] = m[2];
  }
}

const outDir = path.join('public', 'blog');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const article of articles) {
  const desc = metas[article.slug] || article.title;
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${article.title} | Sèche 10 Semaines</title>
  <meta name="description" content="${desc}">
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="https://seche10semaines.fr/blog-images/blog-img-${article.slug}.png">
  <meta property="og:url" content="https://seche10semaines.fr/#/blog/${article.slug}">
  <meta property="og:type" content="article">
  <link rel="canonical" href="https://seche10semaines.fr/#/blog/${article.slug}">
  <meta http-equiv="refresh" content="0; url=https://seche10semaines.fr/#/blog/${article.slug}">
</head>
<body>
  <h1>${article.title}</h1>
  <p>${desc}</p>
  <p>Redirection en cours vers <a href="https://seche10semaines.fr/#/blog/${article.slug}">l'article complet</a>...</p>
  <p><a href="https://seche10semaines.fr/#/blog">Voir tous les articles</a> | <a href="https://seche10semaines.fr">Sèche 10 Semaines</a></p>
</body>
</html>`;

  const articleDir = path.join(outDir, article.slug);
  if (!fs.existsSync(articleDir)) fs.mkdirSync(articleDir, { recursive: true });
  fs.writeFileSync(path.join(articleDir, 'index.html'), html);
}

console.log(`Generated ${articles.length} static pages in public/blog/`);
