/**
 * ==========================================
 * MÓDULO DE TEMA CLARO/ESCURO
 * ==========================================
 */

import { APP_CONFIG } from '../config.js';
import { emit } from '../shared/eventBus.js';

// Seleciona os elementos do DOM uma única vez
const themeToggle = document.getElementById('theme-toggle');
let currentTheme;

// Funções de apoio (não são exportadas, são privadas para este módulo)
function getStoredTheme() {
    try {
        return localStorage.getItem(APP_CONFIG.theme.storageKey);
    } catch (error) {
        console.warn('LocalStorage não disponível:', error);
        return null;
    }
}

function setStoredTheme(theme) {
    try {
        localStorage.setItem(APP_CONFIG.theme.storageKey, theme);
    } catch (error) {
        console.warn('Não foi possível salvar o tema:', error);
    }
}

function applyTheme(theme) {
    try {
        const root = document.documentElement;
        // Desativa transições temporariamente para troca instantânea
        root.classList.add('disable-transitions');
        root.setAttribute('data-theme', theme);
        currentTheme = theme;
        setStoredTheme(theme);
        // Remove a desativação na próxima frame para não impactar outras interações
        requestAnimationFrame(() => {
            root.classList.remove('disable-transitions');
        });
        // Emite evento de tema alterado para módulos interessados
        emit('theme:changed', { theme });
    } catch (error) {
        console.error('Erro ao aplicar tema:', error);
    }
}

function toggleTheme() {
    try {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    } catch (error) {
        console.error('Erro ao alternar tema:', error);
    }
}

// Função principal que será exportada e chamada no main.js
export function initTheme() {
    if (!themeToggle) {
        console.warn('Botão de toggle de tema não encontrado');
        return;
    }

    currentTheme = getStoredTheme() || APP_CONFIG.theme.defaultTheme;
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', toggleTheme);
}