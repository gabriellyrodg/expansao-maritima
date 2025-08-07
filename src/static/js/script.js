// Dados das rotas históricas - posições ajustadas
const routeData = {
    lisboa: {
        title: "Lisboa - Ponto de Partida",
        description: "Capital de Portugal e principal porto de saída das expedições marítimas. Daqui partiram grandes navegadores como Vasco da Gama e Pedro Álvares Cabral.",
        position: { top: "35%", left: "15%" }
    },
    ceuta: {
        title: "Ceuta - Primeira Conquista (1415)",
        description: "Primeira conquista portuguesa no Norte da África, marcando o início da expansão marítima portuguesa. Estratégica para controlar o comércio no Mediterrâneo.",
        position: { top: "42%", left: "18%" }
    },
    "cabo-verde": {
        title: "Cabo Verde - Escala Atlântica",
        description: "Arquipélago descoberto pelos portugueses em 1460, servindo como importante escala para as viagens à África e às Américas.",
        position: { top: "55%", left: "8%" }
    },
    "cabo-esperanca": {
        title: "Cabo da Boa Esperança - Passagem para o Índico",
        description: "Contornado por Bartolomeu Dias em 1488, abriu o caminho marítimo para a Índia e o Oriente, revolucionando o comércio mundial.",
        position: { top: "85%", left: "35%" }
    },
    india: {
        title: "Índia - Destino das Especiarias",
        description: "Vasco da Gama chegou a Calicute em 1498, estabelecendo a rota marítima direta para as especiarias e riquezas do Oriente.",
        position: { top: "45%", left: "85%" }
    },
    canarias: {
        title: "Ilhas Canárias - Base Espanhola",
        description: "Ponto de partida das expedições espanholas, incluindo as viagens de Cristóvão Colombo para a América.",
        position: { top: "48%", left: "12%" }
    },
    america: {
        title: "América - Novo Mundo",
        description: "Descoberta por Cristóvão Colombo em 1492, abriu um novo continente para a exploração e colonização europeia.",
        position: { top: "50%", left: "90%" }
    },
    brasil: {
        title: "Brasil - Terra de Santa Cruz",
        description: "Descoberto por Pedro Álvares Cabral em 1500, tornou-se a maior colônia portuguesa nas Américas.",
        position: { top: "70%", left: "88%" }
    }
};

// Sequência da jornada
const journeySequence = ['lisboa', 'ceuta', 'cabo-verde', 'cabo-esperanca', 'india', 'canarias', 'america', 'brasil'];

// Variáveis de controle
let currentRouteIndex = 0;
let journeyActive = false;
let journeyPaused = false;
let journeyInterval;

// Sistema de abas
class TabSystem {
    constructor() {
        this.init();
    }

    init() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, tabButtons, tabContents);
            });
        });
    }

    switchTab(targetTab, tabButtons, tabContents) {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const activeContent = document.getElementById(targetTab);

        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.classList.add('active');
        }
    }
}

// Sistema de animação do barco
class ShipAnimation {
    constructor() {
        this.ship = document.getElementById('ship');
        this.routeInfo = document.getElementById('route-info');
        this.routeTitle = document.getElementById('route-title');
        this.routeDescription = document.getElementById('route-description');
        this.init();
    }

    init() {
        // Posicionar o barco inicialmente em Lisboa
        this.moveShipToRoute('lisboa');
        
        // Event listeners para os controles
        document.getElementById('start-journey').addEventListener('click', () => this.startJourney());
        document.getElementById('pause-journey').addEventListener('click', () => this.pauseJourney());
        document.getElementById('reset-journey').addEventListener('click', () => this.resetJourney());

        // Event listeners para os pontos de rota
        document.querySelectorAll('.route-point').forEach(point => {
            point.addEventListener('click', (e) => {
                const routeId = e.target.getAttribute('data-route');
                this.showRouteInfo(routeId);
            });
        });
    }

    startJourney() {
        if (journeyPaused) {
            journeyPaused = false;
            this.continueJourney();
        } else {
            journeyActive = true;
            currentRouteIndex = 0;
            this.ship.classList.add('sailing');
            this.nextRoute();
        }
    }

    pauseJourney() {
        journeyPaused = true;
        if (journeyInterval) {
            clearTimeout(journeyInterval);
        }
    }

    resetJourney() {
        journeyActive = false;
        journeyPaused = false;
        currentRouteIndex = 0;
        if (journeyInterval) {
            clearTimeout(journeyInterval);
        }
        this.ship.classList.remove('sailing');
        this.moveShipToRoute('lisboa');
        this.hideRouteInfo();
        
        // Reset route points
        document.querySelectorAll('.route-point').forEach(point => {
            point.classList.remove('active');
        });
    }

    continueJourney() {
        if (journeyActive && !journeyPaused) {
            this.nextRoute();
        }
    }

    nextRoute() {
        if (!journeyActive || journeyPaused) return;

        if (currentRouteIndex < journeySequence.length) {
            const currentRoute = journeySequence[currentRouteIndex];
            
            // Ativar ponto atual
            document.querySelectorAll('.route-point').forEach(point => {
                point.classList.remove('active');
            });
            
            const currentPoint = document.querySelector(`[data-route="${currentRoute}"]`);
            if (currentPoint) {
                currentPoint.classList.add('active');
            }

            // Mover barco
            this.moveShipToRoute(currentRoute);
            
            // Mostrar informações
            this.showRouteInfo(currentRoute);

            currentRouteIndex++;

            // Agendar próxima rota
            journeyInterval = setTimeout(() => {
                this.nextRoute();
            }, 4000); // 4 segundos em cada parada
        } else {
            // Fim da jornada
            this.endJourney();
        }
    }

    moveShipToRoute(routeId) {
        const routeData_item = routeData[routeId];
        if (routeData_item) {
            this.ship.style.top = routeData_item.position.top;
            this.ship.style.left = routeData_item.position.left;
        }
    }

    showRouteInfo(routeId) {
        const route = routeData[routeId];
        if (route) {
            this.routeTitle.textContent = route.title;
            this.routeDescription.textContent = route.description;
            this.routeInfo.classList.add('show');
        }
    }

    hideRouteInfo() {
        this.routeInfo.classList.remove('show');
        this.routeTitle.textContent = "Clique em 'Iniciar Jornada' para começar";
        this.routeDescription.textContent = "Acompanhe o barco navegando pelas rotas históricas da Expansão Marítima.";
    }

    endJourney() {
        journeyActive = false;
        this.ship.classList.remove('sailing');
        
        // Mostrar mensagem final
        this.routeTitle.textContent = "Jornada Concluída!";
        this.routeDescription.textContent = "Você explorou as principais rotas da Expansão Marítima. Clique em 'Reiniciar' para fazer a jornada novamente.";
        
        // Reset route points
        setTimeout(() => {
            document.querySelectorAll('.route-point').forEach(point => {
                point.classList.remove('active');
            });
        }, 2000);
    }
}

// Sistema de Quiz
class QuizSystem {
    constructor() {
        this.questions = [
            {
                question: "Qual país foi pioneiro nas Grandes Navegações?",
                options: ["Espanha", "Portugal", "França", "Inglaterra"],
                correct: 1,
                explanation: "Portugal foi o primeiro país a se lançar nas Grandes Navegações, começando com a conquista de Ceuta em 1415."
            },
            {
                question: "Em que ano Vasco da Gama chegou à Índia?",
                options: ["1492", "1498", "1500", "1488"],
                correct: 1,
                explanation: "Vasco da Gama chegou a Calicute, na Índia, em 1498, estabelecendo a rota marítima para o Oriente."
            },
            {
                question: "Qual navegador descobriu a América?",
                options: ["Vasco da Gama", "Pedro Álvares Cabral", "Cristóvão Colombo", "Fernão de Magalhães"],
                correct: 2,
                explanation: "Cristóvão Colombo chegou à América em 1492, embora pensasse ter chegado às Índias."
            },
            {
                question: "O que foi o Cabo da Boa Esperança?",
                options: ["Uma cidade portuguesa", "Um estreito", "Um cabo contornado por Bartolomeu Dias", "Uma ilha"],
                correct: 2,
                explanation: "O Cabo da Boa Esperança foi contornado por Bartolomeu Dias em 1488, abrindo o caminho para a Índia."
            },
            {
                question: "Qual era o principal objetivo das navegações portuguesas?",
                options: ["Descobrir a América", "Encontrar ouro", "Chegar às Índias para comercializar especiarias", "Conquistar territórios"],
                correct: 2,
                explanation: "O principal objetivo era encontrar uma rota marítima para as Índias para comercializar especiarias diretamente."
            },
            {
                question: "Em que ano Pedro Álvares Cabral chegou ao Brasil?",
                options: ["1498", "1500", "1502", "1492"],
                correct: 1,
                explanation: "Pedro Álvares Cabral chegou ao Brasil em 1500, durante sua viagem para a Índia."
            },
            {
                question: "Qual instrumento de navegação foi fundamental para as Grandes Navegações?",
                options: ["Telescópio", "Bússola", "Microscópio", "Barômetro"],
                correct: 1,
                explanation: "A bússola foi fundamental para a navegação, permitindo determinar a direção mesmo em alto mar."
            },
            {
                question: "O que foi o Tratado de Tordesilhas?",
                options: ["Um acordo comercial", "Uma divisão de territórios entre Portugal e Espanha", "Uma aliança militar", "Um tratado de paz"],
                correct: 1,
                explanation: "O Tratado de Tordesilhas (1494) dividiu os territórios descobertos entre Portugal e Espanha."
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.init();
    }

    init() {
        this.showQuestion();
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        document.getElementById('question').textContent = `${this.currentQuestion + 1}. ${question.question}`;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        document.getElementById('result').innerHTML = '';
        document.getElementById('next-question').style.display = 'none';
    }

    selectOption(selectedIndex) {
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        // Disable all options
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Show correct/incorrect
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score
        if (selectedIndex === question.correct) {
            this.score++;
            document.getElementById('result').innerHTML = `<div style="color: green;">✓ Correto! ${question.explanation}</div>`;
        } else {
            document.getElementById('result').innerHTML = `<div style="color: red;">✗ Incorreto. ${question.explanation}</div>`;
        }
        
        // Show next button or finish quiz
        if (this.currentQuestion < this.questions.length - 1) {
            document.getElementById('next-question').style.display = 'inline-block';
        } else {
            setTimeout(() => this.showFinalScore(), 2000);
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    }

    showFinalScore() {
        document.getElementById('quiz-content').style.display = 'none';
        document.getElementById('quiz-score').style.display = 'block';
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let message = '';
        
        // Verificar se acertou todas as 8 perguntas
        if (this.score === 8) {
            this.triggerCelebration();
            message = '🎉 PERFEITO! Você é um verdadeiro especialista em Expansão Marítima! 🎉';
        } else if (percentage >= 80) {
            message = 'Excelente! Você domina o assunto da Expansão Marítima!';
        } else if (percentage >= 60) {
            message = 'Bom trabalho! Você tem um bom conhecimento sobre o tema.';
        } else if (percentage >= 40) {
            message = 'Razoável. Que tal revisar o conteúdo e tentar novamente?';
        } else {
            message = 'Precisa estudar mais. Explore as outras abas para aprender mais!';
        }
        
        document.getElementById('final-score').innerHTML = `
            <strong>Sua pontuação: ${this.score}/${this.questions.length} (${percentage}%)</strong><br>
            ${message}
        `;
    }

    triggerCelebration() {
        // Criar container de confetes
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);

        // Criar confetes
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confettiContainer.appendChild(confetti);
        }

        // Criar mensagem de celebração
        const celebrationMessage = document.createElement('div');
        celebrationMessage.className = 'celebration-message';
        celebrationMessage.innerHTML = `
            <h2>🏆 PARABÉNS! 🏆</h2>
            <p>Você acertou todas as 8 perguntas!<br>
            Você é um verdadeiro navegador dos conhecimentos históricos!</p>
            <button class="celebration-close" onclick="this.parentElement.remove()">Continuar Explorando</button>
        `;
        document.body.appendChild(celebrationMessage);

        // Remover confetes após 5 segundos
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.remove();
            }
        }, 5000);

        // Remover mensagem automaticamente após 10 segundos
        setTimeout(() => {
            if (celebrationMessage.parentNode) {
                celebrationMessage.remove();
            }
        }, 10000);
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        document.getElementById('quiz-content').style.display = 'block';
        document.getElementById('quiz-score').style.display = 'none';
        this.showQuestion();
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistemas
    new TabSystem();
    new ShipAnimation();
    new QuizSystem();
    
    // Efeitos visuais adicionais
    initVisualEffects();
});

// Efeitos visuais adicionais
function initVisualEffects() {
    // Animação suave para elementos que entram na tela
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.text-content, .section-image, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Efeito de parallax suave no hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Efeito de hover nos pontos de rota
    document.querySelectorAll('.route-point').forEach(point => {
        point.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3)';
            this.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.8)';
        });
        
        point.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.6)';
            }
        });
    });
}

