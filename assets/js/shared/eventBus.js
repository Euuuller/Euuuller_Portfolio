/**
 * ==========================================
 * EVENT BUS SIMPLES (Publish/Subscribe)
 * Desacopla módulos via eventos sem dependências diretas
 * ==========================================
 */

const listeners = new Map(); // Map<string, Set<Function>>

/**
 * Assina um evento.
 * @param {string} event - Nome do evento (ex: 'theme:changed')
 * @param {(payload:any)=>void} handler - Função chamada ao emitir
 * @returns {() => void} Função para desinscrever
 */
export function on(event, handler) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(handler);
  return () => off(event, handler);
}

/**
 * Remove um handler de um evento.
 * @param {string} event
 * @param {(payload:any)=>void} handler
 */
export function off(event, handler) {
  const set = listeners.get(event);
  if (set) {
    set.delete(handler);
    if (set.size === 0) listeners.delete(event);
  }
}

/**
 * Emite um evento com payload.
 * @param {string} event
 * @param {any} payload
 */
export function emit(event, payload) {
  const set = listeners.get(event);
  if (!set || set.size === 0) return;
  set.forEach((handler) => {
    try {
      handler(payload);
    } catch (error) {
      console.error(`[eventBus] Erro em handler de '${event}':`, error);
    }
  });
}