const fs = require('fs');
const path = require('path');

const blogContent = fs.readFileSync('src/data/blogArticles.ts', 'utf8');
const seoContent = fs.readFileSync('src/data/seoArticles25.ts', 'utf8');
const rewriteContent = fs.readFileSync('src/data/seoArticlesRewrite.ts', 'utf8');

const slugs = [];
const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let m;
for (const content of [blogContent, seoContent, rewriteContent]) {
  slugRegex.lastIndex = 0;
  while ((m = slugRegex.exec(content)) !== null) {
    if (!slugs.includes(m[1])) slugs.push(m[1]);
  }
}

const base = 'https://seche10semaines.fr';
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
`;

for (const slug of slugs) {
  xml += `  <url><loc>${base}/blog/${slug}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
}

xml += '</urlset>';
fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated with ${slugs.length} articles (clean URLs)`);
