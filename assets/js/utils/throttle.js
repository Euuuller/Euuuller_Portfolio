/**
 * ==========================================
 * FUNÇÃO DE THROTTLE
 * Limita execução de função a cada intervalo especificado
 * ==========================================
 */

/**
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Intervalo em ms
 * @returns {Function}
 */
export function throttle(func, wait = 50) {
  let last = 0;
  let timer = null;
  let lastArgs = [];
  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    lastArgs = args;
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      func(...lastArgs);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        func(...lastArgs);
      }, remaining);
    }
  };
}