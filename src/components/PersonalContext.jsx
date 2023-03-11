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

    return (
        <PersonalContext.Provider value={{ videos, setVideos, idVideoActual, setIdVideoActual }}>
            {children}
        </PersonalContext.Provider>
    );
}

export default PersonalContextProvider;
