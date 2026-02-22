/**
 * Generate static HTML pages for each blog article (SEO pre-rendering)
 * Reads blogArticles.ts, seoArticles25.ts, seoArticlesRewrite.ts
 * Outputs public/blog/[slug]/index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'data');
const OUT = path.join(ROOT, 'public', 'blog');

// --- Parse TS article files using regex ---

function readFile(name) {
  return fs.readFileSync(path.join(SRC, name), 'utf-8');
}

/**
 * Extract articles from a TS file. Handles both template literals and regular strings.
 * Returns array of { slug, title, metaDescription, content, date?, readTime?, excerpt?, keyword? }
 */
function extractArticles(source) {
  const articles = [];
  // Match each object block in the array
  // We'll find slug first, then extract fields around it
  const objectRegex = /\{\s*\n\s*slug:\s*[`"']([^`"']+)[`"']/g;
  let match;
  
  while ((match = objectRegex.exec(source)) !== null) {
    const slug = match[1];
    // Find the full object: from this { to its closing }
    const startIdx = match.index;
    let braceCount = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < source.length; i++) {
      if (source[i] === '{') braceCount++;
      if (source[i] === '}') {
        braceCount--;
        if (braceCount === 0) { endIdx = i + 1; break; }
      }
    }
    const block = source.substring(startIdx, endIdx);
    
    const getField = (name) => {
      // Try quoted string first
      const strMatch = block.match(new RegExp(name + `:\\s*["\']([^"\']*)["\']`));
      if (strMatch) return strMatch[1];
      return '';
    };
    
    const title = getField('title');
    const metaDescription = getField('metaDescription');
    const date = getField('date') || '2026-02-15';
    const readTime = getField('readTime') || '10 min';
    const excerpt = getField('excerpt') || metaDescription;
    const keyword = getField('keyword') || '';
    
    // Extract content (template literal between backticks)
    const contentStart = block.indexOf('content: `');
    let content = '';
    if (contentStart !== -1) {
      const cStart = contentStart + 'content: `'.length;
      // Find closing backtick - handle nested backticks by finding the last ` before the closing }
      let depth = 1;
      let i = cStart;
      // Simple approach: find matching backtick (not inside ${})
      let result = '';
      while (i < block.length) {
        if (block[i] === '\\' && i + 1 < block.length) {
          result += block[i] + block[i + 1];
          i += 2;
          continue;
        }
        if (block[i] === '`') {
          break;
        }
        result += block[i];
        i++;
      }
      content = result;
    }
    
    articles.push({ slug, title, metaDescription, content, date, readTime, excerpt, keyword });
  }
  
  return articles;
}

// --- Markdown to HTML converter ---

function markdownToHtml(text) {
  if (!text) return '';
  
  let html = text;
  
  // If content already has HTML tags, it's mostly HTML - just do minimal processing
  const hasHtmlTags = /<(h[1-6]|p|ul|ol|li|blockquote|div|table|strong|em)\b/i.test(html);
  
  if (!hasHtmlTags) {
    // Pure markdown content - convert fully
    
    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Blockquotes (multi-line)
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    // Merge adjacent blockquotes
    html = html.replace(/<\/blockquote>\s*<blockquote>/g, '\n');
    
    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
    
    // Paragraphs: wrap lines that aren't already in tags
    const lines = html.split('\n');
    const result = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { result.push(''); continue; }
      if (/^<(h[1-6]|ul|ol|li|blockquote|div|table|p|hr)/.test(trimmed)) {
        result.push(trimmed);
      } else if (trimmed.startsWith('<')) {
        result.push(trimmed);
      } else {
        result.push(`<p>${trimmed}</p>`);
      }
    }
    html = result.join('\n');
  }
  
  // Style special blockquotes (🔬 and 💬)
  html = html.replace(
    /<blockquote(?:\s[^>]*)?>(\s*(?:🔬|ðŸ"¬))/g,
    '<blockquote style="background:#e8f4fd;border-left:4px solid #0ea5e9;padding:16px 20px;margin:20px 0;border-radius:8px;">$1'
  );
  html = html.replace(
    /<blockquote(?:\s[^>]*)?>(\s*(?:💬|ðŸ'¬))/g,
    '<blockquote style="background:#f0fdf4;border-left:4px solid #00B894;padding:16px 20px;margin:20px 0;border-radius:8px;">$1'
  );
  
  return html;
}

// --- HTML template ---

function generateHtml(article) {
  const { slug, title, metaDescription, content, date } = article;
  const url = `https://seche10semaines.fr/blog/${slug}`;
  const contentHtml = markdownToHtml(content);
  
  // Escape for JSON-LD (remove backslashes, escape quotes, strip control chars)
  const jsonTitle = title.replace(/\\/g, '').replace(/"/g, '\\"').replace(/[\n\r\t]/g, ' ');
  const jsonDesc = metaDescription.replace(/\\/g, '').replace(/"/g, '\\"').replace(/[\n\r\t]/g, ' ');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDescription}">
  <link rel="canonical" href="${url}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://seche10semaines.fr/og-image.jpg">
  <meta property="og:site_name" content="Sèche 10 Semaines">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="https://seche10semaines.fr/og-image.jpg">

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${jsonTitle}",
    "description": "${jsonDesc}",
    "datePublished": "${date}",
    "author": { "@type": "Organization", "name": "Sèche 10 Semaines" },
    "publisher": {
      "@type": "Organization",
      "name": "Sèche 10 Semaines",
      "url": "https://seche10semaines.fr"
    },
    "mainEntityOfPage": "${url}"
  }
  </script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-YRJ14669GD"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-YRJ14669GD');</script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">

  <style>
    :root {
      --ink: #0F2C59; --ink-deep: #071828; --paper: #F8FAFC; --cream: #F1F5F9;
      --sage: #00B894; --sage-light: #059669; --sage-glow: #34D399; --sage-muted: #ECFDF5;
      --text: #1E293B; --text-mid: #475569; --text-light: #94A3B8;
      --border: #E2E8F0; --card: #FFFFFF;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--text); -webkit-font-smoothing: antialiased; line-height: 1.7; }

    /* Header */
    .header { background: rgba(7,24,40,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 14px 20px; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 800px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-family: 'Instrument Serif', serif; font-size: 20px; color: #fff; text-decoration: none; }
    .logo span { color: var(--sage); }
    .header-nav { display: flex; gap: 16px; align-items: center; }
    .header-nav a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 13px; font-weight: 500; }
    .header-nav a:hover { color: var(--sage); }
    .btn-member { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.25); padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; text-decoration: none; }
    .btn-member:hover { border-color: var(--sage); color: var(--sage); }

    /* Back link */
    .back-link { max-width: 800px; margin: 24px auto 0; padding: 0 20px; }
    .back-link a { color: var(--sage); text-decoration: none; font-size: 14px; font-weight: 500; }
    .back-link a:hover { text-decoration: underline; }

    /* Article */
    .article { max-width: 800px; margin: 0 auto; padding: 32px 20px 60px; }
    .article h1 { font-family: 'Instrument Serif', serif; font-size: 36px; color: var(--ink); line-height: 1.15; margin-bottom: 24px; letter-spacing: -0.03em; }
    .article h2 { font-family: 'Instrument Serif', serif; font-size: 26px; color: var(--ink); margin: 40px 0 16px; letter-spacing: -0.02em; line-height: 1.2; }
    .article h3 { font-size: 18px; color: var(--ink); margin: 28px 0 12px; font-weight: 700; }
    .article p { margin-bottom: 16px; color: var(--text-mid); font-size: 16px; line-height: 1.8; }
    .article strong { color: var(--text); font-weight: 600; }
    .article ul, .article ol { margin: 16px 0; padding-left: 24px; }
    .article li { margin-bottom: 8px; color: var(--text-mid); font-size: 16px; line-height: 1.7; }
    .article blockquote { background: var(--cream); border-left: 4px solid var(--border); padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0; font-size: 15px; color: var(--text-mid); }
    .article blockquote strong { color: var(--ink); }
    .article a { color: var(--sage); text-decoration: underline; }
    .article img { max-width: 100%; border-radius: 12px; margin: 24px 0; }
    .article table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
    .article th, .article td { border: 1px solid var(--border); padding: 10px 14px; text-align: left; }
    .article th { background: var(--cream); font-weight: 600; color: var(--ink); }

    /* CTA */
    .cta-section { max-width: 800px; margin: 0 auto 60px; padding: 0 20px; }
    .cta-box { background: linear-gradient(135deg, var(--ink) 0%, #1a4a8a 100%); border-radius: 20px; padding: 48px 32px; text-align: center; }
    .cta-box h2 { font-family: 'Instrument Serif', serif; color: #fff; font-size: 28px; margin-bottom: 12px; }
    .cta-box p { color: rgba(255,255,255,0.7); font-size: 16px; margin-bottom: 24px; max-width: 500px; margin-left: auto; margin-right: auto; }
    .cta-btn { display: inline-block; background: var(--sage); color: #fff; padding: 16px 36px; border-radius: 100px; font-size: 16px; font-weight: 700; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
    .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,184,148,0.4); }

    /* Footer */
    .footer { background: var(--ink-deep); padding: 32px 20px; text-align: center; }
    .footer-logo { font-family: 'Instrument Serif', serif; font-size: 18px; color: #fff; margin-bottom: 10px; }
    .footer-logo span { color: var(--sage); }
    .footer-links { display: flex; justify-content: center; gap: 16px; margin-bottom: 10px; flex-wrap: wrap; }
    .footer-links a { font-size: 11px; color: rgba(255,255,255,0.4); text-decoration: none; }
    .footer-copy { font-size: 10px; color: rgba(255,255,255,0.25); }

    @media (min-width: 768px) {
      .article h1 { font-size: 44px; }
      .article h2 { font-size: 30px; }
      .cta-box { padding: 60px 48px; }
      .cta-box h2 { font-size: 34px; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="https://seche10semaines.fr" class="logo">Sèche<span>10</span>Semaines</a>
      <nav class="header-nav">
        <a href="https://seche10semaines.fr/#/blog">Blog</a>
        <a href="https://seche10semaines.fr/#/login" class="btn-member">Espace Membre</a>
      </nav>
    </div>
  </header>

  <div class="back-link">
    <a href="https://seche10semaines.fr/#/blog">← Retour au blog</a>
  </div>

  <article class="article">
    ${contentHtml}
  </article>

  <section class="cta-section">
    <div class="cta-box">
      <h2>Prêt à transformer votre physique ?</h2>
      <p>Rejoignez le programme Sèche 10 Semaines et bénéficiez d'un plan personnalisé basé sur la science.</p>
      <a href="https://seche10semaines.fr/#/login" class="cta-btn">Commencez votre essai gratuit de 7 jours →</a>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-logo">Sèche<span>10</span>Semaines</div>
    <div class="footer-links">
      <a href="https://seche10semaines.fr/">Accueil</a>
      <a href="https://seche10semaines.fr/#/blog">Blog</a>
      <a href="https://seche10semaines.fr/#/mentions-legales">Mentions légales</a>
      <a href="https://seche10semaines.fr/#/cgv">CGV</a>
      <a href="https://seche10semaines.fr/#/politique-confidentialite">Confidentialité</a>
    </div>
    <div class="footer-copy">© 2026 Sèche10Semaines · Résultats individuels, non contractuels.</div>
  </footer>
</body>
</html>`;
}

// --- Main ---

function main() {
  console.log('📄 Generating static blog HTML pages...\n');
  
  const blogSrc = readFile('blogArticles.ts');
  const seo25Src = readFile('seoArticles25.ts');
  const seoRewriteSrc = readFile('seoArticlesRewrite.ts');
  const healthSrc = readFile('healthArticles.ts');
  const gapSrc = readFile('seoArticlesGap.ts');
  
  const blogArticles = extractArticles(blogSrc);
  const seo25Articles = extractArticles(seo25Src);
  const seoRewriteArticles = extractArticles(seoRewriteSrc);
  const healthArticlesList = extractArticles(healthSrc);
  const gapArticles = extractArticles(gapSrc);
  
  console.log(`  blogArticles: ${blogArticles.length} articles`);
  console.log(`  seoArticles25: ${seo25Articles.length} articles`);
  console.log(`  seoArticlesRewrite: ${seoRewriteArticles.length} articles`);
  console.log(`  healthArticles: ${healthArticlesList.length} articles`);
  console.log(`  seoArticlesGap: ${gapArticles.length} articles`);
  
  // Merge: blogArticles + seo25 + seoRewrite + health + gap (rewrite overrides seo25 by slug)
  const articleMap = new Map();
  
  for (const a of blogArticles) articleMap.set(a.slug, a);
  for (const a of seo25Articles) articleMap.set(a.slug, a);
  for (const a of seoRewriteArticles) articleMap.set(a.slug, a); // overrides seo25
  for (const a of healthArticlesList) articleMap.set(a.slug, a);
  for (const a of gapArticles) articleMap.set(a.slug, a);
  
  const allArticles = [...articleMap.values()];
  console.log(`\n  Total unique articles: ${allArticles.length}\n`);
  
  // Clean and recreate output dir
  if (fs.existsSync(OUT)) {
    // Only remove subdirectories (not root blog dir)
    for (const entry of fs.readdirSync(OUT)) {
      const p = path.join(OUT, entry);
      if (fs.statSync(p).isDirectory()) {
        fs.rmSync(p, { recursive: true });
      }
    }
  }
  
  let count = 0;
  for (const article of allArticles) {
    const dir = path.join(OUT, article.slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = generateHtml(article);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    count++;
    console.log(`  ✅ ${article.slug}`);
  }
  
  console.log(`\n🎉 Generated ${count} static blog pages in public/blog/`);
}

main();
