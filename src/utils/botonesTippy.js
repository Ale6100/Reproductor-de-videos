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

export default botonesTippy
