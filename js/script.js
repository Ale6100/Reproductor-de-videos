"use strict";

import { mezclar, actualizarLista, conversion, arange, cambiarIconoVolumen, redondear} from "./utils.js"

// Array con los nombres de los videos junto con su extensión
const videos = ["Abba - Dancing Queen.mp4", "ACDC - Thunderstruck.mp4", "Arbol - El fantasma.mp4", "Arbol - Trenes camiones y tractores.mp4", "Calle 13 - Latinoamérica.mkv", "Coldplay - Adventure Of A Lifetime.mp4", "Coldplay - Paradise.mp4", "Evanescense - Bring Me To Life.mp4", "Intoxicados - Nunca quise.mp4", "La Franela - Hacer un puente.mp4", "León Gieco - Bandidos Rurales.mp4", "Los Autenticos decadentes - Un osito de peluche de Taiwan.mp4", "Mark Ronson Ft Bruno Mars - Uptown Funk.mp4", "Maroon 5 - Girls Like You ft Cardi B.mp4", "Michael Jackson - Beat It.mp4", "Rascal Flatts - Life Is A Highway From Cars.mp4", "Skillet -  Monster.mp4", "Skillet - Hero.mp4", "Soda Stereo - De Música Ligera.mp4", "Soda Stereo - Persiana Americana.mp4", "System of a down - Chop suey.mp4", "The Call - Regina Spektor.mp4", "The Kid LAROI Justin Bieber - STAY.mp4", "ZAZ - Je veux.mp4", "Taylor Swift - Crazier.mp4", "Pharrell Williams - Happy.mp4"]

let videosMezclados // Orden de videos mezclados
if (localStorage.getItem("listaVideos")) { // En caso de que ya exista una lista en el localStorage, la toma
    videosMezclados = JSON.parse(localStorage.getItem("listaVideos"))
} else {
    videosMezclados = mezclar(videos)
}

let videoActual = 0; // Indice del video que se va a reproducir
if (localStorage.getItem("videoActual")) {
    videoActual = JSON.parse(localStorage.getItem("videoActual"))
}

const velocidades = arange(0.5, 2.5, 0.5) // Velocidades disponibles (es necesario que el rango del array sea siempre positivo y contenga al 1)

let indiceVelAct = velocidades.indexOf(1) // Indice donde está ubicada la velocidad inicial
if (localStorage.getItem("velActual")) { // Si está guardada en el localStorage, la tomo de ahí
    indiceVelAct = velocidades.indexOf(JSON.parse(localStorage.getItem("velActual")))
}

let volumenActual = 0.5
if (localStorage.getItem("volActual")) { // Si está guardada en el localStorage, la tomo de ahí
    volumenActual = JSON.parse(localStorage.getItem("volActual"))
}

const vid = document.querySelector("video");
const botonPlay = document.querySelector(".play")
const botonVolumen = document.querySelector(".volumen")
const botonAnterior = document.querySelector(".anterior")
const botonSiguiente = document.querySelector(".siguiente")
const botonReiniciar = document.querySelector(".reiniciar")
const botonAleatorio = document.querySelector(".aleatorio")
const botonMezclar = document.querySelector(".mezclar")
const botonEstado = document.querySelector(".estado")
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
    localStorage.setItem("videoActual", videoActual) // Guarda el número del video actual en el localstorage

    actualizarLista(videosMezclados, videoActual, cambiar)

    if (vid.paused && terminoSolo==false) { // Para que sólo se reproduza si no estaba pausado
        vid.src = `videos/${videosMezclados[videoActual]}`
    } else {
        vid.src = `videos/${videosMezclados[videoActual]}`
        vid.play()
    }
    vid.playbackRate = velocidades[indiceVelAct]; // Para que la velocidad no cambie aunque cambiemos de video
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

const actualizarSegunNumero = (num) => { // Si se presiona el número num, va al num*10% del video
    vid.currentTime = vid.duration*parseInt(num*10)/100
}

const actualizarSegunFlechasHorizontales = (flecha) => { // Avanza o retrocede 5 segundos según cual flecha horizontal presionaste
    vid.currentTime = flecha === "arrowleft" ? vid.currentTime - 5 : vid.currentTime + 5
}

const actualizarVolumenSegunFlechasVerticales = (flecha) => { // Hay un error en el volumen, tengo pendiente arreglarlo
    if (flecha === "arrowup") {
        if (0 <= vid.volume && vid.volume <= 0.95) {
            vid.volume += 0.05
            vid.volume = redondear(vid.volume)
        } else if (0.95 < vid.volume && vid.volume <= 1) {
            vid.volume = 1
        }
    } else if (flecha === "arrowdown") {
        if (0.05 <= vid.volume && vid.volume <= 1) {
            vid.volume -= 0.05
            vid.volume = redondear(vid.volume)
        } else if (0 <= vid.volume && vid.volume < 0.05) {
            vid.volume = 0
        }
    }
    
    if (vid.volume > 0) volumenGuardado = ""
    volumenActual = vid.volume
    cambiarIconoVolumen(volumenActual, botonVolumen)
    if (document.querySelector(".pRangoVolumen")) {
        const texto = `Volumen: ${Math.round(vid.volume*100)}`
        document.querySelector(".pRangoVolumen").innerText = texto
        document.getElementById("progresoVolumen").value = `${vid.volume*100}`
    }
}

const iniciar = () => {
    cambiarIconoVolumen(volumenActual, botonVolumen)
    vid.src = `./videos/${videosMezclados[videoActual]}`;
    vid.playbackRate = velocidades[indiceVelAct];
    vid.volume = volumenActual
    vid.addEventListener("click", play)
    botonPlay.addEventListener("click", play)
    botonAnterior.addEventListener("click", () => cambiar("anterior"))
    botonSiguiente.addEventListener("click", () => cambiar("siguiente"))
    botonReiniciar.addEventListener("click", reiniciar)
    botonAleatorio.addEventListener("click", () => cambiar("aleatorio"))
    botonMezclar.addEventListener("click", () => { // Mezcla el orden y reproduce un video aleatorio
        videosMezclados = mezclar(videos)
        cambiar("primero")
    })
    barraGris.addEventListener("click", buscar)
    vid.addEventListener("loadeddata", actualizar) // Se actualiza cuando carga el video
    vid.addEventListener("timeupdate", actualizar) // Se actualiza cada vez que se actualiza el tiempo
    vid.addEventListener("ended", () => cambiar("siguiente", true))
    document.body.addEventListener("keydown", (e) => {
        const tecla = e.key.toLowerCase()
        if (tecla === " " || tecla === "k") {
            play()
        } else if (e.key === "P") {
            cambiar("anterior")
        } else if (e.key === "N") {
            cambiar("siguiente")
        } else if (tecla === "r") {
            reiniciar()
        } else if (tecla === "a") {
            cambiar("aleatorio")
        } else if (tecla === "m") {
            mute()
        } else if (tecla === "arrowup" || tecla === "arrowdown") {
            actualizarVolumenSegunFlechasVerticales(tecla)
        } else if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(num => num == tecla)) {
            actualizarSegunNumero(tecla)
        } else if (tecla === "arrowleft" || tecla === "arrowright") {
            actualizarSegunFlechasHorizontales(tecla)
        }
    })
}

let volumenGuardado = ""
const mute = () => {
    if (vid.volume !== 0) { // Si tenía volumen mayor a cero, lo colocamos en mute
        volumenGuardado = vid.volume // Guardamos el volumen para utilizarlo más adelante
        vid.volume = 0
    } else { // Sino, lo volvemos a como estaba antes
        vid.volume = volumenGuardado
        volumenGuardado = "" // Que sea un string vacío significa que ya no está en mute
    }
    volumenActual = vid.volume
    cambiarIconoVolumen(volumenActual, botonVolumen)
    localStorage.setItem("volActual", vid.volume)
    const rangeVolumen = document.getElementById("progresoVolumen")
    
    if (rangeVolumen !== null) { // Modificamos el input range sólo i está visible  
        rangeVolumen.value = vid.volume*100
        document.querySelector(".pRangoVolumen").innerText = `Volumen: ${volumenGuardado == "" ? Math.round(volumenActual*100) : 0}`
    }
}

window.addEventListener("load", iniciar) // Ejecuta "inicio" cuando hayan cargado todos los datos

const botonesTippy = [ // Array con los nombres de las clases de los botones junto con el contenido de sus tooltips
    {
        class: "play",
        content: "Reproducir/parar (k)"
    },
    {
        class: "anterior",
        content: "Anterior (P)"
    },
    {
        class: "siguiente",
        content: "Siguiente (N)"
    },
    {
        class: "reiniciar",
        content: "Reiniciar (r)"
    },
    {
        class: "aleatorio",
        content: "Video aleatorio (a)"
    },
    {
        class: "mezclar",
        content: "Mezclar lista"
    },
    {
        class: "volumen",
        content: `<p class='pRangoVolumen'>Volumen ${ volumenGuardado == "" ? Math.round(volumenActual*100) : 0 }</p><input type='range' id='progresoVolumen' min='0' max='100' step='1' value='${volumenGuardado == "" ? volumenActual*100 : 0}'>`
    },
    {
        class: "velocidad",
        content: `<p class="pRangoVelocidad">Velocidad x${velocidades[indiceVelAct]}</p><input type='range' id='progresoVelocidad' min='${velocidades[0]}' max='${velocidades.at(-1)}' step='${velocidades[1] - velocidades[0]}' value='${velocidades[indiceVelAct]}'>`
    },
    {
        class: "estado",
        content: "Tiempo"
    },
    {
        class: "reducir",
        content: "Agrandar/achicar video"
    }
]

botonesTippy.forEach(element => { // No son necesarias tantas propiedades, pero las coloco para probarlas ya que son nuevas para mí
    tippy(`.${element.class}`, {
        content: `${element.content}`,
        allowHTML: true,
        placement: 'top',
        arrow: true,
        animation: 'fade',
        interactive: true,
        delay: 0,
        followCursor: false,
        hideOnClick: false,
        interactiveBorder: 2,
        interactiveDebounce: 0,
        maxWidth: 350,
        moveTransition: '',
        offset: [0, 10],
        onShow(instance) {
            setTimeout(() => { // Dejo que espere un poco antes de llamar a la etiqueta
                try { // Le agrega un evento al input range para poder cambiar el volumen de 0 a 100. El try está porque la etiqueta con id "progresoVolumen" sólo está definida cuando pasamos el mouse sobre el icono de volumen 
                    const rangeVolumen = document.getElementById("progresoVolumen")
                    document.querySelector(".pRangoVolumen").innerText = `Volumen: ${volumenGuardado == "" ? Math.round(volumenActual*100) : 0}`
                    rangeVolumen.value = `${volumenGuardado == "" ? volumenActual*100 : 0}`
                    rangeVolumen.addEventListener("input", () => {
                        vid.volume = rangeVolumen.value/100
                        if (vid.volume !== 0) volumenGuardado = ""
                        volumenActual = vid.volume
                        cambiarIconoVolumen(volumenActual, botonVolumen)
                        document.querySelector(".pRangoVolumen").innerText = `Volumen: ${Math.round(vid.volume*100)}`
                        localStorage.setItem("volActual", vid.volume)
                    })
                } catch(error) {}
            }, 0); 

            setTimeout(() => {
                try { // Le agrega un evento al input range para poder cambiar el la velocidad entre los valores indicados por el array "velocidades" 
                    const rangeVelocidad = document.getElementById("progresoVelocidad")
                    rangeVelocidad.addEventListener("input", () => {
                        vid.playbackRate = rangeVelocidad.value
                        document.querySelector(".pRangoVelocidad").innerText = `Velocidad x${vid.playbackRate}`
                        indiceVelAct = velocidades.indexOf(vid.playbackRate)
                        localStorage.setItem("velActual", vid.playbackRate)
                    })
                } catch(error) {}
            }, 0); 
        },
        showOnCreate: false,
        trigger: 'mouseenter',
    });
})
