/**
 * ==========================================
 * FUNÇÃO DE DEBOUNCE
 * ==========================================
 */

/**
 * Função debounce para limitar a taxa de execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em milissegundos
 * @returns {Function} Função debounceada
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}