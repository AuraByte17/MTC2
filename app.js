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
        themeIconLight.classList.add('hidden');
        themeIconDark.classList.remove('hidden');
        if (themeText) themeText.textContent = 'Tema Escuro';
    } else {
        themeIconLight.classList.remove('hidden');
        themeIconDark.classList.add('hidden');
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

// Aplicar tema guardado ao carregar a página
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
        foodSearchInput.addEventListener('input', debounce((e) => {
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
                    if (isVisible) groupHasVisibleItems = true;
                });
                header.style.display = groupHasVisibleItems ? 'block' : 'none';
            });
        }, 300));
    }
}

function setupGlossary() {
    const container = document.getElementById('glossary-container');
    if (!container) return;

    const groupedTerms = Object.values(glossaryData).reduce((acc, term) => {
        const category = term.category || 'Outros';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(term);
        return acc;
    }, {});

    const sortedCategories = Object.keys(groupedTerms).sort();

    container.innerHTML = sortedCategories.map(category => `
        <div class="visual-card mb-6">
            <div class="card-header">
                <h3>${category}</h3>
            </div>
            <div class="card-content divide-y divide-gray-200">
                ${groupedTerms[category].sort((a, b) => a.term.localeCompare(b.term)).map(term => `
                    <div class="py-4">
                        <h4 class="text-lg font-semibold text-gray-800">${term.term}</h4>
                        <p class="text-gray-600 mt-1">${term.definition}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function setupFiveElements() {
    const elements = {
        madeira: { x: 150, y: 60 },
        fogo: { x: 240, y: 105 },
        terra: { x: 202, y: 225 },
        metal: { x: 98, y: 225 },
        agua: { x: 60, y: 105 }
    };
    const svgContainer = document.getElementById('cycle-paths-container');
    const detailsContainer = document.getElementById('element-details-container');
    const infoBox = document.getElementById('cycle-info-box');
    const btnGeracao = document.getElementById('btn-geracao');
    const btnControlo = document.getElementById('btn-controlo');
    const elementButtons = document.querySelectorAll('.element-diagram .element');

    if (!svgContainer || !detailsContainer || !btnGeracao || !btnControlo) return;

    let currentCycle = 'geracao';

    function drawPath(startId, endId, cycleType) {
        const start = elements[startId];
        const end = elements[endId];
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = cycleType === 'geracao' 
            ? `M ${start.x},${start.y} Q ${(start.x + end.x) / 2 + (start.y - end.y) / 4},${(start.y + end.y) / 2 - (start.x - end.x) / 4} ${end.x},${end.y}`
            : `M ${start.x},${start.y} L ${end.x},${end.y}`;
        
        path.setAttribute('d', d);
        path.setAttribute('class', `cycle-path ${cycleType}`);
        path.setAttribute('marker-end', 'url(#arrow)');
        svgContainer.appendChild(path);
    }

    function updateCycleView(cycleType) {
        currentCycle = cycleType;
        svgContainer.innerHTML = ''; // Limpa os caminhos existentes
        btnGeracao.classList.toggle('active', cycleType === 'geracao');
        btnControlo.classList.toggle('active', cycleType === 'controlo');
        infoBox.innerHTML = `<p class="text-center font-semibold text-lg">${cycleType === 'geracao' ? 'Ciclo de Geração (Sheng)' : 'Ciclo de Controlo (Ke)'}</p><p class="text-center text-gray-500">Clique num elemento para ver os detalhes.</p>`;
        
        const cycleOrder = ['madeira', 'fogo', 'terra', 'metal', 'agua'];
        for (let i = 0; i < cycleOrder.length; i++) {
            const startId = cycleOrder[i];
            const targetData = fiveElementsData[startId];
            if (targetData) {
                const endId = targetData.target[cycleType];
                if (endId) {
                    drawPath(startId, endId, cycleType);
                }
            }
        }
    }

    function showElementDetails(elementId) {
        const data = fiveElementsData[elementId];
        if (!data) return;

        elementButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(elementId).classList.add('active');

        detailsContainer.innerHTML = `
            <div class="p-4 rounded-lg" style="border: 2px solid var(--el-${data.color}); background-color: var(--el-${data.color}20);">
                <h3 class="text-2xl font-bold mb-3" style="color: var(--el-${data.color});">${data.name}</h3>
                <p class="font-semibold">${data.relations.geracao}</p>
                <p class="font-semibold mb-4">${data.relations.controlo}</p>
                <table class="w-full text-sm">
                    <tbody>${data.table}</tbody>
                </table>
            </div>`;
        
        infoBox.innerHTML = `<p class="text-center font-semibold text-lg" style="color: var(--el-${data.color});">${data.name}</p><p class="text-center text-gray-500">${data.relations[currentCycle]}</p>`;
    }

    btnGeracao.addEventListener('click', () => updateCycleView('geracao'));
    btnControlo.addEventListener('click', () => updateCycleView('controlo'));
    elementButtons.forEach(button => {
        button.addEventListener('click', () => showElementDetails(button.id));
    });

    updateCycleView('geracao');
    showElementDetails('madeira');
}

function setupDiagnosisDiagrams() {
    document.querySelectorAll('#panel-observacao .diagram-container').forEach(container => {
        const infoBox = container.previousElementSibling;
        if (!infoBox || !infoBox.classList.contains('info-box-placeholder')) return;
        const defaultText = infoBox.textContent;
        const areas = container.querySelectorAll('.diagram-area-svg[data-info]');
        areas.forEach(area => {
            const updateInfo = () => { infoBox.innerHTML = `<p class="font-semibold text-center">${area.dataset.info}</p>`; };
            const resetInfo = () => { infoBox.innerHTML = `<p class="text-center text-gray-500">${defaultText}</p>`; };
            area.addEventListener('mouseover', updateInfo);
            area.addEventListener('focus', updateInfo);
            area.addEventListener('mouseout', resetInfo);
            area.addEventListener('blur', resetInfo);
        });
    });

    const tongueContainer = document.querySelector('#tongue-details-container');
    const tongueDiagramAreas = document.querySelectorAll('#panel-observacao .diagram-area-svg[data-area]');
    if (tongueContainer && tongueDiagramAreas.length > 0) {
        tongueDiagramAreas.forEach(area => {
            const areaKey = area.dataset.area;
            const areaData = tongueDiagnosisData[areaKey];
            if (!areaData) return;

            const updateTongueInfo = () => {
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
                    </div>
                `;
            };
            const resetTongueInfo = () => {
                tongueContainer.innerHTML = `<p class="text-center text-gray-500">Passe o rato sobre uma área do diagrama para ver os detalhes.</p>`;
            };
            area.addEventListener('mouseover', updateTongueInfo);
            area.addEventListener('focus', updateTongueInfo);
            area.addEventListener('mouseout', resetTongueInfo);
            area.addEventListener('blur', resetTongueInfo);
        });
    }
}

function setupTherapeutics(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container || !data) return;

    let methodsHtml = '';
    if (data.types && data.types[1] && data.types[1].methods) {
        methodsHtml = `<ul class="list-disc list-inside ml-4">${data.types[1].methods.join('')}</ul>`;
    }

    container.innerHTML = `
        <p>${data.introduction}</p>
        <h4>Tipos de Moxabustão</h4>
        <p><strong>${data.types[0].name}:</strong> ${data.types[0].description}</p>
        <p><strong>${data.types[1].name}:</strong> ${data.types[1].description}</p>
        ${methodsHtml}
        <h4>Funções Terapêuticas</h4>
        ${data.functions.map(f => `<p><strong>${f.title}:</strong> ${f.content}</p>`).join('')}
        <h4>Contraindicações</h4>
        <ul class="list-disc list-inside">${data.contraindications.map(c => `<li>${c}</li>`).join('')}</ul>
    `;
}

function setupPhytotherapy(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container || !data) return;

    container.innerHTML = `
        <p>${data.introduction}</p>
        <h4>Princípios Fundamentais</h4>
        ${data.principles.map(p => `<p><strong>${p.name}:</strong> ${p.description}</p>`).join('')}
        <h4>${data.formula_structure.title}</h4>
        <p>${data.formula_structure.description}</p>
        <ul class="list-disc list-inside ml-4">
            ${data.formula_structure.roles.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <h4>Exemplos Comuns</h4>
        <h5>${data.examples[0].type}</h5>
        <ul>${data.examples[0].items.map(i => `<li><strong>${i.name}:</strong> ${i.functions}</li>`).join('')}</ul>
        <h5>${data.examples[1].type}</h5>
        <ul>${data.examples[1].items.map(i => `<li><strong>${i.name}:</strong> ${i.functions}</li>`).join('')}</ul>
    `;
}

function setupPhilosophyAndPractice() {
    const container = document.getElementById('philosophy-content-area');
    if (!container || !philosophyAndPracticeData) return;

    const { masters, internal_arts } = philosophyAndPracticeData;

    const mastersHtml = `
        <div class="visual-card mb-8">
            <div class="card-header"><h3>${masters.title}</h3></div>
            <div class="card-content card-prose"><p>${masters.introduction}</p></div>
        </div>
        <div class="space-y-8">
            ${masters.list.map(master => `
                <div class="visual-card">
                    <div class="card-header">
                        <div>
                            <h3 class="text-xl">${master.name}</h3>
                            <p class="text-sm text-gray-500 font-semibold">${master.title} (${master.period})</p>
                        </div>
                    </div>
                    <div class="card-content card-prose">
                        <p>${master.introduction}</p>
                        <h4 class="!mt-6">Principais Contribuições</h4>
                        <ul class="list-disc list-inside">${master.key_contributions.map(c => `<li>${c}</li>`).join('')}</ul>
                        
                        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h5 class="font-bold text-primary">${master.detailed_principles.title}</h5>
                            <p class="text-sm text-gray-600">${master.detailed_principles.description}</p>
                            <ul class="text-sm mt-2 space-y-1">${master.detailed_principles.principles.map(p => `<li><strong>${p.name}:</strong> ${p.content}</li>`).join('')}</ul>
                        </div>
                        <blockquote class="mt-4 border-l-4 border-primary pl-4 italic text-gray-600">"${master.famous_quote}"</blockquote>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const internalArtsHtml = `
        <div class="visual-card mt-12">
            <div class="card-header"><h3>${internal_arts.title}</h3></div>
            <div class="card-content">
                <p class="card-prose">${internal_arts.introduction}</p>
                <div id="internal-arts-tabs-container" class="mt-4">
                    <div class="border-b border-gray-200 mb-6">
                        <nav id="internal-arts-tabs" class="-mb-px flex space-x-6" aria-label="Tabs">
                            <button class="tab-button active" id="tab-qigong" aria-controls="panel-qigong" role="tab" aria-selected="true">Qi Gong</button>
                            <button class="tab-button" id="tab-taichi" aria-controls="panel-taichi" role="tab" aria-selected="false">Tai Chi</button>
                        </nav>
                    </div>
                    <div id="internal-arts-tab-content">
                        <div class="tab-content active" id="panel-qigong" role="tabpanel" aria-labelledby="tab-qigong"></div>
                        <div class="tab-content" id="panel-taichi" role="tabpanel" aria-labelledby="tab-taichi"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = mastersHtml + internalArtsHtml;

    const qigongPanel = document.getElementById('panel-qigong');
    const taichiPanel = document.getElementById('panel-taichi');

    if (qigongPanel) {
        const { qigong } = internal_arts;
        qigongPanel.innerHTML = `
            <div class="card-prose">
                <h3 class="!text-2xl">${qigong.title}</h3>
                <p>${qigong.introduction}</p>
                <div class="visual-card my-6"><div class="card-header"><h4>${qigong.foundational_concepts.title}</h4></div><div class="card-content">${qigong.foundational_concepts.concepts.map(c => `<h5>${c.name}</h5><div>${c.content}</div>`).join('')}</div></div>
                <div class="visual-card my-6"><div class="card-header"><h4>${qigong.ba_duan_jin.title}</h4></div><div class="card-content"><p>${qigong.ba_duan_jin.description}</p><div class="space-y-4 mt-4">${qigong.ba_duan_jin.movements.map(m => `<div><strong>${m.name}:</strong> ${m.movement}<br><small class="text-green-700"><em>Benefícios: ${m.benefits}</em></small></div>`).join('')}</div></div></div>
                <div class="visual-card my-6"><div class="card-header"><h4>${qigong.yi_jin_jing.title}</h4></div><div class="card-content"><p>${qigong.yi_jin_jing.description}</p><div class="space-y-4 mt-4">${qigong.yi_jin_jing.movements.map(m => `<div><strong>${m.name}:</strong> ${m.movement}<br><small class="text-green-700"><em>Benefícios: ${m.benefits}</em></small></div>`).join('')}</div></div></div>
            </div>`;
    }

    if (taichiPanel) {
        const { taichi } = internal_arts;
        taichiPanel.innerHTML = `
            <div class="card-prose">
                <h3 class="!text-2xl">${taichi.title}</h3>
                <p>${taichi.introduction}</p>
                <div class="visual-card my-6"><div class="card-header"><h4>${taichi.philosophy_and_principles.title}</h4></div><div class="card-content">${taichi.philosophy_and_principles.principles.map(p => `<h5>${p.name}</h5><div>${p.content}</div>`).join('')}</div></div>
                <div class="visual-card my-6"><div class="card-header"><h4>${taichi.advanced_concepts.title}</h4></div><div class="card-content">${taichi.advanced_concepts.concepts.map(c => `<h5>${c.name}</h5><div>${c.content}</div>`).join('')}</div></div>
                <div class="visual-card my-6"><div class="card-header"><h4>${taichi.eight_forces.title}</h4></div><div class="card-content"><p>${taichi.eight_forces.description}</p><div class="space-y-4 mt-4">${taichi.eight_forces.forces.map(f => `<div><strong>${f.name} (${f.translation}):</strong> ${f.description}</div>`).join('')}</div></div></div>
            </div>`;
    }
    
    setupTabs('internal-arts-tabs', 'internal-arts-tab-content');
}


function generateNavLinks() {
    const navStructure = [
        { id: 'inicio', title: 'Início', icon: 'icon-home' },
        {
            title: 'Fundamentos', icon: 'icon-yin-yang',
            links: [
                { id: 'substancias-fundamentais', title: 'Substâncias Fundamentais', icon: 'icon-3-treasures' },
                { id: 'tipos-de-qi', title: 'Tipos de Qi', icon: 'icon-qi' },
                { id: 'cinco-elementos', title: 'Os 5 Elementos', icon: 'icon-5-elements' },
                { id: 'ciclos-de-vida', title: 'Ciclos de Vida', icon: 'icon-lifecycle' }
            ]
        },
        { id: 'meridianos', title: 'Meridianos e Pontos', icon: 'icon-meridian' },
        { id: 'anatomia-energetica', title: 'Anatomia Energética', icon: 'icon-anatomy' },
        { id: 'padroes-zang-fu', title: 'Padrões Zang-Fu', icon: 'icon-zangfu-patterns' },
        { id: 'diagnostico-geral', title: 'Diagnóstico', icon: 'icon-diagnosis' },
        {
            title: 'Terapêuticas', icon: 'icon-tuina',
            links: [
                { id: 'dietetica', title: 'Dietética', icon: 'icon-diet' },
                { id: 'fitoterapia', title: 'Fitoterapia', icon: 'icon-fitoterapia' },
                { id: 'moxabustao', title: 'Moxabustão', icon: 'icon-moxibustion' }
            ]
        },
        { id: 'filosofia-e-pratica', title: 'Filosofia e Prática', icon: 'icon-scroll' },
        { id: 'glossario', title: 'Glossário', icon: 'icon-glossary' },
    ];

    const generateHtml = (item) => {
        if (item.links) {
            return `
                <div class="nav-group">
                    <button class="nav-group-header flex items-center justify-between w-full" aria-expanded="false">
                        <span>
                            <svg><use href="#${item.icon}"></use></svg>
                            <span class="font-semibold">${item.title}</span>
                        </span>
                        <svg class="w-5 h-5 shrink-0 chevron"><use href="#icon-chevron-down"></use></svg>
                    </button>
                    <div class="nav-group-content space-y-1">
                        ${item.links.map(link => `
                            <a href="#${link.id}" class="sidebar-link flex items-center">
                                <span>
                                    <svg><use href="#${link.icon}"></use></svg>
                                    <span>${link.title}</span>
                                </span>
                            </a>
                        `).join('')}
                    </div>
                </div>`;
        } else {
            return `
                <a href="#${item.id}" class="sidebar-link flex items-center">
                    <span>
                        <svg><use href="#${item.icon}"></use></svg>
                        <span>${item.title}</span>
                    </span>
                </a>`;
        }
    };
    
    const navHtml = navStructure.map(generateHtml).join('');
    allNavHubs.forEach(hub => {
        if(hub) hub.innerHTML = navHtml;
    });
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
