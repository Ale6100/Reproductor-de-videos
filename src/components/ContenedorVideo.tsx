import { arange, superIndexOf, mezclarArray, isFalseNullOrUndefined, actualizarVolumenSegunFlechasVerticales, conversion } from '../utils/utils';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Icons from './Icons';
import arrayIconos from '../utils/arrayIconos.js';
import { PersonalContext } from './PersonalContext';
import { ElementoArrayVideo } from '../types.js';

const velocidades = arange(0.5, 2.5, 0.5) // Velocidades disponibles (es necesario que el rango del array sea siempre positivo y contenga al 1)

let botonVolumen: HTMLImageElement | null, vid: HTMLVideoElement | null, botonPlay: HTMLImageElement | null, barraGris: HTMLDivElement | null, botonEstado: HTMLDivElement | null, barraCargando: HTMLDivElement | null,  cartelTiempo: HTMLElement | null

const ContenedorVideo = () => {
    const [ montado, setMontado ] = useState(false)

    const { videos, setVideos, idVideoActual, setIdVideoActual, videosElegidos } = useContext(PersonalContext)

    const [ indiceVel, setIndiceVel ] = useState<number>(() => { // Indice donde está ubicada la velocidad inicial
        const item = localStorage.getItem("indiceVel")
        if (item) {
            const indice = JSON.parse(item)
            return velocidades.includes(velocidades[indice]) ? indice : velocidades.indexOf(1); // La velocidad inicial será la asociada al índice del LocalStorage, siempre y cuando dicho indice siga existiendo
        }
        return velocidades.indexOf(1)
    })

    const [ vol, setVol ] = useState<number>(() => { // Volumen (desde 0 hasta 1)
        const item = localStorage.getItem("vol");
        return item ? JSON.parse(item) : 0.5;
    })

    const [ currentTime, setCurrentTime ] = useState(0) // Tiempo actual del video (el estado no permanece actualizado, sólo se actualiza en momentos importantes)

    const [ play, setPlay ] = useState(false)
    const [ mute, setMute ] = useState({ mute: false, volGuardado: vol }) // Objeto que especifica si el video está muteado, y si ese es el caso, el volumen que tenía antes de estarlo
    const [ showTooltips, setShowTooltips ] = useState<{[ket: string]: boolean}>({ play: false, anterior: false, siguiente: false, reiniciar: false, aleatorio: false, mezclar: false, volumen: false, velocidad: false, estado: false })
    const [ claseTimeTooltip, setClaseTimeTooltip ] = useState("scale-0 opacity-0")
    const [ timeTooltip, setTimeTooltip ] = useState<`${string}:${string}:${string}`>("00:00:00")

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { // La primera vez que ingresamos a la página accedemos a los valores del localstorage y los guardamos como estados, si es que están
        // Selecciono las etiquetas necesarias
        botonVolumen = document.querySelector(".volumen")
        vid = document.querySelector("video");
        botonPlay = document.querySelector(".play")
        barraGris = document.querySelector(".barraGris")
        botonEstado = document.querySelector(".estado")
        barraCargando = document.querySelector(".barraCargando")
        cartelTiempo = document.getElementById("cartelTiempo")

        // Seteo los parámetros iniciales
        if (vid) {
            vid.src = `./videos/${videos.find(video => video.id === idVideoActual)?.nombre }`; // Puse un ? para que TypeScript no moleste, pero no es problema ya que el find nunca será undefined
            vid.playbackRate = velocidades[indiceVel];
            vid.volume = vol
        }

        if (botonVolumen) {
            if (vol === 0) { // Si tiene volumen cero, lo colocamos en mute
                botonVolumen.src = "/img/mute.png"
            } else if (vol < 0.33) {
                botonVolumen.src = "/img/low-volume.png"
            } else if (vol < 0.66) {
                botonVolumen.src = "/img/medium-volume.png"
            } else {
                botonVolumen.src = "/img/high-volume.png"
            }
        }

        setMontado(true)
        // eslint-disable-next-line
    }, []);

    useEffect(() => { // Cada vez que el estado del array de este useEffect cambia, se actualiza su valor en el localstorage
        if (montado) localStorage.setItem("videos", JSON.stringify(videos))
    }, [videos, montado])

    useEffect(() => { // Mantiene actualizado el video actual
        if (montado) {
            localStorage.setItem("idVideoActual", JSON.stringify(isFalseNullOrUndefined(idVideoActual) ? videos[0].id : idVideoActual))
            if (!vid || !botonPlay) return
            vid.src = `./videos/${videos.find(video => video.id === idVideoActual)?.nombre}`; // Puse un ? para que TypeScript no moleste, pero no es problema ya que el find nunca será undefined

            if (play) {
                vid.play()
                botonPlay.src = "/img/pause.png"
            } else {
                vid.pause()
                botonPlay.src = "/img/play.png"
            }
        }
        // eslint-disable-next-line
    }, [idVideoActual]);

    useEffect(() => { // Mantiene actualizada la velocidad
        if (montado) {
            localStorage.setItem("indiceVel", JSON.stringify(isFalseNullOrUndefined(indiceVel) ? velocidades.indexOf(1) : indiceVel));
            if (vid) vid.playbackRate = velocidades[indiceVel];
        }
        // eslint-disable-next-line
    }, [indiceVel]);

    useEffect(() => { // Mantiene actualizado el volumen y su ícono
        if (montado) {
            localStorage.setItem("vol", JSON.stringify(isFalseNullOrUndefined(vol) ? 0.5 : vol))
            if (botonVolumen) {
                if (vol === 0) { // Si tiene volumen cero, lo colocamos en mute
                    botonVolumen.src = "/img/mute.png"
                } else if (vol < 0.33) {
                    botonVolumen.src = "/img/low-volume.png"
                } else if (vol < 0.66) {
                    botonVolumen.src = "/img/medium-volume.png"
                } else {
                    botonVolumen.src = "/img/high-volume.png"
                }
            }
            if (vid) vid.volume = vol
        }
        // eslint-disable-next-line
    }, [vol])

    useEffect(() => { // Mantiene actualizada la orden play/pause
        if (montado && vid && botonPlay) {
            if (play) {
                vid.play()
                botonPlay.src = "/img/pause.png"
            } else {
                vid.pause()
                botonPlay.src = "/img/play.png"
            }
        }
        // eslint-disable-next-line
    }, [play]);

    useEffect(() => { // Mantiene actualizada la orden mute ON/OFF de acuerdo al valor mute.mute
        if (montado) {
            if (mute.mute) {
                setVol(0)
            } else {
                setVol(mute.volGuardado)
            }
        }
        // eslint-disable-next-line
    }, [mute]);

    useEffect(() => { // Cambia el tiempo actual del video cuando se lo pidamos
        if (montado && vid) {
            vid.currentTime = currentTime
        }
        // eslint-disable-next-line
    }, [currentTime]);

    const cambiar = (destino: string) => { // Cambia el id del video actual
        const listaIds = videos.map(video => video.id)
        const tripleLista = listaIds.concat(listaIds, listaIds) // Uso una "triple lista" para asegurarme que no haya problema en los extremos: ya que la lista del medio siempre tendrá dos a su lado, y por lo tanto es como si la última canción fuera la anterior de la primera
        const indiceEnTripleLista = superIndexOf(tripleLista, idVideoActual, 2)

        let contadorDeVideosElegidos = 0
        Object.keys(videosElegidos).forEach(id => { // Esto lo hago para que no intente cambiar de video si no hay más de un video con el input check activado
            if (videosElegidos[id]) contadorDeVideosElegidos+=1
        })
        if (contadorDeVideosElegidos <= 1) return ""

        let cambio = 1
        let continue_ = true
        while (continue_) {
            if (destino === "anterior") {
                if (videosElegidos[tripleLista[indiceEnTripleLista-cambio]]) { // Paso a la anterior canción, siempre y cuando esté habilitada para su reproducción
                    setIdVideoActual(tripleLista[indiceEnTripleLista-cambio])
                    continue_ = false
                } else {
                    cambio++
                }

            } else if (destino === "siguiente") {
                if (videosElegidos[tripleLista[indiceEnTripleLista+cambio]]) {
                    setIdVideoActual(tripleLista[indiceEnTripleLista+cambio])
                    continue_ = false
                } else {
                    cambio++
                }
            } else continue_ = false
        }

        continue_ = true
        if (destino === "aleatorio") {
            while (continue_) { // Reproduce un video aleatorio
                const idAleatorio = listaIds[Math.floor(Math.random()*listaIds.length)]
                if (idVideoActual !== idAleatorio && videosElegidos[idAleatorio]) { // Verifica que el video aleatorio no sea igual al actual, para que no se repita. Además hago que se reproduzca sólo si está habilitado
                    setIdVideoActual(idAleatorio)
                    continue_ = false
                }
            }
        }

        if (play && vid) { // Parece que no hace nada, pero se asegura de que el video continúe en pausa o en play, tal como estaba antes de que se cambie el video
            vid.play()
        }


        if (vid) vid.playbackRate = 0
        setTimeout(() => vid && (vid.playbackRate = velocidades[indiceVel]), 0) //* Con poner vid.playbackRate = velocidades[indiceVel] debería ser suficiente, pero no me deja. El objetivo es que la velocidad del video se mantenga a pesar de que el video cambie
    }

    const reiniciar = () => { // Hago que se reinicie un video (va al segundo 0)
        setCurrentTime(0)
        if (vid) vid.currentTime = 0 // Esto sólo es necesario cuando el estado currentTime ya es cero (consideremos que dicho estado no permanece actualizado, sólo registra los tiempos que pido)
    }

    const mezclarLista = () => { // Mezcla la lista de reproducción y reproduce el primer video
        let arrayMezclado: ElementoArrayVideo[] = []

        let continue_ = true
        while (continue_) {
            arrayMezclado = mezclarArray(videos)
            if (videosElegidos[arrayMezclado[0]?.id]) continue_ = false
        }
        setVideos(arrayMezclado)
        setIdVideoActual(arrayMezclado[0].id)
    }

    const clickBarra = (e: React.MouseEvent<HTMLDivElement>) => { // Adelanta o retrocede el video cuando apretamos en la barra de tiempo
        const containerCurrent = containerRef.current;
        if (!containerCurrent || ! barraGris || !vid) return undefined;
        const rect = containerCurrent.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // Ubicación en x relativa al borde izquierdo de la barra gris
        const anchoBarraGris = barraGris.offsetWidth;
        const porcentajeUbicacionClick = offsetX*100/anchoBarraGris
        setCurrentTime(vid.duration*porcentajeUbicacionClick/100) // Pido que el tiempo cambie a la ubicación pedida, según el porcentaje calculado
    }

    const actualizar = () => { // Actualiza la barra roja "cargando" y el texto que representa al tiempo actual del video
        if (!vid || !botonEstado || !barraCargando) return undefined
        const tiempoActual = vid.currentTime
        const tiempoTotal = vid.duration
        botonEstado.innerHTML = `<p>${conversion(tiempoActual)} / ${conversion(tiempoTotal)}</p>`
        barraCargando.style.width = `${tiempoActual*100/tiempoTotal}%` // Porcentaje actual
    }

    const keydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
            if (vid)  {
                setCurrentTime(vid.duration*parseInt(tecla)*10/100)
                if (tecla === "0") vid.currentTime = 0
            }

        } else if (tecla === "arrowleft" || tecla === "arrowright") { // Avanza o retrocede 5 segundos según cual flecha horizontal presionaste
            if (vid) setCurrentTime(tecla === "arrowleft" ? vid.currentTime - 5 : vid.currentTime + 5)
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
        icon.onClick = find?.onClick
        icon.onClickImg = find?.onClickImg
        return icon
    })

    const chequearTamaño = () => innerWidth < 768

    const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cartelTiempo || chequearTamaño()) return undefined

        const x = e.clientX
        const y = e.clientY
        cartelTiempo.style.left = `${x - 27}px` // Quiero que el tooltip persiga al mouse
        cartelTiempo.style.top = `${y - 35}px`

        const containerCurrent = containerRef.current;
        if (!containerCurrent || ! barraGris || !vid) return undefined;
        const rect = containerCurrent.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // Ubicación en x relativa al borde izquierdo de la barra gris
        const anchoBarraGris = barraGris.offsetWidth;
        const porcentajeUbicacionClick = offsetX*100/anchoBarraGris
        setTimeTooltip(conversion(vid.duration*porcentajeUbicacionClick/100)) // Pido que el tiempo en el tooltip cambie a la ubicación pedida, según el porcentaje calculado
    }

    return (
        <section tabIndex={0} onKeyDown={ keydown } className='h-full w-2/3 max-md:h-auto max-md:w-full outline-0'> {/* El tabIndex es necesario para que el evento keydown funcione */}
            <div className=" flex flex-col justify-center items-center h-full">
                <div className="w-full border-l-2 border-r-2 border-t-2 div-video bg-black bg-opacity-80">
                    <video onClick={ () => setPlay(!play) } onEnded={ () => cambiar("siguiente") } onLoadedData={ actualizar } onTimeUpdate={ actualizar } className='h-full w-full'></video>
                </div>

                <div ref={containerRef} onClick={ clickBarra } onMouseMove={ mouseMove } onMouseEnter={ () => setClaseTimeTooltip("scale-1 opacity-1") } onMouseLeave={ () => setClaseTimeTooltip("scale-0 opacity-0") } className="relative barraGris bg-gray-300 h-[10px] w-full border-l-2 border-r-2">
                    <div className="barraCargando bg-red-600 rounded-br-sm rounded-tr-sm h-full w-0"></div>
                    <p id="cartelTiempo" className={`fixed font-semibold ${claseTimeTooltip} ${chequearTamaño() && "opacity-0"}`}>{timeTooltip}</p>
                </div>

                <div className="botones h-[30px] flex justify-evenly w-full items-center border-2 border-t-0 rounded-br-sm rounded-bl-sm bg-black bg-opacity-80">
                    {
                        arrayDetallesIconos.map((icon) => (
                            <Icons {...{icon, showTooltips, setShowTooltips, velocidades, indiceVel, setIndiceVel, vol, setVol}} key={icon?.type}/>
                        ))
                    }
                    <div className="estado whitespace-nowrap"></div>
                </div>
            </div>
        </section>
    );
}

export default ContenedorVideo;
