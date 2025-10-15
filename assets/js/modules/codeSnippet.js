/**
 * ==========================================
 * MÓDULO: Snippet de Código com Efeito de Digitação
 * ==========================================
 */

// Conteúdo do snippet em HTML com marcação de cores
const codeString = [
  '<span class="text-purple-400">import</span> pandas <span class="text-purple-400">as</span> pd',
  '<span class="text-purple-400">from</span> sklearn.ensemble <span class="text-purple-400">import</span> <span class="text-cyan-400">RandomForestRegressor</span>',
  '',
  '<span class="text-gray-500"># Carregando os dados</span>',
  'df = pd.<span class="text-yellow-300">read_csv</span>(<span class="text-green-400">"house_prices.csv"</span>)',
  'X = df.<span class="text-yellow-300">drop</span>(<span class="text-green-400">"price"</span>, axis=<span class="text-orange-400">1</span>)',
  'y = df[<span class="text-green-400">"price"</span>]',
  '',
  '<span class="text-gray-500"># Treinando o modelo</span>',
  'model = <span class="text-cyan-400">RandomForestRegressor</span>(n_estimators=<span class="text-orange-400">100</span>)',
  'model.<span class="text-yellow-300">fit</span>(X, y)',
  '',
  '<span class="text-gray-500"># Fazendo uma nova predição</span>',
  'prediction = model.<span class="text-yellow-300">predict</span>(X.head(<span class="text-orange-400">1</span>))',
  '<span class="text-purple-400">print</span>(f<span class="text-green-400">"Previsão: R$ {prediction[0]:.2f}"</span>)'
].join('\n');

/**
 * Inicializa o snippet com efeito de digitação na seção Sobre
 */
export function initAboutCodeSnippet() {
  try {
    const target = document.getElementById('typed-code');
    if (!target) return;

    const cursorClass = 'code-cursor-active';
    target.classList.add(cursorClass);

    const typeSpeed = 25;
    const pauseAfterComplete = 3000;

    let idx = 0;
    let timeoutId = null;

    const typeNext = () => {
      if (idx <= codeString.length) {
        target.innerHTML = codeString.substring(0, idx);
        idx += 1;
        timeoutId = setTimeout(typeNext, typeSpeed);
      } else {
        // Remover cursor após terminar
        target.classList.remove(cursorClass);
        // Reinicia após uma pausa
        setTimeout(() => {
          idx = 0;
          target.innerHTML = '';
          target.classList.add(cursorClass);
          typeNext();
        }, pauseAfterComplete);
      }
    };

    typeNext();

    // Cleanup on navigation/unmount
    window.addEventListener('beforeunload', () => {
      if (timeoutId) clearTimeout(timeoutId);
    });
  } catch (error) {
    console.error('Erro ao inicializar o snippet de código:', error);
  }
}