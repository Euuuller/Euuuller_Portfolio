# Day 1 Measurements

- CSS (min): 34.64 KB
- JS (min): 23.59 KB
- Hero AVIF: 15.96 KB
- Hero WebP: 22.63 KB
- Hero JPEG (orig src): 111.61 KB
- Hero JPEG fallback (dist 800px): 72.84 KB
- Hero AVIF srcset: 1_Imagem-280.avif=5.87KB, 1_Imagem-320.avif=6.83KB, 1_Imagem-400.avif=8.08KB, 1_Imagem-640.avif=12.98KB, 1_Imagem-800.avif=15.96KB
- Hero WebP srcset: 1_Imagem-280.webp=6.54KB, 1_Imagem-320.webp=7.61KB, 1_Imagem-400.webp=9.96KB, 1_Imagem-640.webp=17.05KB, 1_Imagem-800.webp=22.63KB
- <img> total: 15
- <img loading="lazy">: 14
- <img decoding="async">: 15
- <picture> tags: 1
- CSS links: 2
- JS scripts: 1

Observações:
- Hero usa <picture> com AVIF/WebP e fallback JPEG.
- Agora o hero é responsivo com srcsets; tamanhos listados acima.
- Atributos width/height e fetchpriority="high" mantêm estabilidade e prioridade de carregamento.
