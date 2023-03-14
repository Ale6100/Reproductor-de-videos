import { arange, superIndexOf, mezclarArray, isFalseNullOrUndefined, actualizarVolumenSegunFlechasVerticales, conversion } from '../utils/utils';
import { useState, useEffect, useRef, useContext } from 'react';
import Icons from './Icons';
import arrayIconos from '../utils/arrayIconos';
import { PersonalContext } from './PersonalContext';

const velocidades = arange(0.5, 2.5, 0.5) // Velocidades disponibles (es necesario que el rango del array sea siempre positivo y contenga al 1)

let botonVolumen, vid, botonPlay, barraGris, botonEstado, barraCargando

const ContenedorVideo = () => {
    const [ montado, setMontado ] = useState(false)

    const { videos, setVideos, idVideoActual, setIdVideoActual, videosElegidos, setVideosElegidos } = useContext(PersonalContext);
    
    const [ indiceVel, setIndiceVel ] = useState(() => { // Indice donde está ubicada la velocidad inicial
        if (localStorage.getItem("indiceVel")) {
            const indice = JSON.parse(localStorage.getItem("indiceVel"))
            return velocidades.findIndex((vel) => vel === velocidades[indice]) === -1 ? velocidades.indexOf(1) : indice // Actualizo el estado siempre y cuando la velocidad siga en la lista de velocidades disponibles
        }
        return velocidades.indexOf(1)
    })

    const [ vol, setVol ] = useState(() => { // Volumen (desde 0 hasta 1)
        if (localStorage.getItem("vol")) {
            return JSON.parse(localStorage.getItem("vol"))
        }
        return 0.5
    })

    const [ currentTime, setCurrentTime ] = useState(0) // Tiempo actual del video (el estado no permanece actualizado, sólo se actualiza en momentos importantes)
    
    const [ play, setPlay ] = useState(false)
    const [ mute, setMute ] = useState({ mute: false, volGuardado: vol }) // Objeto que especifica si el video está muteado, y si ese es el caso, el volumen que tenía antes de estarlo
    const [ showTooltips, setShowTooltips ] = useState({ play: false, anterior: false, siguiente: false, reiniciar: false, aleatorio: false, mezclar: false, volumen: false, velocidad: false, estado: false })

    const containerRef = useRef(null);

    useEffect(() => { // La primera vez que ingresamos a la página accedemsos a los valores del localstorage y los guardamos como estados, si es que están
        // Selecciono las etiquetas necesarias
        botonVolumen = document.querySelector(".volumen")
        vid = document.querySelector("video");
        botonPlay = document.querySelector(".play")
        barraGris = document.querySelector(".barraGris")
        botonEstado = document.querySelector(".estado")
        barraCargando = document.querySelector(".barraCargando")

        // Seteo los parámetros iniciales
        vid.src = `./videos/${videos.find(video => video.id === idVideoActual).nombre }`;
        vid.playbackRate = velocidades[indiceVel];
        vid.volume = vol

        if (vol === 0) { // Si tiene volumen cero, lo colocamos en mute
            botonVolumen.src = "/img/mute.png"
        } else {
            if (vol < 0.33) {
                botonVolumen.src = "/img/low-volume.png"
            } else if (vol < 0.66) {
                botonVolumen.src = "/img/medium-volume.png"
            } else {
                botonVolumen.src = "/img/high-volume.png"
            }
        }

        setMontado(true)
    }, []);

    useEffect(() => { // Cada vez que algún estado del array del useEffect cambia, se actualiza su valor en el localstorage
        if (montado) {
            localStorage.setItem("videos", JSON.stringify(videos))
        }
    }, [videos])

    useEffect(() => { // Mantiene actualizado el video actual
        if (montado) {
            localStorage.setItem("idVideoActual", JSON.stringify(isFalseNullOrUndefined(idVideoActual) ? videos[0].id : idVideoActual))
            vid.src = `./videos/${videos.find(video => video.id === idVideoActual).nombre}`;
        
            if (play) {
                vid.play()
                botonPlay.src = "/img/pause.png"
            } else {
                vid.pause()
                botonPlay.src = "/img/play.png"
            }
        }
    }, [idVideoActual]);

    useEffect(() => { // Mantiene actualizada la velocidad
        if (montado) {
            localStorage.setItem("indiceVel", JSON.stringify(isFalseNullOrUndefined(indiceVel) ? velocidades.indexOf(1) : indiceVel))
            vid.playbackRate = velocidades[indiceVel];
        }
    }, [indiceVel]);

    useEffect(() => { // Mantiene actualizado el volumen y su ícono
        if (montado) {
            localStorage.setItem("vol", JSON.stringify(isFalseNullOrUndefined(vol) ? 0.5 : vol))
            if (vol === 0) { // Si tiene volumen cero, lo colocamos en mute
                botonVolumen.src = "/img/mute.png"

            } else {
                if (vol < 0.33) {
                    botonVolumen.src = "/img/low-volume.png"
                } else if (vol < 0.66) {
                    botonVolumen.src = "/img/medium-volume.png"
                } else {
                    botonVolumen.src = "/img/high-volume.png"
                }
            }
            vid.volume = vol
        }
    }, [vol])

    useEffect(() => { // Mantiene actualizada la orden play/pause | A priori no parece ser necesario ya que la validaciónvid.paused da true cuando el video está pausado, pero se modifica solo cuando cambio de video, así que utilizo este useEffect para asegurarme de que no cambie su valor
        if (montado) {
            if (play) {
                vid.play()
                botonPlay.src = "/img/pause.png"
            } else {
                vid.pause()
                botonPlay.src = "/img/play.png"
            }
        }
    }, [play]);

    useEffect(() => { // Mantiene actualizada la orden mute ON/OFF de acuerdo al valor mute.mute
        if (montado) {
            if (mute.mute) {
                setVol(0)
            } else {
                setVol(mute.volGuardado)
            }
        }
    }, [mute]);

    useEffect(() => { // Cambia el tiempo actual del video cuando se lo pidamos
        if (montado) {
            vid.currentTime = currentTime
        }
    }, [currentTime]);

    const cambiar = (destino) => { // Cambia el id del video actual
        const listaIds = videos.map(video => video.id)
        const tripleLista = listaIds.concat(listaIds, listaIds)
        const indiceEnTripleLista = superIndexOf(tripleLista, idVideoActual, 2)

        let contadorDeVideosElegidos = 0
        Object.keys(videosElegidos).forEach(id => { // Esto lo hago para que no intente cambiar de video si no hay más de un video con el input check activado
            if (videosElegidos[`${id}`]) contadorDeVideosElegidos+=1
        })
        if (contadorDeVideosElegidos <= 1) return ""

        let cambio = 1
        while (true) {
            if (destino === "anterior") {
                if (videosElegidos[`${tripleLista[indiceEnTripleLista-cambio]}`]) {
                    setIdVideoActual(tripleLista[indiceEnTripleLista-cambio])
                    break
                } else {
                    cambio++
                }
    
            } else if (destino === "siguiente") {
                if (videosElegidos[`${tripleLista[indiceEnTripleLista+cambio]}`]) {
                    setIdVideoActual(tripleLista[indiceEnTripleLista+cambio])
                    break
                } else {
                    cambio++
                }
            } else break
        }
        
        if (destino === "aleatorio") {
            while (true) { // Reproduce un video aleatorio
                const idAleatorio = listaIds[parseInt(Math.random()*listaIds.length)]
                if (idVideoActual !== idAleatorio && videosElegidos[`${idAleatorio}`]) { // Verifica que el video aleatorio no sea igual al actual, para que no se repita
                    setIdVideoActual(idAleatorio)
                    break
                } 
            }
        }

        if (play) { // Parece que no hace nada, pero me aseguro de que el video continúe en pausa o en play, tal como estaba antes de que se cambie el video
            vid.play()
        }

        vid.playbackRate = 0
        setTimeout(() => vid.playbackRate = velocidades[indiceVel], 0) //* Con poner vid.playbackRate = velocidades[indiceVel] debería ser suficiente, pero no me deja. El objetivo es que la velocidad del video se mantenga a pesar de que el video cambie
    }

    const reiniciar = () => { // Hago que se reinicie un video (va al segundo 0)
        setCurrentTime(0)
        vid.currentTime = 0 // Esto sólo es necesario cuando el estado currentTime ya es cero (consideremos que dicho estado no permanece actualizado, sólo registra los tiempos que pido)
    }

    const mezclarLista = () => { // Mezcla la lista de reproducción y reproduce el primer video
        const arrayMezclado = mezclarArray(videos)
        setVideos(arrayMezclado)
        setIdVideoActual(arrayMezclado[0].id)
    }

    const clickBarra = (e) => { // Adelanta o retrocede el video cuando apretamos en la barra de tiempo
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // Ubicación en x relativa al borde izquierdo de la barra gris
        const anchoBarraGris = barraGris.offsetWidth;
        const porcentajeUbicacionClick = offsetX*100/anchoBarraGris
        setCurrentTime(vid.duration*porcentajeUbicacionClick/100) // Pido que el tiempo cambie a la ubicación pedida, según el porcentaje calculado
    }

    const actualizar = () => { // Actualiza la barra roja "cargando" y el texto que representa al tiempo actual del video
        const tiempoActual = vid.currentTime
        const tiempoTotal = vid.duration
        botonEstado.innerHTML = `<p>${conversion(tiempoActual)} / ${conversion(tiempoTotal)}</p>`
        barraCargando.style.width = `${tiempoActual*100/tiempoTotal}%` // Porcentaje actual
    }

    const keydown = (e) => {
        const tecla = e.key.toLowerCase()

        if (tecla === " " || tecla === "k") {
            setPlay(!play)

        } else if (tecla === "p") {
            cambiar("anterior")

        } else if (tecla === "n") {
            cambiar("siguiente")

        } else if (tecla === "r") {
            reiniciar()

        } else if (tecla === "a") {
            cambiar("aleatorio")

        } else if (tecla === "o") {
            mezclarLista()

        } else if (tecla === "m") { // Activa o desactiva el mute 
            setMute(mute.mute ? { ...mute, mute: false } : { mute: true, volGuardado: vol })

        } else if (tecla === "arrowup" || tecla === "arrowdown") {
            actualizarVolumenSegunFlechasVerticales(tecla, vol, setVol)

        } else if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(num => `${num}` === tecla)) { // Si se presiona el número num, va al num*10% del video
            setCurrentTime(vid.duration*parseInt(tecla*10)/100)
            if (tecla === "0") vid.currentTime = 0
            
        } else if (tecla === "arrowleft" || tecla === "arrowright") { // Avanza o retrocede 5 segundos según cual flecha horizontal presionaste
            setCurrentTime(tecla === "arrowleft" ? vid.currentTime - 5 : vid.currentTime + 5)
        }
    }

    const arrayMetodosIconos = [
        {
            type: "play",
            onClick: () => setPlay(!play)
        },
        {
            type: "anterior",
            onClick: () => cambiar("anterior")
        },
        {
            type: "siguiente",
            onClick: () => cambiar("siguiente")
        },
        {
            type: "reiniciar",
            onClick: reiniciar
        },
        {
            type: "aleatorio",
            onClick: () => cambiar("aleatorio")
        },
        {
            type: "mezclar",
            onClick: mezclarLista
        },
        {
            type: "volumen",
            onClickImg: () => {setMute(mute.mute ? { ...mute, mute: false } : { mute: true, volGuardado: vol })}
        },
        {
            type: "velocidad",
            onClick: () => {},
            onClickImg: () => { velocidades.findIndex((vel_) => vel_ === velocidades[indiceVel+1]) === -1 ? setIndiceVel(0) : setIndiceVel(velocidades.findIndex((vel_) => vel_ === velocidades[indiceVel+1])) }
        },
    ]

    const arrayDetallesIconos = arrayIconos.map(icon => { // Se encarga de crear un nuevo array con los valores de arrayIconos y los métodos de arrayMetodosIconos
        const find = arrayMetodosIconos.find((icon2) => icon2.type === icon.type)
        icon.onClick = find.onClick
        icon.onClickImg = find.onClickImg
        return icon
    })

    return (
        <section tabIndex="0" onKeyDown={ keydown } className='h-full w-2/3 max-md:h-auto max-md:w-full outline-0'>
            <div className=" flex flex-col justify-center items-center h-full">
                <div className="w-full border-l-2 border-r-2 border-t-2 div-video">
                    <video onClick={ () => setPlay(!play) } onEnded={ () => cambiar("siguiente") } onLoadedData={ actualizar } onTimeUpdate={ actualizar } className='h-full w-full'></video>
                </div>
    
                <div ref={containerRef} onClick={ clickBarra } className="barraGris bg-gray-300 h-[10px] w-full border-l-2 border-r-2">
                    <div className="barraCargando bg-red-600 rounded-br-sm rounded-tr-sm h-full w-0"></div>
                </div>
    
                <div className="botones h-[30px] flex justify-evenly w-full items-center border-2 border-t-0 rounded-br-sm rounded-bl-sm">
                    { 
                        arrayDetallesIconos.map((icon) => (
                            <Icons icon={icon} showTooltips={showTooltips} setShowTooltips={setShowTooltips} velocidades={velocidades} indiceVel={indiceVel} setIndiceVel={setIndiceVel} vol={vol} setVol={setVol} key={icon.type}/>
                        ))
                    }
                    <div className="estado whitespace-nowrap"></div>
                </div>
            </div>
        </section>
    );
}

export default ContenedorVideo;
