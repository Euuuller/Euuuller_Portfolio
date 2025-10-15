/**
 * ==========================================
 * MÓDULO DE ANIMAÇÕES DE SCROLL
 * ==========================================
 */

import { APP_CONFIG } from '../config.js';

/**
 * Inicializa as animações de scroll
 */
export function initScrollAnimations() {
    try {
        // Adiciona classes de animação aos elementos
        addAnimationClasses();
        
        // Verifica elementos visíveis no carregamento
        checkVisibleElements();
    } catch (error) {
        console.error('Erro na inicialização das animações de scroll:', error);
    }
}

/**
 * Adiciona classes de animação aos elementos
 */
function addAnimationClasses() {
    try {
        // Adiciona classes baseadas na posição dos elementos
        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('fade-in');
        });

        document.querySelectorAll('.hero__text').forEach(el => {
            el.classList.add('fade-in-left');
        });

        document.querySelectorAll('.hero__image').forEach(el => {
            el.classList.add('fade-in-right');
        });

        document.querySelectorAll('.about__text').forEach(el => {
            el.classList.add('fade-in-left');
        });

        document.querySelectorAll('.about__image').forEach(el => {
            el.classList.add('fade-in-right');
        });

        // Aplica fade-in com leve atraso apenas em skill cards (efeito em cascata)
        document.querySelectorAll('.skill-card').forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.08}s`;
        });

        // Aplica fade-in nos project cards sem atraso e com duração menor para surgimento mais rápido
        document.querySelectorAll('.project-card').forEach((el) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = '0s';
            el.style.transitionDuration = '0.25s';
        });

        document.querySelectorAll('.contact__form').forEach(el => {
            el.classList.add('fade-in');
        });
    } catch (error) {
        console.error('Erro ao adicionar classes de animação:', error);
    }
}

/**
 * Verifica elementos visíveis na viewport
 */
export function checkVisibleElements() {
    try {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
        
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    } catch (error) {
        console.error('Erro ao verificar elementos visíveis:', error);
    }
}

/**
 * Verifica se um elemento está na viewport
 * @param {HTMLElement} element - Elemento a ser verificado
 * @returns {boolean} True se o elemento está na viewport
 */
function isElementInViewport(element) {
    try {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight - APP_CONFIG.animation.scrollOffset &&
            rect.bottom >= APP_CONFIG.animation.scrollOffset
        );
    } catch (error) {
        console.error('Erro ao verificar viewport:', error);
        return false;
    }
}