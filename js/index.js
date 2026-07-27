//Carrusel
const slides = document.querySelectorAll(".slideBannerKumo");
const indicadores = document.querySelectorAll(".indicadorBanner");

const botonAnterior =
document.querySelector(".botonAnteriorBanner");

const botonSiguiente =
document.querySelector(".botonSiguienteBanner");

let indiceActual = 0;
let intervaloCarrusel;

//Slide
function mostrarSlide(indice){
    slides.forEach((slide)=>{

        slide.classList.remove("activo");
    });

    indicadores.forEach((indicador)=>{
        indicador.classList.remove("activo");
    });

    slides[indice].classList.add("activo");
    indicadores[indice].classList.add("activo");

    indiceActual = indice;
}

//Siguiente
function siguienteSlide(){
    indiceActual++;
    if(indiceActual >= slides.length){
        indiceActual = 0;
    }

    mostrarSlide(indiceActual);
}

//Anterior
function anteriorSlide(){
    indiceActual--;
    if(indiceActual < 0){
        indiceActual = slides.length - 1;
    }
    mostrarSlide(indiceActual);
}

// Reiniciar
function reiniciarCarrusel(){
    clearInterval(intervaloCarrusel);
    intervaloCarrusel = setInterval(()=>{
        siguienteSlide();
    },5000);
}

//Evento botones
botonSiguiente.addEventListener("click",()=>{
    siguienteSlide();
    reiniciarCarrusel();
});

botonAnterior.addEventListener("click",()=>{
    anteriorSlide();
    reiniciarCarrusel();
});

//Indicadores
indicadores.forEach((indicador,indice)=>{
    indicador.addEventListener("click",()=>{
        mostrarSlide(indice);
        reiniciarCarrusel();
    });
});

//Inicio
mostrarSlide(0);
intervaloCarrusel = setInterval(()=>{
    siguienteSlide();
},5000);