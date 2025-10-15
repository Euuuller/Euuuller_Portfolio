# Day 1 Measurements

- CSS (min): 33.7 KB
- JS (min): 23.59 KB
- Hero AVIF: 15.96 KB
- Hero WebP: 22.63 KB
- Hero JPEG (fallback): 111.61 KB
- <img> total: 15
- <img loading="lazy">: 11
- <img decoding="async">: 8
- <picture> tags: 1
- CSS links: 2
- JS scripts: 1

Observações:
- Hero usa <picture> com AVIF/WebP e fallback JPEG.
- Atributos width/height e fetchpriority="high" mantêm estabilidade e prioridade de carregamento.
