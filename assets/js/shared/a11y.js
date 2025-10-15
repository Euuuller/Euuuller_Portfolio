/**
 * ==========================================
 * UTILITÁRIOS DE ACESSIBILIDADE
 * ==========================================
 */

/**
 * Verifica a preferência do usuário por movimento reduzido.
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {
    return false;
  }
}