/**
 * Image optimization script
 * - Convert Hero JPEG to AVIF and WebP using sharp
 * - Optimize all SVGs recursively using SVGO
 * Outputs to assets/dist/images while preserving folder structure
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const sharp = require('sharp');
const fg = require('fast-glob');
const { optimize } = require('svgo');

const ROOT = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'assets', 'images');
const OUTPUT_DIR = path.join(ROOT, 'assets', 'dist', 'images');

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function convertHero() {
  const heroSrc = path.join(INPUT_DIR, '1_Imagem.jpeg');
  const baseName = '1_Imagem';
  const outAvif = path.join(OUTPUT_DIR, `${baseName}.avif`);
  const outWebp = path.join(OUTPUT_DIR, `${baseName}.webp`);

  try {
    await ensureDir(OUTPUT_DIR);
    const image = sharp(heroSrc);
    const meta = await image.metadata();
    const targetWidth = Math.min(meta.width || 800, 800); // cap at 800px for balance

    // AVIF: excellent compression, slightly lower quality setting
    await image
      .resize({ width: targetWidth })
      .avif({ quality: 55 })
      .toFile(outAvif);

    // WebP: wider compatibility
    await sharp(heroSrc)
      .resize({ width: targetWidth })
      .webp({ quality: 75 })
      .toFile(outWebp);

    console.log('[images] Hero converted:', {
      avif: path.relative(ROOT, outAvif),
      webp: path.relative(ROOT, outWebp),
      width: targetWidth,
    });
  } catch (err) {
    console.error('[images] Hero conversion failed:', err.message);
    throw err;
  }
}

async function optimizeSvgs() {
  const svgFiles = await fg(['**/*.svg'], { cwd: INPUT_DIR, dot: false });
  if (svgFiles.length === 0) {
    console.log('[images] No SVG files found. Skipping SVG optimization.');
    return;
  }

  const plugins = [
    'preset-default',
    { name: 'removeViewBox', active: false },
    { name: 'convertPathData', params: { straightCurves: true } },
  ];

  await ensureDir(OUTPUT_DIR);

  for (const rel of svgFiles) {
    const src = path.join(INPUT_DIR, rel);
    const dest = path.join(OUTPUT_DIR, rel);
    await ensureDir(path.dirname(dest));

    const content = await fsp.readFile(src, 'utf8');
    const result = optimize(content, {
      path: src,
      multipass: true,
      plugins,
    });
    await fsp.writeFile(dest, result.data, 'utf8');
    console.log('[images] SVG optimized:', path.relative(ROOT, dest));
  }
}

async function main() {
  console.log('[images] Starting image optimization...');
  await convertHero();
  await optimizeSvgs();
  console.log('[images] Completed. Outputs written to', path.relative(ROOT, OUTPUT_DIR));
}

main().catch((err) => {
  console.error('[images] Failed:', err);
  process.exit(1);
});