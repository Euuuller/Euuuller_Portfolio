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
import { initParticles } from './modules/particles.js';
import { initGalaxyParallax } from './modules/galaxyParallax.js';
import { initEmbers } from './modules/embers.js';
import { initEmbersController } from './modules/embersController.js';
import { initErrorBoundary } from './shared/errorBoundary.js';
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
        initTypingEffect();
        initScrollAnimations();
        initContactForm();
        initScrollToTop();
        initAboutCodeSnippet();
        initSkillsFilters();
        initParticles();
        initEmbers();
        initEmbersController();
        initGalaxyParallax();

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
