import { useContext, useEffect, useState } from 'react';
import { PersonalContext } from './PersonalContext';

const ContenedorLista = () => {
    const [ montado, setMontado ] = useState(false)
    const { videos, idVideoActual, setIdVideoActual, videosElegidos, setVideosElegidos } = useContext(PersonalContext)
    const [ valueSearch, setValueSearch ] = useState("")

    useEffect(() => {
        setMontado(true)
    }, []);

    useEffect(() => {
        if (montado) {
            localStorage.setItem("videosElegidos", JSON.stringify(videosElegidos))
        }
    }, [videosElegidos]);

    const onChangeInputCheckbox = (e) => { // Modifica el valor de videosElegidos, para que React se de cuenta si queremos habilitar o deshabilitar una canción
        setVideosElegidos({...videosElegidos, [`${e.target.dataset.id}`]: e.target.checked})
    }

    const marcarTodo = () => {
        const obj = {}
        videos.forEach(vid => obj[`${vid.id}`] = true)
        setVideosElegidos(obj)
    }

    const desMarcarTodo = () => {
        const obj = {}
        videos.forEach(vid => obj[`${vid.id}`] = false)
        setVideosElegidos(obj)
    }

    return (
        <section className='p-1 h-full flex flex-col text-start border-purple-600 border-2 rounded-sm w-1/3 max-md:w-full'>
            <input onChange={(e) => setValueSearch(e.target.value)} type="search" name="search" className='bg-black border-2 px-1' placeholder='Buscar...'/>

            <div className='my-1 flex w-full justify-evenly whitespace-nowrap'>
                <button onClick={ marcarTodo } className='px-2 border-2 rounded-sm hover:bg-opacity-70 md:hover:bg-purple-900 active:bg-purple-400'>Marcar todo</button>
                <button onClick={ desMarcarTodo } className='px-2 border-2 rounded-sm hover:bg-opacity-70 md:hover:bg-purple-900 active:bg-purple-400'>Desmarcar todo</button>
            </div>

            <div className='overflow-y-auto overflow-x-hidden'>
            {
            videos.map((video, index) => (
                (video.nombre.toLowerCase().includes(valueSearch.toLowerCase()) || valueSearch === "" || `${index+1}`.includes(valueSearch)) &&

                <div className={`${index === videos.length-1 ? "" : "py-2"} ${video.id === idVideoActual && "bg-blue-600 bg-opacity-70"} ${videosElegidos[`${video.id}`] && "hover:bg-blue-500 hover:bg-opacity-50"} px-1 flex cursor-pointer hover:font-semibold hover:scale-105 hover:translate-x-[10px] transition-all duration-100`} key={video.id}>
                    <input onChange={ onChangeInputCheckbox } data-id={`${video.id}`} type="checkbox" checked={videosElegidos[`${video.id}`] ?? setVideosElegidos({...videosElegidos, [`${video.id}`]: true})} className="mr-1"/> {/* El ?? está hecho para que agrege el id de un video a la lista si no estaba (ya que en ese caso sería un video nuevo) */}
                    <p onClick={ () => videosElegidos[`${video.id}`] && setIdVideoActual(video.id) } className={`${video.id === idVideoActual && "font-semibold"} ${videosElegidos[`${video.id}`] || "brightness-50"}`}>{index+1}) {video.nombre.replace(".mp4", "").replace(".mkv", "")}</p> {/* Me aseguro de que la canción no esté habilitada si el usuario no tiene activado el ckeck */}
                </div>
            ))
            }
            </div>
        </section>
    );
}

export default ContenedorLista;
