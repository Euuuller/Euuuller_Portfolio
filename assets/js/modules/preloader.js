/**
 * ==========================================
 * MÓDULO DE PRELOADER
 * ==========================================
 */

let preloader, mainContent;

/**
 * Inicializa o preloader
 */
export function initPreloader() {
    try {
        preloader = document.getElementById('preloader');
        mainContent = document.getElementById('main-content');
        
        if (!preloader || !mainContent) {
            console.warn('Elementos do preloader não encontrados');
            return;
        }
        
        // Auto-hide do preloader após 3 segundos como fallback
        setTimeout(() => {
            if (preloader && !preloader.classList.contains('hidden')) {
                hidePreloader();
            }
        }, 3000);
    } catch (error) {
        console.error('Erro na inicialização do preloader:', error);
    }
}

/**
 * Esconde o preloader
 */
export function hidePreloader() {
    try {
        if (preloader && mainContent) {
            preloader.classList.add('hidden');
            mainContent.classList.add('loaded');
            
            // Remove o preloader do DOM após a animação
            setTimeout(() => {
                if (preloader) {
                    preloader.style.display = 'none';
                }
            }, 500);
        }
    } catch (error) {
        console.error('Erro ao ocultar preloader:', error);
    }
}