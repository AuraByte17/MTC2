// --- Importa todos os dados de data.js ---
import { 
    yinYangData,
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
    greatMastersData,
    therapiesData,
    linguaData
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

// --- LÓGICA DE NAVEGAÇÃO RESPONSIVA E PESQUISA ---
function openMobileMenu() { document.body.classList.add('mobile-menu-open'); }
function closeMobileMenu() { document.body.classList.remove('mobile-menu-open'); }
openMenuBtn.addEventListener('click', openMobileMenu);
closeMenuBtn.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

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

// --- LÓGICA DE PESQUISA ---
function createSearchIndex() {
    meridianData.forEach(m => m.points.forEach(p => searchIndex.push({ title: `${p.id} - ${p.name}`, content: p.functions, type: 'Ponto', color: m.element, sectionId: 'meridianos' })));
    Object.values(glossaryData).forEach(i => searchIndex.push({ title: i.term, content: i.definition, type: 'Glossário', color: 'primary', sectionId: 'glossario' }));
    foodData.forEach(f => searchIndex.push({ title: f.name, content: `Ações: ${f.actions}`, type: 'Alimento', color: 'earth', sectionId: 'dietetica' }));
    zangFuPatternsData.forEach(o => o.patterns.forEach(p => searchIndex.push({ title: p.name, content: p.symptoms, type: 'Padrão Zang-Fu', color: o.color, sectionId: 'padroes-zang-fu' })));
    therapiesData.forEach(t => searchIndex.push({ title: t.title, content: t.content.replace(/<[^>]*>/g, ' ').substring(0, 150) + '...', type: 'Terapia', color: 'secondary', sectionId: 'terapias' }));
    greatMastersData.forEach(m => searchIndex.push({ title: m.name, content: m.content.replace(/<[^>]*>/g, ' ').substring(0, 150) + '...', type: 'Mestre', color: 'water', sectionId: 'grandes-mestres' }));
}
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

function setupYinYangSection() {
    const container = document.getElementById('yin-yang-container');
    if (!container) return;
    const newSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full max-w-xs mx-auto yin-yang-svg">
        <defs>
            <linearGradient id="yin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#4a5568" />
                <stop offset="100%" stop-color="#1a202c" />
            </linearGradient>
            <linearGradient id="yang-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#e2e8f0" />
            </linearGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#000" flood-opacity="0.15"/>
            </filter>
        </defs>
        <g filter="url(#soft-glow)">
            <circle cx="100" cy="100" r="98" fill="url(#yang-grad)" stroke="#e2e8f0" stroke-width="2"/>
            <path fill="url(#yin-grad)" d="M100,2 a98,98 0 0,0 0,196 a49,49 0 0,1 0,-98 a49,49 0 0,0 0,-98 Z"/>
            <circle fill="url(#yin-grad)" cx="100" cy="149" r="18"/>
            <circle fill="url(#yang-grad)" cx="100" cy="51" r="18"/>
        </g>
    </svg>`;
    container.innerHTML = `
        <div class="card-header"><h3>${yinYangData.title}</h3></div>
        <div class="card-content">
            <div class="grid lg:grid-cols-2 gap-8 items-center">
                <div class="p-4">${newSvg}</div>
                <div class="card-prose">${yinYangData.content}</div>
            </div>
            <div class="mt-8 grid md:grid-cols-2 gap-6">
                <div class="yin-card">
                    <h4 class="font-bold text-xl mb-3 text-center text-gray-100">YIN (阴)</h4>
                    <ul class="list-disc list-inside space-y-2 text-gray-300">
                        <li>Noite, Lua, Escuro, Frio</li>
                        <li>Repouso, Passivo, Interior, Baixo</li>
                        <li>Substância, Matéria, Estrutura</li>
                    </ul>
                </div>
                <div class="yang-card">
                    <h4 class="font-bold text-xl mb-3 text-center text-gray-800">YANG (阳)</h4>
                    <ul class="list-disc list-inside space-y-2 text-gray-600">
                        <li>Dia, Sol, Luz, Calor</li>
                        <li>Atividade, Ativo, Exterior, Cima</li>
                        <li>Função, Energia, Movimento</li>
                    </ul>
                </div>
            </div>
        </div>`;
}

function setupExpandingCardGrid(containerId, data, cardRenderer, gridClass = 'therapies-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<div class="${gridClass}">${data.map(item => cardRenderer(item)).join('')}</div>`;
    const grid = container.querySelector(`.${gridClass}`);
    if (!grid) return;
    grid.addEventListener('click', (e) => {
        const cardTitle = e.target.closest('.expandable-card-title-wrapper');
        if (!cardTitle) return;
        const card = cardTitle.closest('.expandable-card');
        if (!card) return;
        const isExpanded = card.classList.contains('expanded');
        if (isExpanded) {
            card.classList.remove('expanded');
            grid.classList.remove('has-expanded');
        } else {
            const alreadyExpandedCard = grid.querySelector('.expanded');
            if (alreadyExpandedCard) {
                alreadyExpandedCard.classList.remove('expanded');
            }
            card.classList.add('expanded');
            grid.classList.add('has-expanded');
            setTimeout(() => {
                 card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 350);
        }
    });
}

const therapyCardRenderer = (therapy) => {
    const match = therapy.title.match(/(.+) \((.+?) - (.+?)\)/);
    const portuguese = match ? match[1].trim() : therapy.title;
    const characters = match ? match[2] : '';
    const pinyin = match ? `(${match[3]})` : '';
    return `
    <div class="expandable-card therapy-card" data-id="${therapy.id}">
        <div class="expandable-card-title-wrapper">
            <div class="therapy-title-content">
                <span class="therapy-characters">${characters}</span>
                <h3 class="expandable-card-title">${portuguese}</h3>
                <span class="therapy-pinyin">${pinyin}</span>
            </div>
        </div>
        <div class="expandable-card-content-wrapper">
            <div class="expandable-card-content-inner">${therapy.content}</div>
        </div>
    </div>`;
};

const meridianCardRenderer = (meridian) => `
    <div class="expandable-card meridian-card" data-id="${meridian.id}" style="--element-color: var(--el-${meridian.color});">
        <div class="expandable-card-title-wrapper">
            <h3 class="expandable-card-title">${meridian.name}</h3>
            <span class="meridian-element-badge">${meridian.element} / ${meridian.time}</span>
        </div>
        <div class="expandable-card-content-wrapper">
            <div class="expandable-card-content-inner">${getMeridianPanelContent(meridian)}</div>
        </div>
    </div>`;

function setupQiGrid() {
    const container = document.getElementById('qi-grid-container');
    if (!container) return;
    container.innerHTML = qiData.map(qi => `
        <div class="visual-card qi-card-item">
            <div class="card-header"><h3>${qi.title}</h3></div>
            <div class="card-content card-prose">${qi.content}</div>
        </div>
    `).join('');
    const diagramContainer = document.getElementById('qi-diagram-container');
    if(diagramContainer) {
        diagramContainer.innerHTML = `
            <h3 class="text-xl font-playfair font-bold text-primary text-center mb-4 mt-8">Diagrama da Geração de Qi</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="w-full max-w-2xl mx-auto">
                <defs>
                    <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-secondary)"/>
                    </marker>
                </defs>
                <style>
                    .qi-box { fill: #fff; stroke: var(--color-secondary); stroke-width: 1.5px; rx: 8px; }
                    .qi-text { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; fill: var(--color-primary-dark); text-anchor: middle; }
                    .qi-line { stroke: var(--color-secondary); stroke-width: 2px; marker-end: url(#arrowhead); }
                    .qi-plus { font-size: 24px; fill: var(--color-text-muted); text-anchor: middle; }
                </style>
                <rect class="qi-box" x="10" y="10" width="100" height="40"/><text class="qi-text" x="60" y="35">Gu Qi (Alimentos)</text>
                <rect class="qi-box" x="150" y="10" width="100" height="40"/><text class="qi-text" x="200" y="35">Kong Qi (Ar)</text>
                <rect class="qi-box" x="290" y="10" width="100" height="40"/><text class="qi-text" x="340" y="35">Yuan Qi (Original)</text>
                <path class="qi-line" d="M 60 50 V 100" />
                <path class="qi-line" d="M 200 50 V 100" />
                <text class="qi-plus" x="130" y="85">+</text>
                <rect class="qi-box" x="100" y="100" width="200" height="40"/><text class="qi-text" x="200" y="125">Zong Qi (Peitoral)</text>
                <path class="qi-line" d="M 200 140 V 180" />
                <path class="qi-line" d="M 340 50 C 340 100, 250 150, 220 180" fill="none" />
                <rect class="qi-box" x="40" y="220" width="120" height="40"/><text class="qi-text" x="100" y="245">Ying Qi (Nutritivo)</text>
                <rect class="qi-box" x="240" y="220" width="120" height="40"/><text class="qi-text" x="300" y="245">Wei Qi (Defensivo)</text>
                <path class="qi-line" d="M 200 180 L 100 220" fill="none" />
                <path class="qi-line" d="M 200 180 L 300 220" fill="none" />
            </svg>
        `;
    }
}

function createAccordion(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map((item, index) => {
        const uniqueId = `${containerId}-item-${index}`;
        return `
        <div class="accordion-item" data-id="${item.id || ''}">
            <button class="accordion-button" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button">
                <span class="flex items-center text-left">
                    ${item.color ? `<span class="w-3 h-3 rounded-full mr-3" style="background-color: var(--el-${item.color});"></span>` : ''}
                    ${item.name || item.title}
                </span>
                <svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg>
            </button>
            <div class="accordion-content" id="${uniqueId}-content" role="region" aria-labelledby="${uniqueId}-button">
                <div class="accordion-content-inner">${item.content || item.functions}</div>
            </div>
        </div>`;
    }).join('');
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
    
    if (navId === 'zangfu-navigation') {
        contentContainer.innerHTML = setupZangFuLayout(data);
    } else if (navId === 'masters-navigation') {
        contentContainer.innerHTML = data.map(item => setupMasterLayout(item, idPrefix)).join('');
    } else {
        contentContainer.innerHTML = data.map(item => `
            <div class="content-card" id="${idPrefix}${item.id}">
                <div class.pb-4 mb-4 border-b-2" style="border-color: var(--el-${item.color || 'primary'});">
                    <h3 class="text-2xl font-playfair font-bold" style="color: var(--el-${item.color || 'primary'});">${item.name || item.title}</h3>
                </div>
                ${item.content ? `<div class="card-prose">${item.content}</div>` : ''}
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

    // [CORRIGIDO] Listener de eventos delegado para os acordeões de Zang-Fu
    contentContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.accordion-button');
        if (button) {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
        }
    });

    if (navItems.length > 0) navItems[0].click();
}

function getMeridianPanelContent(item) { 
    return `<div class="card-prose text-sm"><div class="grid md:grid-cols-2 gap-x-8"><div><h4 class="font-bold !text-base !mb-2 !mt-0">Funções Principais</h4><p class="text-gray-600">${item.functions}</p></div><div><h4 class="font-bold !text-base !mb-2 !mt-0">Sinais de Desequilíbrio</h4><p class="text-gray-600">${item.imbalances}</p></div></div><h4 class="font-bold !text-base !mb-2">Pontos Especiais</h4><div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs p-3 bg-gray-50 rounded-md"><div><strong>Fonte (Yuan):</strong> ${item.yuan_source}</div><div><strong>Conexão (Luo):</strong> ${item.luo_connecting}</div><div><strong>Fenda (Xi):</strong> ${item.xi_cleft}</div></div><h4 class="font-bold !text-base !mb-2">Pontos Shu Antigos</h4><div class="overflow-x-auto"><table class="w-full text-left !text-xs"><thead class="bg-gray-100"><tr><th class="p-2 font-semibold">Tipo</th><th class="p-2 font-semibold">Elemento</th><th class="p-2 font-semibold">Ponto</th><th class="p-2 font-semibold">Funções</th></tr></thead><tbody>${item.five_shu.map(p => `<tr class="border-b"><td class="p-2">${p.type}</td><td class="p-2">${p.element}</td><td class="p-2 font-bold">${p.point}</td><td class="p-2">${p.functions}</td></tr>`).join('')}</tbody></table></div><h4 class="font-bold !text-base !mb-2">Lista Completa de Pontos</h4><div class="space-y-3 max-h-80 overflow-y-auto pr-2">${item.points.map(p => `<div class="p-2 border-l-2 border-gray-200 hover:bg-gray-50"><strong class="text-primary-dark">${p.id} - ${p.name} (${p.character}) - ${p.pt_name}</strong><p class="text-gray-600 !mb-0">${p.functions}</p></div>`).join('')}</div></div>`; 
}

function setupZangFuLayout(data) { return data.map((organ) => `<div class="content-card" id="zangfu-content-${organ.id}"><div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-${organ.color});"><h3 class="text-2xl font-playfair font-bold" style="color: var(--el-${organ.color});">Padrões do ${organ.name}</h3></div><div class="space-y-4">${organ.patterns.map((pattern, patternIndex) => { const uniqueId = `zangfu-${organ.id}-pattern-${patternIndex}`; return `<div class="accordion-item"><button class="accordion-button" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button"><span class="flex items-center gap-2"><svg class="w-5 h-5 text-gray-400"><use href="#icon-clipboard-heart"></use></svg>${pattern.name}</span><svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg></button><div class="accordion-content" id="${uniqueId}-content" role="region" aria-labelledby="${uniqueId}-button"><div class="accordion-content-inner card-prose text-sm"><h4 class="font-bold text-gray-700">Manifestações Clínicas:</h4><p>${pattern.symptoms}</p><h4 class="font-bold text-gray-700">Língua:</h4><p>${pattern.tongue}</p><h4 class="font-bold text-gray-700">Pulso:</h4><p>${pattern.pulse}</p><h4 class="font-bold text-gray-700">Princípio de Tratamento:</h4><p class="text-green-800 font-semibold">${pattern.treatmentPrinciple}</p></div></div></div>`; }).join('')}</div></div>`).join(''); }
function setupMasterLayout(item, idPrefix) { return `<div class="content-card" id="${idPrefix}${item.id}"><div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-water);"><img src="${item.image_placeholder}" alt="Retrato de ${item.name}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-md"><h3 class="text-2xl font-playfair font-bold" style="color: var(--el-water);">${item.name}</h3><p class="font-semibold text-gray-500 text-sm">${item.dynasty}</p></div><div class="card-prose">${item.content}</div></div>`; }

function setupGlossary() { const glossaryContainer = document.getElementById('glossary-container'); if (!glossaryContainer) return; const categories = Object.values(glossaryData).reduce((acc, item) => { (acc[item.category] = acc[item.category] || []).push(item); return acc; }, {}); const sortedCategories = Object.keys(categories).sort(); glossaryContainer.innerHTML = sortedCategories.map(category => `<div class="visual-card mb-8"><div class="card-header"><h3 class="text-gray-700">${category}</h3></div><div class="card-content grid md:grid-cols-2 gap-x-8 gap-y-6">${categories[category].sort((a, b) => a.term.localeCompare(b.term)).map(item => `<div><h4 class="font-bold text-lg">${item.term}</h4><p class="text-gray-600">${item.definition}</p></div>`).join('')}</div></div>`).join(''); }
function activateTooltips() { document.body.addEventListener('mouseover', e => { const term = e.target.closest('.tooltip-term'); if(term) { const existingTooltip = term.querySelector('.tooltip-box'); if (!existingTooltip) { const termKey = term.dataset.term.toLowerCase(); if (glossaryData[termKey]) { const tooltipBox = document.createElement('div'); tooltipBox.className = 'tooltip-box'; tooltipBox.textContent = glossaryData[termKey].definition; term.appendChild(tooltipBox); } } } }); }
function setupDietetics() { const foodSearchInput = document.getElementById('food-search-input'); const foodResultsContainer = document.getElementById('food-results-container'); const foodAlphaNav = document.getElementById('food-alpha-nav'); function renderFoodList(foods) { const groupedFoods = foods.reduce((acc, food) => { const firstLetter = food.name.charAt(0).toUpperCase(); if (!acc[firstLetter]) acc[firstLetter] = []; acc[firstLetter].push(food); return acc; }, {}); const letters = Object.keys(groupedFoods).sort(); if (foodAlphaNav) foodAlphaNav.innerHTML = letters.map(letter => `<a href="#food-letter-${letter}">${letter}</a>`).join(''); if (foodResultsContainer) { foodResultsContainer.innerHTML = letters.map(letter => `<h3 id="food-letter-${letter}" class="food-group-header" tabindex="-1">${letter}</h3><div class="food-group-items">${groupedFoods[letter].map(food => `<div class="food-item visual-card p-4 mb-3"><h4 class="font-bold text-lg text-green-800">${food.name}</h4><div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2"><div><strong>Temp:</strong> <span class="font-semibold">${food.temp}</span></div><div><strong>Sabor:</strong> <span class="font-semibold">${food.flavor}</span></div><div class="col-span-2"><strong>Órgãos:</strong> <span class="font-semibold">${food.organs}</span></div></div><p class="text-sm mt-2"><strong>Ações:</strong> ${food.actions}</p></div>`).join('')}</div>`).join(''); } } if (foodSearchInput) { renderFoodList(foodData); foodSearchInput.addEventListener('input', (e) => { const searchTerm = e.target.value.toLowerCase().trim(); const headers = foodResultsContainer.querySelectorAll('.food-group-header'); headers.forEach(header => { const groupWrapper = header.nextElementSibling; if (!groupWrapper) return; const items = groupWrapper.querySelectorAll('.food-item'); let groupHasVisibleItems = false; items.forEach(item => { const foodName = item.querySelector('h4').textContent.toLowerCase(); const isVisible = foodName.includes(searchTerm); item.classList.toggle('hidden', !isVisible); if (isVisible) groupHasVisibleItems = true; }); header.style.display = groupHasVisibleItems ? 'block' : 'none'; groupWrapper.style.display = groupHasVisibleItems ? 'block' : 'none'; }); }); } }

function setupDiagnosis() {
    const container = document.getElementById('diagnosis-container');
    if (!container) return;
    const linguaDiagram = container.querySelector('#lingua-diagram-svg');
    const linguaInfoBox = container.querySelector('#lingua-info-box');
    if (linguaDiagram && linguaInfoBox) {
        const defaultLinguaText = linguaInfoBox.innerHTML;
        const linguaAreas = linguaDiagram.querySelectorAll('.diagram-area-svg');
        linguaDiagram.addEventListener('click', (e) => {
            const clickedArea = e.target.closest('.diagram-area-svg');
            linguaAreas.forEach(area => area.classList.remove('active'));
            if (clickedArea) {
                clickedArea.classList.add('active');
                const areaKey = clickedArea.dataset.area;
                const info = linguaData[areaKey];
                if (info) {
                    linguaInfoBox.innerHTML = `<h4 class="font-bold text-primary mb-2">${info.title}</h4><p class="text-sm text-gray-600 text-left">${info.info}</p>`;
                }
            } else {
                linguaInfoBox.innerHTML = defaultLinguaText;
            }
        });
    }
    const pulseDiagram = container.querySelector('#pulse-diagram-svg');
    const pulseInfoBox = container.querySelector('#pulse-info-box');
    if (pulseDiagram && pulseInfoBox) {
        const defaultPulseText = pulseInfoBox.innerHTML;
        const pulsePositions = pulseDiagram.querySelectorAll('.pulse-pos-circle');
        pulseDiagram.addEventListener('click', (e) => {
            const clickedPos = e.target.closest('.pulse-pos-circle');
            pulsePositions.forEach(pos => pos.classList.remove('active'));
            if (clickedPos) {
                clickedPos.classList.add('active');
                const posKey = clickedPos.dataset.pos;
                const pulseInfoData = {
                    cun: { title: 'Cun (Polegada)', info: 'Posição mais distal. Esquerda: Coração. Direita: Pulmão.' },
                    guan: { title: 'Guan (Barreira)', info: 'Posição intermédia. Esquerda: Fígado/VB. Direita: Baço/Estômago.' },
                    chi: { title: 'Chi (Pé)', info: 'Posição mais proximal. Esquerda: Rim Yin. Direita: Rim Yang.' }
                };
                const info = pulseInfoData[posKey];
                if (info) {
                    pulseInfoBox.innerHTML = `<h4 class="font-bold text-primary mb-2">${info.title}</h4><p class="text-sm text-gray-600 text-left">${info.info}</p>`;
                }
            } else {
                pulseInfoBox.innerHTML = defaultPulseText;
            }
        });
    }
    const pulseListContainer = container.querySelector('#pulse-list-container');
    if (pulseListContainer) {
        createAccordion('pulse-list-container', pulseData);
        pulseListContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.accordion-button');
            if (button) {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
            }
        });
    }
}

function generateNavLinks() {
    const navStructure = [
        { id: 'inicio', title: 'Início', icon: 'icon-home' },
        {
            title: 'Fundamentos', icon: 'icon-book-open',
            links: [
                { id: 'yin-yang', title: 'Teoria Yin-Yang', icon: 'icon-yin-yang' },
                { id: 'substancias-fundamentais', title: 'Substâncias Fundamentais', icon: 'icon-atom' },
                { id: 'tipos-de-qi', title: 'Tipos de Qi', icon: 'icon-wind' },
                { id: 'ciclos-de-vida', title: 'Ciclos de Vida', icon: 'icon-refresh-cw' },
                { id: 'meridianos', title: 'Meridianos e Pontos', icon: 'icon-git-branch' },
                { id: 'anatomia-energetica', title: 'Anatomia Energética', icon: 'icon-body' },
                { id: 'padroes-zang-fu', title: 'Padrões Zang-Fu', icon: 'icon-clipboard-heart' },
            ]
        },
        {
            title: 'Diagnóstico', icon: 'icon-stethoscope',
            links: [ { id: 'diagnostico', title: 'Métodos de Diagnóstico', icon: 'icon-stethoscope' }, ]
        },
        {
            title: 'Terapêuticas', icon: 'icon-lotus',
            links: [
                { id: 'terapias', title: 'Visão Geral', icon: 'icon-lotus' },
                { id: 'dietetica', title: 'Dietética', icon: 'icon-soup' },
            ]
        },
        {
            title: 'Sabedoria', icon: 'icon-users',
            links: [ { id: 'grandes-mestres', title: 'Grandes Mestres', icon: 'icon-scroll' }, ]
        },
        { id: 'glossario', title: 'Glossário', icon: 'icon-book-open' },
    ];
    const generateHtml = (item) => {
        if (item.links) {
            return `<div class="nav-group"><button class="nav-group-header flex items-center justify-between w-full p-2 rounded-lg" aria-expanded="false"><span class="flex items-center"><svg class="w-5 h-5 mr-3 text-gray-500"><use href="#${item.icon}"></use></svg><span class="font-semibold">${item.title}</span></span><svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg></button><div class="nav-group-content pl-4 pt-1 space-y-1">${item.links.map(link => `<a href="#${link.id}" class="sidebar-link flex items-center p-2 rounded-lg"><svg class="w-5 h-5 mr-3 text-gray-500"><use href="#${link.icon}"></use></svg><span>${link.title}</span></a>`).join('')}</div></div>`;
        } else {
            return `<a href="#${item.id}" class="sidebar-link flex items-center p-2 rounded-lg"><svg class="w-5 h-5 mr-3 text-gray-500"><use href="#${item.icon}"></use></svg><span>${item.title}</span></a>`;
        }
    };
    const navHtml = navStructure.map(generateHtml).join('');
    allNavHubs.forEach(hub => hub.innerHTML = navHtml);
}

document.addEventListener('DOMContentLoaded', () => {
    generateNavLinks(); 
    setupYinYangSection();
    setupQiGrid();
    createLifeCycleTimeline('female-cycles-timeline', lifeCyclesFemaleData, 'bg-pink-500');
    createLifeCycleTimeline('male-cycles-timeline', lifeCyclesMaleData, 'bg-blue-500');
    setupGlossary();
    setupDietetics();
    setupExpandingCardGrid('therapies-grid-container', therapiesData, therapyCardRenderer);
    setupExpandingCardGrid('meridian-grid-container', meridianData, meridianCardRenderer, 'meridian-grid');
    setupDiagnosis();
    setupSidebarLayout('anatomy-navigation', 'anatomy-content-area', anatomyData, 'anatomy-content-');
    setupSidebarLayout('zangfu-navigation', 'zangfu-content-area', zangFuPatternsData, 'zangfu-content-');
    setupSidebarLayout('masters-navigation', 'masters-content-area', greatMastersData, 'master-content-');
    activateTooltips();
    document.querySelectorAll('aside .sidebar-link, aside .nav-group').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.07}s`;
    });
    createSearchIndex();
    contentSections = mainContent.querySelectorAll('.content-section');
    showSection('inicio', 'Início');
    updateActiveLink('inicio');
});
