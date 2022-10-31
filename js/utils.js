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

const actualizarLista = (listaVideos, videoActual, cambiar) => { // Actualiza el orden de la lista en el HTML y le agrega un evento a todos los p
    const listahtml = document.querySelector(".contenedor-lista")
    listahtml.innerHTML = ""
    listaVideos.forEach((nombre, index) => {
        nombre = nombre.split(".")[0]
        if (index === videoActual) {
            listahtml.innerHTML += `
            <div>
                <p class="negrita">${index+1}) ${nombre}</p>
            </div>
            `
        } else {
            listahtml.innerHTML += `
            <div>
                <p>${index+1}) ${nombre}</p>
            </div>
            `
        }
    })

    listaVideos.forEach((nombre, index) => {
        const divHijo = listahtml.children[index]
        divHijo.addEventListener("click", () => {
            cambiar(index) // Hago que todos los p puedan cambiar la cancion con un click
        })
    })
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

const botonesTippy = [ // Array con los nombres de las clases de los botones junto con el contenido de sus tooltips
    {
        class: "play",
        content: "Reproducir/parar"
    },
    {
        class: "anterior",
        content: "Anterior"
    },
    {
        class: "siguiente",
        content: "Siguiente"
    },
    {
        class: "reiniciar",
        content: "Reiniciar"
    },
    {
        class: "aleatorio",
        content: "Video aleatorio"
    },
    {
        class: "mezclar",
        content: "Mezclar lista"
    },
    {
        class: "volumen",
        content: "Mute ON/OFF (en un futuro será gradual)"
    },
    {
        class: "velocidad",
        content: `Cambiar velocidad`
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

export {
    mezclar,
    actualizarLista,
    conversion,
    botonesTippy
}
