/**
 * ==========================================
 * MÓDULO DE MENU MOBILE
 * ==========================================
 */

// Seleciona os elementos do DOM
let mobileMenuToggle, mobileMenu, mobileMenuClose, mobileMenuOverlay, mobileMenuLinks;

/**
 * Inicializa o menu mobile
 */
export function initMobileMenu() {
    try {
        mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        mobileMenu = document.getElementById('mobile-menu');
        mobileMenuClose = document.getElementById('mobile-menu-close');
        mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        mobileMenuLinks = document.querySelectorAll('.mobile-menu__nav-link');

        if (!mobileMenuToggle || !mobileMenu) {
            console.warn('Elementos do menu mobile não encontrados');
            return;
        }

        // Event listeners
        mobileMenuToggle.addEventListener('click', openMobileMenu);

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        // Fecha o menu ao clicar em um link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Fecha o menu com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    } catch (error) {
        console.error('Erro na inicialização do menu mobile:', error);
    }
}

/**
 * Abre o menu mobile
 */
function openMobileMenu() {
    try {
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.add('active');
            mobileMenuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Erro ao abrir menu mobile:', error);
    }
}

/**
 * Fecha o menu mobile
 */
export function closeMobileMenu() {
    try {
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    } catch (error) {
        console.error('Erro ao fechar menu mobile:', error);
    }
}