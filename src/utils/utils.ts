import { arraysIgualesOrdenIndistinto } from "./adHoc.js"

// Recibe tres números. El tercero es opcional pero debe ser positivo. Devuelve un array de números equiespaciados desde el origen hasta el final (sin incluir) solicitado, considerando el espaciado especificado
const arange = (origen: number, final: number, espaciado: number = 1) => {
    if (typeof origen !== 'number' || typeof final !== 'number') throw new Error(`Los primeros dos parámetros de arange deben ser númericos. Se ha recibido ${JSON.stringify(origen)} (${typeof origen}) y ${JSON.stringify(final)} (${typeof final})`)
    if (typeof espaciado !== 'number' || espaciado <= 0) throw new Error(`El tercer parámetro de arange debe ser un número mayor a cero. Se ha recibido ${JSON.stringify(espaciado)} (${typeof espaciado})`)
    const array = []
    for (let i=origen; i<final; i+=espaciado) {
        array.push(i)
    }
    return array
}

// Recibe un "arrayNuevo" y un "arrayViejo". Devuelve un "arrayResultante" tal que tenga los mismos elementos que arrayNuevo pero en el orden que están en arrayViejo. Por otro lado los elementos de arrayNuevo que no estén en arrayViejo se colocan al final de arrayResultante, mientras que los elementos de arrayViejo que no están en arrayNuevo se ignoran
const comprobarPermanencia = (arrayNuevo: any[], arrayViejo: any[]) => {
    if (!Array.isArray(arrayNuevo) || !Array.isArray(arrayViejo)) throw new TypeError(`comprobarPermanencia debe recibir dos arrays. Se ha recibido ${JSON.stringify(arrayNuevo)} (${typeof arrayNuevo}) y ${JSON.stringify(arrayViejo)} (${typeof arrayViejo})`)

    if (arraysIgualesOrdenIndistinto(arrayNuevo, arrayViejo)) return arrayViejo

    let arrayResultante: any[] = []

    arrayViejo.forEach(elemento => { // Agrega los elementos del array viejo en el array resultante, siempre y cuando estén en el nuevo
        if (arrayNuevo.includes(elemento)) arrayResultante.push(elemento)
    })

    arrayNuevo.forEach(elemento => { // Los elementos restantes de arrayNuevo se colocan al final del array resultante 
        if (!arrayResultante.includes(elemento)) arrayResultante.push(elemento)
    })
    return arrayResultante
}

const superIndexOf = (array: number[], element: number, n: number) => {
    const cantVecesN = array.reduce((prev, act) => {
        if (act === element) {
            return prev + 1;
        } else {
            return prev;
        }
    }, 0);

    if (cantVecesN < n) throw new Error(`superIndexOf necesita que el tercer parámetro sea menor o igual a la cantidad de veces que el valor del segundo parametro está en el array del primer parámetro`)

    let index = 0
    for (let i=1; i<=n; i++) {
        index = array.indexOf(element, index + 1);
    }
    return index
}

const mezclarArray = (array: any[]) => {
    if (!Array.isArray(array)) throw new TypeError(`mezclar debe recibir un array. Se ha recibido ${JSON.stringify(array)} (${typeof array})`)
    const arrayMezclado = []
    let arrayCopia = array.slice();
    while (arrayCopia.length > 0) { // Elimino un elemento al azar del array original, y al mismo tiempo lo coloco en el "array mezclado". Repito el ciclo hasta que el array original quede vacío
        const indiceAzar = Math.floor(Math.random()*arrayCopia.length)
        const elementoRandom = arrayCopia.splice(indiceAzar, 1)[0]
        arrayMezclado.push(elementoRandom)
    }
    return arrayMezclado
}

const isFalseNullOrUndefined = (value: any) => {
    return value === false || value === null || value === undefined;
}

const actualizarVolumenSegunFlechasVerticales = (tecla: string, vol: number, setVol: (vol: number) => void) => {
    if (tecla === "arrowup") {
        if (0 <= vol && vol <= 0.95) {
            setVol(vol + 0.05)
            // vol = redondear(vol)
        } else if (0.95 < vol && vol <= 1) {
            setVol(1)
        } else { // Esto nunca debería pasar, pero lo dejo por si es necesario
            setVol(0.5) 
        }
    } else if (tecla === "arrowdown") {
        if (0.05 <= vol && vol <= 1) {
            setVol(vol - 0.05)
            // vol = redondear(vol)
        } else if (0 <= vol && vol < 0.05) {
            setVol(0)
        } else {
            setVol(0.5)
        }
    }
}

const conversion = (segundos: number): string => {
    if (isNaN(segundos)) return '00:00:00';
    let minutos: number = Math.floor(segundos / 60);
    let horas: number = Math.floor(segundos / 3600);
    segundos = Math.floor((segundos / 60 - minutos) * 60);
    if (minutos <= 9) minutos = parseInt('0' + minutos);
    if (horas === 0) horas = parseInt('0' + horas);
    return `${horas === 0 ? `0${horas}` : horas}:${minutos <= 9 ? `0${minutos}` : minutos}:${segundos <= 9 ? `0${segundos}` : segundos}`;
}

export {
    arange,
    comprobarPermanencia,
    superIndexOf,
    mezclarArray,
    isFalseNullOrUndefined,
    actualizarVolumenSegunFlechasVerticales,
    conversion
}