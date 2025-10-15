/**
 * ==========================================
 * MÓDULO DE BOTÃO VOLTAR AO TOPO
 * ==========================================
 */

let scrollToTopBtn;

/**
 * Inicializa o botão voltar ao topo
 */
export function initScrollToTop() {
    try {
        scrollToTopBtn = document.getElementById('scroll-to-top');
        
        if (!scrollToTopBtn) {
            console.warn('Botão de voltar ao topo não encontrado');
            return;
        }
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } catch (error) {
        console.error('Erro na inicialização do botão voltar ao topo:', error);
    }
}