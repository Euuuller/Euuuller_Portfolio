/**
 * ==========================================
 * MÓDULO DE PARTÍCULAS DE FOGO (EMBERS)
 * Elegantes, sutis e performáticas, com gradiente e glow
 * Respeita acessibilidade e tema, e otimiza para diferentes dispositivos.
 * ==========================================
 */

import { prefersReducedMotion } from '../shared/a11y.js';
import { getCssVar, getCssVarNum, getCssVarPx } from '../shared/cssVars.js';
import { on } from '../shared/eventBus.js';

export function initEmbers() {
  try {
    // Respeitar acessibilidade
    const reduced = prefersReducedMotion();

    // Evitar duplicação
    if (document.getElementById('bg-embers')) return;

    // Criar canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-embers';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    let width = 0;
    let height = 0;

    // Tokens de tema
    let emberCore = 'rgba(255, 232, 170, 0.85)';
    let emberRing = 'rgba(255, 168, 88, 0.85)';
    let emberGlow = 'rgba(255, 150, 70, 0.45)';
    let density = 0.9;
    let sizeMin = 1.8;
    let sizeMax = 3.4;
    let speedMin = 22; // px/s
    let speedMax = 48; // px/s

    function readThemeTokens() {
      emberCore = getCssVar('--ember-core', emberCore);
      emberRing = getCssVar('--ember-ring', emberRing);
      emberGlow = getCssVar('--ember-glow', emberGlow);
      density = getCssVarNum('--ember-density', density);
      sizeMin = getCssVarPx('--ember-size-min', sizeMin);
      sizeMax = getCssVarPx('--ember-size-max', sizeMax);
      speedMin = getCssVarNum('--ember-speed-min', speedMin);
      speedMax = getCssVarNum('--ember-speed-max', speedMax);
    }

    // Partículas
    let embers = [];
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

    function getEmberCount() {
      const w = window.innerWidth;
      let base;
      if (w < 576) base = 18; // mobile
      else if (w < 992) base = 26; // tablet
      else base = 34; // desktop
      return Math.max(8, Math.min(60, Math.round(base * density)));
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    function spawnEmber() {
      // Área de spawn: parte inferior da viewport (para sensação de ascensão)
      const minY = height * 0.62;
      const maxY = height * 0.98;
      let x;
      // Peso aos lados (~40%) para estética mais sofisticada
      const edge = Math.random() < 0.4;
      if (edge) {
        const left = Math.random() < 0.5;
        const edgeWidth = Math.max(30, width * 0.12);
        x = left ? rand(0, edgeWidth) : rand(width - edgeWidth, width);
      } else {
        x = rand(0, width);
      }
      const y = rand(minY, maxY);

      const r = rand(sizeMin, sizeMax);
      const vy = -rand(speedMin, speedMax) / 60; // px/frame (
      const vx = rand(-0.15, 0.15); // leve drift horizontal
      const phase = Math.random() * Math.PI * 2; // flicker e drift
      const twinkle = 0.15 + Math.random() * 0.25; // amplitude sutil de flicker

      return { x, y, r, vx, vy, phase, twinkle };
    }

    function createEmbers() {
      const count = getEmberCount();
      embers = new Array(count).fill(0).map(spawnEmber);
    }

    function step() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.globalCompositeOperation = 'lighter';
      ctx.clearRect(0, 0, width, height);
      ctx.shadowColor = emberGlow;
      ctx.shadowBlur = isDark ? 8 : 6;

      const t = performance.now() / 1000;
      for (let i = 0; i < embers.length; i++) {
        const p = embers[i];

        // Atualiza posição (leve curva com seno)
        const sway = Math.sin(t * 0.7 + p.phase) * 0.12; // oscilação horizontal
        p.x += p.vx + sway;
        p.y += p.vy;

        // Flicker suave no raio
        const rf = p.r * (1 + Math.sin(t * 2.2 + p.phase) * p.twinkle * 0.18);

        // Desenho com gradiente radial
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rf * 2.6);
        grad.addColorStop(0, emberCore);
        grad.addColorStop(0.45, emberRing);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.arc(p.x, p.y, rf, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Wrap quando sai pela parte superior; respawn embaixo
        if (p.y + rf < -10) {
          embers[i] = spawnEmber();
          embers[i].y = height + rand(0, 14); // reentrar pelo fundo
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
      }

      animationId = requestAnimationFrame(step);
    }

    // Atualiza tokens no toggle de tema
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      for (const m of mutations) {
        if (m.attributeName === 'data-theme' || m.attributeName === 'style') {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) {
        const prevDensity = density;
        readThemeTokens();
        // Se a densidade mudou significativamente, recria as partículas
        if (Math.abs(prevDensity - density) > 0.01) {
          createEmbers();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });

    // Inicializa
    resize();
    readThemeTokens();
    createEmbers();
    console.debug('[embers] init', { reduced, dpr, count: embers.length });

    if (!reduced) {
      animationId = requestAnimationFrame(step);
    } else {
      // Render estático quando reduz movimento
      ctx.globalCompositeOperation = 'lighter';
      ctx.clearRect(0, 0, width, height);
      ctx.shadowColor = emberGlow;
      ctx.shadowBlur = document.documentElement.getAttribute('data-theme') === 'dark' ? 8 : 6;
      for (const p of embers) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
        grad.addColorStop(0, emberCore);
        grad.addColorStop(0.45, emberRing);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Eventos
    const onResize = () => {
      resize();
      createEmbers();
    };
    window.addEventListener('resize', onResize);

    // Assina eventos do bus para reagir a tema e controlador por seção
    const offTheme = on('theme:changed', () => {
      const prevDensity = density;
      readThemeTokens();
      if (Math.abs(prevDensity - density) > 0.01) {
        createEmbers();
      }
    });

    const offEmbers = on('embers:settings', () => {
      const prevDensity = density;
      readThemeTokens();
      if (Math.abs(prevDensity - density) > 0.01) {
        createEmbers();
      }
    });

    // Cleanup
    window.addEventListener('beforeunload', () => {
      try {
        window.removeEventListener('resize', onResize);
        observer.disconnect();
        if (animationId) cancelAnimationFrame(animationId);
        offTheme?.();
        offEmbers?.();
      } catch (e) {}
    });
  } catch (error) {
    console.error('Erro ao inicializar embers:', error);
  }
}