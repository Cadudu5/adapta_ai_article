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

// --- Prompt Framework Demo Logic ---
function getDynamicPromptData(framework, userInput) {
    // Usa o texto do usuário ou um texto padrão se estiver vazio
    const baseText = userInput.trim() || "Me dê ideias de marketing para um café";
    
    if (framework === 'RACE') {
        return {
            title: 'R.A.C.E. Framework',
            input: `<span class="text-indigo-400">Role (Papel):</span> Aja como um especialista sênior no assunto.\n<span class="text-indigo-400">Action (Ação):</span> ${baseText}\n<span class="text-indigo-400">Context (Contexto):</span> O público precisa de informações claras, aplicáveis e com orçamento otimizado.\n<span class="text-indigo-400">Expectation (Expectativa):</span> Forneça a resposta em formato de lista estruturada e direta ao ponto.`,
            output: `[Simulação otimizada para: "${baseText}"]\n\n1. **Análise Inicial:** Compreendendo o cenário proposto...\n2. **Estratégia:** Aplicando as melhores práticas do mercado...\n3. **Execução:** Passos práticos para atingir o objetivo com eficiência.`
        };
    } else if (framework === 'CARE') {
        return {
            title: 'C.A.R.E. Framework',
            input: `<span class="text-teal-400">Context (Contexto):</span> Tenho a seguinte necessidade: ${baseText}\n<span class="text-teal-400">Action (Ação):</span> Desenvolva uma solução ou resposta detalhada para isso.\n<span class="text-teal-400">Result (Resultado):</span> O resultado deve ser prático, empático e fácil de entender.\n<span class="text-teal-400">Example (Exemplo):</span> Use um tom profissional e didático, semelhante a um artigo da Harvard Business Review.`,
            output: `[Simulação otimizada para: "${baseText}"]\n\n"Para resolver essa questão de forma prática, podemos focar em três pilares principais. Por exemplo, se aplicarmos a técnica adequada, o resultado esperado será uma melhoria significativa na sua abordagem..."`
        };
    } else if (framework === 'APE') {
        return {
            title: 'A.P.E. Framework',
            input: `<span class="text-rose-400">Action (Ação):</span> ${baseText}\n<span class="text-rose-400">Purpose (Propósito):</span> Para resolver um problema específico de forma rápida e objetiva.\n<span class="text-rose-400">Expectation (Expectativa):</span> Vá direto ao ponto, sem introduções longas, usando no máximo 3 frases ou bullet points.`,
            output: `[Simulação otimizada para: "${baseText}"]\n\nAqui está a solução direta:\n- Foco na ação principal.\n- Eliminação de ruídos no processo.\n- Resultado imediato.`
        };
    }
}

let typingInterval; // Variável global para controlar o efeito de digitação

function updatePromptDemo(framework) {
    const userInput = document.getElementById('user-raw-prompt').value;
    const data = getDynamicPromptData(framework, userInput);
    
    document.getElementById('demo-title').innerText = data.title;
    document.getElementById('demo-input').innerHTML = data.input;
    
    const outputElement = document.getElementById('demo-output');
    outputElement.innerText = "Estruturando e gerando resposta simulada...";
    
    // Limpa qualquer digitação anterior se o usuário clicar rápido em outro card
    if (typingInterval) clearInterval(typingInterval);
    
    // Simula o tempo de processamento inicial
    setTimeout(() => {
        outputElement.innerText = ""; // Limpa o texto de carregamento
        let i = 0;
        const text = data.output;
        
        // Efeito de digitação (Typewriter)
        typingInterval = setInterval(() => {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    outputElement.appendChild(document.createElement('br'));
                } else {
                    outputElement.appendChild(document.createTextNode(text.charAt(i)));
                }
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 20); // Velocidade da digitação (20ms por caractere)
    }, 600);
}