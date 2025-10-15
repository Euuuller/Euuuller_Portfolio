/**
 * ==========================================
 * MÓDULO DE FILTROS DA SEÇÃO HABILIDADES
 * ==========================================
 */

/**
 * Inicializa a filtragem de skills por categoria
 */
export function initSkillsFilters() {
  try {
    const filtersContainer = document.querySelector('.skills__filters');
    const filterButtons = document.querySelectorAll('.skills__filter-btn');
    const skillsGrid = document.querySelector('.skills__grid');
    const skillCards = document.querySelectorAll('.skills__grid .skill-card');

    if (!filtersContainer || filterButtons.length === 0 || !skillsGrid || skillCards.length === 0) {
      // Não quebra a aplicação caso a seção não exista
      console.warn('Seção de habilidades não encontrada ou incompleta para filtragem.');
      return;
    }

    let activeCategory = 'languages';

    const setActiveButton = (category) => {
      filterButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-filter') === category;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) {
          btn.classList.remove('btn--secondary');
          btn.classList.add('btn--primary');
        } else {
          btn.classList.remove('btn--primary');
          btn.classList.add('btn--secondary');
        }
      });
    };

    const applyFilter = (category) => {
      let visibleIndex = 0;
      skillCards.forEach((card) => {
        const cardCategory = card.dataset.category || 'uncategorized';
        const shouldShow = cardCategory === category;

        if (shouldShow) {
          // Exibe o card e aplica animação de entrada com atraso em cascata
          card.classList.remove('hidden');
          card.classList.add('enter');
          card.style.animationDelay = `${visibleIndex * 80}ms`;
          card.style.transitionDelay = '0ms';
          card.setAttribute('aria-hidden', 'false');
          // Mantém o card visível após a animação de entrada
          card.classList.add('visible');

          // Remove a classe de animação após concluir para evitar acúmulo
          card.addEventListener('animationend', () => {
            card.classList.remove('enter');
            card.style.animationDelay = '0ms';
          }, { once: true });

          visibleIndex++;
        } else {
          // Oculta completamente o card para não ocupar espaço na grid
          card.classList.add('hidden');
          card.classList.remove('enter');
          card.style.animationDelay = '0ms';
          card.style.transitionDelay = '0ms';
          card.setAttribute('aria-hidden', 'true');
          // Remove visibilidade para evitar que CSS de "fade-in" mantenha opacidade
          card.classList.remove('visible');
        }
      });
    };

    // Bind dos botões
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter');
        if (!category || category === activeCategory) return;
        activeCategory = category;
        setActiveButton(activeCategory);
        applyFilter(activeCategory);
      });
    });

    // Estado inicial
    setActiveButton(activeCategory);
    applyFilter(activeCategory);
  } catch (error) {
    console.error('Erro ao inicializar filtros de habilidades:', error);
  }
}