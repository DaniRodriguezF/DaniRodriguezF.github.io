// --- VARIABLES DE ESTADO ---
let animationInterval, typingTimeout, sfxTimeout, currentFullText = "";
let activeCallback = null, isTyping = false, currentMusicPath = "", currentNode = null;
const typingSpeed = 90; 

// --- NODOS DE HISTORIA ---
const storyNodes = {
    inicio: {
        text: "* ¡Hola! Soy FLOWEY.\n* ¡FLOWEY, la flor!",
        sprite: "img/characters/flowey/flowey_normal.png",
        music: "sounds/mus_flowey1.mp3",
        voice: "sounds/snd_flowey.wav",
        options: [ { label: "Saludar", next: "saludo" }, { label: "Ignorar", next: "ignorar" } ]
    },
    saludo: {
        text: "* Vaya, qué educación.\n* ¿Sabes que hoy es un día especial?",
        sprite: "img/characters/flowey/flowey_happy.png",
        voice: "sounds/snd_flowey.wav",
        music: "sounds/mus_flowey1.mp3",
        options: [ { label: "¿Qué día es?", next: "dia_especial" } ]
    },
    ignorar: {
        text: "* ...\n* Qué grosera.",
        sprite: "img/characters/flowey/flowey_mad.png",
        music: "sounds/mus_flowey2.mp3",
        voice: "sounds/snd_flowey.wav",
        next: "no_te_vayas" 
    },
    no_te_vayas: {
        text: "* ¡Oye!\n* No te vayas tan rápido...\n* Tengo un REGALO especial para ti.",
        sprite: "img/characters/flowey/flowey_nice.png",
        voice: "sounds/snd_flowey.wav",
        music: "sounds/mus_flowey1.mp3",
        soundEffect: "sounds/snd_giggle.mp3",
        soundDelay: 500,
        options: [ { label: "Aceptar regalo", next: "trampa" }, { label: "Rechazar regalo", next: "insistencia_1" } ]
    },
    dia_especial: {
        text: "* ¡Es tu cumpleaños!\n* Deberías aceptar mi regalo.",
        sprite: "img/characters/flowey/flowey_happy2.png",
        voice: "sounds/snd_flowey.wav",
        music: "sounds/mus_flowey1.mp3",
        options: [ { label: "Rechazar regalo", next: "insistencia_1" }, { label: "Aceptar regalo", next: "trampa" } ]
    },
    insistencia_1: {
        text: "* ¿Eh?\n* Vamos, no seas así.\n* Es un regalo muy especial.",
        sprite: "img/characters/flowey/flowey_normal.png",
        voice: "sounds/snd_flowey.wav",
        music: "sounds/mus_flowey1.mp3",
        options: [ { label: "Rechazar de nuevo", next: "insistencia_2" }, { label: "Aceptar", next: "trampa" } ]
    },
    insistencia_2: {
        text: "* ¿En serio?\n* ¡Dije que lo ACEPTES!",
        sprite: "img/characters/flowey/flowey_mad.png",
        music: "sounds/mus_flowey2.mp3",
        voice: "sounds/snd_flowey.wav",
        options: [ { label: "Seguir rechazando", next: "intervencion_pre" }, { label: "Ceder y aceptar", next: "trampa" } ]
    },
    intervencion_pre: {
        text: "* ...\n* Qué... criatura... tan... MOLESTA.",
        sprite: "img/characters/flowey/flowey_evil.png",
        voice: "sounds/snd_flowey2.wav",
        music: "", 
        next: "ataque_sorpresa"
    },
    ataque_sorpresa: {
        text: "* ¡MUERE!",
        sprite: "img/characters/flowey/flowey_l1.png",
        onEnter: () => {
            document.body.classList.add('shake');
            setTimeout(() => {
                characterSprite.src = "img/characters/flowey/flowey_hurt.png";
                document.getElementById('hit-sound').play();
                characterSprite.classList.add('slide-out-left');
                document.body.classList.remove('shake');
                setTimeout(() => playDialogue('aparicion_toriel'), 2000);
            }, 1000);
        }
    },
    aparicion_toriel: {
        text: "* ¡Qué criatura tan terrible, torturando a un alma tan inocente!",
        sprite: "img/characters/toriel/toriel_smile.png",
        voice: "sounds/snd_toriel.wav", 
        music: "sounds/mus_toriel.mp3",
        onEnter: () => { characterSprite.classList.add('slide-in-right'); },
        next: "toriel_bienvenida"
    },
    toriel_bienvenida: {
        text: "* No temas, pequeña. Estás a salvo ahora.\n* Soy TORIEL, guardiana de las RUINAS.",
        sprite: "img/characters/toriel/toriel_smile.png",
        voice: "sounds/snd_toriel.wav",
        music: "sounds/mus_toriel.mp3",
        next: "toriel_presenta"
    },
    toriel_presenta: {
        text: "* Paso por aquí a diario para ver si alguien ha caído.",
        sprite: "img/characters/toriel/toriel_normal.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        next: "toriel_nombre"
    },
    toriel_nombre: {
        text: "* Dime, ¿cómo te llamas?",
        sprite: "img/characters/toriel/toriel_happy.png",
        voice: "sounds/snd_toriel.wav",
        music: "sounds/mus_toriel.mp3",
        options: [ { label: "Soy Karla", next: "respuesta_karla_toriel" } ]
    },
    respuesta_karla_toriel: {
        text: "* ¡Karla!\n* Es un nombre muy bonito y lleno de luz.",
        sprite: "img/characters/toriel/toriel_normal.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        next: "toriel_ruinas"
    },
    toriel_ruinas: {
        text: "* Ven, Karla. Las Ruinas pueden ser confusas.",
        sprite: "img/characters/toriel/toriel_smile.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        next: "toriel_invitacion"
    },
    toriel_invitacion: {
        text: "* Cuéntame... ¿qué te trae por este lugar?",
        sprite: "img/characters/toriel/toriel_happy.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        options: [ { label: "¡Hoy es mi cumple!", next: "sorpresa_cumple" } ]
    },
    sorpresa_cumple: {
        text: "* ¡¿Tu cumpleaños?!\n* ¡Cielos, mi niña!",
        sprite: "img/characters/toriel/toriel_sorpresa.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        soundEffect: "sounds/snd_surprise.mp3",
        soundDelay: 100,
        next: "emocion_toriel"
    },
    emocion_toriel: {
        text: "* ¡Eso es una noticia maravillosa!\n* Es el mejor día para encontrar a una nueva amiga.",
        sprite: "img/characters/toriel/toriel_normal.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        next: "tarta_mencion"
    },
    tarta_mencion: {
        text: "* Debemos celebrar como es debido.\n* Justo iba a preparar una tarta de canela y caramelo.",
        sprite: "img/characters/toriel/toriel_smile.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        next: "tarta_pregunta"
    },
    tarta_pregunta: {
        text: "* ¿Te gustaría probarla?",
        sprite: "img/characters/toriel/toriel_normal.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        options: [ { label: "¡Me encantaría!", next: "llegando_ruinas" } ]
    },
    llegando_ruinas: {
        text: "* ¡Excelente! Sígueme, mi niña.\n* Hay mucho que ver hoy.",
        sprite: "img/characters/toriel/toriel_smile.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        next: "seguir_ruinas"
    },
    seguir_ruinas: {
        text: "* ¿A dónde te gustaría ir?",
        sprite: "img/characters/toriel/toriel_happy.png",
        music: "sounds/mus_toriel.mp3",
        voice: "sounds/snd_toriel.wav",
        options: [
            { label: "Bosque Nevado", next: "inicio_snowdin", transition: true },
            { label: "Zona de Picnic", next: "inicio_picnic", transition: true },
            { label: "Estudio de TV", next: "inicio_mettaton", transition: true }
        ]
    },
    
    inicio_snowdin: {
        text: "* (El aire se ha vuelto frío...)",
        sprite: "img/characters/black.png",
        music: "sounds/mus_wind.mp3",
        voice: "sounds/snd_text.mp3",
        next: "inicio_snowdin1"
    },
    inicio_snowdin1: {
        text: "* Caminas a través de un largo sendero rodeado de árboles nevados.",
        music: "sounds/mus_wind.mp3",
        voice: "sounds/snd_text.mp3",
        next: "inicio_snowdin2"
    },
    inicio_snowdin2: {
        text: "* Escuchas pasos detrás de ti...",
        music: "sounds/mus_wind.mp3",
        voice: "sounds/snd_text.mp3",
        soundEffect: "sounds/snd_snowwalk.ogg",
        soundDelay: 800,
        next: "inicio_snowdin3"
    },
    inicio_snowdin3: {
        text: "* Humana.",
        sprite: "img/characters/black.png",
        music: "",
        voice: "sounds/snd_sans.wav",
        next: "inicio_snowdin4"
    },
    inicio_snowdin4: {
        text: "* ¿Puedes voltearte y saludarme?",
        sprite: "img/characters/black.png",
        music: "",
        voice: "sounds/snd_sans.wav",
        next: "inicio_snowdin5"
    },
    inicio_snowdin5: {
        text: "* Dame la mano.",
        sprite: "img/characters/black.png",
        music: "",
        voice: "sounds/snd_sans.wav",
        next: "inicio_snowdin2",
        options: [ 
            { label: "Dar la mano", next: "dar_mano" }, 
            { label: "No dar la mano", next: "nodar_mano" }]
    },
    dar_mano: {
        text: "* ...",
        sprite: "img/characters/black.png",
        music: "",
        voice: "",
        soundEffect: "sounds/snd_fart.ogg",
        soundDelay: 800,
        next: "sans1"
    },
    sans1: {
        text: "* Hola.",
        sprite: "img/characters/sans/sans.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        options: [ { label: "¿Hola?", next: "sans2" }]
    },
    sans2: {
        text: "* El viejo truco del cojín pedorro. \n * Siempre es muy divertido.",
        sprite: "img/characters/sans/sans.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        options: [ { label: "¿Quien eres?", next: "sans3" }]
    },
    sans3: {
        text: "* Soy Sans. \n * Sans el esqueleto",
        sprite: "img/characters/sans/sans.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        next: "sans4"
    },
    sans4: {
        text: "* En fin, eres una humana, ¿verdad?",
        sprite: "img/characters/sans/sans.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        options: [ { label: "Claro", next: "sans5" },
                   { label: "Por su pollo", next: "sans5_5"}]
    },
    sans5_5: {
        text: "* Jejeje, eres graciosa.",
        sprite: "img/characters/sans/sans1.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        next: "sans5"
    },
    sans5: {
        text: "* Se supone que debo estar atento por si vienen humanos.",
        sprite: "img/characters/sans/sans.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        next: "sans6"
    },
    sans6: {
        text: "* Pero... sabes que, no me apetece capturar a nadie.",
        sprite: "img/characters/sans/sans3.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        next: "sans7"
    },
    sans7: {
        text: "* Pero mi hermano Papyrus, \n * Es un fanático de la captura de humanos.",
        sprite: "img/characters/sans/sans4.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        next: "sans8"
    },
    sans8: {
        text: "* Oye, de hecho, él esta por aqui cerca.",
        sprite: "img/characters/sans/sans.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        next: "sans9"
    },
    sans9: {
        text: "* Tengo una idea. \n * Tu hacete pasar por un esqueleto.",
        sprite: "img/characters/sans/sans5.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        next: "sans10"
    },
    sans10: {
        text: "* Ten una mascara jejeje",
        sprite: "img/characters/sans/sans.png",
        music: "sounds/mus_sans.mp3",
        voice: "sounds/snd_sans.wav",
        options: [ { label: "Tomar mascara", next: "aparicion_papyrus" }]
    },
    // --- ENTRADA DE PAPYRUS AL LADO DE SANS ---
    aparicion_papyrus: {
    text: "* ¡SANS! ¡¿DÓNDE ESTÁS, HERMANO FLOJO?!",
    spriteSans: "img/characters/sans/sans.png",
    spritePapyrus: "img/characters/papyrus/papyrus.png",
    music: "sounds/mus_papyrus.mp3",
    voice: "sounds/snd_papyrus.wav",
    next: "papyrus1"
    },
    papyrus1: {
    text: "* ¡DÍGAME QUE ESTÁS TRABAJANDO EN TUS PUZLES!",
    spriteSans: "img/characters/sans/sans_wink.png",
    spritePapyrus: "img/characters/papyrus/papyrus_normal.png",
    music: "sounds/mus_papyrus.mp3",
    voice: "sounds/snd_papyrus.wav",
    options: [{ label: "Quedarse quieta", next: "papyrus2" }]
    },
    papyrus2: {
    text: "* ¡NYEH HEH HEH! ¡¿Y QUIÉN ES ESTE NUEVO ESQUELETO?!",
    spriteSans: "img/characters/sans/sans.png",
    spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
    music: "sounds/mus_papyrus.mp3",
    voice: "sounds/snd_papyrus.wav",
    next: "seguir_ruinas"
    },


    
    inicio_picnic: {
        text: "* Oh..... Ho.... La...",
        sprite: "img/characters/napstablook/blook_sad.png",
        music: "sounds/mus_napstablook.mp3",
        voice: "sounds/snd_blook.mp3",
        options: [ { label: "Saludar", next: "seguir_ruinas" } ]
    },
    inicio_mettaton: {
        text: "* ¡BIENVENIDOS AL CUMPLEAÑOS DE KARLA!\n* ¡OHHH YES!",
        sprite: "img/characters/mettaton/mtt_box.png",
        music: "sounds/mus_mettaton_quiz.mp3",
        voice: "sounds/snd_mtt.mp3",
        options: [ { label: "¡Cantar!", next: "seguir_ruinas" } ]
    },

    trampa: {
        text: "* ¡SE VE QUE NO SABES CÓMO FUNCIONAN LAS COSAS AQUÍ!\n* ¡EN ESTE MUNDO ES MATAR O MORIR!",
        sprite: "img/characters/flowey/flowey_evil.png",
        music: "sounds/mus_tension.mp3",
        voice: "sounds/snd_flowey2.wav",
        next: "game_over_trigger",
        onEnter: () => {
            document.body.classList.add('shake');
            characterSprite.classList.add('white-flash');
            const laugh = document.getElementById('laugh-sound');
            laugh.currentTime = 0; laugh.play();
            const frames = ["img/characters/flowey/flowey_l1.png", "img/characters/flowey/flowey_l2.png"];
            let frameIdx = 0;
            animationInterval = setInterval(() => {
                characterSprite.src = frames[frameIdx];
                frameIdx = (frameIdx + 1) % frames.length;
            }, 150);
        }
    },
    game_over_trigger: { onEnter: () => startGameOverSequence() },
};

// --- REFERENCIAS AL DOM ---
const textBox = document.getElementById('text-box');
const optionsContainer = document.getElementById('options-container');
const characterSprite = document.getElementById('character-sprite');
const voiceSound = document.getElementById('voice-sound');
const bgMusic = document.getElementById('bg-music');
const sfxSound = document.getElementById('sfx-sound');
const startOverlay = document.getElementById('game-start-overlay');
const transOverlay = document.getElementById('transition-overlay');
const nextIndicator = document.getElementById('next-indicator');
const gameOverScreen = document.getElementById('game-over-screen');
const gameOverHeart = document.getElementById('game-over-heart');
const gameOverText = document.getElementById('game-over-text');
const gameOverOptions = document.getElementById('game-over-options');

// --- EVENTOS INICIALES ---
startOverlay.addEventListener('click', () => {
    startOverlay.style.display = 'none';
    playDialogue('inicio');
});

document.getElementById('dialogue-container').addEventListener('click', () => {
    if (isTyping) {
        clearTimeout(typingTimeout);
        isTyping = false;
        voiceSound.pause();
        voiceSound.currentTime = 0;
        textBox.innerHTML = currentFullText.split('\n').join('<br>');
        if (activeCallback) activeCallback();
    } else if (currentNode && currentNode.next) {
        playDialogue(currentNode.next);
    }
});

// --- FUNCIONES CORE ---
function playDialogue(nodeId) {
    const node = storyNodes[nodeId];
    if (!node) return;
    currentNode = node;

    clearTimeout(typingTimeout); 
    clearTimeout(sfxTimeout);
    clearInterval(animationInterval); 
    
    voiceSound.pause(); voiceSound.currentTime = 0;
    sfxSound.pause(); sfxSound.currentTime = 0;
    
    nextIndicator.style.display = 'none';
    characterSprite.classList.remove('slide-out-left', 'slide-in-right', 'white-flash');

    if (node.onEnter) node.onEnter();

    optionsContainer.innerHTML = '';
    textBox.innerHTML = '';
    if(node.sprite) characterSprite.src = node.sprite;
    
    updateMusic(node.music);
    if(node.voice) voiceSound.src = node.voice;

    if (node.soundEffect) {
        const delay = node.soundDelay || 0;
        sfxTimeout = setTimeout(() => {
            sfxSound.src = node.soundEffect;
            sfxSound.play().catch(e => console.log("SFX bloqueado"));
        }, delay);
    }
    
    if(node.text) {
        typeWriter(node.text, 0, () => {
            if (node.options) {
                showOptions(node.options, optionsContainer);
            } else if (node.next) {
                nextIndicator.style.display = 'block';
            }
        });
    }
}

function updateMusic(musicPath) {
    if (!musicPath || musicPath === "") { bgMusic.pause(); currentMusicPath = ""; return; }
    if (currentMusicPath === musicPath) return;
    currentMusicPath = musicPath;
    bgMusic.src = musicPath;
    bgMusic.play().catch(e => {});
}

function typeWriter(text, i, callback) {
    isTyping = true;
    currentFullText = text;
    activeCallback = callback;
    if (i < text.length) {
        if (text.charAt(i) !== '*' && text.charAt(i) !== ' ' && text.charAt(i) !== '\n') {
            voiceSound.currentTime = 0;
            voiceSound.play().catch(e => {});
        }
        textBox.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
        typingTimeout = setTimeout(() => typeWriter(text, i + 1, callback), typingSpeed);
    } else {
        isTyping = false;
        if (callback) callback();
    }
}

function showOptions(options, container, isGameOver = false) {
    if(!options) return;
    container.innerHTML = '';
    options.forEach(opt => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerText = opt.label;
        if(isGameOver) button.style.margin = "0 auto";
        button.onclick = (e) => {
            e.stopPropagation();
            if (opt.transition) {
                triggerWhiteTransition(opt.next);
            } else if (isGameOver) {
                gameOverScreen.style.display = 'none';
                gameOverHeart.classList.remove('heart-break', 'heart-vibrate');
                gameOverText.classList.remove('fade-in');
                playDialogue(opt.next);
            } else if (!isTyping) {
                playDialogue(opt.next);
            }
        };
        container.appendChild(button);
    });
}

function triggerWhiteTransition(nextNode) {
    transOverlay.style.opacity = "1";
    setTimeout(() => {
        playDialogue(nextNode);
        setTimeout(() => { transOverlay.style.opacity = "0"; }, 500);
    }, 800);
}

function startGameOverSequence() {
    clearTimeout(typingTimeout);
    clearTimeout(sfxTimeout);
    clearInterval(animationInterval); 
    
    gameOverOptions.innerHTML = ''; 
    gameOverText.classList.remove('fade-in');
    gameOverHeart.classList.remove('heart-vibrate', 'heart-break'); 
    
    document.getElementById('laugh-sound').pause();
    document.body.classList.remove('shake');
    characterSprite.classList.remove('white-flash');
    bgMusic.pause();
    
    gameOverScreen.style.display = 'flex';
    document.getElementById('soul-appear-sound').play().catch(e => {});
    gameOverHeart.classList.add('heart-vibrate');

    setTimeout(() => {
        gameOverHeart.classList.remove('heart-vibrate');
        gameOverHeart.classList.add('heart-break');
        document.getElementById('break-sound').play();
    }, 1000);

    setTimeout(() => {
        gameOverText.classList.add('fade-in');
        updateMusic("sounds/mus_gameover.mp3");
        showOptions([{ label: "REINTENTAR", next: "inicio" }], gameOverOptions, true);
    }, 2000); 
}