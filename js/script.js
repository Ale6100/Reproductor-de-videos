"use strict";

import { mezclar, actualizarLista, conversion, botonesTippy } from "./utils.js"

// Array con los nombres de los videos junto con su extensión
const videos = ["Abba - Dancing Queen.mp4", "ACDC - Thunderstruck.mp4", "Arbol - El fantasma.mp4", "Arbol - Trenes camiones y tractores.mp4", "Calle 13 - Latinoamérica.mkv", "Coldplay - Adventure Of A Lifetime.mp4", "Coldplay - Paradise.mp4", "Evanescense - Bring Me To Life.mp4", "Intoxicados - Nunca quise.mp4", "La Franela - Hacer un puente.mp4", "León Gieco - Bandidos Rurales.mp4", "Los Autenticos decadentes - Un osito de peluche de Taiwan.mp4", "Mark Ronson Ft Bruno Mars - Uptown Funk.mp4", "Maroon 5 - Girls Like You ft Cardi B.mp4", "Michael Jackson - Beat It.mp4", "Rascal Flatts - Life Is A Highway From Cars.mp4", "Skillet -  Monster.mp4", "Skillet - Hero.mp4", "Soda Stereo - De Música Ligera.mp4", "Soda Stereo - Persiana Americana.mp4", "System of a down - Chop suey.mp4", "The Call - Regina Spektor.mp4", "The Kid LAROI Justin Bieber - STAY.mp4", "ZAZ - Je veux.mp4", "Taylor Swift - Crazier.mp4", "Pharrell Williams - Happy.mp4"]

let videosMezclados = mezclar(videos) // Orden de videos mezclados

let videoActual = 0; // Indice del video que se va a reproducir

const velocidades = [0.5, 1, 2]; // Velocidades disponibles
let speed = velocidades.indexOf(1); // Indice donde está ubicada la velocidad 1

const vid = document.querySelector("video");

const botonPlay = document.querySelector(".play")
const botonVolumen = document.querySelector(".volumen")
const botonAnterior = document.querySelector(".anterior")
const botonSiguiente = document.querySelector(".siguiente")
const botonReiniciar = document.querySelector(".reiniciar")
const botonAleatorio = document.querySelector(".aleatorio")
const botonMezclar = document.querySelector(".mezclar")
const botonEstado = document.querySelector(".estado")
const botonVelocidad = document.querySelector(".velocidad")

const barraGris = document.querySelector(".barraGris")
const barraCargando = document.querySelector(".barraCargando")

const play = () => { // Reproducir o parar el video
    if (vid.paused) {
        vid.play()
        botonPlay.src = "https://img.icons8.com/ios-glyphs/30/000000/pause--v1.png"
    } else {
        vid.pause()
        botonPlay.src = "https://img.icons8.com/ios-glyphs/30/000000/play--v1.png"
    }
}

const volumen = () => { // Colocar mute o desmutear
    vid.volume = (vid.volume == 1) ? 0 : 1 // Si era 1 pasa a 0, si era 0 pasa a 1
    botonVolumen.src = (vid.volume == 1) ? "https://img.icons8.com/ios-glyphs/30/000000/medium-volume.png" : "https://img.icons8.com/ios-glyphs/30/000000/mute--v1.png"
}

const cambiar = (destino, terminoSolo=false) => { // Reproduce el siguiente video de la lista, el anterior, o uno aleatorio
    if (destino === "siguiente") {
        videoActual = (videoActual === videosMezclados.length-1) ? 0 : videoActual+1 // Si el video actual es el último y le pedimos que vaya al siguiente video, entonces vuelve a empezar
    } else if (destino === "anterior") {
        videoActual = (videoActual === 0) ? videosMezclados.length-1 : videoActual-1
    } else if (destino === "aleatorio") {
        while (true) { // Reproduce un video aleatorio
            const videoAleatorio = parseInt(videosMezclados.length*Math.random())
            if (videoActual !== videoAleatorio) { // Verifica que el video aleatorio no sea igual al actual, para que no se repita
                videoActual = videoAleatorio
                break
            } 
        }
    } else if (destino === "primero") {
        videoActual = 0
        
    } else if (!isNaN(parseInt(destino))) { // Si destino es un número, entonces lo considero como un índice
        videoActual = destino        
    }

    actualizarLista(videosMezclados, videoActual, cambiar)

    if (vid.paused && terminoSolo==false) { // Para que sólo se reproduza si no estaba pausado
        vid.src = `videos/${videosMezclados[videoActual]}`
    } else {
        vid.src = `videos/${videosMezclados[videoActual]}`
        vid.play()
    }
    vid.playbackRate = velocidades[speed]; // Para que la velocidad no cambie aunque cambiemos de video
}

actualizarLista(videosMezclados, videoActual, cambiar)

const reiniciar = () => { // Hago que se reinicie un video (va al segundo 0)
    vid.currentTime = 0
}

const actualizar = () => { // Actualiza la barra roja "cargando" y el texto que representa al tiempo actual del video
    const tiempoActual = vid.currentTime
    const tiempoTotal = vid.duration
    botonEstado.innerHTML = `<p>${conversion(tiempoActual)} / ${conversion(tiempoTotal)}</p>`
    barraCargando.style.width = `${tiempoActual*100/tiempoTotal}%` // Porcentaje actual
}

const buscar = (e) => { // Adelanta o retrocede el video cuando apretamos en la barra de tiempo
    const ubicacionDelClick = e.offsetX; // Ubicación en x relativa al borde izquierdo de la barra gris
    const anchoBarraGris = barraGris.offsetWidth;
    const porcentajeUbicacionClick = ubicacionDelClick*100/anchoBarraGris
    vid.currentTime = vid.duration*porcentajeUbicacionClick/100 // Pido que el tiempo cambie a la ubicación pedida, según el porcentaje calculado
}

const velocidad = () => { // Cambia la velocidad de reproducción
    speed = (speed === velocidades.length-1) ? 0 : speed+1;
    vid.playbackRate = velocidades[speed];
}

const iniciar = () => {
    vid.src = `./videos/${videosMezclados[videoActual]}`;
    vid.addEventListener("click", play)
    botonPlay.addEventListener("click", play)
    botonVolumen.addEventListener("click", volumen)
    botonAnterior.addEventListener("click", () => cambiar("anterior"))
    botonSiguiente.addEventListener("click", () => cambiar("siguiente"))
    botonReiniciar.addEventListener("click", reiniciar)
    botonAleatorio.addEventListener("click", () => cambiar("aleatorio"))
    botonMezclar.addEventListener("click", () => { // Mezcla el orden y reproduce un video aleatorio
        videosMezclados = mezclar(videos)
        cambiar("primero")
    })
    barraGris.addEventListener("click", buscar)
    botonVelocidad.addEventListener("click", velocidad)
    vid.addEventListener("loadeddata", actualizar) // Se actualiza cuando carga el video
    vid.addEventListener("timeupdate", actualizar) // Se actualiza cada vez que se actualiza el tiempo
    vid.addEventListener("ended", () => cambiar("siguiente", true))
}

window.addEventListener("load", iniciar) // Ejecuta "inicio" cuando hayan cargado todos los datos

botonesTippy.forEach(element => { // No son necesarias tantas propiedades, pero las coloco para probarlas ya que son nuevas para mí
    tippy(`.${element.class}`, {
        content: `${element.content}`,
        placement: 'top',
        arrow: true,
        animation: 'fade',
        // trigger: 'click',
        interactive: false,
        allowHTML: false,
        delay: 0,
        followCursor: false,
        hideOnClick: false,
        interactiveBorder: 2,
        interactiveDebounce: 0,
        maxWidth: 350,
        moveTransition: '',
        offset: [0, 10],
        onShow(instance) {},
        showOnCreate: false,
        touch: ['hold', 500],
        trigger: 'mouseenter focus',
    });
})
