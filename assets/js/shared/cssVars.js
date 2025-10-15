/**
 * ==========================================
 * UTILITÁRIOS DE VARIÁVEIS CSS (Design Tokens)
 * Centraliza leitura segura de tokens do :root
 * ==========================================
 */

/**
 * Lê uma variável CSS do :root.
 * @param {string} name - Nome da variável CSS (ex: '--ember-core')
 * @param {string} [fallback] - Valor padrão caso não exista
 * @returns {string}
 */
export function getCssVar(name, fallback = '') {
  try {
    const styles = getComputedStyle(document.documentElement);
    const value = styles.getPropertyValue(name).trim();
    return value || fallback;
  } catch (error) {
    console.warn('[cssVars] Falha ao ler', name, error);
    return fallback;
  }
}

/**
 * Lê uma variável CSS numérica (sem unidade) do :root.
 * @param {string} name - Nome da variável CSS (ex: '--ember-density')
 * @param {number} [fallback] - Valor padrão caso não exista
 * @returns {number}
 */
export function getCssVarNum(name, fallback = 0) {
  const v = parseFloat(getCssVar(name, ''));
  return Number.isFinite(v) ? v : fallback;
}

/**
 * Lê uma variável CSS em pixels e converte para número (px sem sufixo).
 * @param {string} name - Nome da variável CSS (ex: '--ember-size-min')
 * @param {number} [fallback] - Valor padrão caso não exista
 * @returns {number}
 */
export function getCssVarPx(name, fallback = 0) {
  const raw = getCssVar(name, '');
  const v = parseFloat(String(raw).replace('px', ''));
  return Number.isFinite(v) ? v : fallback;
}