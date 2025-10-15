# Otimizações Recomendadas para assets/js

Este relatório documenta oportunidades de melhoria de desempenho, simplificação e correções seguras na pasta `assets/js`.

## Visão Geral do Fluxo
- `assets/js/main.js` orquestra módulos e já aplica boas práticas: `DOMContentLoaded`, `load` e gating do efeito de digitação com `IntersectionObserver` e `requestIdleCallback`.
- Módulos principais: `theme`, `mobileMenu`, `navigation`, `typingEffect`, `animations`, `contactForm`, `scrollToTop`, `preloader`, `codeSnippet`, `skillsFilters`.
- Utilitários: `debounce`, `throttle`, `logger`, `eventBus`, `a11y`, `cssVars`.

## Otimizações de Performance
1. Scroll e resize
   - `modules/eventHandlers.js` usa `throttle` com `APP_CONFIG.animation.debounceDelay = 10ms`. Sugestão: elevar para `60–120ms` (ex.: `100ms`) para reduzir custo por frame, mantendo responsividade.
   - Tornar `checkVisibleElements` baseado em `IntersectionObserver` para marcar `.visible` uma única vez, evitando varreduras com `querySelectorAll` a cada scroll.

2. Navegação ativa
   - Em `modules/navigation.js`, `updateActiveNavLink()` remove/adiciona classes em todos os links a cada scroll. Sugestão: cache de links no `initNavigation()` (de ambos menus) e atualize apenas quando o ID ativo muda; isso reduz manipulações repetidas de classe e queries.

3. Seletores e cache de DOM
   - Em `modules/animations.js` e `modules/skillsFilters.js`, consolidar seletores em variáveis iniciais e reaproveitar `NodeList` quando possível.
   - Evitar `getBoundingClientRect()` em alta frequência (substituir por `IntersectionObserver`).

4. Efeito de digitação
   - O gating por `prefers-reduced-motion` já ocorre no `main.js`. Opcional: replicar verificação no `typingEffect` para maior robustez, caso seja inicializado diretamente.

5. Preloader
   - `window.addEventListener('load', hidePreloader)` é registrado em `main.js` e também via `bindEvents`. Remover uma das inscrições para evitar duplicidade (preferir centralizar no `main.js`).

## Correções e Simplificações Seguras
1. Barrels e exports
   - `utils/index.js` exporta `default` de arquivos que não possuem `default export`. Corrigir para exports nomeados:
     ```js
     // utils/index.js
     export { debounce } from './debounce.js';
     export { throttle } from './throttle.js';
     export { createLogger, logger } from './logger.js';
     ```
   - `shared/index.js` exporta `once` que não existe em `eventBus.js`. Opções:
     - Remover `once` do barrel; ou
     - Implementar `once(event, handler)` em `eventBus.js` (assina e desinscreve após primeira chamada).

2. Eventos globais de erro
   - `shared/errorBoundary.js` já registra `error` e `unhandledrejection` com `logger`. Em `modules/eventHandlers.js`, o listener adicional de `error` gera duplicidade. Remover o segundo para evitar logs em dobro.

3. Inline styles no formulário
   - `modules/contactForm.js` aplica estilos inline na mensagem. Sugerir mover para CSS (classe `.form-message` com variantes `--success` e `--error`) para reduzir custo de reflow e melhorar manutenção.

## Acessibilidade e UX
- `mobileMenu.js`: alternar atributo `aria-expanded` no botão e `aria-hidden` no menu ao abrir/fechar.
- `scrollToTop.js`: adicionar `aria-label` (já presente no HTML) e focar o topo após scroll com `document.getElementById('home')?.focus()` para leitores de tela (opcional).
- `typingEffect.js`: respeitar `prefers-reduced-motion` também dentro do módulo.

## Configuração
- `APP_CONFIG.animation.debounceDelay` nome sugere debounce, mas é usado como throttle. Renomear para `scrollThrottleMs` e ajustar o valor para `~100ms` (mudança cosmética + semântica) para clareza.

## Plano de Implementação (Prioridade)
1) Corrigir barrels (`utils/index.js`, `shared/index.js`) e implementar `once` ou remover do barrel.
2) Remover duplicidade de `load` e `error` listeners em `eventHandlers.js` (centralizar no `main.js` e `errorBoundary`).
3) Elevar `APP_CONFIG.animation.debounceDelay` para `100ms` e medir responsividade.
4) Refatorar `animations.js` para `IntersectionObserver` (impacto positivo em CPU com scroll).
5) Cachear listas de links em `navigation.js` e atualizar estado ativo de forma incremental.
6) Migrar estilos inline do `contactForm` para CSS.

## Observações Finais
- O projeto já adota práticas modernas (listeners passivos, gating de efeitos, modularização). As melhorias acima focam reduzir custo por frame, simplificar pontos de duplicidade e alinhar exports.
- Todas as mudanças propostas são retrocompatíveis e não devem afetar funcionalidade quando aplicadas cuidadosamente.