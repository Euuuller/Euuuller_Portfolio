/**
 * ==========================================
 * MÓDULO DE MANIPULADORES DE EVENTOS
 * ==========================================
 */

import { debounce } from '../utils/debounce.js';
import { throttle } from '../utils/throttle.js';
import { APP_CONFIG } from '../config.js';
import { updateActiveNavLink } from './navigation.js';
import { checkVisibleElements } from './animations.js';
import { closeMobileMenu } from './mobileMenu.js';

/**
 * Vincula eventos globais
 * @param {Object} dependencies - Dependências necessárias
 */
export function bindEvents(dependencies) {
    try {
        // Evento de scroll otimizado com throttle e listener passivo
        const onScrollThrottled = throttle(() => {
            handleScroll();
        }, APP_CONFIG.animation.scrollThrottleMs);
        window.addEventListener('scroll', onScrollThrottled, { passive: true });

        // Evento de redimensionamento (debounce)
        window.addEventListener('resize', debounce(() => {
            handleResize();
        }, 250));

    } catch (error) {
        console.error('Erro ao vincular eventos:', error);
    }
}

/**
 * Manipulador de evento de scroll
 */
function handleScroll() {
    try {
        updateActiveNavLink();
        checkVisibleElements();
    } catch (error) {
        console.error('Erro no manipulador de scroll:', error);
    }
}

/**
 * Manipulador de evento de redimensionamento
 */
function handleResize() {
    try {
        // Fecha o menu mobile se estiver aberto
        if (window.innerWidth >= 992 && document.getElementById('mobile-menu')?.classList.contains('active')) {
            closeMobileMenu();
        }
    } catch (error) {
        console.error('Erro no manipulador de redimensionamento:', error);
    }
}