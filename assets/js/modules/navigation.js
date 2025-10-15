/**
 * ==========================================
 * MÓDULO DE NAVEGAÇÃO E SCROLL SUAVE
 * ==========================================
 */

import { APP_CONFIG } from '../config.js';

let navLinks, sections;

/**
 * Inicializa a navegação
 */
export function initNavigation() {
    try {
        navLinks = document.querySelectorAll('a[href^="#"]');
        sections = document.querySelectorAll('section[id]');
        
        if (navLinks.length === 0) {
            console.warn('Nenhum link de navegação encontrado');
            return;
        }
        
        // Adiciona scroll suave aos links de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    scrollToSection(targetSection);
                }
            });
        });
    } catch (error) {
        console.error('Erro na inicialização da navegação:', error);
    }
}

/**
 * Realiza scroll suave para uma seção
 * @param {HTMLElement} section - Elemento da seção alvo
 */
function scrollToSection(section) {
    try {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Erro no scroll para seção:', error);
    }
}

/**
 * Atualiza o link de navegação ativo com base na posição de scroll
 */
export function updateActiveNavLink() {
    try {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class de todos os links
                document.querySelectorAll('.header__nav-link, .mobile-menu__nav-link').forEach(link => {
                    link.classList.remove('header__nav-link--active', 'mobile-menu__nav-link--active');
                });
                
                // Adiciona active class ao link correspondente
                document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
                    if (link.classList.contains('header__nav-link')) {
                        link.classList.add('header__nav-link--active');
                    } else if (link.classList.contains('mobile-menu__nav-link')) {
                        link.classList.add('mobile-menu__nav-link--active');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar link ativo:', error);
    }
}