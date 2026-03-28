const imagenes = ['img/1titulo.png', 'img/2titulo.png', 'img/3titulo.png'];
        const tiempoVisible = 2500;
        const tiempoFade = 1200;

        const introImage = document.getElementById('intro-image');
        const introSound = document.getElementById('intro-sound');
        const hoverSound = document.getElementById('hover-sound');
        const bgMusic = document.getElementById('bg-music');
        const startScreen = document.getElementById('start-screen');
        const introContainer = document.getElementById('intro-container');
        const mainMenuContainer = document.getElementById('main-menu-container');
        const body = document.body;
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        
        let index = 0;

        // --- LÓGICA PANTALLA COMPLETA ---
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.log(`Error: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });

        startScreen.addEventListener('click', () => {
            startScreen.style.display = 'none';
            introContainer.style.display = 'flex';
            mostrarSecuencia();
        });

        function mostrarSecuencia() {
            if (index < imagenes.length) {
                introImage.src = imagenes[index];
                introImage.onload = () => {
                    introImage.classList.add('visible');
                    introSound.currentTime = 0; 
                    introSound.play().catch(e => console.log("Audio bloqueado:", e));
                    
                    setTimeout(() => {
                        introImage.classList.remove('visible');
                        setTimeout(() => {
                            index++;
                            mostrarSecuencia();
                        }, tiempoFade);
                    }, tiempoVisible);
                };
            } else {
                showMainMenu();
            }
        }

        function showMainMenu() {
            introContainer.style.display = 'none';
            body.classList.add('main-menu-visible');
            mainMenuContainer.style.display = 'flex';
            bgMusic.play().catch(e => console.log("Música bloqueada:", e));
            initMenuInteractions();
        }

        function initMenuInteractions() {
            const options = document.querySelectorAll('.menu-option');
            options.forEach((option, i) => {
                option.addEventListener('mouseenter', () => {
                    hoverSound.currentTime = 0;
                    hoverSound.play().catch(e => console.log("Error de audio:", e));
                });

                option.addEventListener('click', () => {
                    if (i === 0) {
                        window.location.href = 'game.html'; 
                    } else if (i === 1) {
                        window.location.href = 'credits.html'; 
                    }
                });
            });
        }