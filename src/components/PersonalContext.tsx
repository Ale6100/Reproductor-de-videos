import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { comprobarPermanencia } from "../utils/utils.js";
import listaVideosOriginal from "../utils/listaVideosOriginal.js";
import { ObjVideosElegidos, ElementoArrayVideo } from "../types.js";

interface PersonalContextValue {
    videos: ElementoArrayVideo[],
    setVideos: Dispatch<SetStateAction<ElementoArrayVideo[]>>,
    idVideoActual: number,
    setIdVideoActual: Dispatch<SetStateAction<number>>,
    videosElegidos: ObjVideosElegidos,
    setVideosElegidos: Dispatch<SetStateAction<ObjVideosElegidos>>
}

const defaultValue: PersonalContextValue = {
    videos: [],
    setVideos: () => {},
    idVideoActual: 0,
    setIdVideoActual: () => {},
    videosElegidos: {},
    setVideosElegidos: () => {}
}

export const PersonalContext = createContext<PersonalContextValue>(defaultValue);

interface PersonalContextProviderProps {
    children: ReactNode;
}

const PersonalContextProvider = ({ children }: PersonalContextProviderProps) => {
    const [ videos, setVideos ] = useState(() => { // Videos activos en el orden que se van a reproducir
        const item = localStorage.getItem("videos")
        if (item) { // Me aseguro de que la lista esté actualizada en el localstorage (ya que el localstorage debe darse cuenta si en el array "listaVideosOriginal" se agregaron o quitaron canciones entre un deploy y otro)
            const listaLocalStorage = JSON.parse(item)
            return comprobarPermanencia(listaVideosOriginal, listaLocalStorage)
        }
        return listaVideosOriginal
    })

    const [ idVideoActual, setIdVideoActual ] = useState<number>(() => { // Id del video que se va a reproducir
        const item = localStorage.getItem("idVideoActual")
        if (item) { // Me aseguro de que la lista esté actualizada en el localstorage (ya que el localstorage debe darse cuenta si en el array "listaVideosOriginal" se agregaron o quitaron canciones entre un deploy y otro)
            const id = JSON.parse(item)
            return videos.find(video => video.id === id)?.id ?? videos[0].id
        }
        return videos[0].id
    })

    const [ videosElegidos, setVideosElegidos ] = useState<ObjVideosElegidos>(() => { // Objeto cuyas claves son los IDs de los videos, y los valores booleanos representan si pertenecen o no a la lista de canciones habilitadas para reproducirse
        const item = localStorage.getItem("videosElegidos")
        if (item) return JSON.parse(item)
        const obj: ObjVideosElegidos = {};
        videos.forEach(vid => obj[vid.id] = true)
        return obj
    })

    const contextValue = useMemo(() => ({
        videos,
        setVideos,
        idVideoActual,
        setIdVideoActual,
        videosElegidos,
        setVideosElegidos
    }), [videos, idVideoActual, videosElegidos]);

    return (
        <PersonalContext.Provider value={contextValue}>
            {children}
        </PersonalContext.Provider>
    );
}

export default PersonalContextProvider;
