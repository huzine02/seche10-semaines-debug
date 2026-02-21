const fs = require('fs');

const blogContent = fs.readFileSync('src/data/blogArticles.ts', 'utf8');
const seoContent = fs.readFileSync('src/data/seoArticles25.ts', 'utf8');

const slugs = [];
const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let m;
while ((m = slugRegex.exec(blogContent)) !== null) slugs.push(m[1]);
while ((m = slugRegex.exec(seoContent)) !== null) slugs.push(m[1]);

const base = 'https://seche10semaines.fr';
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${base}/#/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${base}/#/pricing</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
`;

for (const slug of slugs) {
  xml += `  <url><loc>${base}/#/blog/${slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
}

xml += '</urlset>';
fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated with ${slugs.length} articles`);
