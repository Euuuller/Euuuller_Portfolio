# Portfólio de Análise e Ciência de Dados — Euller dos Santos

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Status](https://img.shields.io/badge/status-ativo-success.svg)](index.html) [![Stack: HTML/CSS/JS](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-orange.svg)](index.html) [![Deploy: GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github)](https://pages.github.com/)

## Visão Geral
Este portfólio apresenta minhas habilidades, projetos e experiências em Análise/Ciência de Dados, com foco em uma experiência moderna, responsiva e acessível. A aplicação é construída em HTML, CSS e JavaScript modular e pode ser publicada facilmente no GitHub Pages.

## Objetivos
- Demonstrar competências em análise, visualização e modelagem estatística/ML.
- Exibir projetos práticos com dados públicos e contexto de negócio.
- Organizar habilidades técnicas por categorias (Linguagens & BDs, Visualização, ML & Estatística, Engenharia de Software).
- Oferecer navegação clara, rápida e responsiva.

## Tecnologias e Ferramentas
- Web: HTML5, CSS3 (componentes e layout), JavaScript (ES Modules)
- Visualização/Análise: Power BI, Excel, Tableau, Python (Pandas/NumPy/Scikit-learn), R
- Infra e Dev: Git, Docker, GitHub Pages estático (`.nojekyll`)
- Ícones: Devicon (CDN)

## Estrutura do Projeto
```
Euuller_Portfolio/
├── index.html
├── .nojekyll
├── LICENSE
├── README.md
├── assets/
│   ├── css/
│   │   ├── base/  ├── components/  ├── layout/  ├── style.css  └── utils/
│   ├── images/
│   │   ├── profile.svg  └── skills/
│   └── js/
│       ├── main.js  ├── modules/  └── utils/
├── assets/docs/     (documentos estáticos, ex.: Curriculum.pdf)
└── ...
```
- Página principal: [`index.html`](index.html)
- Estilos: [`assets/css`](assets/css) e subpastas
- Scripts: [`assets/js`](assets/js), com `main.js` orquestrando módulos
- Imagens/Ícones: [`assets/images`](assets/images)

## Instalação e Configuração
Requisitos:
- Navegador moderno (Chrome, Edge, Firefox, Safari)
- Opcional: Python 3 para servir localmente (ou VSCode + Live Server)

Passos:
1. Clone ou baixe este repositório.
2. Abra `index.html` diretamente no navegador; ou
3. Sirva localmente com Python:
```bash
python -m http.server 5500
# Acesse: http://localhost:5500/
```

## Publicação (GitHub Pages Estático)
Este projeto está configurado para publicação estática no GitHub Pages. O arquivo `.nojekyll` na raiz garante que o Jekyll não seja executado, servindo diretamente os arquivos HTML/CSS/JS.

Como habilitar a publicação:
1. No GitHub, vá em Settings → Pages.
2. Em “Build and deployment”, selecione “Deploy from a branch”.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Clique em “Save”. A URL do site ficará disponível em `https://euuuller.github.io/Euuuller_Project/`.

Observações:
- Caso futuramente você deseje usar Jekyll, remova o `.nojekyll` e adicione um `_config.yml` conforme sua necessidade.
- Se adicionar etapas de build (por exemplo, Vite/React/Vue), configure um workflow do GitHub Actions para construir e publicar os artefatos.

## Padronização e Qualidade de Código
Este repositório segue boas práticas para garantir consistência e qualidade:
- Formatação: <mcfile name=".prettierrc" path="c:\Users\Euller dos Santos\Documents\Project\Euuller_Portfolio\.prettierrc"></mcfile>
- Padronização entre editores/IDEs: <mcfile name=".editorconfig" path="c:\Users\Euller dos Santos\Documents\Project\Euuller_Portfolio\.editorconfig"></mcfile>
- Portabilidade e EOL: <mcfile name=".gitattributes" path="c:\Users\Euller dos Santos\Documents\Project\Euuller_Portfolio\.gitattributes"></mcfile>
- Itens ignorados no versionamento: <mcfile name=".gitignore" path="c:\Users\Euller dos Santos\Documents\Project\Euuller_Portfolio\.gitignore"></mcfile>

Dicas:
- Caso utilize Prettier localmente, você pode rodar a formatação antes de commitar.
- Se futuramente for necessário um passo de build (Vite/React/Vue), o workflow já possui comentários indicando onde inserir as etapas (setup-node, install, build).
## Guia passo a passo detalhado para publicar no GitHub Pages
1. Primeiro, certifique-se de que seu projeto está versionado no GitHub:
   - Crie um repositório no GitHub (se ainda não tiver)
   - Faça commit e push do seu código para o repositório

2. Para projetos estáticos (HTML/CSS/JS):
   - Acesse as configurações do seu repositório no GitHub
   - Navegue até a seção "Pages" no menu lateral
   - Selecione a branch que contém seu código (geralmente `main` ou `gh-pages`)
   - Clique em "Save" para publicar

3. Para projetos que precisam ser construídos (React, Vue, etc.):
   - Configure um workflow do GitHub Actions para construir seu projeto
   - Especifique a pasta de saída (ex: `dist`, `build`, `public`)
   - Ative o GitHub Pages para publicar a partir dessa pasta

4. Após a publicação:
- Seu site estará disponível em: `https://euuuller.github.io/Euuuller_Project/`
   - As atualizações podem levar alguns minutos para serem publicadas

Observação: Para projetos não estáticos, você precisará configurar adequadamente o processo de build antes da publicação.

## Exemplos de Análises Realizadas
- Habilidades Técnicas: [`index.html#skills`](index.html#skills)
- Projetos em Destaque: [`index.html#projects`](index.html#projects)

Tipos de entregáveis:
- Limpeza, transformação e exploração (Pandas/NumPy)
- Dashboards e relatórios (Power BI, Tableau, Excel)
- Modelagem estatística e ML (Scikit-learn, R)
- Boas práticas de engenharia (Git, Docker) e documentação

## Resultados Obtidos
- Portfólio estruturado por categorias de habilidades e projetos.
- Layout responsivo e acessível para diferentes dispositivos.
- Filtragem e animações suaves na seção de habilidades.
- Apresentação clara de ferramentas e tecnologias aplicadas.

## Próximos Passos Planejados
- Adicionar novos projetos com notebooks e repositórios de dados.
- Publicar estudos de caso com métricas de impacto.
- Integrar pipelines de ETL e automação básica de coleta.
- Expandir visualizações (Power BI/Tableau) com exemplos interativos.
- Melhorar acessibilidade e performance (auditorias Lighthouse).

## Contato
Use a seção de contato do site: [`index.html#contact`](index.html#contact)

## Licença
Licença MIT — veja [`LICENSE`](LICENSE) para mais detalhes.
