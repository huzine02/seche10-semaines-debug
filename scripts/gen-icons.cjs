// Generate PNG icons from canvas API (Node.js built-in)
// Actually let's just update the manifest to use SVG icons which browsers support

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.icons = [
  { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
  { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
  { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" }
];

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Manifest updated with SVG icons');

// Also update index.html apple-touch-icon
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/icon-192\.png/g, 'icon-192.svg');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html updated');
