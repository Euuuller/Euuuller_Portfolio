/**
 * ==========================================
 * MÓDULO DE PARTÍCULAS DE FUNDO
 * Animação sutil, leve e discreta, respeitando UX
 * ==========================================
 */

// Export principal
export function initParticles() {
  try {
    // Respeitar acessibilidade: desativar animações se o usuário preferir
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Evitar duplicação
    if (document.getElementById('bg-particles')) return;

    // Criar canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    let width = 0;
    let height = 0;

    // Configuração baseada no tamanho da tela (densidade baixa)
    const getParticleCount = () => {
      const w = window.innerWidth;
      if (w < 576) return 22; // mobile
      if (w < 992) return 32; // tablet
      return 44;             // desktop
    };

    // Cor sutil adaptada ao tema
    const getThemeColor = () => {
      const root = document.documentElement;
      const isDark = root.getAttribute('data-theme') === 'dark';
      const styles = getComputedStyle(root);
      const token = isDark ? '--text-secondary' : '--text-tertiary';
      const fallback = isDark ? '#cccccc' : '#666666';
      const hex = (styles.getPropertyValue(token).trim() || fallback);
      const { r, g, b } = hexToRgb(hex);
      const alpha = isDark ? 0.11 : 0.15; // ligeiro aumento de visibilidade
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Partículas
    let particles = [];
    let color = getThemeColor();
    let animationId = null;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      const count = getParticleCount();
      particles = new Array(count).fill(0).map(() => makeParticle());
    }

    function makeParticle() {
      const radius = rand(1.3, 3.2); // leve aumento do tamanho
      const speedBase = prefersReducedMotion ? 0 : rand(0.06, 0.28); // ligeiro aumento da velocidade
      // Direção aleatória
      const angle = rand(0, Math.PI * 2);
      const vx = Math.cos(angle) * speedBase;
      const vy = Math.sin(angle) * speedBase;
      return {
        x: rand(0, width),
        y: rand(0, height),
        vx,
        vy,
        r: radius,
        twinkle: Math.random() < 0.15 ? rand(0.02, 0.06) : 0
      };
    }

    function step() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.shadowColor = color;
      ctx.shadowBlur = isDark ? 6 : 4; // brilho suave das partículas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Atualiza posição
        p.x += p.vx;
        p.y += p.vy;

        // Mantém dentro da viewport, com wrap suave
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Twinkle muito leve
        const alphaBoost = p.twinkle ? Math.sin(Date.now() * p.twinkle) * 0.02 : 0;
        if (alphaBoost !== 0) {
          const base = colorToRgbaComponents(color);
          const a = clamp(base.a + alphaBoost, 0.05, 0.14); // teto levemente maior
          ctx.fillStyle = `rgba(${base.r}, ${base.g}, ${base.b}, ${a})`;
        } else {
          ctx.fillStyle = color;
        }

        // Desenho: círculos sutis
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      animationId = requestAnimationFrame(step);
    }

    // Atualiza cor quando tema muda
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          color = getThemeColor();
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    // Inicializa
    resize();
    createParticles();
    color = getThemeColor();
    console.debug('[particles] init', { prefersReducedMotion, dpr, count: particles.length });

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(step);
    } else {
      // Desenho estático quando reduz movimento
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = document.documentElement.getAttribute('data-theme') === 'dark' ? 6 : 4;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Eventos
    const onResize = () => {
      resize();
      createParticles();
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    window.addEventListener('beforeunload', () => {
      try {
        window.removeEventListener('resize', onResize);
        observer.disconnect();
        if (animationId) cancelAnimationFrame(animationId);
      } catch (e) {}
    });
  } catch (error) {
    console.error('Erro ao inicializar partículas:', error);
  }
}

// Utilitários
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function hexToRgb(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  const intVal = parseInt(h, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return { r, g, b };
}

function colorToRgbaComponents(rgbaStr) {
  // expects 'rgba(r, g, b, a)'
  const m = rgbaStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9]*\.?[0-9]+)\)/);
  if (!m) return { r: 0, g: 0, b: 0, a: 0.08 };
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: Number(m[4]) };
}