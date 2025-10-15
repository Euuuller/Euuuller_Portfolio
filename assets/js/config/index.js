/**
 * ==========================================
 * CONFIGURAÇÃO GLOBAL DA APLICAÇÃO (centralizada)
 * ==========================================
 */

// Exporta a configuração para ser usada em toda a aplicação
export const APP_CONFIG = {
    // Configurações do efeito de digitação
    typing: {
        strings: ['Cientista de Dados', 'Data Science', 'Graduando em Engenharia Elétrica'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        startDelay: 500,
        loop: true
    },
    
    // Configurações de animação
    animation: {
        scrollOffset: 100,
        debounceDelay: 10
    },
    
    // Configurações do tema
    theme: {
        storageKey: 'portfolio-theme',
        defaultTheme: 'light'
    }
};