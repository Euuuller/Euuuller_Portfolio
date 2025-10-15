/**
 * ==========================================
 * CONTROLADOR DE EMBERS POR SEÇÃO
 * Ajusta densidade e paleta (marca) conforme a seção em destaque
 * ==========================================
 */

import { emit } from '../shared/eventBus.js';

export function initEmbersController() {
  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sections = Array.from(document.querySelectorAll('.section'));
    if (!sections.length) return;

    const root = document.documentElement;
    const styles = getComputedStyle(root);

    // Guardar defaults para restaurar fora da Home
    const defaults = {
      core: styles.getPropertyValue('--ember-core').trim(),
      ring: styles.getPropertyValue('--ember-ring').trim(),
      glow: styles.getPropertyValue('--ember-glow').trim(),
      density: styles.getPropertyValue('--ember-density').trim(),
    };

    // Configuração por seção
    const SECTION_SETTINGS = {
      home: {
        density: '1.0',
        palette: 'brand', // usa tokens de marca
        glowOverride: '', // opcional
      },
      about: {
        density: '0.7',
        palette: 'default',
        glowOverride: 'rgba(255, 150, 70, 0.40)',
      },
      skills: {
        density: '0.85',
        palette: 'default',
        glowOverride: '',
      },
      projects: {
        density: '0.9',
        palette: 'default',
        glowOverride: '',
      },
      contact: {
        density: '0.65',
        palette: 'default',
        glowOverride: 'rgba(255, 150, 70, 0.40)',
      }
    };

    let currentId = '';
    let rafId = null;

    const getViewportCenterY = () => window.scrollY + (window.innerHeight * 0.5);

    function findActiveSection() {
      const centerY = getViewportCenterY();
      let best = { id: '', dist: Infinity };
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const bottom = top + rect.height;
        const mid = (top + bottom) / 2;
        const dist = Math.abs(mid - centerY);
        const id = s.id || '';
        if (dist < best.dist) best = { id, dist };
      }
      return best.id;
    }

    function applySettings(id) {
      const cfg = SECTION_SETTINGS[id];
      if (!cfg) {
        // Restaura defaults
        set('--ember-density', defaults.density);
        set('--ember-core', defaults.core);
        set('--ember-ring', defaults.ring);
        set('--ember-glow', defaults.glow);
        emit('embers:settings', { id: 'default', density: parseFloat(defaults.density), core: defaults.core, ring: defaults.ring, glow: defaults.glow });
        return;
      }

      set('--ember-density', cfg.density);
      if (cfg.palette === 'brand') {
        set('--ember-core', styles.getPropertyValue('--ember-core-brand').trim() || defaults.core);
        set('--ember-ring', styles.getPropertyValue('--ember-ring-brand').trim() || defaults.ring);
        set('--ember-glow', styles.getPropertyValue('--ember-glow-brand').trim() || defaults.glow);
      } else {
        set('--ember-core', defaults.core);
        set('--ember-ring', defaults.ring);
        set('--ember-glow', defaults.glow);
      }
      if (cfg.glowOverride) set('--ember-glow', cfg.glowOverride);

      // Emite evento para módulos interessados (ex: embers) reagirem sem observer
      emit('embers:settings', {
        id,
        density: parseFloat(cfg.density),
        core: getComputedStyle(document.documentElement).getPropertyValue('--ember-core').trim(),
        ring: getComputedStyle(document.documentElement).getPropertyValue('--ember-ring').trim(),
        glow: getComputedStyle(document.documentElement).getPropertyValue('--ember-glow').trim(),
      });
    }

    function set(name, value) {
      root.style.setProperty(name, value);
    }

    function update() {
      const id = findActiveSection();
      if (id && id !== currentId) {
        currentId = id;
        applySettings(id);
      }
      rafId = requestAnimationFrame(update);
    }

    update();

    // Cleanup
    window.addEventListener('beforeunload', () => {
      try { if (rafId) cancelAnimationFrame(rafId); } catch (_) {}
    });
  } catch (error) {
    console.error('Erro ao inicializar controlador de embers por seção:', error);
  }
}