"use strict";

const mezclar = (array) => { // Recibe un array y lo devuelve mezclado
    const arrayMezclado = []
    array.forEach(() => {
        while (true) {
            const elemetoAlAzar = array[parseInt(array.length*Math.random())] // Elemento al azar del array
            if (arrayMezclado.includes(elemetoAlAzar) === false) { // Si el elemento no está en el nuevo array entonces lo agrega, se deja de repetir el while, y se ejecuta de nuevo el for
                arrayMezclado.push(elemetoAlAzar)
                break
            }
        }
    })
    return arrayMezclado
}

// Array con los nombres de los videos junto con su extensión
const videos = ["Abba - Dancing Queen.mp4", "ACDC - Thunderstruck.mp4", "Arbol - El fantasma.mp4", "Arbol - Trenes camiones y tractores.mp4", "Calle 13 - Latinoamérica.mkv", "Coldplay - Adventure Of A Lifetime.mp4", "Coldplay - Paradise.mp4", "Evanescense - Bring Me To Life.mp4", "Intoxicados - Nunca quise.mp4", "La Franela - Hacer un puente.mp4", "León Gieco - Bandidos Rurales.mp4", "Los Autenticos decadentes - Un osito de peluche de Taiwan.mp4", "Mark Ronson Ft Bruno Mars - Uptown Funk.mp4", "Maroon 5 - Girls Like You ft Cardi B.mp4", "Michael Jackson - Beat It.mp4", "Rascal Flatts - Life Is A Highway From Cars.mp4", "Skillet -  Monster.mp4", "Skillet - Hero.mp4", "Soda Stereo - De Música Ligera.mp4", "Soda Stereo - Persiana Americana.mp4", "System of a down - Chop suey.mp4", "The Call - Regina Spektor.mp4", "The Kid LAROI Justin Bieber - STAY.mp4", "ZAZ - Je veux.mp4", "Taylor Swift - Crazier.mp4"]

let videosMezclados = mezclar(videos) // Orden de videos mezclados

const velocidades = [0.5, 1, 2]; // Velocidades disponibles
let speed = velocidades.indexOf(1); // Indice donde está ubicada la velocidad 1

let videoActual = 0; // Indice del video que se va a reproducir

const vid = document.querySelector("video");

const botonPlay = document.querySelector(".play")
const botonVolumen = document.querySelector(".volumen")
const botonAnterior = document.querySelector(".anterior")
const botonSiguiente = document.querySelector(".siguiente")
const botonReiniciar = document.querySelector(".reiniciar")
const botonAleatorio = document.querySelector(".aleatorio")
const botonMezclar = document.querySelector(".mezclar")
const botonReducir = document.querySelector(".reducir")
const botonEstado = document.querySelector(".estado")
const botonVelocidad = document.querySelector(".velocidad")

const sectionVideo = document.querySelector(".contenedor-video")
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

const cambiar = (destino) => { // Reproduce el siguiente video de la lista, el anterior, o uno aleatorio
    if (destino === "siguiente") {
        videoActual = (videoActual === videosMezclados.length-1) ? 0 : videoActual+1 // Si el video actual es el último y le pedimos que vaya al siguiente video, entonces vuelve a empezar
    } else if (destino === "anterior") {
        videoActual = (videoActual === 0) ? videosMezclados.length-1 : videoActual-1
    } else {
        while (true) { // Reproduce un video aleatorio
            const videoAleatorio = parseInt(videosMezclados.length*Math.random())
            if (videoActual !== videoAleatorio) { // Verifica que el video aleatorio no sea igual al actual, para que no se repita
                videoActual = videoAleatorio
                break
            } 
        }
    }
    vid.src = `videos/${videosMezclados[videoActual]}`
    vid.play()
}

const reiniciar = () => { // Hago que se reinicie un video (va al segundo 0)
    vid.currentTime = 0
}

const reducir = () => { // Reduce o agranda el tamaño del video
    if (sectionVideo.style.transform == "scale(0.5)") { // Si el video está al 50% de su tamaño, lo agranda
        sectionVideo.style.transform = "scale(1)"
        botonReducir.src = "https://img.icons8.com/ios-glyphs/30/000000/collapse.png"
    } else {
        sectionVideo.style.transform = "scale(0.5)"
        botonReducir.src="https://img.icons8.com/material-outlined/24/000000/full-page-view.png"
    }
}

const conversion = (segundos) => { // Convierte segundos en formato "horas:minutos:segundos"
    let minutos = parseInt(segundos/60)
    let horas = parseInt(segundos/3600)
    segundos = parseInt((segundos/60 - minutos)*60) // Para obtener los segundos entre 0 y 60. Por ejemplo si segundos = 90, entonces parseInt((1.5 - 1)*60) = 30. Los 60 segundos faltantes se convirtieron previamente en un minuto
    if (segundos <= 9) segundos = "0"+parseInt(segundos)
    if (minutos <= 9) minutos = "0"+minutos    
    if (horas == 0) horas = "0"+horas
    return isNaN(segundos) ? `00:00:00` : `${horas}:${minutos}:${segundos}`
}

const actualizar = () => { // Actualiza la barra roja "cargando" y el texto que representa al tiempo actual del video
    const tiempoActual = vid.currentTime
    const tiempoTotal = vid.duration
    botonEstado.innerHTML = `${conversion(tiempoActual)} / ${conversion(tiempoTotal)}`
    const porcentajeActual = tiempoActual*100/tiempoTotal
    barraCargando.style.width = `${porcentajeActual}%`
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
        cambiar("aleatorio")
    })
    botonReducir.addEventListener("click", reducir)
    barraGris.addEventListener("click", buscar)
    botonVelocidad.addEventListener("click", velocidad)
    vid.addEventListener("loadeddata", actualizar) // Se actualiza cuando carga el video
    vid.addEventListener("timeupdate", actualizar) // Se actualiza cada vez que se actualiza el tiempo
    vid.addEventListener("ended", () => cambiar("siguiente"))
}

window.addEventListener("load", iniciar) // Ejecuta "inicio" cuando hayan cargado todos los datos
