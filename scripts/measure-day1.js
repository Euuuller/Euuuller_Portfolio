/**
 * Day 1 Measurements
 * - Reports asset sizes (CSS/JS/Hero images)
 * - Counts image tags and lazy/async usage
 * - Writes JSON + Markdown summary to reports/
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

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
  const htmlPath = path.join(ROOT, 'index.html');

  const [cssKB, jsKB, avifKB, webpKB, jpegKB] = await Promise.all([
    fileSize(cssPath),
    fileSize(jsPath),
    fileSize(heroAvif),
    fileSize(heroWebp),
    fileSize(heroJpeg),
  ]);

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
    `- Hero JPEG (fallback): ${jpegKB ?? 'n/a'} KB\n` +
    `- <img> total: ${metrics.imgAll}\n` +
    `- <img loading="lazy">: ${metrics.imgLazy}\n` +
    `- <img decoding="async">: ${metrics.imgAsyncDecoding}\n` +
    `- <picture> tags: ${metrics.pictureTags}\n` +
    `- CSS links: ${metrics.cssLinks}\n` +
    `- JS scripts: ${metrics.jsScripts}\n` +
    `\nObservações:\n` +
    `- Hero usa <picture> com AVIF/WebP e fallback JPEG.\n` +
    `- Atributos width/height e fetchpriority="high" mantêm estabilidade e prioridade de carregamento.\n`;

  await fsp.writeFile(path.join(outDir, 'day1.md'), md, 'utf8');

  console.log('[measure] Day 1 report created at reports/day1.json and reports/day1.md');
}

main().catch((err) => {
  console.error('[measure] Failed:', err);
  process.exit(1);
});