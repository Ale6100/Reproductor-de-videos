import { createContext, useState } from "react";
import { comprobarPermanencia } from "../utils/utils.js";
import listaVideosOriginal from "../utils/listaVideosOriginal.js";

interface PersonalContextValue {
    videos: any[],
    setVideos: React.Dispatch<React.SetStateAction<any[]>>,
    idVideoActual: number,
    setIdVideoActual: React.Dispatch<React.SetStateAction<number>>,
    videosElegidos: { [key: string]: boolean },
    setVideosElegidos: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
}

export const PersonalContext = createContext<PersonalContextValue | undefined>(undefined);

interface PersonalContextProviderProps {
    children: React.ReactNode;
}

const PersonalContextProvider = ({ children }: PersonalContextProviderProps) => {
    const [ videos, setVideos ] = useState(() => { // Orden de videos
        const item = localStorage.getItem("videos")
        if (item) { // Me aseguro de que la lista esté actualizada en el localstorage (ya que el localstorage debe darse cuenta si en el array "listaVideosOriginal" se agregaron o quitaron canciones entre un deploy y otro)
            const listaLocalStorage = JSON.parse(item)
            return comprobarPermanencia(listaVideosOriginal, listaLocalStorage)
        }
        return listaVideosOriginal
    })

    const [ idVideoActual, setIdVideoActual ] = useState(() => { // Id del video que se va a reproducir
        const item = localStorage.getItem("idVideoActual")
        if (item) { // Me aseguro de que la lista esté actualizada en el localstorage (ya que el localstorage debe darse cuenta si en el array "listaVideosOriginal" se agregaron o quitaron canciones entre un deploy y otro)
            const id = JSON.parse(item)
            return videos.find(video => video.id === id)?.id ?? videos[0].id
        }
        return videos[0].id
    })

    const [ videosElegidos, setVideosElegidos ] = useState(() => { // Objeto cuyas claves son los IDs de los videos, y los valores booleanos representan si pertenecen o no a la lista de canciones que se reproducen
        const item = localStorage.getItem("videosElegidos")
        if (item) return JSON.parse(item)
        const obj: { [key: string]: boolean } = {};
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
