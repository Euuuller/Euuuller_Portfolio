/**
 * ==========================================
 * PARALLAX DAS NEBULOSAS (SUAVE E RESPONSIVO)
 * Usa variáveis CSS para deslocar os centros dos gradientes
 * com base em scroll e ponteiro, com baixo custo.
 * ==========================================
 */

export function initGalaxyParallax() {
  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = document.querySelector('.galaxy-bg');
    if (!el) return;

    // Estado
    let pointerX = 0.5; // 0..1
    let pointerY = 0.5; // 0..1 (usamos pouco para evitar conflito com scroll)
    let scrollProgress = 0; // 0..1
    let rafId = null;
    let width = window.innerWidth;

    // Amplitudes (em %). Camadas mais próximas movem mais.
    function getAmp() {
      const isMobile = width < 576;
      const scale = isMobile ? 0.5 : 1.0;
      return {
        g1: { x: 0.8 * scale, y: 0.6 * scale },
        g2: { x: 0.6 * scale, y: 0.5 * scale },
        g3: { x: 0.9 * scale, y: 0.7 * scale },
        g4: { x: 0.5 * scale, y: 0.5 * scale },
      };
    }

    let amp = getAmp();

    // Captura ponteiro (passivo)
    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerX = clamp(clientX / window.innerWidth, 0, 1);
      pointerY = clamp(clientY / window.innerHeight, 0, 1);
    };

    // Atualiza scroll progress
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = clamp(window.scrollY / maxScroll, 0, 1);
    };

    const onResize = () => {
      width = window.innerWidth;
      amp = getAmp();
      onScroll();
    };

    // Loop leve de atualização
    const update = () => {
      // Eixo X pela posição do ponteiro, eixo Y pelo scroll
      const px = (pointerX - 0.5);
      const py = (scrollProgress - 0.5);

      setVar('--g1-ox', (px * amp.g1.x) + '%');
      setVar('--g1-oy', (py * amp.g1.y) + '%');
      setVar('--g2-ox', (px * amp.g2.x) + '%');
      setVar('--g2-oy', (py * amp.g2.y) + '%');
      setVar('--g3-ox', (px * amp.g3.x) + '%');
      setVar('--g3-oy', (py * amp.g3.y) + '%');
      setVar('--g4-ox', (px * amp.g4.x) + '%');
      setVar('--g4-oy', (py * amp.g4.y) + '%');

      rafId = requestAnimationFrame(update);
    };

    const setVar = (name, value) => {
      el.style.setProperty(name, value);
    };

    // Inicializa
    onResize();
    update();

    // Eventos (passivos)
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Cleanup
    window.addEventListener('beforeunload', () => {
      try {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        if (rafId) cancelAnimationFrame(rafId);
      } catch (_) {}
    });
  } catch (error) {
    console.error('Erro ao inicializar parallax das nebulosas:', error);
  }
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }