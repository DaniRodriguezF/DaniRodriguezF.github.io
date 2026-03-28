let animationInterval, typingTimeout, sfxTimeout, customTimeout, spriteAnimLeftInterval, currentFullText = "", activeCallback = null, isTyping = false, currentMusicPath = "", currentNode = null;
        let isTransitioning = false;
        const typingSpeed = 80; 

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
                    customTimeout = setTimeout(() => {
                        const left = document.getElementById('sprite-left');
                        if (left) {
                            left.src = "img/characters/flowey/flowey_hurt.png";
                            left.classList.add('slide-out-left');
                        }
                        const hitSound = document.getElementById('hit-sound');
                        if(hitSound) hitSound.play().catch(e => {}); 
                        document.body.classList.remove('shake');
                        customTimeout = setTimeout(() => playDialogue('aparicion_toriel'), 2000);
                    }, 1000);
                }
            },
            aparicion_toriel: {
                text: "* ¡Qué criatura tan terrible, torturando a un alma tan inocente!",
                sprite: "img/characters/toriel/toriel_smile.png",
                voice: "sounds/snd_toriel.wav", 
                music: "sounds/mus_toriel.mp3",
                onEnter: () => { document.getElementById('sprite-left').classList.add('slide-in-right'); },
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
                voice: "sounds/snd_txt.wav",
                next: "inicio_snowdin1"
            },
            inicio_snowdin1: {
                text: "* Caminas a través de un largo sendero rodeado de árboles nevados.",
                music: "sounds/mus_wind.mp3",
                voice: "sounds/snd_txt.wav",
                next: "inicio_snowdin2"
            },
            inicio_snowdin2: {
                text: "* Escuchas pasos detrás de ti...",
                music: "sounds/mus_wind.mp3",
                voice: "sounds/snd_txt.wav",
                soundEffect: "sounds/snd_snowwalk.ogg",
                soundDelay: 800,
                next: "inicio_snowdin3"
            },
            inicio_snowdin3: {
                text: "* humana.",
                sprite: "img/characters/black.png",
                music: "",
                voice: "sounds/snd_txt.wav",
                next: "inicio_snowdin4"
            },
            inicio_snowdin4: {
                text: "* ¿puedes voltearte y saludarme?",
                sprite: "img/characters/black.png",
                music: "",
                voice: "sounds/snd_txt.wav",
                next: "inicio_snowdin5"
            },
            inicio_snowdin5: {
                text: "* dame la mano.",
                sprite: "img/characters/black.png",
                music: "",
                voice: "sounds/snd_txt.wav",
                options: [ 
                    { label: "Dar la mano", next: "sans0" }, 
                    { label: "No dar la mano", next: "sans_captura_1" }]
            },
            
            sans_captura_1: {
                text: "* ...",
                sprite: "img/characters/black.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                next: "sans_captura_2"
            },
            sans_captura_2: {
                text: "* vaya. no te gustan los apretones de manos, ¿eh?",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                next: "sans_captura_3"
            },
            sans_captura_3: {
                text: "* y yo que pasé toda la mañana afinando este cojín pedorro.",
                sprite: "img/characters/sans/sans4.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                next: "sans_captura_4"
            },
            sans_captura_4: {
                text: "* bueno, supongo que esto me facilita el trabajo.",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                next: "sans_captura_5"
            },
            sans_captura_5: {
                text: "* mi hermano papyrus lleva semanas queriendo capturar un humano.",
                sprite: "img/characters/sans/sans4.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                next: "sans_captura_6"
            },
            sans_captura_6: {
                text: "* así que...\n* estás capturada.",
                sprite: "img/characters/sans/sansb0.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                soundEffect: "sounds/snd_impact.wav",
                soundDelay: 800,
                next: "sans_captura_7"
            },
            sans_captura_7: {
                text: "* no te resistas. la jaula es de alta seguridad.",
                sprite: "img/characters/sans/sansb1.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                next: "sans_captura_8"
            },
            sans_captura_8: {
                text: "* quédate ahí. iré a decirle a papyrus. \n* ... no te muevas.",
                sprite: "img/characters/sans/sansb1.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                next: "game_over_trigger"
            },

            sans0: {
                text: "* ...",
                sprite: "img/characters/black.png",
                music: "",
                voice: "sounds/snd_no.wav",
                soundEffect: "sounds/snd_fart.ogg",
                soundDelay: 800,
                next: "sans1"
            },
            sans1: {
                text: "* hola.",
                sprite: "img/characters/sans/sans.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                options: [ { label: "¿Hola?", next: "sans2" }]
            },
            sans2: {
                text: "* el viejo truco del cojín pedorro. \n * siempre es muy divertido.",
                sprite: "img/characters/sans/sans.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                options: [ { label: "¿Quién eres?", next: "sans3" }]
            },
            sans3: {
                text: "* soy sans. \n * sans el esqueleto.",
                sprite: "img/characters/sans/sans.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                next: "sans4"
            },
            sans4: {
                text: "* en fin, eres una humana, ¿verdad?",
                sprite: "img/characters/sans/sans.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                options: [ { label: "Claro", next: "sans5" },
                        { label: "Por su pollo", next: "sans5_5"}]
            },
            sans5_5: {
                text: "* jejeje, eres graciosa.",
                sprite: "img/characters/sans/sans1.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                next: "sans5"
            },
            sans5: {
                text: "* se supone que debo estar atento por si vienen humanos.",
                sprite: "img/characters/sans/sans.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                next: "sans6"
            },
            sans6: {
                text: "* pero... sabes qué, no me apetece capturar a nadie.",
                sprite: "img/characters/sans/sans3.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                next: "sans7"
            },
            sans7: {
                text: "* pero mi hermano papyrus, \n * es un fanático de la captura de humanos.",
                sprite: "img/characters/sans/sans4.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                next: "sans8"
            },
            sans8: {
                text: "* oye, de hecho, él está por aquí cerca.",
                sprite: "img/characters/sans/sans.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                next: "sans9"
            },
            sans9: {
                text: "* tengo una idea. \n * tú hazte pasar por un esqueleto.",
                sprite: "img/characters/sans/sans5.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                next: "sans10"
            },
            sans10: {
                text: "* ten una máscara jejeje.",
                sprite: "img/characters/sans/sans.png",
                music: "sounds/mus_sans.mp3",
                voice: "sounds/snd_sans.wav",
                options: [ { label: "Tomar máscara", next: "sans11" }]
            },
            sans11: {
                text: "* bien, aquí viene.",
                sprite: "img/characters/sans/sans5.png",
                music: "sounds/mus_sans.mp3",
                soundEffect: "sounds/snd_item.wav",
                soundDelay: 200,
                voice: "sounds/snd_sans.wav",
                next: "aparicion_papyrus"
            },
            aparicion_papyrus: {
                text: "* ¡SANS! ¡¿DÓNDE ESTABAS, HERMANO FLOJO?!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.add('sans-shift');
                    right.classList.add('slide-in-right');
                },
                next: "papyrus1"
            },
            papyrus1: {
                text: "* ¡DÍME QUE ESTÁS TRABAJANDO EN TUS PUZZLES!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [{ label: "Quedarse quieta", next: "papyrus2" }]
            },
            papyrus2: {
                text: "* ¡NYEH HEH HEH! ¡¿Y QUIÉN ES ESTE NUEVO ESQUELETO?!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_curioso.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "sans12"
            },
            sans12: {
                text: "* es nuestra hermanita, ¿no sabías?",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_curioso.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus3"
            },
            papyrus3: {
                text: "* ¡¿HERMANITA?! NO SABÍA QUE TENÍAMOS UNA HERMANITA.",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "sans13"
            },
            sans13: {
                text: "* pues, ahora lo sabes.",
                spriteSans: "img/characters/sans/sans3.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus4"
            },
            papyrus4: {
                text: "* ¡ES CIERTO! ¡ES IGUAL DE APUESTA QUE YO, NYEH HEH HEH!",
                spriteSans: "img/characters/sans/sans4.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus5"
            },
            papyrus5: {
                text: "* SÍ... ESO TIENE MUCHO SENTIDO PARA MÍ.",
                spriteSans: "img/characters/sans/sans3.png",
                spritePapyrus: "img/characters/papyrus/papyrus_pregunton.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "sans14"
            },
            sans14: {
                text: "* claro, el nombre de nuestra hermanita es...",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [ { label: "Karla, la esqueleto", next: "papyrus6" },
                        { label: "Karla, la malula", next: "papyrus6_5"}]
            },
            papyrus6_5: {
                text: "* HOLA KARLA MALULA, YO SOY EL GRAN PAPYRUS.",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus7"
            },
            papyrus6: {
                text: "* HOLA KARLA, YO SOY EL GRAN PAPYRUS.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus7"
            },
            papyrus7: {
                text: "* ESTOY CREANDO PUZZLES PARA ATRAPAR A HUMANOS.",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus8"
            },
            papyrus8: {
                text: "* ¿QUIERES AYUDARME CON MIS PUZZLES, HERMANITA KARLA?",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [ { label: "¡Por supuesto, hermano!", next: "papyrus9" },
                        { label: "No me apetece", next: "papyrus9_5"}]
            },
            papyrus9: {
                text: "* ¡¡EXCELENTE!! \n * ¡NYEH HEH HEH!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "despedida_papyrus"
            },
            papyrus9_5: {
                text: "* ¡¿EH?! VAMOS HERMANITA, SON LOS MEJORES PUZZLES QUE VERÁS EN TU VIDA.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [ { label: "Está bien...", next: "papyrus9" },
                        { label: "No quiero", next: "papyrus10_5"}]
            },
            papyrus10_5: {
                text: "* AYÚDAME HERMANITA KARLA. \n * NO ME PONGAS TRISTE.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [ { label: "Está bien", next: "papyrus11_5" }]
            },
            papyrus11_5: {
                text: "* ¡¡EXCELENTE!!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "despedida_papyrus"
            },
            despedida_papyrus: {
                text: "* VAMOS, SÍGUEME PARA VER MIS GRANDIOSOS PUZZLES.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {const right = document.getElementById('sprite-right'); right.classList.add('slide-out-right-fast');},
                next: "sans15"
            },
            sans15: {
                text: "* no te preocupes, él no es peligroso.",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                onEnter: () => {document.getElementById('sprite-left').classList.remove('sans-shift');},
                options: [{ label: "Seguir avanzando", next: "puzzle_laberinto_1", transition: true }]
            },

            puzzle_laberinto_1: {
                text: "* ¡HERMANITA! \n* ¡ESTE ES EL LABERINTO INVISIBLE DE ELECTRICIDAD!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_laberinto_2"
            },
            puzzle_laberinto_2: {
                text: "* ¡CUANDO TOQUES LAS PAREDES, \n* ESTE ORBE TE DARÁ UNA GRAN DESCARGA!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_laberinto_3"
            },
            puzzle_laberinto_3: {
                text: "* ¡INTENTA AVANZAR!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [ { label: "Avanzar", next: "puzzle_laberinto_4" } ]
            },
            puzzle_laberinto_4: {
                text: "* ¡¡¡ZAP!!!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "",
                soundEffect: "sounds/snd_shock.wav",
                soundDelay: 0,
                onEnter: () => {
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                next: "puzzle_laberinto_5"
            },
            puzzle_laberinto_5: {
                text: "* ¡SANS! ¡¿QUÉ HICISTE?!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_laberinto_6"
            },
            puzzle_laberinto_6: {
                text: "* creo que nuestra hermanita tiene que sostener el orbe.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_laberinto_7"
            },
            puzzle_laberinto_7: {
                text: "* ¡OH, CLARO! \n* ¡SOSTÉN ESTO, HERMANITA!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                soundEffect: "sounds/snd_item.wav",
                soundDelay: 400,
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_laberinto_8"
            },
            puzzle_laberinto_8: {
                text: "* (Papyrus caminó por la nieve y te entregó el orbe, \n* dejando un camino de huellas claro).",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => {const right = document.getElementById('sprite-right'); right.classList.add('slide-out-right-fast');},
                options: [ { label: "Seguir sus huellas", next: "puzzle_laberinto_9" } ]
            },
            puzzle_laberinto_9: {
                text: "* ¡INCREÍBLE! \n* ¡LO RESOLVISTE CON MUCHA FACILIDAD!",
                spriteSans: "img/characters/sans/sans3.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                next: "puzzle_laberinto_10"
            },
            puzzle_laberinto_10: {
                text: "* ¡PERO EL SIGUIENTE NO SERÁ TAN FÁCIL! \n* ¡NYEH HEH HEH!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {const right = document.getElementById('sprite-right'); right.classList.add('slide-out-right-fast');},
                next: "puzzle_laberinto_11"
            },
            puzzle_laberinto_11: {
                text: "* supongo que eso cuenta como una victoria.",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                onEnter: () => {document.getElementById('sprite-left').classList.remove('sans-shift');},
                options: [{ label: "Continuar", next: "puzzle_sopa_1", transition: true }]
            },

            puzzle_sopa_1: {
                text: "* ¡HERMANITA! ¡MIRA ESTO!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.add('sans-shift');
                    right.classList.add('slide-in-right');
                    
                },
                next: "puzzle_sopa_2"
            },
            puzzle_sopa_2: {
                text: "* ¡ES EL PUZZLE MÁS DIFÍCIL DE TODOS! \n* ¡LA SOPA DE LETRAS!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_sopa_3"
            },
            puzzle_sopa_3: {
                text: "* papyrus, todo el mundo sabe que el crucigrama es más difícil.",
                spriteSans: "img/characters/sans/sans3.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_sopa_4"
            },
            puzzle_sopa_4: {
                text: "* ¡QUÉ DICES! ¡LA SOPA DE LETRAS ES EL PINÁCULO DEL INTELECTO!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_sopa_5"
            },
            puzzle_sopa_5: {
                text: "* HERMANITA, ¡DÍSELO! \n* ¿QUÉ ES MÁS DIFÍCIL?",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_pregunton.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [
                    { label: "Sopa de letras", next: "puzzle_sopa_letras" },
                    { label: "Crucigrama", next: "puzzle_sopa_crucigrama" }
                ]
            },
            puzzle_sopa_letras: {
                text: "* ¡HA! ¡LO VES, SANS! \n* ¡NUESTRA HERMANITA TIENE UN GUSTO REFINADO!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_sopa_fin"
            },
            puzzle_sopa_fin: {
                text: "* COMO SEA... \n* ¡AÚN QUEDAN MÁS PUZZLES! ¡SÍGUEME!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {const right = document.getElementById('sprite-right'); right.classList.add('slide-out-right-fast');},
                next: "puzzle_sopa_finfin"
            },
            puzzle_sopa_finfin: {
                text: "* gracias por elegir la sopa de letras para alegrar a mi hermano.",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                onEnter: () => {document.getElementById('sprite-left').classList.remove('sans-shift');},
                next: "puzzle_sopa_finfinfin"
            },
            puzzle_sopa_finfinfin: {
                text: "* ayer estuvo intentado resolver el horoscopo.",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                options: [{ label: "Continuar", next: "puzzle_colores_1", transition: true }]
            },
            puzzle_sopa_crucigrama: {
                text: "* ... \n* ESTOY MUY DECEPCIONADO DE TI.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_sopa_crucigrama_finB"
            },
            puzzle_sopa_crucigrama_finB: {
                text: "* COMO SEA... \n* ¡AÚN QUEDAN MÁS PUZZLES! ¡SÍGUEME!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {const right = document.getElementById('sprite-right'); right.classList.add('slide-out-right-fast');},
                next: "puzzle_sopa_crucigrama_sans"
            },
            puzzle_sopa_crucigrama_sans: {
                text: "* jejeje, buena elección.",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                onEnter: () => {document.getElementById('sprite-left').classList.remove('sans-shift');},
                options: [{ label: "Continuar", next: "puzzle_colores_1", transition: true }]
            },
        
            puzzle_colores_1: {
                text: "* ¡HERMANITA! \n* ¡ESPERO QUE ESTÉS LISTA PARA EL SIGUIENTE RETO!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.add('sans-shift');
                    right.classList.add('slide-in-right');
                },
                next: "puzzle_colores_2"
            },
            puzzle_colores_2: {
                text: "* ¡EL PUZZLE DE BALDOSAS DE COLORES! \n* CADA COLOR TIENE UNA FUNCIÓN DIFERENTE.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_3"
            },
            puzzle_colores_3: {
                text: "* ¡LAS ROJAS SON MUROS! \n* ¡LAS AMARILLAS TE DAN UNA GRAN DESCARGA!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_3b"
            },
            puzzle_colores_3b: {
                text: "* ¡LAS VERDES SON ALARMAS! ¡TIENES QUE LUCHAR! \n* ¡LAS NARANJAS TE HARÁN OLER DELICIOSO!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_3c"
            },
            puzzle_colores_3c: {
                text: "* ¡LAS AZULES SON DE AGUA! \n* ¡PERO SI HUELES A NARANJA, LAS PIRAÑAS TE MORDERÁN!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_3d"
            },
            puzzle_colores_3d: {
                text: "* ¡Y SI UNA AZUL TOCA UNA AMARILLA, \n* EL AGUA TE ELECTROCUTARÁ!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_3e"
            },
            puzzle_colores_3e: {
                text: "* ¡LAS MORADAS SON RESBALADIZAS! \n* ¡Y SU JABÓN HUELE A LIMONES!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_3f"
            },
            puzzle_colores_3f: {
                text: "* ¡Y LAS ROSAS NO HACEN NADA! \n* ¡PUEDES PISARLAS TODO LO QUE QUIERAS!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_3g"
            },
            puzzle_colores_3g: {
                text: "* ¡¿ENTENDIDO?!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_pregunton.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                options: [ { label: "¡Entendido!", next: "puzzle_colores_4" }, { label: "No entendí nada", next: "puzzle_colores_4" } ]
            },
            puzzle_colores_4: {
                text: "* ¡NO IMPORTA! \n* ¡LA MÁQUINA GENERARÁ UN CAMINO TOTALMENTE AL AZAR!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_5"
            },
            puzzle_colores_5: {
                text: "* (La máquina hace ruidos extraños y genera una línea recta de baldosas rosas).",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                soundEffect: "sounds/snd_computer.ogg",
                soundDelay: 100,
                options: [ { label: "Caminar por lo rosa", next: "puzzle_colores_6" } ]
            },
            puzzle_colores_6: {
                text: "* ... \n* ESO NO ERA LO QUE DEBÍA PASAR.",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_7"
            },
            puzzle_colores_7: {
                text: "* wow, ese sí que fue un desafío, bro.",
                spriteSans: "img/characters/sans/sans4.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_colores_fin"
            },
            puzzle_colores_fin: {
                text: "* ¡CÁLLATE SANS! \n* ¡EL PRÓXIMO SERÁ IMPOSIBLE! ¡NYEH HEH HEH!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {const right = document.getElementById('sprite-right'); right.classList.add('slide-out-right-fast');},
                next: "sans_post_colores"
            },
            sans_post_colores: {
                text: "* supongo que deberíamos seguir avanzando.",
                sprite: "img/characters/sans/sans.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                onEnter: () => {document.getElementById('sprite-left').classList.remove('sans-shift');},
                options: [{ label: "Continuar", next: "puzzle_terror_1", transition: true }]
            },

            puzzle_terror_1: {
                text: "* ¡HERMANITA! ¡ESTE ES MI ÚLTIMO Y MÁS PELIGROSO RETO!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.add('sans-shift');
                    right.classList.add('slide-in-right');
                },
                next: "puzzle_terror_2"
            },
            puzzle_terror_2: {
                text: "* ¡EL DESAFÍO DEL TERROR MORTAL!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_terror_3"
            },
            puzzle_terror_3: {
                text: "* ¡CUANDO DÉ LA SEÑAL, CAERÁN BOLAS DE FUEGO Y CAÑONES DISPARARÁN!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_terror_4"
            },
            puzzle_terror_4: {
                text: "* ...",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_terror_5"
            },
            puzzle_terror_5: {
                text: "* ... ¿qué pasa? ¿no vas a encenderlo?",
                spriteSans: "img/characters/sans/sans3.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_terror_6"
            },
            puzzle_terror_6: {
                text: "* ¡NO! ¡PODRÍA SER DEMASIADO INJUSTO!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_terror_7"
            },
            puzzle_terror_7: {
                text: "* SOY UN ESQUELETO CON ESTÁNDARES. \n* ¡MIS PUZZLES DEBEN SER JUSTOS!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "puzzle_terror_8"
            },
            puzzle_terror_8: {
                text: "* ¡TE ESPERO EN EL PUEBLO PARA COMER ESPAGUETI! ¡NYEH HEH HEH!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {const right = document.getElementById('sprite-right'); right.classList.add('slide-out-right-fast');},
                next: "sans_post_terror"
            },
            sans_post_terror: {
                text: "* bueno, parece que le caíste bien.",
                sprite: "img/characters/sans/sans4.png",
                music: "",
                voice: "sounds/snd_sans.wav",
                onEnter: () => {document.getElementById('sprite-left').classList.remove('sans-shift');},
                options: [{ label: "Ir al pueblo", next: "inicio_snowdin6", transition: true }]
            },

            inicio_snowdin6: {
                text: "* Caminas con Sans hacia el pueblo, pero la nieve está muy alta.",
                sprite: "img/characters/black.png",
                music: "sounds/mus_snowy.mp3",
                voice: "sounds/snd_txt.wav",
                next: "inicio_snowdin7"
            },
            inicio_snowdin7: {
                text: "* (¡Ops! Te tropiezas con una rama oculta en la nieve).",
                sprite: "img/characters/black.png",
                music: "sounds/mus_snowy.mp3",
                voice: "sounds/snd_txt.wav",
                soundEffect: "sounds/snd_fall.wav",
                soundDelay: 100,
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => document.body.classList.remove('shake-strong'), 400);
                },
                next: "inicio_snowdin8"
            },
            inicio_snowdin8: {
                text: "* (La máscara de esqueleto sale volando y cae lejos de ti).",
                sprite: "img/characters/black.png",
                music: "",
                voice: "sounds/snd_txt.wav",
                next: "aparicion_papyrus_sorpresa"
            },
            aparicion_papyrus_sorpresa: {
                text: "* ¡HERMANITA! ¡¿ESTÁS BIEN?! \n* ¡DÉJAME AYUDARTE A LEVANTAR...!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.add('sans-shift');
                    right.classList.add('slide-in-right');
                },
                next: "papyrus_revelacion_humana"
            },
            papyrus_revelacion_humana: {
                text: "* ... \n* ¡¡¡SANTAS MOZZARELLAS!!!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                soundEffect: "sounds/snd_surprise.mp3",
                soundDelay: 100,
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_analisis"
            },
            papyrus_analisis: {
                text: "* ¡¿SANS?! ¡¿POR QUÉ NUESTRA HERMANITA TIENE PIEL?! \n* ¡Y NO TIENE PANTALONES DE HUESOS!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_curioso.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_conclusión"
            },
            papyrus_conclusión: {
                text: "* ESPERA... ¡¡ERES UNA HUMANA!!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_conflicto"
            },
            papyrus_conflicto: {
                text: "* SE SUPONE QUE DEBO CAPTURARTE... \n* ¡PERO ERES MI HERMANITA PREFERIDA!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_perdon"
            },
            papyrus_perdon: {
                text: "* ¡NYEH HEH HEH! ¡ESTÁ BIEN! \n* ¡EL GRAN PAPYRUS NO CAPTURA A SUS AMIGOS!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_cumpleaños"
            },
            papyrus_cumpleaños: {
                text: "* (Aprovechas para decirle que, además, hoy es tu cumpleaños).",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_festejo_cumple"
            },
            papyrus_festejo_cumple: {
                text: "* ¡¿TU CUMPLEAÑOS?! \n* ¡ESTO ES MEJOR QUE ENCONTRAR UN HUMANO!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_invitacion"
            },
            papyrus_invitacion: {
                text: "* ¡SANS! ¡VAMOS AL PUEBLO AHORA MISMO! \n* ¡PREPARARÉ EL ESPAGUETI MÁS FESTIVO DE LA HISTORIA!",
                spriteSans: "img/characters/sans/sans4.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "papyrus_fiesta"
            },
            papyrus_fiesta: {
                text: "* ¡SÍGUEME, HUMANA KARLA! ¡NYEH HEH HEH!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {
                    const right = document.getElementById('sprite-right');
                    right.classList.add('slide-out-right-fast');
                },
                options: [ { label: "Ir a festejar", next: "inicio_pueblo_festejo", transition: true } ]
            },

            inicio_pueblo_festejo: {
                text: "* (Llegas al centro de Snowdin. Hay luces coloridas, globos y un cartel gigante que dice 'FELIS CUMPLEAÑOS KARLA').",
                sprite: "img/characters/black.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_txt.wav",
                next: "fiesta1"
            },
            fiesta1: {
                text: "* ¡BIENVENIDA A TU FIESTA SORPRESA, HUMANA KARLA!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.add('sans-shift');
                    right.classList.add('slide-in-right');
                },
                next: "fiesta2"
            },
            fiesta2: {
                text: "* EL GRAN PAPYRUS HA ORGANIZADO ESTO EXCLUSIVAMENTE PARA TI.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_hotel.mp3",  
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta3"
            },
            fiesta3: {
                text: "* DEBO ADMITIR QUE ERES UNA HUMANA FASCINANTE.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta4"
            },
            fiesta4: {
                text: "* ERES VALIENTE, RESUELVES MIS PUZZLES CON ELEGANCIA... \n* ¡Y TIENES UN GUSTO IMPECABLE PARA LOS AMIGOS!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_confident.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta5"
            },
            fiesta5: {
                text: "* CASI ERES TAN GENIAL COMO YO. \n* ¡Y ESO ES DECIR MUCHÍSIMO! ¡NYEH HEH HEH!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
               music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta6"
            },
            fiesta6: {
                text: "* POR ESO, TE HE PREPARADO MI OBRA MAESTRA CULINARIA: \n* ¡EL ESPAGUETI DE CUMPLEAÑOS!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_hotel.mp3",  
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta7"
            },
            fiesta7: {
                text: "* wow, huele genial, bro. \n* seguro que a karla le encanta.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta8"
            },
            fiesta8: {
                text: "* por cierto, qué coincidencia.",
                spriteSans: "img/characters/sans/sans3.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta9"
            },
            fiesta9: {
                text: "* hoy también es mi cumpleaños.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_incredulo.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta10"
            },
            fiesta10: {
                text: "* ¡¿QUÉ?! ¡¿CÓMO NO ME DIJISTE, SANS?! \n* ¡TENDRÍA QUE HABER HECHO EL DOBLE DE ESPAGUETI!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta11"
            },
            fiesta11: {
                text: "* relájate, bro. es una broma.",
                spriteSans: "img/characters/sans/sans4.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_hotel.mp3",  
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta12"
            },
            fiesta12: {
                text: "* mi cumpleaños es mañana, 1 de abril.",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_hotel.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta13"
            },
            fiesta13: {
                text: "* jejeje. \n* caíste hasta los huesos.",
                spriteSans: "img/characters/sans/sans5.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta14"
            },
            fiesta14: {
                text: "* ¡¡¡SAAAANS!!! ¡NO ARRUINES EL MOMENTO EMOTIVO DE KARLA CON TUS CHISTES MALOS!",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_mad.png",
                music: "sounds/mus_hotel.mp3",  
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift'); 
                    document.body.classList.add('shake');
                    setTimeout(() => document.body.classList.remove('shake'), 200);
                },
                next: "fiesta15"
            },
            fiesta15: {
                text: "* está bien, está bien. me pongo serio.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_sweaty.png",
                music: "sounds/mus_hotel.mp3", 
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta16"
            },
            fiesta16: {
                text: "* oye, karla...",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta17"
            },
            fiesta17: {
                text: "* sé que caer en el subsuelo puede dar miedo. \n* pero... me alegra que hayas caído por aquí.",
                spriteSans: "img/characters/sans/sans.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta18"
            },
            fiesta18: {
                text: "* iluminas este lugar. \n* eres una persona muy especial.",
                spriteSans: "img/characters/sans/sans4.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta19"
            },
            fiesta19: {
                text: "* así que... feliz cumpleaños, niña.",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_happy.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_sans.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta20"
            },
            fiesta20: {
                text: "* ¡LO QUE ÉL DIJO! ¡PERO CON MÁS ENTUSIASMO! \n* ¡Y CON ESPAGUETI!",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_papyrus.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "fiesta21"
            },
            fiesta21: {
                text: "* (Pasas el resto del día riendo, comiendo y festejando con tus monstruos favoritos).",
                spriteSans: "img/characters/sans/sans1.png",
                spritePapyrus: "img/characters/papyrus/papyrus_megahappy.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { document.getElementById('sprite-left').classList.add('sans-shift'); },
                next: "trigger_birthday" 
            },
            
            trigger_birthday: {
                music: "sounds/mus_memory.mp3",
                next:"inicio",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.remove('sans-shift');
                    right.classList.add('slide-out-right-fast');
                    left.classList.add('slide-out-left');
                    startBirthdaySequence();
                }
            },

            inicio_mettaton: {
                text: "* ...",
                sprite: "img/characters/black.png",
                music: "",
                voice: "sounds/snd_no.wav",
                next: "mtt_intro_1",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    left.classList.add('slide-in-right');
                },
            },
            mtt_intro_1: {
                text: "* ¡OH YEEEES!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150, 
                moveClassLeft: "move-left-right",
                moveDuration: "0.4s",
                music: "sounds/mus_mettaton.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/mus_mett_cheer.ogg",
                soundDelay: 0,
                next: "mtt_intro_2"
            },
            mtt_intro_2: {
                text: "* ¡BIENVENIDOS, BELLEZAS, AL ÚNICO E INIGUALABLE...!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 250,
                moveClassLeft: "move-left-right",
                moveDuration: "0.8s",
                music: "sounds/mus_mettaton.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_intro_3"
            },
            mtt_intro_3: {
                text: "* ¡CONCURSO DE PREGUNTAS Y RESPUESTAS DE METTATON!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "1s",
                music: "sounds/mus_mettaton.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_intro_4"
            },
            mtt_intro_4: {
                text: "* ¡QUÉ PÚBLICO TAN MARAVILLOSO TENEMOS HOY!\n* ¡Y VEO A UNA CONCURSANTE MUY ESPECIAL!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-left-right",
                moveDuration: "1.2s",
                music: "sounds/mus_mettaton.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_reglas"
            },
            mtt_reglas: {
                text: "* LAS REGLAS SON SIMPLES, CARIÑO.\n* RESPONDE BIEN O... ¡BZZZT! ¡CONSECUENCIAS ELECTRIZANTES!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 150, 
                moveClassLeft: "move-up-down",
                moveDuration: "1.5s",
                music: "sounds/mus_mettaton.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [ { label: "¡Comencemos el show!", next: "mtt_q0" } ]
            },
            
            mtt_q0: {
                text: "* PREGUNTA NÚMERO 1...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "2.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q0"
            },
            mtt_q0: {
                text: "* ¿CUÁL ES EL PREMIO POR RESPONDER CORRECTAMENTE?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400, 
                moveClassLeft: "move-left-right",
                moveDuration: "1.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q1"
            },
            mtt_q1: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400, 
                moveClassLeft: "move-left-right",
                moveDuration: "1.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "A) Dinero", next: "mtt_q1_wrong" },
                    { label: "B) Un computador nuevo", next: "mtt_q1_wrong" },
                    { label: "C) Más preguntas", next: "mtt_q1_right" },
                    { label: "D) Piedad", next: "mtt_q1_wrong" }
                ]
            },
            mtt_q1_wrong: {
                text: "* ¡INCORRECTO!\n* ¡EL PREMIO SIEMPRE ES PODER RESPONDER MÁS PREGUNTAS MÍAS!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 100, 
                moveClassLeft: "move-left-right",
                moveDuration: "0.2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_shock.wav",
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                options: [ { label: "Siguiente pregunta", next: "mtt_q2" } ]
            },
            mtt_q1_right: {
                text: "* ¡CORRECTO, CARIÑO!\n* ¡SABÍA QUE ERAS UNA FANÁTICA INTELIGENTE!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.6s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_q2"
            },

            mtt_q2: {
                text: "* PREGUNTA NÚMERO 2...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "2.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q2_pregunta1"
            },
            mtt_q2_pregunta1: {
                text: "* ¿DE QUÉ ESTÁN HECHOS LOS ROBOTS?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "1.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q2_pregunta"
            },
            mtt_q2_pregunta: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "1.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "A) Metal y Magia", next: "mtt_q2_right" },
                    { label: "B) Engranajes", next: "mtt_q2_wrong" },
                    { label: "C) Glamour puro", next: "mtt_q2_wrong" },
                    { label: "D) Amor y esperanza", next: "mtt_q2_wrong" }
                ]
            },
            mtt_q2_wrong: {
                text: "* ¡AY, CARIÑO, CASI!\n* PERO TÉCNICAMENTE SOMOS METAL Y MAGIA. ¡LO SIENTO!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "0.3s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_shock.wav",
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                options: [ { label: "Siguiente pregunta", next: "mtt_q3" } ]
            },
            mtt_q2_right: {
                text: "* ¡EXACTO!\n* AUNQUE EN MI CASO, LE AGREGARÍA UN 99% DE GLAMOUR.",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 250,
                moveClassLeft: "move-left-right",
                moveDuration: "0.6s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_q3"
            },

            mtt_q3: {
                text: "* PREGUNTA NÚMERO 3...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "2.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q3_pregunta"
            },
            mtt_q3_pregunta: {
                text: "* DOS TRENES SALEN DE SNOWDIN A 60 KM/H...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 500,
                moveClassLeft: "move-up-down",
                moveDuration: "3s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q3_b"
            },
            mtt_q3_b: {
                text: "* ESPERA, ESTO ES DEMASIADO ABURRIDO PARA LA TELEVISIÓN.\n* ¡CAMBIEMOS LA PREGUNTA RÁPIDO!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 100,
                moveClassLeft: "move-up-down",
                moveDuration: "0.4s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_intro" 
            },

            mtt_broma_intro: {
                text: "* AHORA, MIS FUENTES ME HAN DADO INFORMACIÓN MUY EXCLUSIVA SOBRE NUESTRA CONCURSANTE...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-left-right",
                moveDuration: "2s", 
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_pregunta"
            },
            
            mtt_broma_pregunta: {
                text: "* MIS SENSORES ME INDICAN QUE TIENES EL MISMO COMPUTADOR DESDE EL AÑO 2016...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-left-right",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_pregunta1"
            },
             mtt_broma_pregunta1: {
                text: "* ¡Y NUNCA LE HAS HECHO MANTENIMIENTO! ¡QUÉ HORROR!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-up-down",
                moveDuration: "0.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_pregunta2"
            },
            mtt_broma_pregunta2: {
                text: "* COMO EXPERTO EN TECNOLOGÍA, EXIJO SABER...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-up-down",
                moveDuration: "1s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_pregunta3"
            },
            mtt_broma_pregunta3: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-left-right",
                moveDuration: "2.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_pc_opciones"
            },
            mtt_broma_pc_opciones: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "A) Magia negra y esperanza", next: "mtt_pc_right" },
                    { label: "B) El polvo acumulado le da poder", next: "mtt_pc_horror" },
                    { label: "C) Pura fuerza de voluntad", next: "mtt_pc_right" },
                    { label: "D) Ya no funciona, es una ilusión", next: "mtt_pc_right" }
                ]
            },
            mtt_pc_horror: {
                text: "* ¡AAAHHH! ¡QUÉ ASCO, CARIÑO!\n* ¡ALPHYS, CONSÍGUEME UN ANTIVIRUS Y UN PLUMERO, RÁPIDO!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 100,
                moveClassLeft: "move-left-right",
                moveDuration: "0.2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_shock.wav",
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                next: "mtt_broma_furro"
            },
            mtt_pc_right: {
                text: "* ¡FASCINANTE! \n* AUNQUE TE RECOMIENDO DARLE UN POCO DE AMOR... Y UN FORMATEO.",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.7s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_broma_furro"
            },

            mtt_broma_furro: {
                text: "* PASANDO A TEMAS MÁS... ARTÍSTICOS.\n* LOS RATINGS SUBEN CUANDO SE REVELAN SECRETOS OSCUROS...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "2.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_furro2"
            },
            mtt_broma_furro2: {
                text: "* ¿QUÉ ES LO QUE REALMENTE DIBUJA KARLA CUANDO NADIE LA ESTÁ MIRANDO?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "2.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_furro_q"
            },
            mtt_broma_furro_q: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "A) Furros y Therians", next: "mtt_furro_right" },
                    { label: "B) Dibujos de Karla", next: "mtt_furro_wrong" },
                    { label: "C) Retratos majestuosos de Mettaton", next: "mtt_furro_wrong" },
                    { label: "D) Paisajes aburridos", next: "mtt_furro_wrong" }
                ]
            },
            mtt_furro_wrong: {
                text: "* ¡INCORRECTO!\n* ¡SABEMOS MUY BIEN CUÁL ES TU VERDADERA PASIÓN!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-left-right",
                moveDuration: "0.2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_shock.wav",
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                options: [ { label: "Siguiente escándalo", next: "mtt_broma_uni" } ]
            },
            mtt_furro_right: {
                text: "* ¡OH YEEEES!\n* ¡EL ARTE ES ARTE, CARIÑO! ¡NO TE ESCONDAS, DALE AL MUNDO TU GLAMOUR THERIAN!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_broma_uni"
            },

            mtt_broma_uni: {
                text: "* Y PARA LA ÚLTIMA PREGUNTA DE ESTA SECCIÓN... \n* UNA DUDA QUE CARCOME A CIERTO ESPECTADOR MUY CERCANO A TI.",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 250,
                moveClassLeft: "move-left-right",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_uni2"
            },
            mtt_broma_uni2: {
                text: "* CON LA UNIVERSIDAD CONSUMIENDO TODA TU VIDA... ¿CUÁNDO VOLVERÁS A JUGAR CON DANI?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 250,
                moveClassLeft: "move-up-down",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_broma_uni_q"
            },
            mtt_broma_uni_q: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "A) Cuando me gradúe (en 84 años)", next: "mtt_uni_drama" },
                    { label: "B) Mañana sin falta", next: "mtt_uni_right" },
                    { label: "C) Cuando explote mi PC del 2016", next: "mtt_uni_drama" },
                    { label: "D) ¡Hoy mismo para celebrar!", next: "mtt_uni_right" }
                ]
            },
            mtt_uni_drama: {
                text: "* ¡QUÉ TRAGEDIA!\n* ¡EL PÚBLICO LLORA ANTE TANTA CRUELDAD ACADÉMICA!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-up-down",
                moveDuration: "0.4s", 
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_comercial_intro" 
            },
            mtt_uni_right: {
                text: "* ¡SÍ! ¡ESO ES LO QUE QUERÍAMOS ESCUCHAR!\n* ¡UNA VERDADERA ESTRELLA SIEMPRE TIENE TIEMPO PARA SUS FANS!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.6s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_comercial_intro" 
            },

            mtt_comercial_intro: {
                text: "* ¡Y AHORA, UNA BREVE PAUSA PARA NUESTROS PATROCINADORES!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "0.8s",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_comercial_texto"
            },
            mtt_comercial_texto: {
                text: "* ¿TU PC DEL 2016 SUENA COMO UN AVIÓN A PUNTO DE DESPEGAR CUANDO ABRES WORD?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "1.2s",
                music: "sounds/mus_dating.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_comercial_texto2"
            },
            mtt_comercial_texto2: {
                text: "* ¡COMPRA EL NUEVO VENTILADOR 'SOPLO DE GLAMOUR MTT'! ¡ENFRIARÁ TU CPU Y TUS LÁGRIMAS DE UNIVERSITARIA!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "0.6s", 
                music: "sounds/mus_dating.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_llamada_intro"
            },

            mtt_llamada_intro: {
                text: "* ¡OH! ¡PARECE QUE TENEMOS UNA LLAMADA EN VIVO DE UN FAN MUY ENTUSIASTA!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-up-down",
                moveDuration: "0.7s",
                music: "sounds/snd_no.wav", 
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_phone.wav",
                soundDelay: 100,
                next: "mtt_llamada_papy"
            },
            mtt_llamada_papy: {
                text: "* ¡HOLA, TELEVISIÓN! ¡SOY YO, EL GRAN PAPYRUS!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"], 
                animSpeedLeft: 400, 
                moveClassLeft: "move-up-down",
                moveDuration: "3s", 
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                next: "mtt_llamada_papy2"
            },
            mtt_llamada_papy2: {
                text: "* ¡SOLO LLAMABA PARA DESEARLE UN FELIZ CUMPLEAÑOS A KARLA Y OFRECERLE MIS MÍTICOS ESPAGUETIS!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"], 
                animSpeedLeft: 400, 
                moveClassLeft: "move-up-down",
                moveDuration: "3s",
                music: "sounds/mus_papyrus.mp3",
                voice: "sounds/snd_papyrus.wav",
                next: "mtt_llamada_corte"
            },
            mtt_llamada_corte: {
                text: "* ¡GRACIAS, FAN ANÓNIMO! ¡PERO EL TIEMPO EN TELEVISIÓN ES ORO!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-left-right",
                moveDuration: "0.4s", 
                music: "sounds/snd_no.wav", 
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_block2.wav",
                soundDelay: 0,
                next: "mtt_q4" 
            },

            mtt_q4: {
                text: "* AHORA SÍ, PREGUNTA NÚMERO 4...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "2.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q4_pregunta1"
            },
            mtt_q4_pregunta1: {
                text: "* ¿CÓMO SE LLAMA LA VERDADERA ESTRELLA DE ESTE DÍA?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "1.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q4_pregunta"
            },
            mtt_q4_pregunta: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "1.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "A) Mettaton", next: "mtt_q4_wrong" },
                    { label: "B) Napstablook", next: "mtt_q4_wrong" },
                    { label: "C) Karlangas", next: "mtt_q4_right" },
                    { label: "D) Papyrus", next: "mtt_q4_wrong" }
                ]
            },
            mtt_q4_wrong: {
                text: "* ¡CARIÑO, POR FAVOR!\n* ¡SABES PERFECTAMENTE QUE HOY ES EL DÍA DE KARLA!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-left-right",
                moveDuration: "0.2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_shock.wav",
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                options: [ { label: "Siguiente pregunta", next: "mtt_q5" } ]
            },
            mtt_q4_right: {
                text: "* ¡OH YEEEES!\n* ¡UN APLAUSO GIGANTE PARA LA CUMPLEAÑERA MÁS FABULOSA!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_q5"
            },

            mtt_q5: {
                text: "* PREGUNTA FINAL:",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "3s", 
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q5_pregunta1"
            },
            mtt_q5_pregunta1: {
                text: "* ¿QUIÉN ES EL MONSTRUO MÁS ATRACTIVO DEL SUBSUELO?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_q5_pregunta"
            },
            mtt_q5_pregunta: {
                text: " ",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "2s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "A) Mettaton", next: "mtt_q5_right" },
                    { label: "B) Mettaton", next: "mtt_q5_right" },
                    { label: "C) Mettaton", next: "mtt_q5_right" },
                    { label: "D) Mettaton", next: "mtt_q5_right" }
                ]
            },
            mtt_q5_right: {
                text: "* ¡EXCELENTE ELECCIÓN!\n* ¡NO PODRÍA ESTAR MÁS DE ACUERDO CONTIGO, BELLEZA!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "0.5s",
                music: "sounds/mus_mettaton_quiz.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "alphys_interrupcion"
            },

            alphys_interrupcion: {
                text: "* ...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "3s",
                music: "sounds/snd_no.wav", 
                voice: "sounds/snd_txt.wav",
                soundEffect: "sounds/snd_phone.wav",
                soundDelay: 100,
                next: "alphys_habla_1"
            },
            alphys_habla_1: {
                text: "* ¡E-espera, Mettaton! ¡N-no puedes terminar el programa todavía!",
                spriteSans: "img/characters/mettaton/mettaton_mic1.png",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                moveClassLeft: "move-up-down",
                moveDuration: "3s",
                music: "sounds/mus_alphys.mp3",
                voice: "sounds/snd_alphys.wav",
                onEnter: () => {
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    const right = document.getElementById('sprite-right');
                    right.classList.add('slide-in-right');
                },
                next: "mtt_responde_alphys"
            },
            mtt_responde_alphys: {
                text: "* ¿ALPHYS, QUERIDA? ¿INTERRUMPIENDO MI CLÍMAX TELEVISIVO?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "1s",
                spritePapyrus: "img/characters/alphys/alphys_normal.png",
                music: "sounds/mus_alphys.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "alphys_habla_2"
            },
            alphys_habla_2: {
                text: "* ¡E-es el cumpleaños de Karla! ¡T-tenemos que darle la sorpresa e-especial que planeamos!",
                spriteSans: "img/characters/mettaton/mettaton_mic1.png",
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                moveClassLeft: "move-up-down",
                moveDuration: "3s",
                music: "sounds/mus_alphys.mp3",
                voice: "sounds/snd_alphys.wav",
                next: "mtt_acepta_regalo"
            },
            mtt_acepta_regalo: {
                text: "* ¡TIENES TODA LA RAZÓN! ¡ESTA CAJA METÁLICA ESTÁ LLENA DE GENEROSIDAD!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "0.6s",
                spritePapyrus: "img/characters/alphys/alphys_normal.png",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_ruleta_intro" 
            },

            mtt_ruleta_intro: {
                text: "* ¡PERO ANTES DE ABRIR MI CAJA, HAREMOS ESTO MÁS INTERESANTE!\n* ¡JUGUEMOS A LA RULETA DE REGALOS MISTERIOSOS!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "0.8s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_strongermonsters.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_ruleta_pregunta"
            },
            mtt_ruleta_pregunta: {
                text: "* TENGO TRES PAQUETES AQUÍ. SOLO UNO ES SEGURO.",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "2s", 
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_strongermonsters.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_ruleta_pregunta2"
            },
            mtt_ruleta_pregunta2: {
                text: "* ¿CUÁL ELIGES, CUMPLEAÑERA?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-up-down",
                moveDuration: "1.5s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_strongermonsters.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "Caja 1 (La que vibra)", next: "mtt_ruleta_caja1" },
                    { label: "Caja 2 (La que huele a pelo)", next: "mtt_ruleta_caja2" },
                    { label: "Caja 3 (La que tiene una carta)", next: "mtt_ruleta_caja3" }
                ]
            },
            mtt_ruleta_caja1: {
                text: "* ¡OH NO! ¡ESTABA LLENA DE ABEJAS ROBÓTICAS ASESINAS!\n* ¡QUÉ CLÁSICO DE LA TELEVISIÓN!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 100,
                moveClassLeft: "move-left-right",
                moveDuration: "0.2s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_strongermonsters.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_shock.wav",
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                next: "mtt_ruleta_alphys"
            },
            mtt_ruleta_caja2: {
                text: "* ¡FELICIDADES! ¡ES UN KIT COMPLETO PARA CREAR TU PROPIA FURSONA THERIAN MARCA MTT!\n* ¡GLAMOUR ANIMALESCO GARANTIZADO!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.6s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_strongermonsters.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_ruleta_alphys"
            },
            mtt_ruleta_caja3: {
                text: "* ¡AWW! ES UN MENSAJE SÚPER TIERNO DE DANI...\n* ¡QUÉ ABURRIDO! ¡LOS SENTIMIENTOS SINCEROS NO DAN RATINGS!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 300,
                moveClassLeft: "move-left-right",
                moveDuration: "1s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_strongermonsters.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_ruleta_alphys"
            },
            mtt_ruleta_alphys: {
                text: "* ¡M-Mettaton! ¡D-deja de asustarla! E-el verdadero juego e-es este...",
                spriteSans: "img/characters/mettaton/mettaton_mic1.png",
                moveClassLeft: "move-up-down",
                moveDuration: "3s", 
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_strongermonsters.mp3",
                voice: "sounds/snd_alphys.wav",
                next: "mtt_juego_bomba_1"
            },

            mtt_juego_bomba_1: {
                text: "* ¡ASÍ ES! ¡EL DESAFÍO DE LA BOMBA DE CONFETI GIGANTE!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-up-down",
                moveDuration: "0.7s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_juego_bomba_pregunta"
            },
            mtt_juego_bomba_pregunta: {
                text: "* ¡TIENES 10 SEGUNDOS! ¿QUÉ CABLE CORTAS PARA SALVAR LA FIESTA?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 100,
                moveClassLeft: "move-left-right",
                moveDuration: "0.4s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_deathreport.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "alphys_pista1"
            },
            alphys_pista1: {
                text: "* ¡K-Karla! L-los manuales dicen que el rojo es una trampa...",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "0.4s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_deathreport.mp3",
                voice: "sounds/snd_alphys.wav",
                next: "alphys_pista"
            },
            alphys_pista: {
                text: "* ¡T-Tu puedes Karla!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "0.4s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_deathreport.mp3",
                voice: "sounds/snd_alphys.wav",
                options: [
                    { label: "Cortar el Rojo", next: "mtt_bomba_mal" },
                    { label: "Cortar el Azul", next: "mtt_bomba_bien" },
                    { label: "Cortar el Verde", next: "mtt_bomba_mal" }
                ]
            },
            mtt_bomba_mal: {
                text: "* ¡OH NO, CARIÑO! ¡BOMBA DETONADA!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 50,
                moveClassLeft: "move-left-right",
                moveDuration: "0.2s", 
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_deathreport.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_bombsplosion.wav",
                onEnter: () => {
                    document.body.classList.add('shake-strong');
                    setTimeout(() => { document.body.classList.remove('shake-strong'); }, 300);
                },
                next: "mtt_bomba_mal_2"
            },
            mtt_bomba_mal_2: {
                text: "* (Estás cubierta de confeti negro con olor a quemado... pero estás viva).",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 500,
                moveClassLeft: "move-up-down",
                moveDuration: "4s", 
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_deathreport.mp3",
                voice: "sounds/snd_txt.wav",
                options: [ { label: "Sacudirse el confeti", next: "mtt_juego_baile_1" } ]
            },
            mtt_bomba_bien: {
                text: "* ¡CORRECTO! ¡EL CONFETI CAE CON UN ESTILO ESPECTACULAR!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.5s",
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                music: "sounds/mus_deathreport.mp3",
                voice: "sounds/snd_mtt.wav",
                soundEffect: "sounds/snd_victory.wav",
                next: "mtt_juego_baile_1"
            },

            mtt_juego_baile_1: {
                text: "* ¡PERO EL SHOW DEBE CONTINUAR! \n* ¡AHORA, LA PRUEBA FINAL: EL CONCURSO DE POSES!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 150,
                moveClassLeft: "move-left-right",
                moveDuration: "0.8s",
                spritePapyrus: "img/characters/alphys/alphys_normal.png",
                music: "sounds/mus_deathglamour.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "alphys_animo"
            },
            alphys_animo: {
                text: "* ¡T-tú puedes, Karla! ¡D-dales tu mejor pose, como en los a-animes que vemos!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "0.8s",
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                music: "sounds/mus_deathglamour.mp3",
                voice: "sounds/snd_alphys.wav",
                next: "mtt_juego_baile_pregunta"
            },
            mtt_juego_baile_pregunta: {
                text: "* LA CÁMARA ESTÁ RODANDO... ¿QUÉ VAS A HACER, BELLEZA?",
                animSpritesLeft: ["img/characters/mettaton/mettaton_question1.png", "img/characters/mettaton/mettaton_question2.png"],
                animSpeedLeft: 100,
                moveClassLeft: "move-up-down",
                moveDuration: "1.2s", 
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                music: "sounds/mus_deathglamour.mp3",
                voice: "sounds/snd_mtt.wav",
                options: [
                    { label: "Posar con glamour", next: "pose_drama" },
                    { label: "Pose otaku con Alphys", next: "pose_otaku" },
                    { label: "Saltar de alegría", next: "pose_papy" }
                ]
            },
            
            pose_drama: {
                text: "* ¡SÍ! ¡QUÉ ÁNGULOS! ¡QUÉ PASIÓN! ¡LOS RATINGS ESTÁN POR LAS NUBES!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 100,
                moveClassLeft: "move-up-down",
                moveDuration: "0.3s",
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                music: "sounds/mus_deathglamour.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_despedida_final"
            },
            pose_otaku: {
                text: "* ¡O-oh Dios mío, e-esa es la pose de Mew Mew Kissy Cutie! ¡KARLA ERES LA MEJOR!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-up-down",
                moveDuration: "0.5s",
                spritePapyrus: "img/characters/alphys/alphys_worry.png",
                music: "sounds/mus_deathglamour.mp3",
                voice: "sounds/snd_alphys.wav",
                next: "mtt_despedida_final"
            },
            pose_papy: {
                text: "* ¡FANTASTICO! ¡TIENES UNA ENERGÍA DESBORDANTE!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_correct1.png", "img/characters/mettaton/mettaton_correct2.png"],
                animSpeedLeft: 100,
                moveClassLeft: "move-up-down",
                moveDuration: "0.5s",
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                music: "sounds/mus_deathglamour.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "mtt_despedida_final"
            },
            mtt_despedida_final: {
                text: "* ¡HA SIDO UN EPISODIO PERFECTO!\n* ¡GRACIAS ALPHYS, Y GRACIAS KARLA POR PARTICIPAR!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 200,
                moveClassLeft: "move-left-right",
                moveDuration: "1s", 
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                music: "sounds/mus_mettaton.mp3",
                voice: "sounds/snd_mtt.wav",
                next: "alphys_despedida"
            },
            alphys_despedida: {
                text: "* ¡F-feliz cumpleaños, Karla! ¡E-espero que te haya gustado n-nuestro regalo!",
                animSpritesLeft: ["img/characters/mettaton/mettaton_mic1.png", "img/characters/mettaton/mettaton_mic2.png"],
                animSpeedLeft: 400,
                moveClassLeft: "move-left-right",
                moveDuration: "2s", 
                spritePapyrus: "img/characters/alphys/alphys_happy.png",
                music: "sounds/mus_mettaton.mp3",
                voice: "sounds/snd_alphys.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    const right = document.getElementById('sprite-right');
                    left.classList.add('slide-out-left');
                    right.classList.add('slide-out-right-fast');
                },
                next: "trigger_birthday"
            },

            inicio_picnic: {
                text: "* Llegamos, mi niña.\n* Este es mi rincón favorito de todas las Ruinas.",
                sprite: "img/characters/toriel/toriel_smile.png", 
                music: "sounds/snd_no.wav", 
                voice: "sounds/snd_toriel.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    left.classList.remove('sans-shift', 'slide-in-right');
                    void left.offsetWidth; 
                    left.classList.add('slide-in-right');
                },
                next: "picnic_sentarse"
            },
            picnic_sentarse: {
                text: "* El aire es fresco y no hay monstruos que nos molesten aquí.\n* Ven, siéntate a mi lado.",
                sprite: "img/characters/toriel/toriel_happy.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_tarta1"
            },
            picnic_tarta1: {
                text: "* He traído la tarta de canela y caramelo.",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_tarta"
            },
            picnic_tarta: {
                text: "* * Corté el pedazo más grande especialmente para ti.",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_toriel.wav",
                options: [
                    { label: "Comer un trozo", next: "picnic_comer" },
                    { label: "Guardarlo para después", next: "picnic_guardar" }
                ]
            },
            picnic_comer: {
                text: "* (Muerdes la tarta. Es cálida, dulce y sabe a hogar. Sientes que todos tus HP se restauran al máximo).",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_txt.wav",
                soundEffect: "sounds/snd_item.wav", 
                soundDelay: 200,
                next: "picnic_observacion"
            },
            picnic_guardar: {
                text: "* Por supuesto, pequeña. Puedes llevarlo en tu inventario para cuando el viaje se ponga difícil.",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_observacion"
            },
            picnic_observacion: {
                text: "* Sabes, Karla...\n* Te he estado observando desde que caíste aquí.",
                sprite: "img/characters/toriel/toriel_normal.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_esfuerzo"
            },
            picnic_esfuerzo: {
                text: "* Noto que tienes una mirada cansada, pero a la vez muy fuerte.",
                sprite: "img/characters/toriel/toriel_normal.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_pc"
            },
            picnic_pc: {
                text: "* Se nota que pasas horas ahora con tu nueva tableta, luchando contra tus tareas, dibujos y presentaciones...",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_asgore_interrumpe"
            },

            picnic_asgore_interrumpe: {
                text: "* Ooh.. Tori. P-pasaba por aquí y...",
                spriteSans: "img/characters/toriel/toriel_angry.png", 
                spritePapyrus: "img/characters/asgore/asgore_awkward.png",
                music: "sounds/snd_no.wav", 
                voice: "sounds/snd_asgore.wav",
                onEnter: () => {
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    const right = document.getElementById('sprite-right');
                    right.classList.remove('slide-out-right-fast');
                    right.classList.add('asgore-scale'); 
                    void right.offsetWidth;
                    right.classList.add('slide-in-right');
                },
                next: "picnic_asgore_2"
            },
            picnic_asgore_2: {
                text: "* O-oh... veo que estás ocupada. ¿Es la cumpleañera de la que me hablaron?",
                spriteSans: "img/characters/toriel/toriel_angry.png",
                spritePapyrus: "img/characters/asgore/asgore_sad.png",
                music: "sounds/mus_asgore.mp3",
                voice: "sounds/snd_asgore.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    document.getElementById('sprite-right').classList.add('asgore-scale');
                },
                next: "picnic_asgore_3"
            },
            picnic_asgore_3: {
                text: "* Solo... dejaré este té de flores doradas aquí y me iré. ¡F-feliz cumpleaños, humana!",
                spriteSans: "img/characters/toriel/toriel_angry.png",
                spritePapyrus: "img/characters/asgore/asgore_sad.png",
                music: "sounds/mus_asgore.mp3",
                voice: "sounds/snd_asgore.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    document.getElementById('sprite-right').classList.add('asgore-scale');
                },
                next: "picnic_asgore_huye"
            },
            picnic_asgore_huye: {
                text: "* (El Rey del Subsuelo se marcha caminando muy, muy rápido).",
                spriteSans: "img/characters/toriel/toriel_normal.png", 
                spritePapyrus: "img/characters/asgore/asgore_sad.png",
                music: "sounds/mus_asgore.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    const right = document.getElementById('sprite-right');
                    right.classList.add('asgore-scale');
                    right.classList.add('slide-out-right-fast'); 
                },
                next: "picnic_toriel_ignora"
            },

            picnic_toriel_ignora: {
                text: "* ...Haremos de cuenta que eso no pasó.\n* ¿En qué estaba? ¡Ah, sí!",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_toriel.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.remove('sans-shift'); 
                    document.getElementById('sprite-right').classList.remove('asgore-scale');
                },
                next: "picnic_arte"
            },

            picnic_arte: {
                text: "* A pesar de todo ese estrés desarrollando tus proyectos, siempre encuentras un momento para el arte.",
                sprite: "img/characters/toriel/toriel_happy.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_secreto"
            },
            picnic_secreto: {
                text: "* Karla, debo confesarte algo.\n* Yo no preparé este lugar mágico sola.",
                sprite: "img/characters/toriel/toriel_normal.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                options: [
                    { label: "¿Quién fue?", next: "picnic_revelacion_dani" }
                ]
            },
            picnic_revelacion_dani: {
                text: "* Fue Dani.\n* Él me pidió que te trajera hasta aquí y que te diera un mensaje de su parte.",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_mensaje_1"
            },
            picnic_mensaje_1: {
                text: "* Me pidió que le dijera a su querida Karla que está inmensamente orgulloso de la mujer en la que te estás convirtiendo.",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_mensaje_2"
            },
            picnic_mensaje_2: {
                text: "* Que sabe que a veces el tiempo no alcanza y que las presiones del mundo exterior te mantienen ocupada...",
                sprite: "img/characters/toriel/toriel_normal.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_mensaje_3"
            },
            picnic_mensaje_3: {
                text: "* Pero que cada segundo que logran pasar juntos es un tesoro para él.",
                sprite: "img/characters/toriel/toriel_happy.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_mensaje_4"
            },
            picnic_mensaje_4: {
                text: "* Quería regalarte un pedacito de este mundo que tanto te gusta, para que sepas que él siempre estara a tu lado.",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_abrazo_opcion"
            },
            picnic_abrazo_opcion: {
                text: "* (Toriel te mira con una calidez inmensa en sus ojos. Te abre los brazos).",
                sprite: "img/characters/toriel/toriel_smile.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_txt.wav",
                options: [
                    { label: "Abrazar a Toriel", next: "picnic_abrazo" }
                ]
            },
            picnic_abrazo: {
                text: "* Eres una persona muy amada. Nunca lo olvides.\n* Feliz cumpleaños, mi niña.",
                sprite: "img/characters/toriel/toriel_happy.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_napsta_interrumpe"
            },

            picnic_napsta_interrumpe: {
                text: "* oh... perdón por interrumpir un abrazo tan lindo...",
                spriteSans: "img/characters/toriel/toriel_sorpresa.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => {
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    const right = document.getElementById('sprite-right');
                    right.classList.remove('slide-out-right-fast');
                    right.classList.add('napsta-scale');
                    void right.offsetWidth;
                    right.classList.add('slide-in-right');
                },
                next: "picnic_napsta_2"
            },
            picnic_napsta_2: {
                text: "* escuché que era tu cumpleaños... te hice un sándwich fantasma de regalo... \n* pero me di cuenta de que no lo puedes comer...",
                spriteSans: "img/characters/toriel/toriel_smile.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/mus_home2.mp3", 
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift'); 
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                },
                next: "picnic_napsta_3"
            },
            picnic_napsta_3: {
                text: "* ah... espera... casi lo olvido...\n* también te traje mi nuevo mixtape...",
                spriteSans: "img/characters/toriel/toriel_smile.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/mus_home2.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift'); 
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                },
                next: "picnic_napsta_cd"
            },
            picnic_napsta_cd: {
                text: "* se llama 'spookwave'... es muy experimental... \n* ¿quieres escucharlo...?",
                spriteSans: "img/characters/toriel/toriel_smile.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/mus_home2.mp3", 
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift'); 
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                },
                options: [
                    { label: "Reproducir CD", next: "picnic_napsta_play" }
                ]
            },
            picnic_napsta_play: {
                text: "* (Reproduces el CD. Un zumbido fantasmal llena el aire...\n* De repente, los colores cambian y tu cabeza da vueltas).",
                spriteSans: "img/characters/toriel/toriel_sorpresa.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/mus_spooktune.mp3", 
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                    document.body.classList.add('nausea-effect');
                },
                next: "picnic_alucinacion_1"
            },
            picnic_alucinacion_1: {
                text: "* (Sientes que flotas en el cosmos...\n* Ves tus dibujos pasados volando a tu alrededor).",
                spriteSans: "img/characters/toriel/toriel_sorpresa.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/mus_spooktune.mp3", 
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift'); 
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                },
                next: "picnic_alucinacion_blanco"
            },
            
            picnic_alucinacion_blanco: {
                text: "* (De repente, el zumbido se detiene.\n* Los colores y las figuras universitarias desaparecen en un resplandor puro).",
                spriteSans: "img/characters/toriel/toriel_sorpresa.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                    
                    document.body.classList.add('vision-white-out');
                    document.getElementById('sprite-left').style.opacity = '0';
                    document.getElementById('sprite-right').style.opacity = '0';
                },
                next: "picnic_vision_dani"
            },
            picnic_vision_dani: {
                text: "* Karla... Te mereces toda la felicidad del mundo.",
                sprite: "", 
                music: "sounds/snd_no.wav", 
                voice: "sounds/snd_no.wav",
                onEnter: () => {
                    document.body.classList.remove('shake', 'nausea-effect'); 
                    document.body.style.filter = 'none'; 
                    document.body.classList.add('vision-white-out'); 
                    document.getElementById('sprite-left').style.display = 'none';
                    document.getElementById('sprite-right').style.display = 'none';
                },
                next: "picnic_vision_fade_back"
            },
            picnic_vision_fade_back: {
                text: "* (La imagen se desvanece suavemente.\n* Sientes que la realidad vuelve a su lugar, pero con un calor nuevo en tu corazón).",
                sprite: "img/characters/black.png", 
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.body.classList.remove('vision-white-out');
                    document.getElementById('sprite-left').style.display = 'block';
                    document.getElementById('sprite-right').style.display = 'block';
                    document.getElementById('sprite-left').style.opacity = '1';
                    document.getElementById('sprite-right').style.opacity = '1';
                },
                next: "picnic_alucinacion_2"
            },
            picnic_alucinacion_2: {
                text: "* oh... creo que le puse demasiado reverb a los bajos...\n* perdón...",
                spriteSans: "img/characters/toriel/toriel_sorpresa.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/mus_spooktune.mp3", 
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift'); 
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                },
                next: "picnic_toriel_salva"
            },
            picnic_toriel_salva: {
                text: "* ¡Por el Ángel! ¡Apaga eso, mi niña, te estás poniendo verde!",
                spriteSans: "img/characters/toriel/toriel_angry.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_toriel.wav",
                soundEffect: "sounds/snd_damage.wav", 
                soundDelay: 100,
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                    document.body.classList.remove('shake', 'nausea-effect');
                },
                next: "picnic_napsta_huye_2"
            },
            picnic_napsta_huye_2: {
                text: "* bueno... me voy a ir a sentir como basura al suelo...",
                spriteSans: "img/characters/toriel/toriel_normal.png", 
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift'); 
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                },
                next: "picnic_napsta_huye_3"
            },
            picnic_napsta_huye_3: {
                text: "* (Napstablook se desvanece lentamente en el aire).",
                spriteSans: "img/characters/toriel/toriel_happy.png",
                spritePapyrus: "img/characters/napstablook/napstablook.png",
                music: "sounds/snd_no.wav",
                voice: "sounds/snd_txt.wav",
                onEnter: () => { 
                    document.getElementById('sprite-left').classList.add('sans-shift');
                    document.getElementById('sprite-right').classList.add('napsta-scale');
                    document.getElementById('sprite-right').classList.add('slide-out-right-fast'); 
                },
                next: "picnic_fin_calma"
            },

            picnic_fin_calma: {
                text: "* Vaya... Las Ruinas nunca dejan de sorprender, ¿verdad?",
                sprite: "img/characters/toriel/toriel_smile.png", 
                music: "sounds/mus_undertale.mp3",
                voice: "sounds/snd_toriel.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    left.classList.remove('sans-shift');
                },
                next: "picnic_fin_reflexion_1" 
            },
            picnic_fin_reflexion_1: {
                text: "* Hemos visto cosas extrañas hoy, pero espero que este momento sea lo que más atesores.",
                sprite: "img/characters/toriel/toriel_normal.png", 
                music: "sounds/mus_undertale.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_fin_reflexion_2" 
            },
            picnic_fin_reflexion_2: {
                text: "* Dani preparó este mundo de píxeles porque sabe que a veces, el mundo real es demasiado ruidoso.",
                sprite: "img/characters/toriel/toriel_smile.png", 
                music: "sounds/mus_undertale.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_fin_reflexion_3" 
            },
            picnic_fin_reflexion_3: {
                text: "* Aquí, siempre tendrás un lugar donde las reglas son simples, la tarta es infinita y los monstruos te quieren.",
                sprite: "img/characters/toriel/toriel_happy.png", 
                music: "sounds/mus_undertale.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_fin_despedida" 
            },
            picnic_fin_despedida: {
                text: "* Tómate el tiempo que necesites. Cierra los ojos y respira, mi niña.\n* Que tengas el cumpleaños más maravilloso de todos.",
                sprite: "img/characters/toriel/toriel_smile.png", 
                music: "sounds/mus_undertale.mp3",
                voice: "sounds/snd_toriel.wav",
                next: "picnic_fin_pausa_larga" 
            },
            picnic_fin_pausa_larga: {
                text: "* (Te quedas un largo rato en silencio. Escuchas el viento suave de las Ruinas y sientes una inmensa paz).",
                sprite: "img/characters/black.png", 
                music: "sounds/mus_undertale.mp3",
                voice: "sounds/snd_txt.wav",
                onEnter: () => {
                    const left = document.getElementById('sprite-left');
                    left.classList.add('slide-out-left');
                },
                next: "trigger_birthday" 
            },
            
        
            trampa: {
                text: "* ¡SE VE QUE NO SABES CÓMO FUNCIONAN LAS COSAS AQUÍ!\n* ¡EN ESTE MUNDO ES MATAR O MORIR!",
                sprite: "img/characters/flowey/flowey_evil.png",
                music: "sounds/mus_tension.mp3",
                voice: "sounds/snd_flowey2.wav",
                onEnter: () => {
                    document.body.classList.add('shake');
                    const left = document.getElementById('sprite-left');
                    left.classList.add('white-flash');
                    const laugh = document.getElementById('laugh-sound');
                    laugh.currentTime = 0; laugh.play().catch(e => {});
                    const frames = ["img/characters/flowey/flowey_l1.png", "img/characters/flowey/flowey_l2.png"];
                    let frameIdx = 0;
                    customTimeout = setTimeout(() => startGameOverSequence(), 8000);
                    animationInterval = setInterval(() => {
                        left.src = frames[frameIdx];
                        frameIdx = (frameIdx + 1) % frames.length;
                        }, 150);
                    }
                },
                game_over_trigger: { onEnter: () => startGameOverSequence() },
            };

        const textBox = document.getElementById('text-box');
        const optionsContainer = document.getElementById('options-container');
        const spriteLeft = document.getElementById('sprite-left');
        const spriteRight = document.getElementById('sprite-right');
        const voiceSound = document.getElementById('voice-sound');
        const bgMusic = document.getElementById('bg-music');
        const sfxSound = document.getElementById('sfx-sound');
        const startOverlay = document.getElementById('game-start-overlay');
        const transOverlay = document.getElementById('transition-overlay');
        const snowOverlay = document.getElementById('snow-overlay');
        const nextIndicator = document.getElementById('next-indicator');
        const gameOverScreen = document.getElementById('game-over-screen');
        const gameOverHeart = document.getElementById('game-over-heart');
        const gameOverText = document.getElementById('game-over-text');
        const gameOverOptions = document.getElementById('game-over-options');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const birthdayScreen = document.getElementById('birthday-screen');
        const birthdayText = document.getElementById('birthday-text');
        const birthdayOptions = document.getElementById('birthday-options');

        startOverlay.addEventListener('click', () => {
            startOverlay.style.display = 'none';
            playDialogue('inicio');
        });

        document.getElementById('dialogue-container').addEventListener('click', () => {
            if (isTransitioning) return; 
            if (isTyping) {
                clearTimeout(typingTimeout);
                isTyping = false;
                voiceSound.pause();
                textBox.innerHTML = currentFullText.split('\n').join('<br>');
                if (activeCallback) activeCallback();
            } else if (currentNode && currentNode.next && !currentNode.options) {
                playDialogue(currentNode.next);
            }
        });

        function playDialogue(nodeId) {
            const node = storyNodes[nodeId];
            if (!node) return;
            currentNode = node;

            clearTimeout(typingTimeout); 
            clearTimeout(sfxTimeout);
            clearTimeout(customTimeout); 
            clearInterval(animationInterval); 
            clearInterval(spriteAnimLeftInterval);
            
            voiceSound.pause(); voiceSound.currentTime = 0;
            sfxSound.pause(); sfxSound.currentTime = 0;
            
            nextIndicator.style.display = 'none';
            
            spriteLeft.classList.remove('slide-out-left', 'slide-in-right', 'white-flash', 'move-left-right', 'move-up-down');
            spriteRight.classList.remove('slide-in-right', 'slide-out-right-fast', 'papyrus-exit');
            
            void spriteLeft.offsetWidth;
            void spriteRight.offsetWidth;

            if (!nodeId.includes('sans') && !nodeId.includes('papyrus') && !nodeId.includes('aparicion_papyrus') && !nodeId.includes('puzzle')) {
                spriteLeft.classList.remove('sans-shift');
                spriteLeft.style.transform = ''; 
            }

            if (nodeId.includes('snowdin') || nodeId.includes('sans') || nodeId.includes('papyrus') || nodeId.includes('puzzle')) {
                snowOverlay.style.display = 'block';
            } else {
                snowOverlay.style.display = 'none';
            }

            if (node.onEnter) node.onEnter();

            optionsContainer.innerHTML = '';
            textBox.innerHTML = '';

            if (node.spritePapyrus) {
                spriteRight.style.display = "block";
                spriteRight.src = node.spritePapyrus;
            } else {
                spriteRight.style.display = "none";
            }

            if (nodeId.includes('mtt_') || nodeId.includes('alphys_nuevo') || nodeId.includes('mtt_juego')) {
                spriteLeft.classList.add('mettaton-large');
            } else {
                spriteLeft.classList.remove('mettaton-large');
            }

            if (node.animSpritesLeft && node.animSpritesLeft.length > 0) {
                spriteLeft.style.display = "block";
                let currentFrame = 0;
                spriteLeft.src = node.animSpritesLeft[currentFrame];
                
                let speed = node.animSpeedLeft || 300;
                spriteAnimLeftInterval = setInterval(() => {
                    currentFrame = (currentFrame + 1) % node.animSpritesLeft.length;
                    spriteLeft.src = node.animSpritesLeft[currentFrame];
                }, speed);
            } else if (node.spriteSans) {
                spriteLeft.style.display = "block";
                spriteLeft.src = node.spriteSans;
            } else if (node.sprite) {
                spriteLeft.style.display = "block";
                spriteLeft.src = node.sprite;
            } else {
                spriteLeft.style.display = "none";
            }

            if (node.moveClassLeft) {
                spriteLeft.classList.add(node.moveClassLeft);
                if (node.moveDuration) {
                    spriteLeft.style.animationDuration = node.moveDuration;
                } else {
                    spriteLeft.style.animationDuration = ""; 
                }
            } else {
                spriteLeft.style.animationDuration = ""; 
            }
            
            updateMusic(node.music);
            if(node.voice) voiceSound.src = node.voice;

            if (node.soundEffect) {
                const delay = node.soundDelay || 0;
                sfxTimeout = setTimeout(() => {
                    sfxSound.src = node.soundEffect;
                    sfxSound.play().catch(e => {});
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

        function showOptions(options, container, isOverlay = false) {
            if(!options) return;
            container.innerHTML = '';
            options.forEach(opt => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.innerText = opt.label;
                if(isOverlay) button.style.margin = "0 auto";
                button.onclick = (e) => {
                    e.stopPropagation();
                    if (isTransitioning) return; 
                    container.innerHTML = ''; 
                
                    if (isOverlay) {
                        gameOverScreen.style.display = 'none';
                        birthdayScreen.style.display = 'none'; 
                        gameOverHeart.classList.remove('heart-break', 'heart-vibrate');
                        gameOverText.classList.remove('fade-in'); 
                        birthdayText.classList.remove('fade-in');
                        document.getElementById('dialogue-container').style.display = 'block'; 
                    }

                    if (opt.transition) {
                        triggerWhiteTransition(opt.next);
                    } else if (!isTyping) {
                        playDialogue(opt.next);
                    }
                };
                container.appendChild(button);
            });
        }

        function triggerWhiteTransition(nextNode) {
            if (isTransitioning) return;
            isTransitioning = true;
            transOverlay.classList.remove('no-transition');
            transOverlay.style.transform = "translateX(0)"; 
            
            setTimeout(() => {
                playDialogue(nextNode); 
                setTimeout(() => { 
                    transOverlay.style.transform = "translateX(100%)"; 
                    
                    setTimeout(() => {
                        transOverlay.classList.add('no-transition');
                        transOverlay.style.transform = "translateX(-100%)"; 
                        

                        setTimeout(() => {
                            isTransitioning = false;
                        }, 50);
                    }, 1500);
                    
                }, 300);
            }, 1500); 
        }
    
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.log(`Error al intentar iniciar pantalla completa: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });

        function startGameOverSequence() {
            clearTimeout(typingTimeout);
            clearTimeout(sfxTimeout);
            clearTimeout(customTimeout);
            clearInterval(animationInterval); 

            gameOverScreen.style.display = 'flex';
            gameOverOptions.innerHTML = ''; 
            gameOverText.style.opacity = "0";
            gameOverText.classList.remove('fade-in');
            gameOverHeart.style.opacity = "1";
            gameOverHeart.style.filter = "brightness(1)";
            gameOverHeart.style.transform = "scale(1)";
            gameOverHeart.classList.remove('heart-vibrate', 'heart-break'); 
            
            document.getElementById('laugh-sound').pause();
            document.body.classList.remove('shake');
            spriteLeft.classList.remove('white-flash', 'sans-shift');
            spriteRight.classList.remove('slide-in-right', 'slide-out-right-fast', 'papyrus-exit');
            bgMusic.pause();
            
            document.getElementById('soul-appear-sound').play().catch(e => {});
            gameOverHeart.classList.add('heart-vibrate');

            customTimeout = setTimeout(() => {
                gameOverHeart.classList.remove('heart-vibrate');
                gameOverHeart.classList.add('heart-break');
                document.getElementById('break-sound').play().catch(e => {});

                customTimeout = setTimeout(() => {
                    gameOverText.classList.add('fade-in');
                    updateMusic("sounds/mus_gameover.mp3");
                    showOptions([{ label: "REINTENTAR", next: "inicio" }], gameOverOptions, true);
                }, 2000); 
            }, 1000);
        }

        function startBirthdaySequence() {
            clearTimeout(typingTimeout);
            clearTimeout(sfxTimeout);
            clearInterval(animationInterval); 

            birthdayScreen.style.display = 'flex';
            birthdayOptions.innerHTML = ''; 
            birthdayText.style.opacity = "0";
            birthdayText.classList.remove('fade-in');
            document.getElementById('dialogue-container').style.display = 'none';

            customTimeout = setTimeout(() => {
                birthdayText.classList.add('fade-in');
                showOptions([{ label: "VOLVER A EMPEZAR", next: "inicio", transition: true }], birthdayOptions, true);
            }, 1500); 
        }