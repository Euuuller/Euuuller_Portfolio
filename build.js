// Simple build script: bundles and minifies CSS and JS
// - CSS: resolves @import in assets/css/style.css, concatenates, minifies with csso
// - JS: bundles assets/js/main.js with esbuild (ESM), minifies

const fs = require('fs');
const path = require('path');
const csso = require('csso');
const esbuild = require('esbuild');

async function buildCSS() {
  const cssEntry = path.join(__dirname, 'assets', 'css', 'style.css');
  const cssBaseDir = path.dirname(cssEntry);
  const distDir = path.join(__dirname, 'assets', 'dist');

  const importRegex = /@import\s+url\(['"]?(.+?)['"]?\);/g;
  const original = fs.readFileSync(cssEntry, 'utf8');

  let bundled = '';
  let match;

  // Collect imports in order
  const imports = [];
  while ((match = importRegex.exec(original)) !== null) {
    imports.push(match[1]);
  }

  // Append imported files content
  for (const imp of imports) {
    const impPath = path.join(cssBaseDir, imp);
    if (!fs.existsSync(impPath)) {
      console.warn(`[WARN] CSS import not found: ${imp}`);
      continue;
    }
    const content = fs.readFileSync(impPath, 'utf8');
    bundled += `\n/* >>> ${imp} >>> */\n` + content + `\n/* <<< ${imp} <<< */\n`;
  }

  // Add remaining CSS (without import lines)
  const withoutImports = original.replace(importRegex, '').trim();
  bundled += `\n/* >>> style.css remainder >>> */\n` + withoutImports + `\n/* <<< style.css remainder <<< */\n`;

  // Minify
  const minified = csso.minify(bundled, { comments: false }).css;

  // Ensure dist dir exists
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const outFile = path.join(distDir, 'style.min.css');
  fs.writeFileSync(outFile, minified, 'utf8');
  console.log(`[CSS] Wrote ${outFile}`);
}

async function buildJS() {
  const distDir = path.join(__dirname, 'assets', 'dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  // Habilita code splitting para imports dinâmicos
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'assets', 'js', 'main.js')],
    outdir: distDir,
    entryNames: '[name].min',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    bundle: true,
    minify: true,
    format: 'esm',
    splitting: true,
    sourcemap: false,
    target: ['es2019']
  });
  console.log(`[JS] Wrote ${path.join(distDir, 'main.min.js')} and chunks`);
}

async function run() {
  try {
    await buildCSS();
    await buildJS();
    console.log('Build completed successfully.');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

run();