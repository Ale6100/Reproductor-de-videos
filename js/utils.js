"use strict";

const mezclar = (array) => { // Recibe un array y lo devuelve mezclado
    if (typeof array == "number" || typeof array == "string") throw new Error('mezclar debe recibir un array')
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
    localStorage.setItem("listaVideos", JSON.stringify(arrayMezclado))
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

// Recibe tres números. El tercero debe ser positivo. Devuelve un array de números desde el origen hasta el final (sin incluir) solicitado, considerando un espaciado entre valores consecutivos
// Si no se pide el espaciado se sobreentiende que es de 1
const arange = (origen, final, espaciado = 1) => {
    if (origen !== parseFloat(origen) || final !== parseFloat(final)) throw new Error('arange debe recibir números')
    if (espaciado !== parseFloat(espaciado) || espaciado <= 0) throw new Error('El tercer parámetro de arange debe ser un número mayor a cero')
    const array = []
    for (let i=origen; i<final; i+=espaciado) {
        array.push(i)
    }
    return array
}

const cambiarIconoVolumen = (volumenActual, botonVolumen) => { // Coloca el ícono de volumen según corresponda
    if (volumenActual === 0) { // Si tenía volumen mayor a cero, lo colocamos en mute
        botonVolumen.src = "https://img.icons8.com/ios-glyphs/30/000000/mute--v1.png"
    } else { // Sino, lo volvemos a como estaba antes
        if (volumenActual < 0.33) {
            botonVolumen.src = "https://img.icons8.com/ios-glyphs/30/null/low-volume.png"
        } else if (volumenActual < 0.66) {
            botonVolumen.src = "https://img.icons8.com/ios-glyphs/30/000000/medium-volume.png"
        } else {
            botonVolumen.src = "https://img.icons8.com/ios-glyphs/30/null/high-volume--v1.png"
        }
    }
}

const redondear = (n) => { // Recibe un número y lo devuelve redondeado a dos decimales. Fuente: https://www.delftstack.com/es/howto/javascript/javascript-round-to-2-decimal-places/#uso-de-la-funci%C3%B3n-personalizada-para-redondear-un-n%C3%BAmero-a-2-decimales-en-javascript
    if (n != parseFloat(n)) throw new Error('redondear debe recibir un número')
    return +(Math.round(n + "e+2") + "e-2")
};

export {
    mezclar,
    actualizarLista,
    conversion,
    arange,
    cambiarIconoVolumen,
    redondear
}
