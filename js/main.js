document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.main-nav ul');

    mobileMenuBtn?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
    });

    // Fecha o menu ao clicar em qualquer link
    navMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form handling
    const quoteForm = document.getElementById('quote-form');
    quoteForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = quoteForm.querySelector('.btn-submit');
        const buttonText = submitBtn.querySelector('.button-text');
        const spinner = submitBtn.querySelector('.spinner');
        
        try {
            buttonText.style.display = 'none';
            spinner.style.display = 'inline-block';
            submitBtn.disabled = true;

            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData);

            const response = await fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao enviar formulário');
            }

            alert(result.message);
            quoteForm.reset();
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || 'Erro ao enviar o formulário. Por favor, tente novamente.');
        } finally {
            buttonText.style.display = 'inline-block';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    loadGallery();
    // Google Maps script will call initMap
    initServicesAccordion();
    initCarousel();
});

// Gallery Implementation
const loadGallery = () => {
    const gallery = document.getElementById('installations-gallery');
    const images = [
        { src: 'imag/carousel/Base BPS.webp', alt: 'Vista frontal do armazém' },
        { src: 'images/instalacao2.jpg', alt: 'Área de carga e descarga' },
        { src: 'images/instalacao3.jpg', alt: 'Câmara frigorífica' },
        // Add more images as needed
    ];

    images.forEach(img => {
        const figure = document.createElement('figure');
        figure.className = 'gallery-item';
        figure.innerHTML = `
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
            <figcaption>${img.alt}</figcaption>
        `;
        gallery?.appendChild(figure);
    });
};

// Services accordion functionality
const initServicesAccordion = () => {
    const servicesGrid = document.querySelector('.services-grid');
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const verMaisBtn = card.querySelector('.btn-ver-mais');
        
        verMaisBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const wasActive = card.classList.contains('active');
            
            // Reset all cards
            serviceCards.forEach(c => c.classList.remove('active'));
            servicesGrid.classList.remove('has-active');
            
            if (!wasActive) {
                card.classList.add('active');
                servicesGrid.classList.add('has-active');
                
                // Scroll to card
                setTimeout(() => {
                    const cardTop = card.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({
                        top: cardTop,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
};

// Carousel Implementation
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let interval;

    // Array com imagens e suas informações
    const carouselItems = [
        // Estrutura e Fachada
        {
            src: 'img/carousel/Base BPS.webp',
            title: 'Base Operacional',
            description: 'Nossa sede em Porto Seguro, estrutura completa para atender você'
        },
        {
            src: 'img/carousel/escritorio1.webp',
            title: 'Recepção',
            description: 'Ambiente profissional para atendimento ao cliente'
        },
        {
            src: 'img/carousel/escritorio2.webp',
            title: 'Área Administrativa',
            description: 'Gestão eficiente de operações e processos'
        },
        
        // Área de Armazenamento
        {
            src: 'img/carousel/Sala Climatizada1.webp',
            title: 'Armazenamento Climatizado',
            description: 'Controle preciso de temperatura'
        },
        {
            src: 'img/carousel/Sala Climatizada2.webp',
            title: 'Ambiente Controlado',
            description: 'Monitoramento constante das condições ambientais'
        },
        {
            src: 'img/carousel/Grade de proteção.webp',
            title: 'Segurança Reforçada',
            description: 'Proteção total para suas mercadorias'
        },
        {
            src: 'img/carousel/extintor.webp',
            title: 'Prevenção',
            description: 'Equipamentos de segurança em conformidade'
        },
        {
            src: 'img/carousel/empilhadeira.webp',
            title: 'Movimentação de Cargas',
            description: 'Equipamentos modernos para operação eficiente'
        },
        
        // Transporte de Automóveis
        {
            src: 'img/carousel/Automóveis1.webp',
            title: 'Transporte de Veículos',
            description: 'Serviço especializado com total segurança'
        },
        {
            src: 'img/carousel/Automóveis2.webp',
            title: 'Logística Automotiva',
            description: 'Transporte dedicado de veículos'
        },
        {
            src: 'img/carousel/Automóveis3.webp',
            title: 'Frota Especializada',
            description: 'Veículos adaptados para transporte'
        },
        {
            src: 'img/carousel/Automóveis4.webp',
            title: 'Transporte Seguro',
            description: 'Cuidado especial com seu veículo'
        },
        {
            src: 'img/carousel/Automóveis5.webp',
            title: 'Logística Veicular',
            description: 'Experiência em transporte automotivo'
        },
        {
            src: 'img/carousel/Automóveis6.webp',
            title: 'Transporte Premium',
            description: 'Serviço diferenciado para seu automóvel'
        },
        
        // Gestão de Cargas
        {
            src: 'img/carousel/Material para entrega.webp',
            title: 'Gestão de Entregas',
            description: 'Controle eficiente de mercadorias'
        },
        {
            src: 'img/carousel/Material para entregar.webp',
            title: 'Preparação de Cargas',
            description: 'Organização e separação de materiais'
        },
        {
            src: 'img/carousel/Materiais armazenados.webp',
            title: 'Estoque Organizado',
            description: 'Sistema eficiente de armazenamento'
        },
        {
            src: 'img/carousel/Cargas armazenadas.webp',
            title: 'Gestão de Estoque',
            description: 'Controle total das mercadorias'
        },
        {
            src: 'img/carousel/Caixas coletadas.webp',
            title: 'Coleta de Materiais',
            description: 'Serviço de recolhimento e organização'
        },
        
        // Produtos Perecíveis
        {
            src: 'img/carousel/Materiais perecíveis.webp',
            title: 'Controle Perecível',
            description: 'Cuidado especial com produtos sensíveis'
        },
        {
            src: 'img/carousel/Modelo de produto perecível.webp',
            title: 'Armazenamento Específico',
            description: 'Ambiente adequado para cada tipo de produto'
        },
        {
            src: 'img/carousel/Nossos gelos.webp',
            title: 'Controle Térmico',
            description: 'Manutenção da cadeia do frio'
        },
        {
            src: 'img/carousel/Nossos gelos2.webp',
            title: 'Refrigeração',
            description: 'Sistema de resfriamento controlado'
        },
        {
            src: 'img/carousel/Gelos para troca.webp',
            title: 'Manutenção Térmica',
            description: 'Sistema de troca e controle de temperatura'
        },
        
        // Armazenamento Especializado
        {
            src: 'img/carousel/Pallets para medicamento.webp',
            title: 'Área Farmacêutica',
            description: 'Armazenamento específico para medicamentos'
        },
        {
            src: 'img/carousel/Pallet de madeira.webp',
            title: 'Sistema de Pallets',
            description: 'Organização eficiente do espaço'
        }
    ];

    // Limpa o conteúdo existente
    if (track) {
        track.innerHTML = '';
        dotsContainer.innerHTML = '';

        // Cria os slides
        carouselItems.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <div class="carousel-content">
                    <img src="${item.src}" 
                         alt="${item.title}"
                         onerror="console.error('Erro ao carregar imagem:', this.src)">
                    <div class="carousel-caption">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
            track.appendChild(slide);
            
            // Cria o dot correspondente
            const dot = document.createElement('div');
            dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const slides = track.querySelectorAll('.carousel-slide');

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
            resetInterval();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        function resetInterval() {
            clearInterval(interval);
            interval = setInterval(nextSlide, 5000);
        }

        // Event listeners
        nextButton?.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevButton?.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        // Inicia o carrossel
        updateCarousel();
        resetInterval();
    }
}