/**
 * Generate sitemap.xml with all blog article URLs + static pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'public', 'blog');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');
const BASE = 'https://seche10semaines.fr';

function main() {
  console.log('🗺️  Generating sitemap.xml...\n');
  
  const today = new Date().toISOString().split('T')[0];
  
  // Collect blog slugs from generated directories
  const slugs = [];
  if (fs.existsSync(BLOG_DIR)) {
    for (const entry of fs.readdirSync(BLOG_DIR)) {
      const p = path.join(BLOG_DIR, entry);
      if (fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'index.html'))) {
        slugs.push(entry);
      }
    }
  }
  
  console.log(`  Found ${slugs.length} blog articles`);
  
  const urls = [
    { loc: `${BASE}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${BASE}/mentions-legales`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${BASE}/cgv`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${BASE}/politique-confidentialite`, priority: '0.3', changefreq: 'yearly' },
    ...slugs.map(slug => ({
      loc: `${BASE}/blog/${slug}/`,
      priority: '0.8',
      changefreq: 'monthly'
    }))
  ];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(OUT, xml, 'utf-8');
  console.log(`\n🎉 Sitemap written to public/sitemap.xml (${urls.length} URLs)`);
}

main();
