import { createContext, useState } from "react";
import { comprobarPermanencia } from "../utils/utils";
import listaVideosOriginal from "../utils/listaVideosOriginal";

export const PersonalContext = createContext()

const PersonalContextProvider = ({ children }) => {
    const [ videos, setVideos ] = useState(() => { // Orden de videos
        if (localStorage.getItem("videos")) { // Me aseguro de que la lista esté actualizada en el localstorage (ya que el localstorage debe darse cuenta si en el array "listaVideosOriginal" se agregaron o quitaron canciones entre un deploy y otro)
            const listaLocalStorage = JSON.parse(localStorage.getItem("videos"))
            return comprobarPermanencia(listaVideosOriginal, listaLocalStorage)
        }
        return listaVideosOriginal
    })

    const [ idVideoActual, setIdVideoActual ] = useState(() => { // Id del video que se va a reproducir
        if (localStorage.getItem("idVideoActual")) { // Me aseguro de que la lista esté actualizada en el localstorage (ya que el localstorage debe darse cuenta si en el array "listaVideosOriginal" se agregaron o quitaron canciones entre un deploy y otro)
            const id = JSON.parse(localStorage.getItem("idVideoActual"))
            return videos.find(video => video.id === id)?.id ?? videos[0].id
        }
        return videos[0].id
    })

    const [ videosElegidos, setVideosElegidos ] = useState(() => { // Objeto cuyas claves son los IDs de los videos, y los valores booleanos representan si pertenecen o no a la lista de canciones que se reproducen
        if (localStorage.getItem("videosElegidos")) {
            return JSON.parse(localStorage.getItem("videosElegidos"))
        }
        const obj = {}
        videos.forEach(vid => obj[`${vid.id}`] = true)
        return obj
    })

    return (
        <PersonalContext.Provider value={{ videos, setVideos, idVideoActual, setIdVideoActual, videosElegidos, setVideosElegidos }}>
            {children}
        </PersonalContext.Provider>
    );
}

export default PersonalContextProvider;
