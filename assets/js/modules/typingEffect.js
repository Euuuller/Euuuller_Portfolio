/**
 * ==========================================
 * MÓDULO DE EFEITO DE DIGITAÇÃO
 * ==========================================
 */

import { APP_CONFIG } from '../config.js';

let typedElement, typingConfig, currentStringIndex, currentCharIndex, typingTimeout;

/**
 * Inicializa o efeito de digitação
 */
export function initTypingEffect() {
    try {
        typedElement = document.getElementById('typed-text');
        
        if (!typedElement) {
            console.warn('Elemento de texto digitado não encontrado');
            return;
        }

        typingConfig = { ...APP_CONFIG.typing };
        currentStringIndex = 0;
        currentCharIndex = 0;
        typingTimeout = null;

        // Garantir estabilidade visual: evitar “saltos” ao trocar de frase
        const styles = getComputedStyle(typedElement);
        typedElement.style.display = 'inline-block';
        typedElement.style.whiteSpace = 'nowrap';
        // Medir e fixar a largura mínima pela maior frase
        const maxWidth = measureMaxPhraseWidth(typingConfig.strings, styles);
        if (maxWidth > 0) {
            typedElement.style.minWidth = `${maxWidth}px`;
        }

        // Inicia o efeito após um delay
        setTimeout(() => {
            typeText();
        }, typingConfig.startDelay);
    } catch (error) {
        console.error('Erro na inicialização do efeito de digitação:', error);
    }
}

function measureMaxPhraseWidth(strings, baseStyles) {
    try {
        const probe = document.createElement('span');
        probe.style.visibility = 'hidden';
        probe.style.position = 'absolute';
        probe.style.whiteSpace = 'nowrap';
        probe.style.fontSize = baseStyles.fontSize;
        probe.style.fontWeight = baseStyles.fontWeight;
        probe.style.fontFamily = baseStyles.fontFamily;
        document.body.appendChild(probe);
        let max = 0;
        strings.forEach(s => {
            probe.textContent = s;
            const w = probe.offsetWidth;
            if (w > max) max = w;
        });
        document.body.removeChild(probe);
        return max;
    } catch (e) {
        return 0;
    }
}

/**
 * Função principal que controla o efeito de digitação
 * Fluxo contínuo: sem etapa de deleção (no backspace)
 */
function typeText() {
    try {
        if (!typedElement || !typingConfig.strings.length) return;
        
        const currentString = typingConfig.strings[currentStringIndex];
        
        // Adicionando caracteres continuamente
        typedElement.textContent = currentString.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentString.length) {
            // Ao finalizar a frase, aguarda e passa para a próxima sem "apagar"
            typingTimeout = setTimeout(() => {
                currentStringIndex = (currentStringIndex + 1) % typingConfig.strings.length;
                currentCharIndex = 0;
                // Limpa o conteúdo para iniciar a próxima frase sem regressão perceptível
                typedElement.textContent = '';
                typeText();
            }, typingConfig.backDelay);
        } else {
            typingTimeout = setTimeout(() => typeText(), typingConfig.typeSpeed);
        }
    } catch (error) {
        console.error('Erro no efeito de digitação:', error);
    }
}