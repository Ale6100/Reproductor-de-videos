import { useContext, useEffect, useState } from 'react';
import { PersonalContext } from './PersonalContext';
import { ObjVideosElegidos } from '../types';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const ContenedorLista = () => {
    const [ montado, setMontado ] = useState(false)
    const [ valueSearch, setValueSearch ] = useState("")

    const [ parent ] = useAutoAnimate();

    const { videos, idVideoActual, setIdVideoActual, videosElegidos, setVideosElegidos } = useContext(PersonalContext)

    useEffect(() => {
        setMontado(true)
    }, []);

    useEffect(() => {
        if (montado) localStorage.setItem("videosElegidos", JSON.stringify(videosElegidos))
    }, [videosElegidos, montado]);

    const onChangeInputCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => { // Modifica el valor de videosElegidos, para que React se de cuenta si queremos habilitar o deshabilitar una canción
        setVideosElegidos({...videosElegidos, [`${e.target.dataset.id}`]: e.target.checked})
    }

    const marcarTodo = () => {
        const obj: ObjVideosElegidos = {}
        videos.forEach(vid => obj[vid.id] = true)
        setVideosElegidos(obj)
    }

    const desMarcarTodo = () => {
        const obj: ObjVideosElegidos = {}
        videos.forEach(vid => obj[vid.id] = false)
        setVideosElegidos(obj)
    }


    return (
        <section className='p-1 h-full flex flex-col text-start border-purple-600 border-2 rounded-sm w-1/3 max-md:w-full bg-opacity-40 bg-black'>
            <input onChange={e => setValueSearch(e.target.value)} type="search" name="search" autoComplete='off' className='bg-black border-2 px-1' placeholder='Buscar...'/>

            <div className='my-1 flex w-full justify-evenly whitespace-nowrap'>
                <button onClick={ marcarTodo } className='px-2 border-2 rounded-sm hover:bg-opacity-70 md:hover:bg-purple-900 active:bg-purple-400'>Marcar todo</button>
                <button onClick={ desMarcarTodo } className='px-2 border-2 rounded-sm hover:bg-opacity-70 md:hover:bg-purple-900 active:bg-purple-400'>Desmarcar todo</button>
            </div>

            <div className='overflow-y-auto overflow-x-hidden' ref={parent}>
            {
            videos.map((video, index) => (
                (video.nombre.toLowerCase().includes(valueSearch.toLowerCase()) || valueSearch === "" || `${index+1}`.includes(valueSearch)) &&

                <div className={[index !== videos.length - 1 ? "py-6" : "", video.id === idVideoActual ? "bg-blue-600 bg-opacity-70" : "", videosElegidos[video.id] ? "hover:bg-blue-500" : "", "h-10 px-1 flex items-center cursor-pointer hover:font-semibold hover:scale-105 hover:translate-x-[10px] transition-all duration-100"].filter(Boolean).join(" ")} key={video.id}>
                    <input title='Habilitar/deshabilitar' onChange={ onChangeInputCheckbox } data-id={`${video.id}`} type="checkbox" checked={videosElegidos[`${video.id}`] ?? setVideosElegidos({...videosElegidos, [`${video.id}`]: true})} className="mr-1 scale-125"/> {/* El ?? está hecho para que agrege el id de un video a la lista si no estaba (ya que en ese caso sería un video nuevo) */}
                    <button type='button' title='Reproducir' onClick={ () => videosElegidos[`${video.id}`] && setIdVideoActual(video.id) } className={`whitespace-normal text-start ${video.id === idVideoActual ? "font-semibold" : ""} ${videosElegidos[video.id.toString()] ? "" : "brightness-50"}`}>{index+1} {video.nombre.replace(".mp4", "").replace(".mkv", "")}</button>
                </div>
            ))
            }
            </div>
        </section>
    );
}

export default ContenedorLista;
