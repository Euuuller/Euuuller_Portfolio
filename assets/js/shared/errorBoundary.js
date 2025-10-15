/**
 * ==========================================
 * ERROR BOUNDARY GLOBAL (vanilla)
 * Captura erros e rejections para logging estruturado
 * ==========================================
 */

import { logger } from '../utils/logger.js';

/**
 * Inicializa handlers globais de erro.
 */
export function initErrorBoundary() {
  try {
    window.addEventListener('error', (event) => {
      logger.error('Erro global capturado:', event.error || event.message || event);
    });
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Promise não tratada:', event.reason || event);
    });
  } catch (error) {
    // Falha silenciosa, não bloquear app
    console.error('[errorBoundary] falha ao inicializar:', error);
  }
}