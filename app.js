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
    pulseData,
    tongueDiagnosisData,
    moxibustionData,
    phytotherapyData,
    philosophyAndPracticeData
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
let contentSections = [];

const allNavHubs = [mobileNavHub, desktopNavHub];

// Elementos da Pesquisa Global
const openSearchMobileBtn = document.getElementById('open-search-btn-mobile');
const desktopSearchInput = document.getElementById('desktop-search-input');
const searchModalContainer = document.getElementById('search-modal-container');
const searchOverlay = document.getElementById('search-overlay');
const closeSearchBtn = document.getElementById('close-search-btn');
const globalSearchInput = document.getElementById('global-search-input');
const searchResultsContainer = document.getElementById('search-results-container');
let searchIndex = [];

// --- Lógica para o Seletor de Tema ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIconLight = document.getElementById('theme-icon-light');
const themeIconDark = document.getElementById('theme-icon-dark');
const themeText = document.getElementById('theme-text');

function applyTheme(theme) {
    document.body.dataset.theme = theme;
    if (theme === 'dark') {
        if(themeIconLight) themeIconLight.classList.add('hidden');
        if(themeIconDark) themeIconDark.classList.remove('hidden');
        if (themeText) themeText.textContent = 'Tema Escuro';
    } else {
        if(themeIconLight) themeIconLight.classList.remove('hidden');
        if(themeIconDark) themeIconDark.classList.add('hidden');
        if (themeText) themeText.textContent = 'Tema Claro';
    }
    localStorage.setItem('mtc-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
const savedTheme = localStorage.getItem('mtc-theme') || 'light';
applyTheme(savedTheme);


// --- FUNÇÃO DE UTILIDADE: DEBOUNCE ---
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// --- LÓGICA DE NAVEGAÇÃO RESPONSIVA ---
function openMobileMenu() { document.body.classList.add('mobile-menu-open'); }
function closeMobileMenu() { document.body.classList.remove('mobile-menu-open'); }
if(openMenuBtn) openMenuBtn.addEventListener('click', openMobileMenu);
if(closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
if(mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// --- LÓGICA DA PESQUISA GLOBAL ---
function openSearchModal() { 
    document.body.classList.add('search-modal-open');
    if(searchModalContainer) searchModalContainer.classList.remove('hidden');
    setTimeout(() => globalSearchInput && globalSearchInput.focus(), 50); 
}

function closeSearchModal() { 
    document.body.classList.remove('search-modal-open');
    if(searchModalContainer) searchModalContainer.classList.add('hidden');
    if(globalSearchInput) globalSearchInput.value = ''; 
    if(searchResultsContainer) searchResultsContainer.innerHTML = '<p class="text-center text-gray-500">Comece a escrever para ver os resultados.</p>';
}

if(openSearchMobileBtn) openSearchMobileBtn.addEventListener('click', openSearchModal);
if(desktopSearchInput) desktopSearchInput.addEventListener('focus', openSearchModal);
if(closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearchModal);
if(searchOverlay) searchOverlay.addEventListener('click', closeSearchModal);

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
        if(hub) {
            hub.querySelectorAll('.sidebar-link').forEach(link => {
                const href = link.getAttribute('href');
                const isActive = href === `#${targetId}`;
                link.classList.toggle('active', isActive);
                link.setAttribute('aria-current', isActive ? 'page' : 'false');
            });
        }
    });
}

allNavHubs.forEach(hub => {
    if(hub) {
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
                const isOpen = groupHeader.classList.toggle('open');
                groupHeader.setAttribute('aria-expanded', isOpen);
            }
        });
    }
});

// --- CRIAÇÃO DO ÍNDICE DE PESQUISA ---
function createSearchIndex() {
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
    Object.values(glossaryData).forEach(item => {
        searchIndex.push({
            title: item.term,
            content: item.definition,
            type: 'Glossário',
            color: 'primary',
            sectionId: 'glossario'
        });
    });
    foodData.forEach(food => {
        searchIndex.push({
            title: food.name,
            content: `Ações: ${food.actions}`,
            type: 'Alimento',
            color: 'wood',
            sectionId: 'dietetica'
        });
    });
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
    if (!searchResultsContainer) return;
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
    if (!searchResultsContainer) return;
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p class="text-center text-gray-500">Nenhum resultado encontrado.</p>';
        return;
    }
    searchResultsContainer.innerHTML = results.map(item => `
        <div class="search-result-item" data-section-id="${item.sectionId}" tabindex="0">
            <h4>${item.title}</h4>
            <p>${item.content}</p>
            <span class="result-type-badge" style="background-color: var(--el-${item.color}, var(--color-primary))">${item.type}</span>
        </div>
    `).join('');
}

if(globalSearchInput) globalSearchInput.addEventListener('input', debounce((e) => performSearch(e.target.value), 300));
if(searchResultsContainer) {
    searchResultsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') e.target.click();
    });
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
}


// --- FUNÇÕES DE GERAÇÃO DE CONTEÚDO ---
function createAccordion(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map((item, index) => {
        const uniqueId = `${containerId}-item-${index}`;
        return `
        <div class="accordion-item">
            <button class="accordion-button flex items-center justify-between w-full text-left" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button">
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
        <div class="timeline-item relative pl-8 pb-8">
            <div class="timeline-marker absolute top-0 left-0">
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
        <button class="sidebar-nav-item flex items-center text-left w-full p-2 rounded-lg transition-colors duration-200" data-id="${item.id}">
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
            <div class="content-card hidden" id="${idPrefix}${item.id}">
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
        contentCards.forEach(card => card.classList.add('hidden'));
        const targetCard = contentContainer.querySelector(`#${idPrefix}${targetId}`);
        if(targetCard) targetCard.classList.remove('hidden');
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
    <div class="content-card hidden" id="${idPrefix}${item.id}">
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
        <div class="content-card hidden" id="zangfu-content-${organ.id}">
            <div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-${organ.color});">
                <h3 class="text-2xl font-playfair font-bold" style="color: var(--el-${organ.color});">Padrões do ${organ.name}</h3>
            </div>
            <div class="space-y-4" id="zangfu-accordion-${organ.id}">
                ${organ.patterns.map((pattern, patternIndex) => {
                    const uniqueId = `zangfu-${organIndex}-pattern-${patternIndex}`;
                    return `
                    <div class="accordion-item">
                        <button class="accordion-button flex items-center justify-between w-full text-left" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button">
                            <span class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400"><use href="#icon-zangfu-patterns"></use></svg>
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

function setupDietetics() {
    // ... (código existente sem alterações)
}

function setupGlossary() {
    // ... (código existente sem alterações)
}

function setupFiveElements() {
    const container = document.getElementById('element-diagram-container');
    const svgContainer = document.getElementById('cycle-paths-container');
    const detailsContainer = document.getElementById('element-details-container');
    const infoBox = document.getElementById('cycle-info-box');
    const btnGeracao = document.getElementById('btn-geracao');
    const btnControlo = document.getElementById('btn-controlo');

    if (!container || !svgContainer || !detailsContainer || !btnGeracao || !btnControlo) return;

    const R = 120; // Raio do pentagrama
    const center = { x: 150, y: 150 };
    const elements = {
        fogo:    { id: 'fogo',    name: 'Fogo',    coords: { x: center.x, y: center.y - R }},
        terra:   { id: 'terra',   name: 'Terra',   coords: { x: center.x + R * Math.sin(2 * Math.PI / 5), y: center.y - R * Math.cos(2 * Math.PI / 5) }},
        metal:   { id: 'metal',   name: 'Metal',   coords: { x: center.x + R * Math.sin(4 * Math.PI / 5), y: center.y - R * Math.cos(4 * Math.PI / 5) }},
        agua:    { id: 'agua',    name: 'Água',    coords: { x: center.x - R * Math.sin(4 * Math.PI / 5), y: center.y - R * Math.cos(4 * Math.PI / 5) }},
        madeira: { id: 'madeira', name: 'Madeira', coords: { x: center.x - R * Math.sin(2 * Math.PI / 5), y: center.y - R * Math.cos(2 * Math.PI / 5) }}
    };

    let currentCycle = 'geracao';
    let activeElement = 'fogo';

    Object.values(elements).forEach(el => {
        const sphere = document.createElement('button');
        sphere.id = el.id;
        sphere.className = `element-sphere`;
        sphere.style.left = `${el.coords.x}px`;
        sphere.style.top = `${el.coords.y}px`;
        sphere.style.backgroundColor = `var(--el-${el.id})`;
        sphere.textContent = el.name;
        sphere.addEventListener('click', () => {
            activeElement = el.id;
            updateView();
        });
        container.appendChild(sphere);
    });

    function drawPath(startId, endId, cycleType) {
        const start = elements[startId].coords;
        const end = elements[endId].coords;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d;

        if (cycleType === 'geracao') {
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 0.8; 
            d = `M ${start.x},${start.y} A ${dr},${dr} 0 0,1 ${end.x},${end.y}`;
        } else {
            d = `M ${start.x},${start.y} L ${end.x},${end.y}`;
        }
        
        path.setAttribute('d', d);
        path.setAttribute('class', `cycle-path ${cycleType}`);
        path.setAttribute('marker-end', 'url(#arrow)');
        svgContainer.appendChild(path);
    }

    function updateView() {
        svgContainer.innerHTML = '';
        btnGeracao.classList.toggle('active', currentCycle === 'geracao');
        btnControlo.classList.toggle('active', currentCycle === 'controlo');

        const cycleOrder = ['madeira', 'fogo', 'terra', 'metal', 'agua'];
        const controlOrder = ['madeira', 'terra', 'agua', 'fogo', 'metal'];
        const order = currentCycle === 'geracao' ? cycleOrder : controlOrder;

        for (let i = 0; i < order.length; i++) {
            const startId = order[i];
            const targetData = fiveElementsData[startId];
            if (targetData) {
                const endId = targetData.target[currentCycle];
                if (endId) {
                    drawPath(startId, endId, currentCycle);
                }
            }
        }

        document.querySelectorAll('.element-sphere').forEach(sphere => {
            sphere.classList.toggle('active', sphere.id === activeElement);
        });

        const data = fiveElementsData[activeElement];
        if (data) {
            detailsContainer.innerHTML = `
                <div class="p-4 rounded-lg" style="border: 2px solid var(--el-${data.color}); background-color: var(--el-${data.color}20);">
                    <h3 class="text-2xl font-bold mb-3" style="color: var(--el-${data.color});">${data.name}</h3>
                    <p class="font-semibold">${data.relations.geracao}</p>
                    <p class="font-semibold mb-4">${data.relations.controlo}</p>
                    <table class="w-full text-sm"><tbody>${data.table}</tbody></table>
                </div>`;
            infoBox.innerHTML = `<p class="text-center font-semibold text-lg" style="color: var(--el-${data.color});">${data.name}</p><p class="text-center text-gray-500">${data.relations[currentCycle]}</p>`;
        }
    }

    btnGeracao.addEventListener('click', () => {
        currentCycle = 'geracao';
        updateView();
    });
    btnControlo.addEventListener('click', () => {
        currentCycle = 'controlo';
        updateView();
    });

    updateView();
}

function setupDiagnosisDiagrams() {
    const tongueDiagram = document.getElementById('tongue-diagram');
    const tongueContainer = document.querySelector('#tongue-details-container');
    
    if (!tongueDiagram || !tongueContainer) return;

    const tongueDiagramAreas = tongueDiagram.querySelectorAll('.diagram-area-svg[data-area]');
    
    tongueDiagram.addEventListener('click', (e) => {
        const clickedArea = e.target.closest('.diagram-area-svg');
        if (!clickedArea) return;

        tongueDiagramAreas.forEach(area => area.classList.remove('active'));
        clickedArea.classList.add('active');

        const areaKey = clickedArea.dataset.area;
        const areaData = tongueDiagnosisData[areaKey];
        if (!areaData) return;

        tongueContainer.innerHTML = `
            <h4 class="font-bold text-lg text-primary mb-2">${areaData.title}</h4>
            <div class="text-sm space-y-2">
                <div>
                    <h5 class="font-semibold">Aparência Típica:</h5>
                    <ul class="list-disc list-inside text-gray-600">${areaData.appearance.map(item => `<li>${item}</li>`).join('')}</ul>
                </div>
                <div>
                    <h5 class="font-semibold">Sintomas Associados:</h5>
                    <ul class="list-disc list-inside text-gray-600">${areaData.symptoms.map(item => `<li>${item}</li>`).join('')}</ul>
                </div>
            </div>`;
    });
}

function setupTherapeutics(containerId, data) {
    // ... (código existente sem alterações)
}

function setupPhytotherapy(containerId, data) {
    // ... (código existente sem alterações)
}

function setupPhilosophyAndPractice() {
    // ... (código existente sem alterações)
}

function generateNavLinks() {
    // ... (código existente sem alterações)
}

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    generateNavLinks();
    createAccordion('qi-accordion', qiData);
    createLifeCycleTimeline('female-cycles-timeline', lifeCyclesFemaleData, 'bg-pink-500');
    createLifeCycleTimeline('male-cycles-timeline', lifeCyclesMaleData, 'bg-blue-500');
    createAccordion('perguntas-accordion', dezPerguntasData);
    createAccordion('pulse-list-container', pulseData);
    setupGlossary();
    setupDietetics();
    setupTherapeutics('moxabustao-content-area', moxibustionData);
    setupPhytotherapy('fitoterapia-content-area', phytotherapyData);
    setupPhilosophyAndPractice();
    
    setupTabs('diagnosis-tabs', 'diagnosis-tab-content');
    setupFiveElements();
    setupSidebarLayout('meridian-navigation', 'meridian-content-area', meridianData, 'meridian-content-');
    setupSidebarLayout('anatomy-navigation', 'anatomy-content-area', anatomyData, 'anatomy-content-');
    setupSidebarLayout('zangfu-navigation', 'zangfu-content-area', zangFuPatternsData, 'zangfu-content-');
    setupDiagnosisDiagrams();

    createSearchIndex();
    if(mainContent) {
        contentSections = mainContent.querySelectorAll('.content-section');
    }
    showSection('inicio', 'Início');
    updateActiveLink('inicio');
});
