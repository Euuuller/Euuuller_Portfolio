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
  const sizes = [280, 320, 400, 640, 800];

  try {
    await ensureDir(OUTPUT_DIR);
    const meta = await sharp(heroSrc).metadata();
    const maxWidth = Math.min(meta.width || 800, 800);

    const outputs = { avif: [], webp: [], jpeg: null };

    for (const w of sizes) {
      const width = Math.min(w, maxWidth);

      const outAvif = path.join(OUTPUT_DIR, `${baseName}-${width}.avif`);
      const outWebp = path.join(OUTPUT_DIR, `${baseName}-${width}.webp`);

      // AVIF
      await sharp(heroSrc)
        .resize({ width })
        .avif({ quality: 55 })
        .toFile(outAvif);
      outputs.avif.push(path.relative(ROOT, outAvif));

      // WebP
      await sharp(heroSrc)
        .resize({ width })
        .webp({ quality: 75 })
        .toFile(outWebp);
      outputs.webp.push(path.relative(ROOT, outWebp));
    }

    // Fallback JPEG otimizado (800px)
    const outJpeg = path.join(OUTPUT_DIR, `${baseName}-800.jpg`);
    await sharp(heroSrc)
      .resize({ width: maxWidth })
      .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
      .toFile(outJpeg);
    outputs.jpeg = path.relative(ROOT, outJpeg);

    // Também gerar versões "sem sufixo" para compatibilidade retroativa
    const outAvifSingle = path.join(OUTPUT_DIR, `${baseName}.avif`);
    const outWebpSingle = path.join(OUTPUT_DIR, `${baseName}.webp`);
    await sharp(heroSrc).resize({ width: maxWidth }).avif({ quality: 55 }).toFile(outAvifSingle);
    await sharp(heroSrc).resize({ width: maxWidth }).webp({ quality: 75 }).toFile(outWebpSingle);

    console.log('[images] Hero converted responsive:', {
      avif: outputs.avif,
      webp: outputs.webp,
      jpeg: outputs.jpeg,
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