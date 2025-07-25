/* --- 
Vida em Harmonia: MTC - Folha de Estilos "Tinta e Pincel"
Inspirada na estética da caligrafia e pintura tradicional chinesa.
--- */

/* --- 1. Variáveis Globais e Estilo Base --- */
:root {
    /* Paleta de Cores "Tinta e Pincel" */
    --color-paper: #FDFBF5;         /* Fundo de papel de arroz */
    --color-ink: #1a1a1a;           /* Tinta preta/carvão para texto */
    --color-ink-muted: #5c5c5c;     /* Tinta cinza para texto secundário */
    --color-seal: #9E2B25;          /* Vermelho cinábrio para selos e destaques */
    --color-seal-light: #d4a373;    /* Dourado suave para hover e acentos */
    --color-border: #EAE2D6;        /* Borda subtil cor de papel */
    --color-surface: #ffffff;       /* Superfície branca para os cards */

    /* Cores dos Elementos (Paleta harmonizada) */
    --el-wood: #6A994E;
    --el-fire: #BC4749;
    --el-earth: #E58A4E;
    --el-metal: #A9A9A9;
    --el-water: #3A86FF;
    --el-primary: #6A994E; /* Cor primária para elementos sem cor definida */

    /* Tipografia */
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Noto Serif SC', serif; /* Fonte para caligrafia */
}

body {
    font-family: var(--font-sans);
    background-color: var(--color-paper);
    background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e8e2d7" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
    color: var(--color-ink);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
}

body.mobile-menu-open, 
body.search-modal-open {
    overflow: hidden;
}

h1, h2, h3, h4, .font-playfair {
    font-family: var(--font-serif);
    font-weight: 700;
}

/* --- 2. Acessibilidade e Comportamento Geral --- */
:focus-visible {
    outline: 3px solid var(--color-seal-light);
    outline-offset: 2px;
    border-radius: 6px;
}

#main-content-area {
    scroll-behavior: smooth;
}

/* --- 3. Animações --- */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInNav {
    from { opacity: 0; transform: translateX(-15px); }
    to { opacity: 1; transform: translateX(0); }
}

.content-section { display: none; }
.content-section.active { display: block; animation: fadeIn 0.7s cubic-bezier(0.165, 0.84, 0.44, 1); }

/* --- 4. Barra Lateral de Navegação (Sidebar) --- */
aside {
    background-color: rgba(253, 251, 245, 0.8); /* Papel translúcido */
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-right: 1px solid var(--color-border);
}

.sidebar-link, .nav-group-header {
    opacity: 0;
    animation: slideInNav 0.5s forwards;
}

.nav-group-header {
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 8px;
}
.nav-group-header:hover { background-color: rgba(234, 226, 214, 0.5); }
.nav-group-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-in-out; }
.nav-group-header.open + .nav-group-content { max-height: 500px; }
.nav-group-header[aria-expanded="true"] .chevron { transform: rotate(180deg); }
[aria-expanded] .chevron { transition: transform 0.3s ease; }

.sidebar-link {
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    padding-left: 1.5rem; /* Espaço para o "selo" */
}
.sidebar-link:before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-seal);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.sidebar-link:hover {
    color: var(--color-seal);
}
.sidebar-link:hover:before {
    transform: translateY(-50%) scale(1);
}
.sidebar-link.active, a.sidebar-link[aria-current="page"] {
    background-color: rgba(158, 43, 37, 0.08);
    color: var(--color-seal);
    font-weight: 600;
}
.sidebar-link.active:before, a.sidebar-link[aria-current="page"]:before {
    transform: translateY(-50%) scale(1.2);
}
.sidebar-link.active svg, a.sidebar-link[aria-current="page"] svg { color: var(--color-seal); }

/* --- 5. Estilo dos Cards e Conteúdo --- */
.visual-card {
    background-color: var(--color-surface);
    border-radius: 4px; /* Cantos mais retos, como papel */
    border: 1px solid var(--color-border);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.02), 0 8px 15px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.visual-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.03), 0 12px 20px rgba(0, 0, 0, 0.05);
}
.card-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    border-left: 5px solid var(--color-seal); /* Simula um selo lateral */
}
.card-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-ink);
}
.card-content { padding: 1.5rem; }
.card-prose { line-height: 1.8; }
.card-prose h4 {
    margin-bottom: 0.75rem;
    margin-top: 1.5rem;
    font-size: 1.2rem;
    color: var(--color-ink);
}
.card-prose > *:last-child { margin-bottom: 0; }

/* --- 6. Componentes Interativos (Acordeão, Abas, etc.) --- */
.accordion-item {
    border: none;
    border-bottom: 1px solid var(--color-border);
    border-radius: 0;
    background-color: transparent;
}
.accordion-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: left;
    padding: 1rem 0.5rem;
    font-weight: 600;
    color: var(--color-ink);
    transition: color 0.3s ease;
}
.accordion-button:hover {
    color: var(--color-seal);
}
.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease, padding 0.5s ease, opacity 0.4s 0.1s ease;
    padding: 0 0.5rem;
    opacity: 0;
    font-size: 0.95rem;
    color: var(--color-ink-muted);
}
.accordion-button[aria-expanded="true"] + .accordion-content {
    max-height: 2500px;
    padding: 0 0.5rem 1.5rem;
    opacity: 1;
}
.accordion-button .chevron { transition: transform 0.3s ease; }
.accordion-button[aria-expanded="true"] .chevron { transform: rotate(180deg); }


.tab-button {
    padding: 0.5rem 0;
    margin: 0 1rem;
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--color-ink-muted);
    border-bottom: 3px solid transparent;
    transition: color 0.3s, border-color 0.3s;
}
.tab-button.active, .tab-button:hover { color: var(--color-ink); }
.tab-button.active { border-bottom-color: var(--color-seal); }
.tab-content { display: none; }
.tab-content.active { display: block; }

/* --- 7. Pesquisa Global --- */
#search-modal-container {
    transition: opacity 0.3s ease, visibility 0.3s ease;
}
#search-modal-container.hidden {
    visibility: hidden;
    opacity: 0;
}
#search-overlay {
    background-color: rgba(253, 251, 245, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}
#search-modal-container .relative {
    background: var(--color-paper);
    border: 1px solid var(--color-border);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    border-radius: 8px;
}
.search-result-item {
    padding: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid var(--color-border);
}
.search-result-item:hover { background-color: rgba(234, 226, 214, 0.4); }
.search-result-item h4 { font-weight: 600; color: var(--color-seal); }
.search-result-item p {
    font-size: 0.9rem;
    color: var(--color-ink-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
}

/* --- 8. Componentes Específicos --- */

/* Timeline */
.timeline-container {
    position: relative;
    padding-left: 2rem;
}
.timeline-container:before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--color-border);
}
.timeline-item {
    position: relative;
    margin-bottom: 1.5rem;
}
.timeline-marker {
    position: absolute;
    left: -2rem;
    top: 0;
    transform: translateX(50%);
}

/* Diagramas */
.diagram-area-svg {
    fill: rgba(255, 255, 255, 0.2);
    stroke: rgba(0, 0, 0, 0.5);
    stroke-width: 1;
    cursor: pointer;
    transition: fill 0.3s ease;
}
.diagram-area-svg:hover, .diagram-area-svg:focus {
    fill: rgba(158, 43, 37, 0.3); /* --color-seal com opacidade */
}

/* NOVO: Estilos para o diagrama dos 5 Elementos */
.element-diagram { position: relative; }
.element {
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 0.75rem 1rem;
    border-radius: 50%;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.element:hover { transform: translate(-50%, -50%) scale(1.1); }
.element.active {
    transform: translate(-50%, -50%) scale(1.15);
    border-color: var(--color-seal);
    color: var(--color-seal) !important;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.element.wood { background-color: var(--el-wood); color: white; }
.element.fire { background-color: var(--el-fire); color: white; }
.element.earth { background-color: var(--el-earth); color: white; }
.element.metal { background-color: var(--el-metal); color: white; }
.element.water { background-color: var(--el-water); color: white; }

.element-lines {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
}
.cycle-path {
    transition: opacity 0.3s ease;
}
.geracao-path { color: var(--el-wood); }
.controlo-path { color: var(--el-fire); }
.arrow-marker { transition: fill 0.3s ease; }
#element-details-container table td:first-child { font-weight: 600; padding-right: 1rem; color: var(--color-ink-muted); }
#element-details-container table tr { border-bottom: 1px solid var(--color-border); }
#element-details-container table tr:last-child { border-bottom: none; }
#element-details-container table td { padding: 0.5rem 0; }


/* --- 9. Preferências de Movimento Reduzido --- */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
