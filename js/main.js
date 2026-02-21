// --- Navigation Logic ---
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    const menu = document.getElementById('mobile-menu');
    if (!menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function switchTab(tabId) {
    // Hide all contents
    document.getElementById('tab-data').classList.add('hidden');
    document.getElementById('tab-reg').classList.add('hidden');
    
    // Reset button styles
    document.getElementById('tab-data-btn').classList.remove('active-tab', 'text-indigo-600');
    document.getElementById('tab-data-btn').classList.add('text-stone-500');
    
    document.getElementById('tab-reg-btn').classList.remove('active-tab', 'text-indigo-600');
    document.getElementById('tab-reg-btn').classList.add('text-stone-500');

    // Show selected
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    const btn = document.getElementById('tab-' + tabId + '-btn');
    btn.classList.add('active-tab', 'text-indigo-600');
    btn.classList.remove('text-stone-500');
}

// --- Chart.js Implementation (The 3 Waves) ---
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('wavesChart').getContext('2d');
    
    const dataWaves = {
        labels: ['1950', '1970', '1990', '2010', '2020', '2025+'],
        datasets: [
            {
                label: '1ª Onda: Conhecimento Artesanal (Regras)',
                data: [10, 40, 50, 20, 10, 5],
                borderColor: '#6366f1', // Indigo
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: '2ª Onda: Aprendizado Estatístico (Percepção)',
                data: [0, 5, 20, 80, 70, 60],
                borderColor: '#94a3b8', // Slate 400
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: '3ª Onda: Adaptação Contextual (Generativa)',
                data: [0, 0, 0, 10, 95, 100],
                borderColor: '#10b981', // Emerald
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const waveInfoData = {
        0: {
            title: "1ª Onda: Conhecimento Artesanal",
            desc: "Sistemas especialistas baseados em regras 'se-então'. Ótimos para raciocínio lógico bem definido (ex: Xadrez, Diagnóstico simples), mas falham em lidar com a ambiguidade do mundo real. Não aprendem, apenas executam o que foi programado."
        },
        1: {
            title: "2ª Onda: Aprendizado Estatístico",
            desc: "Machine Learning e Redes Neurais. Excelentes em percepção (reconhecer rostos, vozes) e classificação estatística. Dependem de enormes quantidades de dados ('Big Data') e treinamento específico. Têm dificuldade em explicar 'por que' tomaram uma decisão."
        },
        2: {
            title: "3ª Onda: Adaptação Contextual",
            desc: "O momento atual. Sistemas que não apenas classificam, mas geram e adaptam. Entendem contexto e nuances (LLMs). O foco é a capacidade de explicar o raciocínio e adaptar-se a novas situações com poucos dados (Zero-shot learning)."
        }
    };

    const wavesChart = new Chart(ctx, {
        type: 'line',
        data: dataWaves,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                intersect: true,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    onClick: (e, legendItem, legend) => {
                        const index = legendItem.datasetIndex;
                        updateWaveInfo(index);
                        Chart.defaults.plugins.legend.onClick(e, legendItem, legend);
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label;
                        }
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const datasetIndex = elements[0].datasetIndex;
                    updateWaveInfo(datasetIndex);
                }
            },
            scales: {
                y: {
                    display: false,
                    title: { display: true, text: 'Capacidade' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    function updateWaveInfo(index) {
        const infoBox = document.getElementById('wave-info');
        const data = waveInfoData[index];
        if(data) {
            infoBox.innerHTML = `
                <h4 class="text-xl font-bold text-indigo-600 mb-3">${data.title}</h4>
                <p class="text-stone-600 leading-relaxed">${data.desc}</p>
            `;
        }
    }
});

// --- Prompt Framework Demo Logic (v2.0 - Construtor de Blocos) ---

// Estado Global para armazenar os dados do usuário entre as trocas de framework
const promptState = {
    role: '',
    action: '',
    context: '',
    expectation: '',
    example: ''
};

let currentFramework = '';
let typingInterval;

// Definição dos campos necessários para cada framework
const frameworkConfig = {
    'RACE': [
        { id: 'role', label: 'Role (Papel)', placeholder: 'Ex: Você é um professor de matemática...', color: 'text-indigo-400' },
        { id: 'action', label: 'Action (Ação)', placeholder: 'Ex: Me dê ideias para preparar uma aula sobre Bhaskara...', color: 'text-indigo-400' },
        { id: 'context', label: 'Context (Contexto)', placeholder: 'Ex: Os alunos do 9º ano estão com dificuldade...', color: 'text-indigo-400' },
        { id: 'expectation', label: 'Expectation (Expectativa)', placeholder: 'Ex: Forneça a resposta em um único parágrafo.', color: 'text-indigo-400' }
    ],
    'CARE': [
        { id: 'context', label: 'Context (Contexto)', placeholder: 'Ex: Sendo um professor, os alunos estão com dificuldade...', color: 'text-teal-400' },
        { id: 'action', label: 'Action (Ação)', placeholder: 'Ex: Me dê ideias para preparar uma aula sobre Bhaskara...', color: 'text-teal-400' },
        { id: 'expectation', label: 'Result (Resultado)', placeholder: 'Ex: Forneça a resposta em um único parágrafo.', color: 'text-teal-400' },
        { id: 'example', label: 'Example (Exemplo)', placeholder: 'Ex: Use uma linguagem simples e encorajadora.', color: 'text-teal-400' }
    ],
    'APE': [
        { id: 'action', label: 'Action (Ação)', placeholder: 'Ex: Me dê ideias para preparar uma aula sobre Bhaskara...', color: 'text-rose-400' },
        { id: 'context', label: 'Purpose (Propósito)', placeholder: 'Ex: Para ajudar alunos do 9º ano com dificuldade...', color: 'text-rose-400' },
        { id: 'expectation', label: 'Expectation (Expectativa)', placeholder: 'Ex: Forneça a resposta em um único parágrafo.', color: 'text-rose-400' }
    ]
};

// Variável global para armazenar a base de conhecimento do CSV
let knowledgeBase = [];
let mockPrompts = [];

// Função para carregar e processar o CSV ao iniciar a página
async function loadKnowledgeBase() {
    try {
        const response = await fetch('data/themes.csv');
        const csvText = await response.text();
        
        // Divide o CSV em linhas e remove linhas vazias
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        
        // Pula o cabeçalho (índice 0) e mapeia os dados
        knowledgeBase = lines.slice(1).map(line => {
            const [tema, palavras_chave, emoji, passo1, passo2, passo3] = line.split(';');
            return {
                tema: tema ? tema.trim() : '',
                palavras: palavras_chave ? palavras_chave.split(',').map(p => p.trim().toLowerCase()) : [],
                emoji: emoji ? emoji.trim() : '',
                passo1: passo1 ? passo1.trim() : '',
                passo2: passo2 ? passo2.trim() : '',
                passo3: passo3 ? passo3.trim() : ''
            };
        });
        console.log("Base de conhecimento carregada com sucesso!", knowledgeBase);
    } catch (error) {
        console.error("Erro ao carregar o CSV. Verifique se está rodando em um servidor local.", error);
    }
}

// Função para carregar os prompts de exemplo
async function loadMockPrompts() {
    try {
        const response = await fetch('data/mock_prompts.csv');
        const csvText = await response.text();
        
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        
        mockPrompts = lines.slice(1).map(line => {
            const [role, action, context, expectation, example] = line.split(';');
            return {
                role: role ? role.trim() : '',
                action: action ? action.trim() : '',
                context: context ? context.trim() : '',
                expectation: expectation ? expectation.trim() : '',
                example: example ? example.trim() : ''
            };
        });
        console.log("Prompts de exemplo carregados com sucesso!", mockPrompts);
    } catch (error) {
        console.error("Erro ao carregar mock_prompts.csv", error);
    }
}

// Chama as funções assim que o script carrega
loadKnowledgeBase();
loadMockPrompts();

// Preenche os campos com um prompt aleatório
function fillRandomPrompt() {
    if (mockPrompts.length === 0) {
        alert("Os exemplos ainda estão carregando ou houve um erro ao ler o arquivo.");
        return;
    }
    
    // Escolhe um prompt aleatório da lista
    const randomIndex = Math.floor(Math.random() * mockPrompts.length);
    const randomPrompt = mockPrompts[randomIndex];
    
    // Atualiza o estado global
    promptState.role = randomPrompt.role;
    promptState.action = randomPrompt.action;
    promptState.context = randomPrompt.context;
    promptState.expectation = randomPrompt.expectation;
    promptState.example = randomPrompt.example;
    
    // Se nenhum framework estiver selecionado, seleciona o RACE por padrão
    if (!currentFramework) {
        currentFramework = 'RACE';
        
        // Atualiza visualmente os botões de framework
        document.querySelectorAll('.framework-btn').forEach(btn => {
            btn.classList.remove('bg-red-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        const raceBtn = document.querySelector('button[onclick="updatePromptDemo(\'RACE\')"]');
        if (raceBtn) {
            raceBtn.classList.remove('bg-gray-200', 'text-gray-700');
            raceBtn.classList.add('bg-red-600', 'text-white');
        }
    }
    
    // Atualiza a interface com os novos dados
    updatePromptDemo(currentFramework);
}

// 1. Nova função para detectar o tema baseada no CSV
function detectTheme(text) {
    if (!text || knowledgeBase.length === 0) return null;
    const lowerText = text.toLowerCase();
    
    // Procura na base de conhecimento qual tema tem as palavras digitadas
    for (const item of knowledgeBase) {
        if (item.palavras.some(palavra => lowerText.includes(palavra))) {
            return item; // Retorna o objeto completo do tema encontrado
        }
    }
    return null; // Retorna null se não achar nada (cai no fallback geral)
}

// 2. Nova função para gerar a resposta usando os dados do CSV
function generateSmartOutput(framework) {
    // Resgata os valores digitados pelo usuário
    const action = promptState.action || "sua solicitação";
    const context = promptState.context || "o cenário atual";
    const expectation = promptState.expectation || "a melhor forma possível";
    
    // Junta os textos para tentar adivinhar o tema
    const fullText = `${action} ${context}`;
    const themeData = detectTheme(fullText);
    
    let output = `[Simulação baseada na estrutura ${framework}]\n\n`;
    output += `Entendido! Analisando seu pedido principal: "${action}"...\n\n`;

    if (themeData) {
        // Substitui as tags {context} e {expectation} pelo texto do usuário
        const p1 = themeData.passo1.replace('{context}', context);
        const p3 = themeData.passo3.replace('{expectation}', expectation);

        output += `${themeData.emoji} **Abordagem Focada (${themeData.tema}):**\n`;
        output += `1. **Análise:** ${p1}\n`;
        output += `2. **Execução:** ${themeData.passo2}\n`;
        output += `3. **Resultado:** ${p3}`;
    } else {
        // Fallback Geral
        output += `⚙️ **Plano de Execução:**\n`;
        output += `1. **Análise Inicial:** Focando no contexto fornecido (${context}), a melhor estratégia é organizar as ideias.\n`;
        output += `2. **Aplicação Prática:** Vamos desenvolver a solução passo a passo, direto ao ponto.\n`;
        output += `3. **Resultado:** Seguindo a expectativa definida ("${expectation}"), esta estrutura garante maior clareza e precisão.`;
    }

    return output;
}

// Atualiza o estado global com o que o usuário digitou antes de trocar de framework
function saveCurrentState() {
    if (!currentFramework) return;
    
    const config = frameworkConfig[currentFramework];
    config.forEach(field => {
        const inputEl = document.getElementById(`input-${field.id}`);
        if (inputEl) {
            promptState[field.id] = inputEl.value;
        }
    });
}

// Renderiza os campos de input baseados no framework selecionado
function updatePromptDemo(framework) {
    saveCurrentState(); // Salva o que estava digitado
    currentFramework = framework;
    
    const titleMap = { 'RACE': 'R.A.C.E. Framework', 'CARE': 'C.A.R.E. Framework', 'APE': 'A.P.E. Framework' };
    document.getElementById('demo-title').innerText = titleMap[framework];
    
    const builderContainer = document.getElementById('prompt-builder');
    builderContainer.innerHTML = ''; // Limpa os campos antigos
    
    const config = frameworkConfig[framework];
    
    config.forEach(field => {
        // Lógica de adaptação (De/Para) ao trocar de framework
        let valueToFill = promptState[field.id] || '';
        
        // Adaptação específica para o CARE (junta Role no Contexto se o Contexto estiver vazio)
        if (framework === 'CARE' && field.id === 'context' && !valueToFill && promptState.role) {
            valueToFill = `Sendo ${promptState.role.replace(/Você é um |Você é uma |Aja como /i, '')}, ${promptState.context}`;
        }

        const fieldHtml = `
            <div class="flex flex-col">
                <label class="text-xs font-bold ${field.color} mb-1">${field.label}</label>
                <textarea id="input-${field.id}" class="w-full bg-stone-800 text-stone-200 border border-stone-600 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" rows="2" placeholder="${field.placeholder}">${valueToFill}</textarea>
            </div>
        `;
        builderContainer.innerHTML += fieldHtml;
    });

    // Mostra o botão de simular
    document.getElementById('btn-simulate').classList.remove('hidden');
    
    // Limpa o output anterior
    document.getElementById('demo-output').innerText = "// Preencha os blocos acima e clique em 'Gerar Resposta Simulada'.";
    if (typingInterval) clearInterval(typingInterval);
}

// Gera a resposta simulada baseada nos campos preenchidos
function generateSimulation() {
    saveCurrentState(); // Garante que o estado mais recente está salvo
    
    const outputElement = document.getElementById('demo-output');
    outputElement.innerText = "Processando blocos e gerando resposta simulada...";
    
    if (typingInterval) clearInterval(typingInterval);
    
    setTimeout(() => {
        outputElement.innerText = ""; 
        let i = 0;
        
        // CHAMA A NOVA FUNÇÃO AQUI
        const simulatedResponse = generateSmartOutput(currentFramework); 
        
        typingInterval = setInterval(() => {
            if (i < simulatedResponse.length) {
                if (simulatedResponse.charAt(i) === '\n') {
                    outputElement.appendChild(document.createElement('br'));
                } else {
                    outputElement.appendChild(document.createTextNode(simulatedResponse.charAt(i)));
                }
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 15); // Velocidade ajustada para 15ms
    }, 600);
}