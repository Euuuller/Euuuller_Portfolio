/**
 * ==========================================
 * PONTO DE ENTRADA (ENTRY POINT) DO JAVASCRIPT
 * Orquestra a inicialização de todos os módulos.
 * ==========================================
 */

import { initTheme } from './modules/theme.js';
import { initMobileMenu } from './modules/mobileMenu.js';
import { initNavigation, updateActiveNavLink } from './modules/navigation.js';
import { initTypingEffect } from './modules/typingEffect.js';
import { initScrollAnimations, checkVisibleElements } from './modules/animations.js';
import { initContactForm } from './modules/contactForm.js';
import { initScrollToTop } from './modules/scrollToTop.js';
import { initPreloader, hidePreloader } from './modules/preloader.js';
import { bindEvents } from './modules/eventHandlers.js';
import { initAboutCodeSnippet } from './modules/codeSnippet.js';
import { initSkillsFilters } from './modules/skillsFilters.js';
// Módulos visuais pesados serão carregados sob demanda
// importações dinâmicas são usadas para reduzir custo em dispositivos móveis
import { initErrorBoundary } from './shared/errorBoundary.js';
import { prefersReducedMotion } from './shared/a11y.js';
// Funções de inicialização
function initializeApp() {
    try {
        // Inicializa boundary global de erros
        initErrorBoundary();
        // Inicializa todos os módulos importados
        initPreloader();
        initTheme();
        initMobileMenu();
        initNavigation();
        // Tipagem: adiar inicialização para reduzir custo inicial
        // Será disparada ao entrar em viewport do herói e/ou em idle
        initScrollAnimations();
        initContactForm();
        initScrollToTop();
        initAboutCodeSnippet();
        initSkillsFilters();

        // Removidos efeitos visuais de fundo (particles/embers/galaxy)
        const reducedMotion = prefersReducedMotion();

        // Gating para tipagem (typing effect)
        if (!reducedMotion) {
            const hero = document.querySelector('#home');
            const startTyping = () => {
                if ('requestIdleCallback' in window) {
                    window.requestIdleCallback(() => initTypingEffect(), { timeout: 1000 });
                } else {
                    setTimeout(() => initTypingEffect(), 500);
                }
            };

            if (hero) {
                const typingObserver = new IntersectionObserver((entries, obs) => {
                    const entry = entries[0];
                    if (entry && entry.isIntersecting) {
                        obs.disconnect();
                        startTyping();
                    }
                }, { root: null, threshold: 0.15 });
                typingObserver.observe(hero);
            } else {
                startTyping();
            }
        }

        // Vincula eventos globais
        bindEvents({ hidePreloader });

        console.log('✅ Aplicação modular inicializada com sucesso');
    } catch (error) {
        console.error('❌ Erro na inicialização da aplicação:', error);
    }
}

// O evento DOMContentLoaded garante que o script só rode após o HTML ser carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // Caso o script seja carregado após o DOMContentLoaded já ter disparado
  initializeApp();
}

// O evento 'load' espera por tudo (imagens, etc.) para esconder o preloader
window.addEventListener('load', hidePreloader);
