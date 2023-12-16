import isEqual from 'lodash/isEqual';
import { ElementoArrayVideo } from "../types";

// Acá están todas las funciones que no se utilizan de manera directa en los jsx, sino en el archivo utils.ts

// Recibe dos arreglos. Devuelve true si ambos son iguales aunque tengan distinto orden, o false en caso contrario (sólo funciona para los arreglos con la estructura del array "videos")
const arraysIgualesOrdenIndistinto = (array1: ElementoArrayVideo[], array2: ElementoArrayVideo[]) => {
    if (!Array.isArray(array1) || !Array.isArray(array2)) throw new TypeError(`arraysIguales debe recibir dos arrays. Se ha recibido ${JSON.stringify(array1)} (${typeof array1}) y ${JSON.stringify(array2)} (${typeof array2})`)
    if (array1.length !== array2.length) return false

    const array1Sort = Array.from(array1); // Necesito copiar para no modificar los originales
    const array2Sort = Array.from(array2);

    array1Sort.sort((elem1, elem2) => elem1.id - elem2.id) // Los ordeno con el mismo método
    array2Sort.sort((elem1, elem2) => elem1.id - elem2.id)

    return isEqual(array1Sort, array2Sort); // Si luego de ordenarlos los elementos no son iguales en sus posiciones i-ésimas, entonces son arreglos distintos
}

export {
    arraysIgualesOrdenIndistinto
}
