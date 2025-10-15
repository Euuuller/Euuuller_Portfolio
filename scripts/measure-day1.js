/**
 * Day 1 Measurements
 * - Reports asset sizes (CSS/JS/Hero images)
 * - Counts image tags and lazy/async usage
 * - Writes JSON + Markdown summary to reports/
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const fg = require('fast-glob');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'assets', 'dist');
const IMAGES_DIST = path.join(DIST, 'images');
const IMAGES_SRC = path.join(ROOT, 'assets', 'images');

function kb(bytes) {
  return +(bytes / 1024).toFixed(2);
}

async function fileSize(filePath) {
  try {
    const stat = await fsp.stat(filePath);
    return kb(stat.size);
  } catch (err) {
    return null;
  }
}

async function countHtmlMetrics(html) {
  const imgAll = (html.match(/<img\b/gi) || []).length;
  const imgLazy = (html.match(/<img[^>]*\bloading\s*=\s*"lazy"/gi) || []).length;
  const imgAsyncDecoding = (html.match(/<img[^>]*\bdecoding\s*=\s*"async"/gi) || []).length;
  const pictureTags = (html.match(/<picture\b/gi) || []).length;
  const cssLinks = (html.match(/<link[^>]*rel\s*=\s*"stylesheet"/gi) || []).length;
  const jsScripts = (html.match(/<script\b/gi) || []).length;

  return { imgAll, imgLazy, imgAsyncDecoding, pictureTags, cssLinks, jsScripts };
}

async function main() {
  const cssPath = path.join(DIST, 'style.min.css');
  const jsPath = path.join(DIST, 'main.min.js');
  const heroAvif = path.join(IMAGES_DIST, '1_Imagem.avif');
  const heroWebp = path.join(IMAGES_DIST, '1_Imagem.webp');
  const heroJpeg = path.join(IMAGES_SRC, '1_Imagem.jpeg');
  const heroJpegDistFallback = path.join(IMAGES_DIST, '1_Imagem-800.jpg');
  const htmlPath = path.join(ROOT, 'index.html');

  const [cssKB, jsKB, avifKB, webpKB, jpegKB, jpegFallbackDistKB] = await Promise.all([
    fileSize(cssPath),
    fileSize(jsPath),
    fileSize(heroAvif),
    fileSize(heroWebp),
    fileSize(heroJpeg),
    fileSize(heroJpegDistFallback),
  ]);

  // Responsive hero srcsets (AVIF/WebP)
  const avifFiles = await fg(['1_Imagem-*.avif'], { cwd: IMAGES_DIST });
  const webpFiles = await fg(['1_Imagem-*.webp'], { cwd: IMAGES_DIST });
  async function listSizes(files) {
    const out = [];
    for (const rel of files) {
      const fp = path.join(IMAGES_DIST, rel);
      const size = await fileSize(fp);
      out.push({ file: path.relative(ROOT, fp), sizeKB: size });
    }
    return out.sort((a, b) => a.file.localeCompare(b.file));
  }
  const avifSrcset = await listSizes(avifFiles);
  const webpSrcset = await listSizes(webpFiles);

  const html = await fsp.readFile(htmlPath, 'utf8');
  const metrics = await countHtmlMetrics(html);

  const report = {
    generatedAt: new Date().toISOString(),
    assets: {
      css: { file: path.relative(ROOT, cssPath), sizeKB: cssKB },
      js: { file: path.relative(ROOT, jsPath), sizeKB: jsKB },
      hero: {
        avif: { file: path.relative(ROOT, heroAvif), sizeKB: avifKB },
        webp: { file: path.relative(ROOT, heroWebp), sizeKB: webpKB },
        jpeg: { file: path.relative(ROOT, heroJpeg), sizeKB: jpegKB },
        jpegFallbackDist: { file: path.relative(ROOT, heroJpegDistFallback), sizeKB: jpegFallbackDistKB },
        responsive: {
          avif: avifSrcset,
          webp: webpSrcset,
        },
      },
    },
    html: metrics,
  };

  const outDir = path.join(ROOT, 'reports');
  await fsp.mkdir(outDir, { recursive: true });
  await fsp.writeFile(path.join(outDir, 'day1.json'), JSON.stringify(report, null, 2), 'utf8');

  const md = `# Day 1 Measurements\n\n` +
    `- CSS (min): ${cssKB ?? 'n/a'} KB\n` +
    `- JS (min): ${jsKB ?? 'n/a'} KB\n` +
    `- Hero AVIF: ${avifKB ?? 'n/a'} KB\n` +
    `- Hero WebP: ${webpKB ?? 'n/a'} KB\n` +
    `- Hero JPEG (orig src): ${jpegKB ?? 'n/a'} KB\n` +
    `- Hero JPEG fallback (dist 800px): ${jpegFallbackDistKB ?? 'n/a'} KB\n` +
    `- Hero AVIF srcset: ${avifSrcset.map(i => `${path.basename(i.file)}=${i.sizeKB ?? 'n/a'}KB`).join(', ') || 'n/a'}\n` +
    `- Hero WebP srcset: ${webpSrcset.map(i => `${path.basename(i.file)}=${i.sizeKB ?? 'n/a'}KB`).join(', ') || 'n/a'}\n` +
    `- <img> total: ${metrics.imgAll}\n` +
    `- <img loading="lazy">: ${metrics.imgLazy}\n` +
    `- <img decoding="async">: ${metrics.imgAsyncDecoding}\n` +
    `- <picture> tags: ${metrics.pictureTags}\n` +
    `- CSS links: ${metrics.cssLinks}\n` +
    `- JS scripts: ${metrics.jsScripts}\n` +
    `\nObservações:\n` +
    `- Hero usa <picture> com AVIF/WebP e fallback JPEG.\n` +
    `- Agora o hero é responsivo com srcsets; tamanhos listados acima.\n` +
    `- Atributos width/height e fetchpriority="high" mantêm estabilidade e prioridade de carregamento.\n`;

  await fsp.writeFile(path.join(outDir, 'day1.md'), md, 'utf8');

  console.log('[measure] Day 1 report created at reports/day1.json and reports/day1.md');
}

main().catch((err) => {
  console.error('[measure] Failed:', err);
  process.exit(1);
});