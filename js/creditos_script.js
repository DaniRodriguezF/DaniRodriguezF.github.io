document.addEventListener("DOMContentLoaded", () => {
    
    const contenidoAnimado = document.getElementById("contenido-animado");
    const botonVolver = document.getElementById("boton-volver");
    const musicaCreditos = document.getElementById("musica-creditos"); 
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    musicaCreditos.play().catch(error => {
        console.log("El navegador bloqueó el autoplay temporalmente:", error);
    });

    contenidoAnimado.addEventListener("animationend", () => {
        console.log("La animación de los créditos ha finalizado.");
        botonVolver.classList.add("mostrar-boton");
    });

    botonVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });

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

});