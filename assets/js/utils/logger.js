/**
 * ==========================================
 * LOGGER ESTRUTURADO
 * ==========================================
 */

/**
 * Cria um logger com namespace para facilitar rastreio.
 * @param {string} ns
 */
export function createLogger(ns = 'app') {
  const prefix = `[${ns}]`;
  return {
    debug: (...args) => console.debug(prefix, ...args),
    info: (...args) => console.info(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args),
  };
}

// Logger padrão do app
export const logger = createLogger('app');