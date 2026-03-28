document.addEventListener("DOMContentLoaded", () => {
    
    const contenidoAnimado = document.getElementById("contenido-animado");
    const botonVolver = document.getElementById("boton-volver");
    const musicaCreditos = document.getElementById("musica-creditos"); 
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

});