import { useContext, useEffect } from 'react';
import { PersonalContext } from './PersonalContext';

const ContenedorLista = () => {
    const { videos, idVideoActual, setIdVideoActual } = useContext(PersonalContext)

    return (
        <section className='p-1 flex flex-col text-start border-purple-600 border-2 rounded-sm w-1/3 overflow-y-auto overflow-x-hidden max-md:w-full'>
            {
                videos.map((video, index) => (
                   <div onClick={ () => setIdVideoActual(video.id) } className={`${index === 0 || index === videos.length-1 ? "" : "py-2"} cursor-pointer hover:font-semibold hover:scale-105 hover:translate-x-[10px] transition-all duration-100`} key={video.id}>
                        {
                        video.id === idVideoActual ? 
                        <p className='font-semibold'>{index+1}) {video.nombre}</p> :
                        <p >{index+1}) {video.nombre}</p>
                        }
                   </div> 
                ))
            }
        </section>
    );
}

export default ContenedorLista;
