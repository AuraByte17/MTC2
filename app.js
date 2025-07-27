// --- Importa todos os dados de data.js ---
import { 
    qiData, 
    meridianData, 
    lifeCyclesFemaleData, 
    lifeCyclesMaleData, 
    anatomyData, 
    fiveElementsData, 
    glossaryData, 
    foodData, 
    zangFuPatternsData, 
    dezPerguntasData, 
    pulseData 
} from './data.js';

// --- Seleção de Elementos DOM ---
const openMenuBtn = document.getElementById('open-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileNavHub = document.getElementById('navigation-hub');
const desktopNavHub = document.getElementById('desktop-navigation-hub');
const currentSectionTitle = document.getElementById('current-section-title');
const contentArea = document.getElementById('main-content-area');
const mainContent = document.getElementById('main-content');
let contentSections = []; // Será preenchido dinamicamente

const allNavHubs = [mobileNavHub, desktopNavHub];

// Elementos da Pesquisa Global
const openSearchMobileBtn = document.getElementById('open-search-btn-mobile');
const desktopSearchInput = document.getElementById('desktop-search-input');
const searchModalContainer = document.getElementById('search-modal-container');
const searchOverlay = document.getElementById('search-overlay');
const closeSearchBtn = document.getElementById('close-search-btn');
const globalSearchInput = document.getElementById('global-search-input');
const searchResultsContainer = document.getElementById('search-results-container');
let searchIndex = []; // Onde todos os dados pesquisáveis serão guardados

// --- LÓGICA DE NAVEGAÇÃO RESPONSIVA ---
function openMobileMenu() { document.body.classList.add('mobile-menu-open'); }
function closeMobileMenu() { document.body.classList.remove('mobile-menu-open'); }
openMenuBtn.addEventListener('click', openMobileMenu);
closeMenuBtn.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// --- LÓGICA DA PESQUISA GLOBAL ---
function openSearchModal() {
    document.body.classList.add('search-modal-open');
    searchModalContainer.classList.remove('hidden');
    setTimeout(() => globalSearchInput.focus(), 50); 
}

function closeSearchModal() {
    document.body.classList.remove('search-modal-open');
    searchModalContainer.classList.add('hidden');
    globalSearchInput.value = ''; 
    searchResultsContainer.innerHTML = '<p class="text-center text-gray-500">Comece a escrever para ver os resultados.</p>';
}

openSearchMobileBtn.addEventListener('click', openSearchModal);
desktopSearchInput.addEventListener('focus', openSearchModal);
closeSearchBtn.addEventListener('click', closeSearchModal);
searchOverlay.addEventListener('click', closeSearchModal);

// --- LÓGICA DE NAVEGAÇÃO PRINCIPAL ---
function showSection(targetId, linkText) {
    contentSections.forEach(section => {
        section.classList.toggle('active', section.id === targetId);
    });
    if (contentArea) contentArea.scrollTop = 0;
    if (currentSectionTitle && linkText) currentSectionTitle.textContent = linkText;
}

function updateActiveLink(targetId) {
    allNavHubs.forEach(hub => {
        hub.querySelectorAll('.sidebar-link').forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${targetId}`;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    });
}

allNavHubs.forEach(hub => {
    hub.addEventListener('click', (e) => {
        const link = e.target.closest('a.sidebar-link');
        const groupHeader = e.target.closest('.nav-group-header');
        if (link) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const linkText = link.querySelector('span').textContent;
            showSection(targetId, linkText);
            updateActiveLink(targetId);
            closeMobileMenu();
        }
        if (groupHeader) {
            groupHeader.classList.toggle('open');
            groupHeader.setAttribute('aria-expanded', groupHeader.classList.contains('open'));
        }
    });
});

// --- CRIAÇÃO DO ÍNDICE DE PESQUISA ---
function createSearchIndex() {
    // 1. Meridianos e Pontos
    meridianData.forEach(meridian => {
        meridian.points.forEach(point => {
            searchIndex.push({
                title: `${point.id} - ${point.name} (${point.character})`,
                content: `${point.pt_name}. ${point.functions}`,
                type: 'Ponto',
                color: meridian.element,
                sectionId: 'meridianos',
            });
        });
    });

    // 2. Glossário
    Object.values(glossaryData).forEach(item => {
        searchIndex.push({
            title: item.term,
            content: item.definition,
            type: 'Glossário',
            color: 'primary',
            sectionId: 'glossario'
        });
    });

    // 3. Alimentos
    foodData.forEach(food => {
        searchIndex.push({
            title: food.name,
            content: `Ações: ${food.actions}`,
            type: 'Alimento',
            color: 'wood',
            sectionId: 'dietetica'
        });
    });

    // 4. Padrões Zang-Fu
    zangFuPatternsData.forEach(organ => {
        organ.patterns.forEach(pattern => {
            searchIndex.push({
                title: pattern.name,
                content: pattern.symptoms,
                type: 'Padrão Zang-Fu',
                color: organ.color,
                sectionId: 'padroes-zang-fu'
            });
        });
    });
}


// --- LÓGICA DE EXECUÇÃO DA PESQUISA ---
function performSearch(query) {
    if (query.length < 2) {
        searchResultsContainer.innerHTML = '<p class="text-center text-gray-500">Escreva pelo menos 2 letras para pesquisar.</p>';
        return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(lowerCaseQuery) || 
        item.content.toLowerCase().includes(lowerCaseQuery)
    );

    renderSearchResults(results);
}

function renderSearchResults(results) {
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p class="text-center text-gray-500">Nenhum resultado encontrado.</p>';
        return;
    }

    searchResultsContainer.innerHTML = results.map(item => `
        <div class="search-result-item" data-section-id="${item.sectionId}">
            <h4>${item.title}</h4>
            <p>${item.content}</p>
            <span class="result-type-badge" style="background-color: var(--el-${item.color}, var(--color-primary))">${item.type}</span>
        </div>
    `).join('');
}

globalSearchInput.addEventListener('input', (e) => performSearch(e.target.value));

searchResultsContainer.addEventListener('click', (e) => {
    const resultItem = e.target.closest('.search-result-item');
    if (resultItem) {
        const sectionId = resultItem.dataset.sectionId;
        const link = document.querySelector(`#desktop-navigation-hub a[href="#${sectionId}"]`);
        if (link) {
            const linkText = link.querySelector('span').textContent;
            showSection(sectionId, linkText);
            updateActiveLink(sectionId);
            closeSearchModal();
        }
    }
});


// --- FUNÇÕES DE GERAÇÃO DE CONTEÚDO ---
function createAccordion(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map((item, index) => {
        const uniqueId = `${containerId}-item-${index}`;
        return `
        <div class="accordion-item">
            <button class="accordion-button" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button">
                <span class="flex items-center">
                    ${item.color ? `<span class="w-3 h-3 rounded-full mr-3" style="background-color: var(--el-${item.color});"></span>` : ''}
                    ${item.name || item.title}
                </span>
                <svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg>
            </button>
            <div class="accordion-content card-prose" id="${uniqueId}-content" role="region" aria-labelledby="${uniqueId}-button">
                ${item.content || item.functions}
            </div>
        </div>`;
    }).join('');

    container.addEventListener('click', (e) => {
        const button = e.target.closest('.accordion-button');
        if (button) {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
        }
    });
}

function createLifeCycleTimeline(containerId, data, colorClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="timeline-item">
            <div class="timeline-marker">
                <div class="w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center font-bold text-sm shadow-md">${item.age}</div>
            </div>
            <div class="pt-1">
                <p class="font-semibold text-gray-800">Idade ${item.age}</p>
                <p class="text-sm text-gray-600">${item.content}</p>
            </div>
        </div>`).join('');
}

function setupTabs(tabsContainerId, tabContentContainerId) {
    const tabsContainer = document.getElementById(tabsContainerId);
    const tabContentContainer = document.getElementById(tabContentContainerId);
    if (!tabsContainer || !tabContentContainer) return;

    const tabs = tabsContainer.querySelectorAll('[role="tab"]');
    const tabPanels = tabContentContainer.querySelectorAll('[role="tabpanel"]');

    tabsContainer.addEventListener('click', (e) => {
        const clickedTab = e.target.closest('[role="tab"]');
        if (!clickedTab) return;

        tabs.forEach(tab => {
            tab.setAttribute('aria-selected', 'false');
            tab.classList.remove('active');
        });
        clickedTab.setAttribute('aria-selected', 'true');
        clickedTab.classList.add('active');

        tabPanels.forEach(panel => panel.classList.remove('active'));
        const targetPanel = document.getElementById(clickedTab.getAttribute('aria-controls'));
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
}

function setupSidebarLayout(navId, contentId, data, idPrefix = 'content-') {
    const navContainer = document.getElementById(navId);
    const contentContainer = document.getElementById(contentId);
    if (!navContainer || !contentContainer) return;

    navContainer.innerHTML = data.map(item => `
        <button class="sidebar-nav-item flex items-center text-left w-full" data-id="${item.id}">
            ${item.color ? `<span class="w-4 h-4 rounded-full mr-3 flex-shrink-0" style="background-color: var(--el-${item.color});"></span>` : ''}
            <span class="font-semibold text-sm">${item.name || item.title}</span>
        </button>
    `).join('');
    
    if (navId === 'meridian-navigation') {
        contentContainer.innerHTML = data.map(item => setupMeridianLayout(item, idPrefix)).join('');
    } else if (navId === 'zangfu-navigation') {
        contentContainer.innerHTML = setupZangFuLayout(data);
    } else {
        contentContainer.innerHTML = data.map(item => `
            <div class="content-card" id="${idPrefix}${item.id}">
                <div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-${item.color || 'gray'});">
                    <h3 class="text-2xl font-playfair font-bold" style="color: var(--el-${item.color || 'gray'});">${item.name || item.title}</h3>
                </div>
                <div class="card-prose">
                    ${item.content ? `<div class="text-gray-600">${item.content}</div>` : ''}
                </div>
            </div>`).join('');
    }
    
    const navItems = navContainer.querySelectorAll('.sidebar-nav-item');
    const contentCards = contentContainer.querySelectorAll('.content-card');

    navContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.sidebar-nav-item');
        if (!button) return;

        const targetId = button.dataset.id;
        navItems.forEach(nav => nav.classList.remove('active'));
        button.classList.add('active');
        
        contentCards.forEach(card => card.classList.remove('active'));
        const targetCard = contentContainer.querySelector(`#${idPrefix}${targetId}`);
        if(targetCard) targetCard.classList.add('active');
    });

    contentContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.accordion-button');
        if (button) {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
        }
    });

    if (navItems.length > 0) navItems[0].click();
}

function setupMeridianLayout(item, idPrefix) {
    return `
    <div class="content-card" id="${idPrefix}${item.id}">
        <div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-${item.color || 'gray'});">
            <h3 class="text-2xl font-playfair font-bold" style="color: var(--el-${item.color || 'gray'});">${item.name}</h3>
            <p class="font-semibold text-gray-500">${item.element} / ${item.time}</p>
        </div>
        <div class="card-prose text-sm">
            <div class="grid md:grid-cols-2 gap-x-8">
                <div>
                    <h4 class="font-bold !text-base !mb-2 !mt-0">Funções Principais</h4>
                    <p class="text-gray-600">${item.functions}</p>
                </div>
                <div>
                    <h4 class="font-bold !text-base !mb-2 !mt-0">Sinais de Desequilíbrio</h4>
                    <p class="text-gray-600">${item.imbalances}</p>
                </div>
            </div>
            
            <h4 class="font-bold !text-base !mb-2">Pontos Especiais</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs p-3 bg-gray-50 rounded-md">
                <div><strong>Fonte (Yuan):</strong> ${item.yuan_source}</div>
                <div><strong>Conexão (Luo):</strong> ${item.luo_connecting}</div>
                <div><strong>Fenda (Xi):</strong> ${item.xi_cleft}</div>
            </div>

            <h4 class="font-bold !text-base !mb-2">Pontos Shu Antigos</h4>
            <div class="overflow-x-auto">
                <table class="w-full text-left !text-xs">
                    <thead class="bg-gray-100"><tr>
                        <th class="p-2 font-semibold">Tipo</th><th class="p-2 font-semibold">Elemento</th><th class="p-2 font-semibold">Ponto</th><th class="p-2 font-semibold">Funções</th>
                    </tr></thead>
                    <tbody>
                        ${item.five_shu.map(p => `<tr class="border-b">
                            <td class="p-2">${p.type}</td><td class="p-2">${p.element}</td><td class="p-2 font-bold">${p.point}</td><td class="p-2">${p.functions}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
            
            <h4 class="font-bold !text-base !mb-2">Lista Completa de Pontos</h4>
            <div class="space-y-3 max-h-80 overflow-y-auto pr-2">
                ${item.points.map(p => `<div class="p-2 border-l-2 border-gray-200 hover:bg-gray-50">
                    <strong class="text-primary-dark">${p.id} - ${p.name} (${p.character}) - ${p.pt_name}</strong>
                    <p class="text-gray-600 !mb-0">${p.functions}</p>
                </div>`).join('')}
            </div>
        </div>
    </div>`;
}

function setupZangFuLayout(data) {
    return data.map((organ, organIndex) => `
        <div class="content-card" id="zangfu-content-${organ.id}">
            <div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-${organ.color});">
                <h3 class="text-2xl font-playfair font-bold" style="color: var(--el-${organ.color});">Padrões do ${organ.name}</h3>
            </div>
            <div class="space-y-4" id="zangfu-accordion-${organ.id}">
                ${organ.patterns.map((pattern, patternIndex) => {
                    const uniqueId = `zangfu-${organIndex}-pattern-${patternIndex}`;
                    return `
                    <div class="accordion-item">
                        <button class="accordion-button" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button">
                            <span class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400"><use href="#icon-clipboard-heart"></use></svg>
                                ${pattern.name}
                            </span>
                            <svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg>
                        </button>
                        <div class="accordion-content card-prose text-sm" id="${uniqueId}-content" role="region" aria-labelledby="${uniqueId}-button">
                            <h4 class="font-bold text-gray-700">Manifestações Clínicas:</h4>
                            <p>${pattern.symptoms}</p>
                            <h4 class="font-bold text-gray-700">Língua:</h4>
                            <p>${pattern.tongue}</p>
                            <h4 class="font-bold text-gray-700">Pulso:</h4>
                            <p>${pattern.pulse}</p>
                            <h4 class="font-bold text-gray-700">Princípio de Tratamento:</h4>
                            <p class="text-green-800 font-semibold">${pattern.treatmentPrinciple}</p>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// --- LÓGICA DOS 5 ELEMENTOS ---
const elementDiagramSVG = document.getElementById('element-diagram-svg');
const elementDetailsContainer = document.getElementById('element-details-container');
const pathsContainer = document.getElementById('cycle-paths-container');
const spheresContainer = document.getElementById('element-spheres-container');
const btnGeracao = document.getElementById('btn-geracao');
const btnControlo = document.getElementById('btn-controlo');
const cycleInfoBox = document.getElementById('cycle-info-box');
const defaultColor = '#a8a29e';
let currentCycle = 'geracao';
let selectedElementId = null;

const cycleInfo = {
    geracao: { title: 'Ciclo de Geração (Sheng)', description: 'Este ciclo representa a nutrição e o apoio. Cada elemento é a "mãe" do seguinte, nutrindo-o e promovendo o seu crescimento.', color: 'bg-green-100', textColor: 'text-green-800' },
    controlo: { title: 'Ciclo de Controlo (Ke)', description: 'Este ciclo representa o controlo e a restrição, garantindo que nenhum elemento se torna excessivo e mantendo o equilíbrio do sistema.', color: 'bg-red-100', textColor: 'text-red-800' }
};

const elementCoords = {
    madeira: { x: 150, y: 45 },
    fogo: { x: 255, y: 125 },
    terra: { x: 208, y: 255 },
    metal: { x: 92, y: 255 },
    agua: { x: 45, y: 125 }
};

const cyclePaths = {
    geracao: [
        { id: 'madeira-fogo', d: `M ${elementCoords.madeira.x} ${elementCoords.madeira.y} C 210 65, 230 80, ${elementCoords.fogo.x} ${elementCoords.fogo.y}` },
        { id: 'fogo-terra', d: `M ${elementCoords.fogo.x} ${elementCoords.fogo.y} C 250 180, 240 220, ${elementCoords.terra.x} ${elementCoords.terra.y}` },
        { id: 'terra-metal', d: `M ${elementCoords.terra.x} ${elementCoords.terra.y} C 160 285, 130 285, ${elementCoords.metal.x} ${elementCoords.metal.y}` },
        { id: 'metal-agua', d: `M ${elementCoords.metal.x} ${elementCoords.metal.y} C 60 220, 50 180, ${elementCoords.agua.x} ${elementCoords.agua.y}` },
        { id: 'agua-madeira', d: `M ${elementCoords.agua.x} ${elementCoords.agua.y} C 70 80, 90 65, ${elementCoords.madeira.x} ${elementCoords.madeira.y}` }
    ],
    controlo: [
        { id: 'madeira-terra', d: `M ${elementCoords.madeira.x} ${elementCoords.madeira.y} L ${elementCoords.terra.x} ${elementCoords.terra.y}` },
        { id: 'fogo-metal', d: `M ${elementCoords.fogo.x} ${elementCoords.fogo.y} L ${elementCoords.metal.x} ${elementCoords.metal.y}` },
        { id: 'terra-agua', d: `M ${elementCoords.terra.x} ${elementCoords.terra.y} L ${elementCoords.agua.x} ${elementCoords.agua.y}` },
        { id: 'metal-madeira', d: `M ${elementCoords.metal.x} ${elementCoords.metal.y} L ${elementCoords.madeira.x} ${elementCoords.madeira.y}` },
        { id: 'agua-fogo', d: `M ${elementCoords.agua.x} ${elementCoords.agua.y} L ${elementCoords.fogo.x} ${elementCoords.fogo.y}` }
    ]
};

function setup5ElementsDiagram() {
    if (!spheresContainer) return;
    spheresContainer.innerHTML = Object.keys(fiveElementsData).map(key => {
        const el = fiveElementsData[key];
        const { x, y } = elementCoords[key];
        return `
            <g id="${key}" class="element-sphere">
                <defs>
                    <radialGradient id="grad-${key}" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stop-color="white" stop-opacity="0.5" />
                        <stop offset="100%" stop-color="var(--el-${el.color})" stop-opacity="1" />
                    </radialGradient>
                </defs>
                <circle class="sphere-circle" cx="${x}" cy="${y}" r="30" fill="url(#grad-${key})" stroke="var(--el-${el.color})" stroke-width="1.5" filter="url(#sphere-glow)"/>
                <text class="sphere-text" x="${x}" y="${y + 5}">${el.name}</text>
            </g>
        `;
    }).join('');
}

function renderCyclePaths() {
    if(!pathsContainer) return;
    pathsContainer.innerHTML = cyclePaths[currentCycle].map(p => `<path id="${p.id}" class="cycle-path" d="${p.d}" stroke="${defaultColor}" stroke-width="2.5" fill="none" marker-end="url(#arrow)"/>`).join('');
}

function update5ElementsUI() {
    if(!elementDiagramSVG) return;
    elementDiagramSVG.querySelectorAll('.element-sphere').forEach(g => g.classList.remove('active'));
    document.querySelectorAll('.arrow-marker').forEach(marker => marker.style.fill = defaultColor);
    
    if (pathsContainer) {
        pathsContainer.querySelectorAll('.cycle-path').forEach(path => {
            path.style.stroke = defaultColor;
            path.style.strokeWidth = '2.5';
            path.classList.remove('draw');
        });
    }
    
    if (selectedElementId) {
        const elData = fiveElementsData[selectedElementId];
        const selectedGroup = document.getElementById(selectedElementId);
        if (selectedGroup) selectedGroup.classList.add('active');

        const targetElementId = elData.target[currentCycle];
        const activePathId = `${selectedElementId}-${targetElementId}`;
        const activePath = document.getElementById(activePathId);
        
        if (activePath) {
            const color = `var(--el-${elData.color})`;
            activePath.style.stroke = color;
            activePath.style.color = color;
            activePath.style.strokeWidth = '4';
            activePath.classList.add('draw');
            const marker = document.querySelector(`#arrow path`);
            if (marker) marker.style.fill = color;
        }

        elementDetailsContainer.innerHTML = `
            <div class="text-left p-6 rounded-lg border-2" style="border-color: var(--el-${elData.color}); background-color: #fafcff;">
                <h3 class="text-2xl font-playfair font-bold mb-4" style="color: var(--el-${elData.color});">${elData.name}</h3>
                <div class="card-prose">
                    <p class="font-semibold text-gray-600 mb-2">Relações no Ciclo de ${currentCycle.charAt(0).toUpperCase() + currentCycle.slice(1)}:</p>
                    <p class="text-sm">${elData.relations[currentCycle]}</p>
                    <table class="w-full text-sm mt-4"><tbody>${elData.table}</tbody></table>
                </div>
            </div>`;
    } else {
        elementDetailsContainer.innerHTML = '<div class="flex items-center justify-center h-full text-center text-gray-500 p-4 bg-gray-50 rounded-lg"><p>Clique num elemento do diagrama para ver as suas correspondências detalhadas e a sua relação no ciclo atual.</p></div>';
    }
}

function switchCycle(cycle) {
    currentCycle = cycle;
    const info = cycleInfo[cycle];
    if(cycleInfoBox) {
        cycleInfoBox.className = `mb-6 p-4 rounded-lg text-center transition-colors duration-500 ${info.color} ${info.textColor}`;
        cycleInfoBox.innerHTML = `<h4 class="font-bold">${info.title}</h4><p class="text-sm">${info.description}</p>`;
    }
    if(btnGeracao) btnGeracao.classList.toggle('active', cycle === 'geracao');
    if(btnControlo) btnControlo.classList.toggle('active', cycle === 'controlo');
    renderCyclePaths();
    update5ElementsUI();
}

if(btnGeracao) btnGeracao.addEventListener('click', () => switchCycle('geracao'));
if(btnControlo) btnControlo.addEventListener('click', () => switchCycle('controlo'));

if (elementDiagramSVG) {
    elementDiagramSVG.addEventListener('click', (e) => {
        const sphereGroup = e.target.closest('.element-sphere');
        if (sphereGroup) {
            selectedElementId = sphereGroup.id;
            update5ElementsUI();
        }
    });
}

function setupGlossary() {
    const glossaryContainer = document.getElementById('glossary-container');
    if (!glossaryContainer) return;

    const categories = Object.values(glossaryData).reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {});
    const sortedCategories = Object.keys(categories).sort();
    
    glossaryContainer.innerHTML = sortedCategories.map(category => `
        <div class="visual-card mb-8">
            <div class="card-header"><h3 class="text-gray-700">${category}</h3></div>
            <div class="card-content grid md:grid-cols-2 gap-x-8 gap-y-6">
                ${categories[category].sort((a, b) => a.term.localeCompare(b.term)).map(item => `
                    <div>
                        <h4 class="font-bold text-lg">${item.term}</h4>
                        <p class="text-gray-600">${item.definition}</p>
                    </div>`).join('')}
            </div>
        </div>`).join('');
}

function activateTooltips() {
    document.body.addEventListener('mouseover', e => {
        const term = e.target.closest('.tooltip-term');
        if(term) {
            const existingTooltip = term.querySelector('.tooltip-box');
            if (!existingTooltip) {
                const termKey = term.dataset.term.toLowerCase();
                if (glossaryData[termKey]) {
                    const tooltipBox = document.createElement('div');
                    tooltipBox.className = 'tooltip-box';
                    tooltipBox.textContent = glossaryData[termKey].definition;
                    term.appendChild(tooltipBox);
                }
            }
        }
    });
}

function setupDietetics() {
    const foodSearchInput = document.getElementById('food-search-input');
    const foodResultsContainer = document.getElementById('food-results-container');
    const foodAlphaNav = document.getElementById('food-alpha-nav');

    function renderFoodList(foods) {
        const groupedFoods = foods.reduce((acc, food) => {
            const firstLetter = food.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) acc[firstLetter] = [];
            acc[firstLetter].push(food);
            return acc;
        }, {});
        const letters = Object.keys(groupedFoods).sort();
        
        if (foodAlphaNav) foodAlphaNav.innerHTML = letters.map(letter => `<a href="#food-letter-${letter}">${letter}</a>`).join('');

        if (foodResultsContainer) {
            foodResultsContainer.innerHTML = letters.map(letter => `
                <h3 id="food-letter-${letter}" class="food-group-header" tabindex="-1">${letter}</h3>
                <div class="food-group-items">
                ${groupedFoods[letter].map(food => `
                    <div class="food-item visual-card p-4 mb-3">
                        <h4 class="font-bold text-lg text-green-800">${food.name}</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                            <div><strong>Temp:</strong> <span class="font-semibold">${food.temp}</span></div>
                            <div><strong>Sabor:</strong> <span class="font-semibold">${food.flavor}</span></div>
                            <div class="col-span-2"><strong>Órgãos:</strong> <span class="font-semibold">${food.organs}</span></div>
                        </div>
                        <p class="text-sm mt-2"><strong>Ações:</strong> ${food.actions}</p>
                    </div>`).join('')}
                </div>`).join('');
        }
    }

    if (foodSearchInput) {
        renderFoodList(foodData);
        foodSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const headers = foodResultsContainer.querySelectorAll('.food-group-header');
            
            headers.forEach(header => {
                const groupWrapper = header.nextElementSibling;
                if (!groupWrapper) return;

                const items = groupWrapper.querySelectorAll('.food-item');
                let groupHasVisibleItems = false;
                
                items.forEach(item => {
                    const foodName = item.querySelector('h4').textContent.toLowerCase();
                    const isVisible = foodName.includes(searchTerm);
                    item.classList.toggle('hidden', !isVisible);
                    if (isVisible) {
                        groupHasVisibleItems = true;
                    }
                });

                header.style.display = groupHasVisibleItems ? 'block' : 'none';
                groupWrapper.style.display = groupHasVisibleItems ? 'block' : 'none';
            });
        });
    }
}

function setupDiagnosisDiagrams() {
    document.querySelectorAll('.diagram-area-svg').forEach(area => {
        const infoBox = area.closest('.visual-card, .grid').querySelector('.p-4.bg-gray-100');
        if (!infoBox) return;
        
        const defaultText = infoBox.firstElementChild.textContent;
        const updateInfo = () => {
            if (infoBox) {
                infoBox.innerHTML = `<p class="font-semibold">${area.dataset.info}</p>`;
            }
        };
        const resetInfo = () => {
            if (infoBox) {
                infoBox.innerHTML = `<p class="text-center text-gray-500">${defaultText}</p>`;
            }
        };
        
        area.addEventListener('mouseover', updateInfo);
        area.addEventListener('focus', updateInfo);
        area.addEventListener('mouseout', resetInfo);
        area.addEventListener('blur', resetInfo);
    });

    const pulseSVG = document.getElementById('pulse-diagram-svg');
    if (pulseSVG) {
        const pulsePositions = pulseSVG.querySelectorAll('.pulse-pos-circle');
        const pulseInfoBoxes = document.querySelectorAll('.pulse-info-box');

        pulsePositions.forEach(pos => {
            pos.addEventListener('mouseover', () => {
                const positionName = pos.dataset.pos;
                pulsePositions.forEach(p => p.classList.toggle('active', p.dataset.pos === positionName));
                pulseInfoBoxes.forEach(box => box.classList.toggle('active', box.dataset.pos === positionName));
            });

            pos.addEventListener('mouseout', () => {
                pulsePositions.forEach(p => p.classList.remove('active'));
                pulseInfoBoxes.forEach(box => box.classList.remove('active'));
            });
        });
    }
}

// --- Função para gerar os links de navegação (ESTRUTURA ALTERADA) ---
function generateNavLinks() {
    const navStructure = [
        { id: 'inicio', title: 'Início', icon: 'icon-home' },
        {
            title: 'Fundamentos', icon: 'icon-book-open',
            links: [
                { id: 'substancias-fundamentais', title: 'Substâncias Fundamentais', icon: 'icon-atom' },
                { id: 'tipos-de-qi', title: 'Tipos de Qi', icon: 'icon-wind' },
                { id: 'cinco-elementos', title: 'Os 5 Elementos', icon: 'icon-star' },
                { id: 'ciclos-de-vida', title: 'Ciclos de Vida', icon: 'icon-refresh-cw' },
                { id: 'meridianos', title: 'Meridianos e Pontos', icon: 'icon-git-branch' },
                { id: 'anatomia-energetica', title: 'Anatomia Energética', icon: 'icon-body' },
                { id: 'padroes-zang-fu', title: 'Padrões Zang-Fu', icon: 'icon-clipboard-heart' },
            ]
        },
        {
            title: 'Diagnóstico', icon: 'icon-stethoscope',
            links: [
                { id: 'diagnostico-geral', title: 'Geral e Visual', icon: 'icon-stethoscope' },
                { id: 'pulsologia', title: 'Pulsologia', icon: 'icon-heart-pulse' }
            ]
        },
        {
            title: 'Terapêuticas', icon: 'icon-lotus',
            links: [
                { id: 'dietetica', title: 'Dietética', icon: 'icon-soup' },
                { id: 'fitoterapia', title: 'Fitoterapia', icon: 'icon-mortar-pestle' },
                { id: 'moxabustao', title: 'Moxabustão', icon: 'icon-flame' },
                { id: 'qigong', title: 'Qi Gong & Tai Chi', icon: 'icon-lotus' }
            ]
        },
        { id: 'glossario', title: 'Glossário', icon: 'icon-book-open' },
    ];

    const generateHtml = (item) => {
        if (item.links) {
            return `
                <div class="nav-group">
                    <button class="nav-group-header flex items-center justify-between w-full p-2 rounded-lg" aria-expanded="false">
                        <span class="flex items-center">
                            <svg class="w-5 h-5 mr-3 text-gray-500"><use href="#${item.icon}"></use></svg>
                            <span class="font-semibold">${item.title}</span>
                        </span>
                        <svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg>
                    </button>
                    <div class="nav-group-content pl-4 pt-1 space-y-1">
                        ${item.links.map(link => `
                            <a href="#${link.id}" class="sidebar-link flex items-center p-2 rounded-lg">
                                <svg class="w-5 h-5 mr-3 text-gray-500"><use href="#${link.icon}"></use></svg>
                                <span>${link.title}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>`;
        } else {
            return `
                <a href="#${item.id}" class="sidebar-link flex items-center p-2 rounded-lg">
                    <svg class="w-5 h-5 mr-3 text-gray-500"><use href="#${item.icon}"></use></svg>
                    <span>${item.title}</span>
                </a>`;
        }
    };
    
    const navHtml = navStructure.map(generateHtml).join('');
    allNavHubs.forEach(hub => hub.innerHTML = navHtml);
}


// --- PONTO DE ENTRADA DA APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Geração de conteúdo principal
    generateNavLinks(); 
    createAccordion('qi-accordion', qiData);
    createLifeCycleTimeline('female-cycles-timeline', lifeCyclesFemaleData, 'bg-pink-500');
    createLifeCycleTimeline('male-cycles-timeline', lifeCyclesMaleData, 'bg-blue-500');
    createAccordion('perguntas-accordion', dezPerguntasData);
    createAccordion('pulse-list-container', pulseData);
    setupGlossary();
    setupDietetics();
    
    // Configuração de componentes interativos
    setupTabs('qigong-tabs', 'qigong-tab-content');
    setupSidebarLayout('meridian-navigation', 'meridian-content-area', meridianData, 'meridian-content-');
    setupSidebarLayout('anatomy-navigation', 'anatomy-content-area', anatomyData, 'anatomy-content-');
    setupSidebarLayout('zangfu-navigation', 'zangfu-content-area', zangFuPatternsData, 'zangfu-content-');
    activateTooltips();
    setupDiagnosisDiagrams();
    
    // Inicializa o diagrama dos 5 Elementos
    if (document.getElementById('cinco-elementos')) {
        setup5ElementsDiagram();
        switchCycle('geracao');
    }

    // Animação da barra lateral
    document.querySelectorAll('aside .sidebar-link, aside .nav-group').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.07}s`;
    });

    // Construção do índice de pesquisa
    createSearchIndex();
    
    // Seleciona as secções de conteúdo DEPOIS de serem criadas
    contentSections = mainContent.querySelectorAll('.content-section');
    
    // Mostra a secção inicial
    showSection('inicio', 'Início');
    updateActiveLink('inicio');
});
