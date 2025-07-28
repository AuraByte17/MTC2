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

// [NOVO] Elementos do Modal de Conteúdo
const contentModal = document.getElementById('content-modal');
const contentModalContent = document.getElementById('content-modal-content');
const contentModalCloseBtn = document.getElementById('content-modal-close-btn');
const contentModalOverlay = document.getElementById('content-modal-overlay');


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

// --- [NOVO] LÓGICA DO MODAL DE CONTEÚDO ---
function openContentModal(htmlContent) {
    contentModalContent.innerHTML = htmlContent;
    document.body.classList.add('content-modal-open');
}
function closeContentModal() {
    document.body.classList.remove('content-modal-open');
}
contentModalCloseBtn.addEventListener('click', closeContentModal);
contentModalOverlay.addEventListener('click', closeContentModal);


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

function initializeAccordion(container) {
    if (!container) return;
    container.addEventListener('click', (e) => {
        const button = e.target.closest('.accordion-button');
        if (!button) return;
        const item = button.closest('.accordion-item');
        if (!item) return;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const allItems = container.querySelectorAll('.accordion-item');
        allItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherButton = otherItem.querySelector('.accordion-button');
                if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
            }
        });
        button.setAttribute('aria-expanded', !isExpanded);
    });
}

function createAccordionHTML(data, containerIdPrefix = '') {
    return data.map((item, index) => {
        const uniqueId = `${containerIdPrefix}-item-${index}`;
        return `
        <div class="accordion-item" data-id="${item.id || ''}">
            <button class="accordion-button" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button">
                <span class="accordion-title-content">
                    ${item.color ? `<span class="w-3 h-3 rounded-full mr-3 shrink-0" style="background-color: var(--el-${item.color});"></span>` : ''}
                    <span class="text-left">${item.title}</span>
                </span>
                <svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg>
            </button>
            <div class="accordion-content" id="${uniqueId}-content" role="region" aria-labelledby="${uniqueId}-button">
                <div class="accordion-content-inner">${item.content || item.functions}</div>
            </div>
        </div>`;
    }).join('');
}

function setupYinYangSection() {
    const container = document.getElementById('yin-yang-container');
    if (!container) return;
    const newSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full max-w-xs mx-auto yin-yang-svg">
        <defs>
            <linearGradient id="yin-grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#4a5568" /><stop offset="100%" stop-color="#1a202c" /></linearGradient>
            <linearGradient id="yang-grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff" /><stop offset="100%" stop-color="#e2e8f0" /></linearGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#000" flood-opacity="0.15"/></filter>
        </defs>
        <g filter="url(#soft-glow)">
            <circle cx="100" cy="100" r="98" fill="url(#yang-grad)" stroke="#e2e8f0" stroke-width="2"/>
            <path fill="url(#yin-grad)" d="M100,2 a98,98 0 0,0 0,196 a49,49 0 0,1 0,-98 a49,49 0 0,0 0,-98 Z"/>
            <circle fill="url(#yin-grad)" cx="100" cy="149" r="18"/><circle fill="url(#yang-grad)" cx="100" cy="51" r="18"/>
        </g>
    </svg>`;
    container.innerHTML = `
        <div class="card-header"><h3>${yinYangData.title}</h3></div>
        <div class="card-content">
            <div class="grid lg:grid-cols-2 gap-8 items-center">
                <div class="p-4">${newSvg}</div><div class="card-prose">${yinYangData.content}</div>
            </div>
            <div class="mt-8 grid md:grid-cols-2 gap-6">
                <div class="yin-card"><h4 class="font-bold text-xl mb-3 text-center text-gray-100">YIN (阴)</h4><ul class="list-disc list-inside space-y-2 text-gray-300"><li>Noite, Lua, Escuro, Frio</li><li>Repouso, Passivo, Interior, Baixo</li><li>Substância, Matéria, Estrutura</li></ul></div>
                <div class="yang-card"><h4 class="font-bold text-xl mb-3 text-center text-gray-800">YANG (阳)</h4><ul class="list-disc list-inside space-y-2 text-gray-600"><li>Dia, Sol, Luz, Calor</li><li>Atividade, Ativo, Exterior, Cima</li><li>Função, Energia, Movimento</li></ul></div>
            </div>
        </div>`;
}

function setupQiCards(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="floating-card h-full">
            <div class="card-content">
                <h4 class="font-bold text-lg text-primary !mt-0">${item.title}</h4>
                <p class="text-gray-600 !mb-0 text-sm">${item.content}</p>
            </div>
        </div>
    `).join('');
}

function setupTherapiesGrid() {
    const container = document.getElementById('therapies-grid-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center mb-12">
            <h2 class="text-3xl font-playfair font-bold text-primary">Terapêuticas da MTC</h2>
            <p class="text-gray-600 mt-2 max-w-2xl mx-auto">Explore as principais modalidades de tratamento. Clique em cada cartão para aprender mais.</p>
        </div>
        <div class="therapies-grid">
            ${therapiesData.map(therapy => {
                const regex = /(.+?)\s\((.+?)(?:\s-\s(.+?))?\)/;
                const match = therapy.title.match(regex);
                let titleHTML, pinyinHTML = '';
                if (match) {
                    const [, pt, ch, pinyin] = match;
                    titleHTML = `<div class="text-2xl font-chinese">${ch}</div><div class="text-xl font-playfair my-1">${pt}</div>`;
                    if (pinyin) pinyinHTML = `<div class="text-sm text-gray-500 font-mono">(${pinyin})</div>`;
                    else if (ch === '气功' || ch === '太极拳') pinyinHTML = `<div class="text-sm text-gray-500 font-mono">(${ch === '气功' ? 'Qìgōng' : 'Tàijí quán'})</div>`;
                } else {
                    titleHTML = `<div class="text-xl font-playfair my-1">${therapy.title}</div>`;
                }

                return `
                <div class="therapy-card" data-id="${therapy.id}">
                    <div class="therapy-card-front">
                        <div class="therapy-card-title-wrapper">
                            ${titleHTML}
                            ${pinyinHTML}
                        </div>
                    </div>
                    <div class="therapy-card-back">
                        <div class="therapy-content-inner card-prose">
                            ${therapy.content}
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;

    const grid = container.querySelector('.therapies-grid');
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.therapy-card');
        if (!card) return;

        const isExpanded = card.classList.contains('expanded');

        grid.querySelectorAll('.therapy-card').forEach(c => c.classList.remove('expanded'));
        
        if (!isExpanded) {
            card.classList.add('expanded');
        }
    });
}

function createLifeCycleTimeline(containerId, data, colorClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="timeline-item">
            <div class="timeline-marker"><div class="w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center font-bold text-sm shadow-md">${item.age}</div></div>
            <div class="pt-1"><p class="font-semibold text-gray-800">Idade ${item.age}</p><p class="text-sm text-gray-600">${item.content}</p></div>
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
                <div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-${item.color || 'primary'});">
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

    if (navItems.length > 0) navItems[0].click();
}

function getMeridianPanelContent(item) { 
    return `
        <div class="card-header">
            <span class="w-4 h-4 rounded-full mr-3 shrink-0" style="background-color: var(--el-${item.color});"></span>
            <h3>${item.name}</h3>
        </div>
        <div class="card-content card-prose text-sm">
            <div class="grid md:grid-cols-2 gap-x-8">
                <div><h4 class="font-bold !text-base !mb-2 !mt-0">Funções Principais</h4><p class="text-gray-600">${item.functions}</p></div>
                <div><h4 class="font-bold !text-base !mb-2 !mt-0">Sinais de Desequilíbrio</h4><p class="text-gray-600">${item.imbalances}</p></div>
            </div>
            <h4 class="font-bold !text-base !mb-2">Pontos Especiais</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs p-3 bg-gray-50 rounded-md">
                <div><strong>Fonte (Yuan):</strong> ${item.yuan_source}</div>
                <div><strong>Conexão (Luo):</strong> ${item.luo_connecting}</div>
                <div><strong>Fenda (Xi):</strong> ${item.xi_cleft}</div>
            </div>
            <h4 class="font-bold !text-base !mb-2">Pontos Shu Antigos</h4>
            <div class="overflow-x-auto"><table class="w-full text-left !text-xs"><thead class="bg-gray-100"><tr><th class="p-2 font-semibold">Tipo</th><th class="p-2 font-semibold">Elemento</th><th class="p-2 font-semibold">Ponto</th><th class="p-2 font-semibold">Funções</th></tr></thead><tbody>${item.five_shu.map(p => `<tr class="border-b"><td class="p-2">${p.type}</td><td class="p-2">${p.element}</td><td class="p-2 font-bold">${p.point}</td><td class="p-2">${p.functions}</td></tr>`).join('')}</tbody></table></div>
            <h4 class="font-bold !text-base !mb-2">Lista Completa de Pontos</h4>
            <div class="space-y-3 max-h-80 overflow-y-auto pr-2">${item.points.map(p => `<div class="p-2 border-l-2 border-gray-200 hover:bg-gray-50"><strong class="text-primary-dark">${p.id} - ${p.name} (${p.character}) - ${p.pt_name}</strong><p class="text-gray-600 !mb-0">${p.functions}</p></div>`).join('')}</div>
        </div>`; 
}

// [NOVO] Configura a secção de Meridianos com uma grelha de cartões que abrem um modal de zoom.
function setupMeridianGrid() {
    const container = document.getElementById('meridian-grid-container');
    if (!container) return;

    container.innerHTML = meridianData.map(meridian => `
        <div class="meridian-card" data-meridian-id="${meridian.id}">
            <span class="meridian-card-color-bar" style="background-color: var(--el-${meridian.color});"></span>
            <div class="p-4">
                <h4 class="font-playfair font-bold text-lg text-primary">${meridian.name}</h4>
                <p class="text-xs text-gray-500">${meridian.element} / ${meridian.time}</p>
            </div>
        </div>
    `).join('');

    container.addEventListener('click', (e) => {
        const card = e.target.closest('.meridian-card');
        if (!card) return;

        const meridianId = card.dataset.meridianId;
        const meridianInfo = meridianData.find(m => m.id === meridianId);

        if (meridianInfo) {
            const contentHTML = getMeridianPanelContent(meridianInfo);
            openContentModal(contentHTML);
        }
    });
}


function setupZangFuLayout(data) {
    return data.map((organ) => {
        const accordionItems = organ.patterns.map((pattern, patternIndex) => {
            const uniqueId = `zangfu-${organ.id}-pattern-${patternIndex}`;
            return `
            <div class="accordion-item">
                <button class="accordion-button" aria-expanded="false" aria-controls="${uniqueId}-content" id="${uniqueId}-button">
                    <span class="accordion-title-content">
                        <svg class="w-5 h-5 text-gray-400 shrink-0"><use href="#icon-clipboard-heart"></use></svg>
                        <span class="text-left">${pattern.name}</span>
                    </span>
                    <svg class="w-5 h-5 shrink-0 text-gray-400 chevron"><use href="#icon-chevron-down"></use></svg>
                </button>
                <div class="accordion-content" id="${uniqueId}-content" role="region" aria-labelledby="${uniqueId}-button">
                    <div class="accordion-content-inner card-prose text-sm">
                        <h4 class="font-bold text-gray-700">Manifestações Clínicas:</h4><p>${pattern.symptoms}</p>
                        <h4 class="font-bold text-gray-700">Língua:</h4><p>${pattern.tongue}</p>
                        <h4 class="font-bold text-gray-700">Pulso:</h4><p>${pattern.pulse}</p>
                        <h4 class="font-bold text-gray-700">Princípio de Tratamento:</h4><p class="text-green-800 font-semibold">${pattern.treatmentPrinciple}</p>
                    </div>
                </div>
            </div>`;
        }).join('');
        return `
        <div class="content-card" id="zangfu-content-${organ.id}">
            <div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-${organ.color});">
                <h3 class="text-2xl font-playfair font-bold" style="color: var(--el-${organ.color});">Padrões do ${organ.name}</h3>
            </div>
            <div class="space-y-3" id="zangfu-accordion-${organ.id}">${accordionItems}</div>
        </div>`;
    }).join('');
}

function setupMasterLayout(item, idPrefix) { return `<div class="content-card" id="${idPrefix}${item.id}"><div class="pb-4 mb-4 border-b-2" style="border-color: var(--el-water);"><img src="${item.image_placeholder}" alt="Retrato de ${item.name}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-md"><h3 class="text-2xl font-playfair font-bold" style="color: var(--el-water);">${item.name}</h3><p class="font-semibold text-gray-500 text-sm">${item.dynasty}</p></div><div class="card-prose">${item.content}</div></div>`; }

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
const cycleInfo = { geracao: { title: 'Ciclo de Geração (Sheng)', description: 'Este ciclo representa a nutrição e o apoio. Cada elemento é a "mãe" do seguinte, nutrindo-o e promovendo o seu crescimento.', color: 'bg-green-100', textColor: 'text-green-800' }, controlo: { title: 'Ciclo de Controlo (Ke)', description: 'Este ciclo representa o controlo e a restrição, garantindo que nenhum elemento se torna excessivo e mantendo o equilíbrio do sistema.', color: 'bg-red-100', textColor: 'text-red-800' } };
const elementCoords = { madeira: { x: 150, y: 45 }, fogo: { x: 255, y: 125 }, terra: { x: 208, y: 255 }, metal: { x: 92, y: 255 }, agua: { x: 45, y: 125 } };
const cyclePaths = { geracao: [ { id: 'madeira-fogo', d: `M ${elementCoords.madeira.x} ${elementCoords.madeira.y} C 210 65, 230 80, ${elementCoords.fogo.x} ${elementCoords.fogo.y}` }, { id: 'fogo-terra', d: `M ${elementCoords.fogo.x} ${elementCoords.fogo.y} C 250 180, 240 220, ${elementCoords.terra.x} ${elementCoords.terra.y}` }, { id: 'terra-metal', d: `M ${elementCoords.terra.x} ${elementCoords.terra.y} C 160 285, 130 285, ${elementCoords.metal.x} ${elementCoords.metal.y}` }, { id: 'metal-agua', d: `M ${elementCoords.metal.x} ${elementCoords.metal.y} C 60 220, 50 180, ${elementCoords.agua.x} ${elementCoords.agua.y}` }, { id: 'agua-madeira', d: `M ${elementCoords.agua.x} ${elementCoords.agua.y} C 70 80, 90 65, ${elementCoords.madeira.x} ${elementCoords.madeira.y}` } ], controlo: [ { id: 'madeira-terra', d: `M ${elementCoords.madeira.x} ${elementCoords.madeira.y} L ${elementCoords.terra.x} ${elementCoords.terra.y}` }, { id: 'fogo-metal', d: `M ${elementCoords.fogo.x} ${elementCoords.fogo.y} L ${elementCoords.metal.x} ${elementCoords.metal.y}` }, { id: 'terra-agua', d: `M ${elementCoords.terra.x} ${elementCoords.terra.y} L ${elementCoords.agua.x} ${elementCoords.agua.y}` }, { id: 'metal-madeira', d: `M ${elementCoords.metal.x} ${elementCoords.metal.y} L ${elementCoords.madeira.x} ${elementCoords.madeira.y}` }, { id: 'agua-fogo', d: `M ${elementCoords.agua.x} ${elementCoords.agua.y} L ${elementCoords.fogo.x} ${elementCoords.fogo.y}` } ] };
function setup5ElementsDiagram() { if (!spheresContainer) return; spheresContainer.innerHTML = Object.keys(fiveElementsData).map(key => { const el = fiveElementsData[key]; const { x, y } = elementCoords[key]; return `<g id="${key}" class="element-sphere"><defs><radialGradient id="grad-${key}" cx="30%" cy="30%" r="70%"><stop offset="0%" stop-color="white" stop-opacity="0.5" /><stop offset="100%" stop-color="var(--el-${el.color})" stop-opacity="1" /></radialGradient></defs><circle class="sphere-circle" cx="${x}" cy="${y}" r="30" fill="url(#grad-${key})" stroke="var(--el-${el.color})" stroke-width="1.5" filter="url(#sphere-glow)"/><text class="sphere-text" x="${x}" y="${y + 5}">${el.name}</text></g>`; }).join(''); }
function renderCyclePaths() { if(!pathsContainer) return; pathsContainer.innerHTML = cyclePaths[currentCycle].map(p => `<path id="${p.id}" class="cycle-path" d="${p.d}" stroke="${defaultColor}" stroke-width="2.5" fill="none" marker-end="url(#arrow)"/>`).join(''); }
function update5ElementsUI() { if(!elementDiagramSVG) return; elementDiagramSVG.querySelectorAll('.element-sphere').forEach(g => g.classList.remove('active')); document.querySelectorAll('.arrow-marker').forEach(marker => marker.style.fill = defaultColor); if (pathsContainer) { pathsContainer.querySelectorAll('.cycle-path').forEach(path => { path.style.stroke = defaultColor; path.style.strokeWidth = '2.5'; path.classList.remove('draw'); }); } if (selectedElementId) { const elData = fiveElementsData[selectedElementId]; const selectedGroup = document.getElementById(selectedElementId); if (selectedGroup) selectedGroup.classList.add('active'); const targetElementId = elData.target[currentCycle]; const activePathId = `${selectedElementId}-${targetElementId}`; const activePath = document.getElementById(activePathId); if (activePath) { const color = `var(--el-${elData.color})`; activePath.style.stroke = color; activePath.style.color = color; activePath.style.strokeWidth = '4'; activePath.classList.add('draw'); const marker = document.querySelector(`#arrow path`); if (marker) marker.style.fill = color; } elementDetailsContainer.innerHTML = `<div class="text-left p-6 rounded-lg border-2" style="border-color: var(--el-${elData.color}); background-color: #fafcff;"><h3 class="text-2xl font-playfair font-bold mb-4" style="color: var(--el-${elData.color});">${elData.name}</h3><div class="card-prose"><p class="font-semibold text-gray-600 mb-2">Relações no Ciclo de ${currentCycle.charAt(0).toUpperCase() + currentCycle.slice(1)}:</p><p class="text-sm">${elData.relations[currentCycle]}</p><table class="w-full text-sm mt-4"><tbody>${elData.table}</tbody></table></div></div>`; } else { elementDetailsContainer.innerHTML = '<div class="flex items-center justify-center h-full text-center text-gray-500 p-4 bg-gray-50 rounded-lg"><p>Clique num elemento do diagrama para ver as suas correspondências detalhadas e a sua relação no ciclo atual.</p></div>'; } }
function switchCycle(cycle) { currentCycle = cycle; const info = cycleInfo[cycle]; if(cycleInfoBox) { cycleInfoBox.className = `mb-6 p-4 rounded-lg text-center transition-colors duration-500 ${info.color} ${info.textColor}`; cycleInfoBox.innerHTML = `<h4 class="font-bold">${info.title}</h4><p class="text-sm">${info.description}</p>`; } if(btnGeracao) btnGeracao.classList.toggle('active', cycle === 'geracao'); if(btnControlo) btnControlo.classList.toggle('active', cycle === 'controlo'); renderCyclePaths(); update5ElementsUI(); }
if(btnGeracao) btnGeracao.addEventListener('click', () => switchCycle('geracao'));
if(btnControlo) btnControlo.addEventListener('click', () => switchCycle('controlo'));
if (elementDiagramSVG) { elementDiagramSVG.addEventListener('click', (e) => { const sphereGroup = e.target.closest('.element-sphere'); if (sphereGroup) { selectedElementId = sphereGroup.id; update5ElementsUI(); } }); }

function setupGlossary() { const glossaryContainer = document.getElementById('glossary-container'); if (!glossaryContainer) return; const categories = Object.values(glossaryData).reduce((acc, item) => { (acc[item.category] = acc[item.category] || []).push(item); return acc; }, {}); const sortedCategories = Object.keys(categories).sort(); glossaryContainer.innerHTML = sortedCategories.map(category => `<div class="floating-card mb-8"><div class="card-header"><h3 class="text-gray-700">${category}</h3></div><div class="card-content grid md:grid-cols-2 gap-x-8 gap-y-6">${categories[category].sort((a, b) => a.term.localeCompare(b.term)).map(item => `<div><h4 class="font-bold text-lg">${item.term}</h4><p class="text-gray-600">${item.definition}</p></div>`).join('')}</div></div>`).join(''); }
function activateTooltips() { document.body.addEventListener('mouseover', e => { const term = e.target.closest('.tooltip-term'); if(term) { const existingTooltip = term.querySelector('.tooltip-box'); if (!existingTooltip) { const termKey = term.dataset.term.toLowerCase(); if (glossaryData[termKey]) { const tooltipBox = document.createElement('div'); tooltipBox.className = 'tooltip-box'; tooltipBox.textContent = glossaryData[termKey].definition; term.appendChild(tooltipBox); } } } }); }
function setupDietetics() { const foodSearchInput = document.getElementById('food-search-input'); const foodResultsContainer = document.getElementById('food-results-container'); const foodAlphaNav = document.getElementById('food-alpha-nav'); function renderFoodList(foods) { const groupedFoods = foods.reduce((acc, food) => { const firstLetter = food.name.charAt(0).toUpperCase(); if (!acc[firstLetter]) acc[firstLetter] = []; acc[firstLetter].push(food); return acc; }, {}); const letters = Object.keys(groupedFoods).sort(); if (foodAlphaNav) foodAlphaNav.innerHTML = letters.map(letter => `<a href="#food-letter-${letter}">${letter}</a>`).join(''); if (foodResultsContainer) { foodResultsContainer.innerHTML = letters.map(letter => `<h3 id="food-letter-${letter}" class="food-group-header" tabindex="-1">${letter}</h3><div class="food-group-items">${groupedFoods[letter].map(food => `<div class="food-item floating-card p-4 mb-3"><h4 class="font-bold text-lg text-green-800">${food.name}</h4><div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2"><div><strong>Temp:</strong> <span class="font-semibold">${food.temp}</span></div><div><strong>Sabor:</strong> <span class="font-semibold">${food.flavor}</span></div><div class="col-span-2"><strong>Órgãos:</strong> <span class="font-semibold">${food.organs}</span></div></div><p class="text-sm mt-2"><strong>Ações:</strong> ${food.actions}</p></div>`).join('')}</div>`).join(''); } } if (foodSearchInput) { renderFoodList(foodData); foodSearchInput.addEventListener('input', (e) => { const searchTerm = e.target.value.toLowerCase().trim(); const headers = foodResultsContainer.querySelectorAll('.food-group-header'); headers.forEach(header => { const groupWrapper = header.nextElementSibling; if (!groupWrapper) return; const items = groupWrapper.querySelectorAll('.food-item'); let groupHasVisibleItems = false; items.forEach(item => { const foodName = item.querySelector('h4').textContent.toLowerCase(); const isVisible = foodName.includes(searchTerm); item.classList.toggle('hidden', !isVisible); if (isVisible) groupHasVisibleItems = true; }); header.style.display = groupHasVisibleItems ? 'block' : 'none'; groupWrapper.style.display = groupHasVisibleItems ? 'block' : 'none'; }); }); } }

function setupDiagnosisDiagrams() {
    const tongueSVG = document.getElementById('lingua-diagram-svg');
    const tongueInfoBox = document.getElementById('lingua-info-box');
    if (tongueSVG && tongueInfoBox) {
        const areas = tongueSVG.querySelectorAll('.diagram-area-svg');
        areas.forEach(area => {
            area.addEventListener('click', () => {
                areas.forEach(a => a.classList.remove('active'));
                area.classList.add('active');
                const areaId = area.dataset.area;
                const info = linguaData[areaId];
                if (info) {
                    tongueInfoBox.innerHTML = `
                        <h4 class="font-playfair font-bold text-lg text-primary mb-2">${info.title}</h4>
                        <p class="text-sm text-gray-600">${info.info}</p>`;
                }
            });
        });
    }

    const pulseSVG = document.getElementById('pulso-diagram-svg');
    const pulseInfoBox = document.getElementById('pulso-info-box');
    if (pulseSVG && pulseInfoBox) {
        const positions = pulseSVG.querySelectorAll('.pulse-pos-circle');
        positions.forEach(pos => {
            pos.addEventListener('click', () => {
                positions.forEach(p => p.classList.remove('active'));
                pos.classList.add('active');
                const positionId = pos.dataset.pos;
                const info = pulseData.find(p => p.id === positionId);
                 if (info) {
                    pulseInfoBox.innerHTML = `
                        <h4 class="font-playfair font-bold text-lg text-primary mb-2">${info.title}</h4>
                        <p class="text-sm text-gray-600"><strong>Pulso Esquerdo:</strong> ${info.left}</p>
                        <p class="text-sm text-gray-600"><strong>Pulso Direito:</strong> ${info.right}</p>`;
                }
            });
        });
    }
}

function setupDiagnosisAccordion() {
    const container = document.getElementById('diagnosis-accordion-container');
    if(!container) return;
    const perguntasContent = `<div id="perguntas-accordion-inner" class="space-y-3"></div>`;
    const pulseTypesContent = `<div id="pulse-list-container-inner" class="space-y-3"></div>`;
    const diagnosisData = [ { title: 'As 10+1 Perguntas', content: perguntasContent }, { title: 'Tipos de Pulso Comuns', content: pulseTypesContent } ];
    
    container.innerHTML = createAccordionHTML(diagnosisData, 'diagnosis-sub');
    initializeAccordion(container);

    const perguntasContainer = document.getElementById('perguntas-accordion-inner');
    if(perguntasContainer) {
        perguntasContainer.innerHTML = createAccordionHTML(dezPerguntasData, 'perguntas');
        initializeAccordion(perguntasContainer);
    }
    const pulsoContainer = document.getElementById('pulse-list-container-inner');
     if(pulsoContainer) {
        const pulseTypes = pulseData.filter(p => p.type === 'common');
        pulsoContainer.innerHTML = createAccordionHTML(pulseTypes, 'pulse-list');
        initializeAccordion(pulsoContainer);
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
                { id: 'cinco-elementos', title: 'Os 5 Elementos', icon: 'icon-star' },
                { id: 'ciclos-de-vida', title: 'Ciclos de Vida', icon: 'icon-refresh-cw' },
                { id: 'meridianos', title: 'Meridianos e Pontos', icon: 'icon-git-branch' },
                { id: 'anatomia-energetica', title: 'Anatomia Energética', icon: 'icon-body' },
                { id: 'padroes-zang-fu', title: 'Padrões Zang-Fu', icon: 'icon-clipboard-heart' },
            ]
        },
        { title: 'Diagnóstico', icon: 'icon-stethoscope', links: [ { id: 'diagnostico', title: 'Métodos de Diagnóstico', icon: 'icon-stethoscope' } ] },
        { title: 'Terapêuticas', icon: 'icon-lotus', links: [ { id: 'terapias', title: 'Visão Geral', icon: 'icon-lotus' }, { id: 'dietetica', title: 'Dietética', icon: 'icon-soup' } ] },
        { title: 'Sabedoria', icon: 'icon-users', links: [ { id: 'grandes-mestres', title: 'Grandes Mestres', icon: 'icon-scroll' } ] },
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

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    generateNavLinks(); 
    
    setupYinYangSection();
    setupQiCards('qi-cards-container', qiData);
    createLifeCycleTimeline('female-cycles-timeline', lifeCyclesFemaleData, 'bg-pink-500');
    createLifeCycleTimeline('male-cycles-timeline', lifeCyclesMaleData, 'bg-blue-500');
    setupGlossary();
    setupDietetics();
    setupTherapiesGrid();
    
    setupMeridianGrid(); // [NOVO]
    setupDiagnosisAccordion();
    
    setupSidebarLayout('anatomy-navigation', 'anatomy-content-area', anatomyData, 'anatomy-content-');
    setupSidebarLayout('zangfu-navigation', 'zangfu-content-area', zangFuPatternsData, 'zangfu-content-');
    setupSidebarLayout('masters-navigation', 'masters-content-area', greatMastersData, 'master-content-');

    document.querySelectorAll('[id^="zangfu-accordion-"]').forEach(container => {
        initializeAccordion(container);
    });

    activateTooltips();
    setupDiagnosisDiagrams();
    
    if (document.getElementById('cinco-elementos')) {
        setup5ElementsDiagram();
        switchCycle('geracao');
    }

    document.querySelectorAll('aside .sidebar-link, aside .nav-group').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.07}s`;
    });

    createSearchIndex();
    contentSections = mainContent.querySelectorAll('.content-section');
    showSection('inicio', 'Início');
    updateActiveLink('inicio');
});
